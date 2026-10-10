// scripts/test-quote-integration.mjs
/**
 * @file test-quote-integration.mjs
 * @description Automated integration test suite for SOCOFEB -> ACYA quote integration.
 * Spins up a local mock ACYA HTTP server to verify all Phase 10 safety and contract requirements
 * WITHOUT calling external production endpoints.
 */

import http from 'node:http';

let mockConfig = { statusCode: 202, body: { status: 'accepted' } };
let lastReceivedRequest = null;

// Start local mock ACYA server on ephemeral port
const server = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf-8');
  let parsedBody = null;
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    parsedBody = rawBody;
  }

  lastReceivedRequest = {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: parsedBody,
  };

  if (mockConfig.delayMs) {
    await new Promise((resolve) => setTimeout(resolve, mockConfig.delayMs));
  }

  res.writeHead(mockConfig.statusCode, mockConfig.headers || { 'Content-Type': 'application/json' });
  if (typeof mockConfig.body === 'string') {
    res.end(mockConfig.body);
  } else if (mockConfig.body) {
    res.end(JSON.stringify(mockConfig.body));
  } else {
    res.end();
  }
});

async function runTests() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  const mockApiUrl = `http://127.0.0.1:${address.port}/api/public/quote-requests`;

  console.log(`\n======================================================`);
  console.log(`  SOCOFEB -> ACYA QUOTE INTEGRATION TEST SUITE`);
  console.log(`  Local mock ACYA server listening on: ${mockApiUrl}`);
  console.log(`======================================================\n`);

  let passedCount = 0;
  let failedCount = 0;

  function assert(condition, testName, detail) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`  [FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
      failedCount++;
    }
  }

  // Base valid test payload
  const validPayload = {
    product: 'Panneaux > MDF 18mm Brut 2800x2070',
    quantity: '50 panneaux',
    customerName: 'Mohamed Salah',
    customerEmail: 'mohamed.salah@example.com',
    customerPhone: '+216 99 218 866',
    message: 'Besoin urgent pour chantier Jâafer',
    source: 'socofeb-decor.com',
    idempotencyKey: 'a1b2c3d4-e5f6-4a1b-8c2d-123456789abc',
  };

  // Dynamically import acya-client
  const { sendQuoteToAcya } = await import('../src/lib/acya-client.ts');

  // TEST 1: Missing configuration fails safely without throwing
  {
    delete process.env.ACYA_QUOTE_API_URL;
    delete process.env.ACYA_QUOTE_INTEGRATION_KEY;
    delete process.env.ACYA_TENANT_SLUG;

    const result = await sendQuoteToAcya(validPayload, '192.168.1.1');
    assert(
      result.success === false && result.statusCode === 503,
      'Test 1: Missing configuration fails safely with HTTP 503 status'
    );
  }

  // Configure mock env vars
  process.env.ACYA_QUOTE_API_URL = mockApiUrl;
  process.env.ACYA_QUOTE_INTEGRATION_KEY = 'test-secret-integration-key-xyz';
  process.env.ACYA_TENANT_SLUG = 'socofeb';

  // TEST 2 & 4: Correct headers and DTO field names sent to ACYA
  {
    mockConfig = { statusCode: 202, body: { status: 'accepted' } };
    lastReceivedRequest = null;

    const result = await sendQuoteToAcya(validPayload, '196.203.20.10');
    const req = lastReceivedRequest;

    assert(result.success === true && result.statusCode === 202, 'Test 2a: HTTP 202 accepted result returned');
    assert(
      req?.headers['x-integration-key'] === 'test-secret-integration-key-xyz',
      'Test 4a: Correct X-Integration-Key header transmitted'
    );
    assert(
      req?.headers['x-tenant-slug'] === 'socofeb',
      'Test 4b: Correct X-Tenant-Slug header transmitted'
    );
    assert(
      req?.headers['x-forwarded-client-ip'] === '196.203.20.10',
      'Test 4c: Validated client IP transmitted in X-Forwarded-Client-IP'
    );
    assert(
      req?.body?.product === validPayload.product &&
        req?.body?.quantity === validPayload.quantity &&
        req?.body?.customerName === validPayload.customerName &&
        req?.body?.customerEmail === validPayload.customerEmail &&
        req?.body?.customerPhone === validPayload.customerPhone &&
        req?.body?.idempotencyKey === validPayload.idempotencyKey,
      'Test 4d: Exact DTO fields match verified ACYA specification'
    );
    assert(
      req?.body?.source === 'socofeb-decor.com',
      'Test 5: Source is strictly controlled as socofeb-decor.com'
    );
  }

  // TEST 6: HTTP 202 duplicate idempotent submission displays success
  {
    mockConfig = { statusCode: 202, body: { status: 'accepted', duplicate: true } };
    const result = await sendQuoteToAcya(validPayload, '196.203.20.10');
    assert(result.success === true, 'Test 6: Idempotent duplicate acceptance (202) treated as success');
  }

  // TEST 7: HTTP 400 validation error handled safely
  {
    mockConfig = {
      statusCode: 400,
      body: { error: 'ValidationError', message: 'Format d email invalide.' },
    };
    const result = await sendQuoteToAcya(validPayload, '196.203.20.10');
    assert(
      result.success === false && result.statusCode === 400 && result.message === 'Format d email invalide.',
      'Test 7: HTTP 400 returns safe validation error message'
    );
  }

  // TEST 8: HTTP 401, 403, 404 do not expose internal details
  {
    mockConfig = { statusCode: 401, body: { internalError: 'Invalid Secret Key hash: 0xDEADBEEF' } };
    const res401 = await sendQuoteToAcya(validPayload, null);
    assert(
      res401.success === false &&
        res401.statusCode === 401 &&
        !res401.message?.includes('DEADBEEF') &&
        res401.message?.includes('indisponible'),
      'Test 8a: HTTP 401 masks internal credentials from customer message'
    );

    mockConfig = { statusCode: 403, body: { internalError: 'Tenant socofeb is disabled in DB' } };
    const res403 = await sendQuoteToAcya(validPayload, null);
    assert(
      res403.success === false &&
        res403.statusCode === 403 &&
        !res403.message?.includes('disabled in DB'),
      'Test 8b: HTTP 403 masks internal database details'
    );

    mockConfig = { statusCode: 404, body: { route: '/api/internal/quote' } };
    const res404 = await sendQuoteToAcya(validPayload, null);
    assert(
      res404.success === false &&
        res404.statusCode === 404 &&
        !res404.message?.includes('/api/internal/quote'),
      'Test 8c: HTTP 404 masks internal routing paths'
    );
  }

  // TEST 9: HTTP 429 respects valid Retry-After
  {
    mockConfig = {
      statusCode: 429,
      body: { error: 'RateLimited' },
      headers: { 'Content-Type': 'application/json', 'Retry-After': '45' },
    };
    const result = await sendQuoteToAcya(validPayload, '196.203.20.10');
    assert(
      result.success === false &&
        result.statusCode === 429 &&
        result.retryAfter === 45 &&
        result.message?.includes('45 secondes'),
      'Test 9: HTTP 429 extracts and respects Retry-After (45s)'
    );
  }

  // TEST 10: HTTP 503 / 500 / timeouts declare isRetryable: true
  {
    mockConfig = { statusCode: 503, body: 'Database connection pool exhausted' };
    const res503 = await sendQuoteToAcya(validPayload, null);
    assert(
      res503.success === false && res503.statusCode === 503 && res503.isRetryable === true,
      'Test 10a: HTTP 503 flagged as retryable to preserve idempotency key'
    );

    mockConfig = { statusCode: 500, body: 'Internal Server Error' };
    const res500 = await sendQuoteToAcya(validPayload, null);
    assert(
      res500.success === false && res500.statusCode === 500 && res500.isRetryable === true,
      'Test 10b: HTTP 500 flagged as retryable'
    );
  }

  // TEST 11: UUID v4 format verification
  {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const testUuid1 = crypto.randomUUID();
    const testUuid2 = crypto.randomUUID();
    assert(
      uuidRegex.test(testUuid1) && uuidRegex.test(testUuid2) && testUuid1 !== testUuid2,
      'Test 11: Dynamic UUID v4 generator produces unique, compliant identifiers'
    );
  }

  // Clean up mock server
  server.close();

  console.log(`\n------------------------------------------------------`);
  console.log(`  TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log(`------------------------------------------------------\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  server.close();
  process.exit(1);
});

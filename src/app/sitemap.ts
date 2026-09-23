import { MetadataRoute } from 'next';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';
import { SUPPLIERS } from '@/types/image';
import { SITE_ORIGIN } from '@/lib/seo';
import { getAllIndexableDecors } from '@/lib/decors';
import { getArtisans } from '@/lib/artisans';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_ORIGIN;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    // 1. Core Homepage
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // 2. Providers Index
    {
      url: `${baseUrl}/providers`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },

    // 3. Products Catalog & Categories
    {
      url: `${baseUrl}/produits`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/produits/mdf`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/produits/bois`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/produits/contreplaque`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produits/osb`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // 4. Secondary Commercial Pages
    {
      url: `${baseUrl}/promotions`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/realisations`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 5. All Individual Provider SEO Pages (/providers/[provider])
  SUPPLIERS.forEach((provider) => {
    routes.push({
      url: `${baseUrl}/providers/${provider}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // 6. All Individual Crawlable Decor Pages (/decors/[provider]/[ref])
  const indexableDecors = getAllIndexableDecors();
  indexableDecors.forEach(({ supplier, ref }) => {
    routes.push({
      url: `${baseUrl}/decors/${supplier}/${encodeURIComponent(ref)}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 7. Individual MDF Products
  const mdf = PRODUCT_CATEGORIES.find((c) => c.id === 'mdf');
  (mdf?.products || []).forEach((p) => {
    routes.push({
      url: `${baseUrl}/produits/mdf/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 8. Individual Wood Species
  const bois = PRODUCT_CATEGORIES.find((c) => c.id === 'bois-massifs');
  (bois?.products || []).forEach((p) => {
    routes.push({
      url: `${baseUrl}/produits/bois/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 9. Individual Artisan Portfolio Pages (/realisations/artisan/[id])
  const artisans = getArtisans();
  artisans.forEach((artisan) => {
    routes.push({
      url: `${baseUrl}/realisations/artisan/${artisan.id}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  return routes;
}

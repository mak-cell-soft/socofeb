import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import manifestData from '@/lib/decors-manifest.json';

// In dev mode, re-scan public/images directly so any newly added file appears immediately
function scanLiveDecors() {
  const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
  const LOGO_EXTENSIONS = new Set(['.png', '.svg', '.webp', '.jpg', '.jpeg']);
  const SUPPLIERS = ['starwood', 'stibois', 'propann', 'mpbs'];
  const publicDir = path.join(process.cwd(), 'public', 'images');

  const enterprises: Record<string, any> = {};

  for (const supplier of SUPPLIERS) {
    const supplierDir = path.join(publicDir, supplier);
    const decorsDir = path.join(supplierDir, 'decors');
    const logoDir = path.join(supplierDir, 'logo');

    let logoPath: string | null = null;
    if (fs.existsSync(logoDir)) {
      try {
        const logoFiles = fs.readdirSync(logoDir);
        const found = logoFiles.find((f) =>
          LOGO_EXTENSIONS.has(path.extname(f).toLowerCase())
        );
        if (found) {
          logoPath = `/images/${supplier}/logo/${found}`;
        }
      } catch (e) {
        // Fallback below
      }
    }

    if (!logoPath) {
      const uiLogoPath = path.join(publicDir, 'ui', `logo-${supplier}.png`);
      if (fs.existsSync(uiLogoPath)) {
        logoPath = `/images/ui/logo-${supplier}.png`;
      }
    }

    const decors: any[] = [];
    if (fs.existsSync(decorsDir)) {
      try {
        const files = fs.readdirSync(decorsDir);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (IMAGE_EXTENSIONS.has(ext)) {
            decors.push({
              filename: file,
              name: path.basename(file, ext),
              src: `/images/${supplier}/decors/${file}`,
              ext: ext.slice(1),
              supplier,
            });
          }
        }
      } catch (e) {
        // Continue
      }
    }

    decors.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    enterprises[supplier] = {
      id: supplier,
      logo: logoPath,
      decorsCount: decors.length,
      decors,
    };
  }

  return {
    updatedAt: new Date().toISOString(),
    enterprises,
  };
}

export async function GET() {
  try {
    // If in development or running on Node with fs access, scan live
    if (process.env.NODE_ENV === 'development') {
      const liveData = scanLiveDecors();
      return NextResponse.json(liveData);
    }
    // In production on Vercel, serve pre-compiled manifest
    return NextResponse.json(manifestData);
  } catch (error) {
    return NextResponse.json(manifestData);
  }
}

const esbuild = require('esbuild');
const fs = require('fs/promises');
const path = require('path');

async function build() {
  const outdir = 'dist';

  try {
    // Clean and create dist folder
    await fs.rm(outdir, { recursive: true, force: true });
    await fs.mkdir(outdir);

    // Build TypeScript/React code
    await esbuild.build({
      entryPoints: ['index.tsx'],
      bundle: true,
      outfile: path.join(outdir, 'index.js'),
      jsx: 'automatic',
      // The define option is crucial for replacing process.env.API_KEY
      // with the actual environment variable at build time.
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
      },
    });

    // Read, process, and copy index.html
    let html = await fs.readFile('index.html', 'utf-8');
    
    // 1. Remove the importmap script tag entirely
    html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/s, '');
    
    // 2. Change the main script source to the bundled JS file
    html = html.replace(
      '<script type="module" src="/index.tsx"></script>', 
      '<script type="module" src="/index.js"></script>'
    );
      
    await fs.writeFile(path.join(outdir, 'index.html'), html.trim());

    console.log('Build successful! Output is in the "dist" directory.');

  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
}

build();

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Compile TypeScript entrypoints
async function build() {
  console.log('[Build] Bundling TypeScript entrypoints with Esbuild...');
  
  await esbuild.build({
    entryPoints: [
      { in: 'src/inject/main.ts', out: 'inject' },
      { in: 'src/content/content.ts', out: 'content' },
      { in: 'src/popup/popup.ts', out: 'popup' }
    ],
    bundle: true,
    outdir: distDir,
    target: 'es2022',
    format: 'iife',
    minify: false,
    sourcemap: false,
  });

  // 2. Copy static files into dist
  console.log('[Build] Copying manifest and static popup files...');
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(distDir, 'manifest.json'));
  fs.copyFileSync(path.join(__dirname, 'src/popup/popup.html'), path.join(distDir, 'popup.html'));
  fs.copyFileSync(path.join(__dirname, 'src/popup/popup.css'), path.join(distDir, 'popup.css'));

  // 3. Create icon.png in dist (orange icon PNG)
  const iconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA_SURBVHhe7cEBDQAAAMKg909tDjegAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvBq0AAAB5c024AAAAABJRU5ErkJggg==";
  const iconBuffer = Buffer.from(iconBase64, 'base64');
  fs.writeFileSync(path.join(distDir, 'icon.png'), iconBuffer);
  
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'icon.png'), iconBuffer);

  console.log('[Build] Build complete! Extension files ready in dist/');
}

build().catch((err) => {
  console.error('[Build] Build failed:', err);
  process.exit(1);
});

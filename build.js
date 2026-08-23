const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

async function build() {
  console.log('[Build] Bundling TypeScript entrypoints with Esbuild...');

  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Build TS entrypoints
  const context = await esbuild.context({
    entryPoints: [
      { in: 'src/content/content.ts', out: 'content' },
      { in: 'src/inject/main.ts', out: 'inject' },
      { in: 'src/popup/popup.ts', out: 'popup' }
    ],
    bundle: true,
    minify: false,
    sourcemap: true,
    target: ['chrome100'],
    outdir: 'dist',
    format: 'iife'
  });

  if (isWatch) {
    await context.watch();
    console.log('[Build] Watching for changes...');
  } else {
    await context.rebuild();
    await context.dispose();
  }

  // Copy static files
  console.log('[Build] Copying manifest and static popup files...');
  fs.copyFileSync(path.join(__dirname, 'manifest.json'), path.join(distDir, 'manifest.json'));
  fs.copyFileSync(path.join(__dirname, 'src/popup/popup.html'), path.join(distDir, 'popup.html'));
  fs.copyFileSync(path.join(__dirname, 'src/popup/popup.css'), path.join(distDir, 'popup.css'));

  const publicIcon = path.join(__dirname, 'public', 'icon.png');
  if (fs.existsSync(publicIcon)) {
    fs.copyFileSync(publicIcon, path.join(distDir, 'icon.png'));
  }

  const publicPreview = path.join(__dirname, 'public', 'preview.png');
  if (fs.existsSync(publicPreview)) {
    fs.copyFileSync(publicPreview, path.join(distDir, 'preview.png'));
  }

  console.log('[Build] Build complete! Extension files ready in dist/');
}

build().catch((err) => {
  console.error('[Build Error]:', err);
  process.exit(1);
});

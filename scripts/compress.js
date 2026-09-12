import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * IKSH STUDIO — Recursive High-Fidelity Image Optimizer
 * Usage: npm run compress
 */

const PUBLIC_DIR = path.resolve('public');
const MAX_DIMENSION = 1600;

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function processImage(filePath) {
  const filename = path.basename(filePath);
  const relPath = path.relative(PUBLIC_DIR, filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return null;
  }

  // Preserve core favicon & logo from heavy alterations
  if (filename.includes('favicon') || filename.includes('header-logo')) {
    return null;
  }

  const statBefore = fs.statSync(filePath);
  const sizeBefore = statBefore.size;

  try {
    const inputBuffer = fs.readFileSync(filePath);
    const metadata = await sharp(inputBuffer).metadata();

    let transform = sharp(inputBuffer).rotate();

    // Scale down only if image is larger than 1600px
    if ((metadata.width && metadata.width > MAX_DIMENSION) || (metadata.height && metadata.height > MAX_DIMENSION)) {
      transform = transform.resize({
        width: metadata.width > metadata.height ? MAX_DIMENSION : undefined,
        height: metadata.height >= metadata.width ? MAX_DIMENSION : undefined,
        fit: 'inside',
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      });
    }

    let buffer;
    if (ext === '.jpg' || ext === '.jpeg') {
      buffer = await transform
        .jpeg({
          quality: 80,
          mozjpeg: true,
          progressive: true
        })
        .toBuffer();
    } else if (ext === '.png') {
      buffer = await transform
        .png({
          compressionLevel: 9,
          effort: 8,
          quality: 82,
          palette: true
        })
        .toBuffer();
    } else if (ext === '.webp') {
      buffer = await transform
        .webp({
          quality: 80,
          effort: 6
        })
        .toBuffer();
    }

    if (buffer && buffer.length < sizeBefore) {
      fs.writeFileSync(filePath, buffer);
      const sizeAfter = buffer.length;
      const savings = (((sizeBefore - sizeAfter) / sizeBefore) * 100).toFixed(1);
      return {
        relPath,
        beforeKB: (sizeBefore / 1024).toFixed(1),
        afterKB: (sizeAfter / 1024).toFixed(1),
        savings: `${savings}%`
      };
    } else {
      return {
        relPath,
        beforeKB: (sizeBefore / 1024).toFixed(1),
        afterKB: (sizeBefore / 1024).toFixed(1),
        savings: '0.0% (already optimal)'
      };
    }
  } catch (err) {
    console.error(`❌ Error processing ${relPath}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('⚡ IKSH STUDIO — High-Fidelity Image Optimizer');
  console.log(`📁 Scanning directory: ${PUBLIC_DIR} (Recursive)`);
  console.log('======================================================\n');

  const files = getAllFiles(PUBLIC_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let compressedCount = 0;

  for (const filePath of files) {
    const res = await processImage(filePath);
    if (res) {
      totalBefore += parseFloat(res.beforeKB);
      totalAfter += parseFloat(res.afterKB);
      compressedCount++;
      console.log(`✓ ${res.relPath.padEnd(38)} ${res.beforeKB.padStart(8)} KB  ->  ${res.afterKB.padStart(8)} KB  (${res.savings})`);
    }
  }

  console.log('\n------------------------------------------------------');
  console.log(`Total Images Processed : ${compressedCount}`);
  console.log(`Total Original Size     : ${(totalBefore / 1024).toFixed(2)} MB`);
  console.log(`Total Compressed Size   : ${(totalAfter / 1024).toFixed(2)} MB`);
  const overallSavings = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : '0.0';
  console.log(`Overall Savings         : ${overallSavings}%`);
  console.log('======================================================\n');
}

run();

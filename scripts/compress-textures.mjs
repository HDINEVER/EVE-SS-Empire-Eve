import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const inputDir = './public/models';
const outputDir = './public/models';

const files = readdirSync(inputDir).filter(f => 
  f.startsWith('texture_') && extname(f) === '.png'
);

console.log('🔄 Converting textures to WebP...\n');

for (const file of files) {
  const inputPath = join(inputDir, file);
  const outputPath = join(outputDir, basename(file, '.png') + '.webp');
  
  const originalSize = statSync(inputPath).size;
  
  await sharp(inputPath)
    .webp({ 
      quality: 90,  // 高质量
      effort: 6,    // 压缩努力程度 (0-6)
    })
    .toFile(outputPath);
  
  const newSize = statSync(outputPath).size;
  const savings = ((1 - newSize / originalSize) * 100).toFixed(1);
  
  console.log(`✅ ${file}`);
  console.log(`   ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(newSize / 1024 / 1024).toFixed(2)} MB (${savings}% smaller)\n`);
}

console.log('🎉 Done! WebP textures created.');
console.log('\n💡 You can now update your model to use .webp textures');
console.log('   or keep both formats for fallback.');

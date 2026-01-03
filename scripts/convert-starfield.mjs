import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// 将上传的星空图片转换为高质量WebP
// 输入: 你需要手动将图片保存为 public/images/galaxy-source.jpg
// 输出: public/images/galaxy-background.webp

const inputPath = join(rootDir, 'public', 'images', 'galaxy-source.jpg');
const outputPath = join(rootDir, 'public', 'images', 'galaxy-background.webp');

console.log('🔄 Converting galaxy image to WebP...');
console.log('Input:', inputPath);
console.log('Output:', outputPath);

try {
  await sharp(inputPath)
    .webp({
      quality: 95, // 高质量，接近无损
      effort: 6,   // 最高压缩效率
      lossless: false // 如果需要完全无损，改为true（文件会更大）
    })
    .toFile(outputPath);

  console.log('✅ Conversion successful!');
  
  // 显示文件大小比较
  const inputStats = await sharp(inputPath).metadata();
  const outputStats = await sharp(outputPath).metadata();
  
  console.log('\n📊 Image Info:');
  console.log('  Dimensions:', `${outputStats.width}x${outputStats.height}`);
  console.log('  Format:', outputStats.format);
  
} catch (error) {
  if (error.code === 'ENOENT') {
    console.error('\n❌ Error: Source file not found!');
    console.error('\n📝 Please save the uploaded galaxy image as:');
    console.error('   public/images/galaxy-source.jpg');
    console.error('\nThen run this script again: npm run convert-starfield');
  } else {
    console.error('❌ Conversion failed:', error.message);
  }
  process.exit(1);
}

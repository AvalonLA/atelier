
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');

async function convertImages() {
  try {
    if (!fs.existsSync(imagesDir)) {
      console.log('Images directory not found');
      return;
    }

    const files = fs.readdirSync(imagesDir);
    
    for (const file of files) {
      if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
        const inputPath = path.join(imagesDir, file);
        const outputPath = path.join(imagesDir, file.replace(/\.(jpeg|jpg)$/, '.webp'));
        
        console.log(`Converting ${file} to WebP...`);
        
        try {
          await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);
            
          // Delete original file
          fs.unlinkSync(inputPath);
          console.log(`Converted and deleted ${file}`);
        } catch (err) {
          console.error(`Error converting ${file}:`, err);
        }
      }
    }
    console.log('All conversions complete!');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

convertImages();

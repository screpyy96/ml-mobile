#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Generator de iconițe iPhone pentru MeseriasLocal');
console.log('==================================================');

// Verifică dacă ImageMagick este instalat
const checkImageMagick = () => {
  try {
    execSync('magick --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Dimensiunile iconițelor iPhone necesare
const iphoneIconSizes = {
  'icon-20@2x.png': 40,
  'icon-20@3x.png': 60,
  'icon-29@2x.png': 58,
  'icon-29@3x.png': 87,
  'icon-40@2x.png': 80,
  'icon-40@3x.png': 120,
  'icon-60@2x.png': 120,
  'icon-60@3x.png': 180,
  'icon-1024.png': 1024
};

const generateIphoneIcons = () => {
  const sourceIcon = path.join(__dirname, '../temp-icons/logo-1024-square.png');
  const targetDir = path.join(__dirname, '../ios/MeseriasLocalAppNew/Images.xcassets/AppIcon.appiconset');
  
  if (!fs.existsSync(sourceIcon)) {
    console.error('❌ Iconița sursă logo-1024-square.png nu a fost găsită în temp-icons/');
    process.exit(1);
  }
  
  console.log('✅ Iconița sursă găsită');
  
  if (!checkImageMagick()) {
    console.error('❌ ImageMagick nu este instalat. Instalează-l cu: brew install imagemagick');
    console.log('📋 Alternativ, poți genera iconițele manual folosind un tool online:');
    console.log('   - https://appicon.co/');
    console.log('   - https://www.appicon.co/');
    console.log('   - https://makeappicon.com/');
    process.exit(1);
  }
  
  console.log('✅ ImageMagick găsit');
  console.log('\n🎨 Generarea iconițelor iPhone...');
  
  Object.entries(iphoneIconSizes).forEach(([filename, size]) => {
    const outputPath = path.join(targetDir, filename);
    const command = `magick "${sourceIcon}" -resize ${size}x${size}! "${outputPath}"`;
    
    try {
      execSync(command, { stdio: 'ignore' });
      console.log(`✅ ${filename} (${size}x${size}px)`);
    } catch (error) {
      console.error(`❌ Eroare la generarea ${filename}:`, error.message);
    }
  });
  
  console.log('\n🎉 Iconițele iPhone au fost generate cu succes!');
  console.log('\n📋 Următorii pași:');
  console.log('1. Verifică că toate iconițele au fost create în AppIcon.appiconset/');
  console.log('2. Fă un build nou cu: npm run ios');
};

generateIphoneIcons();

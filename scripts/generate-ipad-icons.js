#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎨 Generator de iconițe iPad pentru MeseriasLocal');
console.log('===============================================');

// Verifică dacă ImageMagick este instalat
const checkImageMagick = () => {
  try {
    execSync('magick --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};

// Dimensiunile iconițelor iPad necesare
const ipadIconSizes = {
  'icon-20.png': 20,
  'icon-29.png': 29,
  'icon-40.png': 40,
  'icon-76.png': 76,
  'icon-76@2x.png': 152,
  'icon-83.5@2x.png': 167
};

const generateIpadIcons = () => {
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
  console.log('\n🎨 Generarea iconițelor iPad...');
  
  Object.entries(ipadIconSizes).forEach(([filename, size]) => {
    const outputPath = path.join(targetDir, filename);
    const command = `magick "${sourceIcon}" -resize ${size}x${size}! "${outputPath}"`;
    
    try {
      execSync(command, { stdio: 'ignore' });
      console.log(`✅ ${filename} (${size}x${size}px)`);
    } catch (error) {
      console.error(`❌ Eroare la generarea ${filename}:`, error.message);
    }
  });
  
  console.log('\n🎉 Iconițele iPad au fost generate cu succes!');
  console.log('\n📋 Următorii pași:');
  console.log('1. Verifică că toate iconițele au fost create în AppIcon.appiconset/');
  console.log('2. Fă un build nou cu: npm run ios');
};

generateIpadIcons();

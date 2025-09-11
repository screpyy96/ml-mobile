#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Dimensiunile iconițelor necesare
const iconSizes = {
  ios: {
    'icon-20@2x.png': 40,
    'icon-20@3x.png': 60,
    'icon-29@2x.png': 58,
    'icon-29@3x.png': 87,
    'icon-40@2x.png': 80,
    'icon-40@3x.png': 120,
    'icon-60@2x.png': 120,
    'icon-60@3x.png': 180,
    'icon-1024.png': 1024
  },
  android: {
    'ic_launcher.png': 192,
    'ic_launcher_round.png': 192
  }
};

console.log('🎨 Generarea tuturor iconițelor pentru MeseriasLocal');
console.log('==================================================');

// Verifică dacă logo-ul PNG există
const logoPath = path.join(__dirname, '../temp-icons/logo-1024.png');
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo-1024.png nu a fost găsit în temp-icons/');
  console.log('💡 Rulează mai întâi: magick src/assets/images/logo.svg -resize 1024x1024 temp-icons/logo-1024.png');
  process.exit(1);
}

console.log('✅ Logo-1024.png găsit');

// Generează iconițele iOS
const generateIOSIcons = () => {
  console.log('\n📱 Generarea iconițelor iOS...');
  
  const iosPath = path.join(__dirname, '../ios/MeseriasLocalAppNew/Images.xcassets/AppIcon.appiconset');
  
  Object.entries(iconSizes.ios).forEach(([filename, size]) => {
    const outputPath = path.join(iosPath, filename);
    const command = `magick temp-icons/logo-1024.png -resize ${size}x${size} "${outputPath}"`;
    
    try {
      execSync(command, { stdio: 'pipe' });
      console.log(`✅ ${filename} (${size}x${size}px)`);
    } catch (error) {
      console.error(`❌ Eroare la generarea ${filename}:`, error.message);
    }
  });
};

// Generează iconițele Android
const generateAndroidIcons = () => {
  console.log('\n🤖 Generarea iconițelor Android...');
  
  const androidDensities = [
    { density: 'mdpi', size: 48 },
    { density: 'hdpi', size: 72 },
    { density: 'xhdpi', size: 96 },
    { density: 'xxhdpi', size: 144 },
    { density: 'xxxhdpi', size: 192 }
  ];
  
  androidDensities.forEach(({ density, size }) => {
    const androidPath = path.join(__dirname, `../android/app/src/main/res/mipmap-${density}`);
    
    Object.entries(iconSizes.android).forEach(([filename, baseSize]) => {
      const outputPath = path.join(androidPath, filename);
      const command = `magick temp-icons/logo-1024.png -resize ${size}x${size} "${outputPath}"`;
      
      try {
        execSync(command, { stdio: 'pipe' });
        console.log(`✅ ${density}/${filename} (${size}x${size}px)`);
      } catch (error) {
        console.error(`❌ Eroare la generarea ${density}/${filename}:`, error.message);
      }
    });
  });
};

// Funcție principală
const main = () => {
  try {
    generateIOSIcons();
    generateAndroidIcons();
    
    console.log('\n🎉 Toate iconițele au fost generate cu succes!');
    console.log('\n📋 Următorii pași:');
    console.log('1. Fă un build nou cu: npm run ios');
    console.log('2. Sau pentru Android: npm run android');
    console.log('3. Verifică că iconița apare corect pe device/simulator');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    process.exit(1);
  }
};

main();

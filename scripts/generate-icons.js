#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Dimensiunile iconițelor necesare pentru iOS și Android
const iconSizes = {
  ios: {
    '20x20': [40, 60], // 2x, 3x
    '29x29': [58, 87], // 2x, 3x
    '40x40': [80, 120], // 2x, 3x
    '60x60': [120, 180], // 2x, 3x
    '1024x1024': [1024] // App Store
  },
  android: {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
  }
};

console.log('🎨 Generator de iconițe pentru MeseriasLocal');
console.log('==========================================');

// Verifică dacă logo.svg există
const logoPath = path.join(__dirname, '../src/assets/images/logo.svg');
if (!fs.existsSync(logoPath)) {
  console.error('❌ Logo.svg nu a fost găsit în src/assets/images/');
  process.exit(1);
}

console.log('✅ Logo.svg găsit');

// Creează directoarele pentru iconițe
const createDirectories = () => {
  console.log('\n📁 Crearea directoarelor...');
  
  // iOS
  const iosIconPath = path.join(__dirname, '../ios/MeseriasLocalAppNew/Images.xcassets/AppIcon.appiconset');
  if (!fs.existsSync(iosIconPath)) {
    fs.mkdirSync(iosIconPath, { recursive: true });
  }
  
  // Android
  const androidPaths = [
    'mipmap-mdpi',
    'mipmap-hdpi', 
    'mipmap-xhdpi',
    'mipmap-xxhdpi',
    'mipmap-xxxhdpi'
  ];
  
  androidPaths.forEach(density => {
    const androidPath = path.join(__dirname, `../android/app/src/main/res/${density}`);
    if (!fs.existsSync(androidPath)) {
      fs.mkdirSync(androidPath, { recursive: true });
    }
  });
  
  console.log('✅ Directoare create');
};

// Funcție pentru generarea iconițelor (placeholder - va fi implementată cu un tool real)
const generateIcons = () => {
  console.log('\n🎨 Generarea iconițelor...');
  console.log('⚠️  Aceasta este o funcție placeholder');
  console.log('📋 Pentru generarea reală, folosește:');
  console.log('   - https://appicon.co/');
  console.log('   - https://www.appicon.co/');
  console.log('   - https://makeappicon.com/');
  console.log('   - Sau un tool local precum ImageMagick');
  
  console.log('\n📏 Dimensiuni necesare:');
  
  console.log('\n📱 iOS:');
  Object.entries(iconSizes.ios).forEach(([name, sizes]) => {
    console.log(`   ${name}: ${sizes.join(', ')}px`);
  });
  
  console.log('\n🤖 Android:');
  Object.entries(iconSizes.android).forEach(([density, size]) => {
    console.log(`   ${density}: ${size}x${size}px`);
  });
};

// Funcție pentru actualizarea Contents.json pentru iOS
const updateIOSContents = () => {
  console.log('\n📝 Actualizarea Contents.json pentru iOS...');
  
  const contentsPath = path.join(__dirname, '../ios/MeseriasLocalAppNew/Images.xcassets/AppIcon.appiconset/Contents.json');
  
  const contents = {
    images: [
      {
        filename: "icon-20@2x.png",
        idiom: "iphone",
        scale: "2x",
        size: "20x20"
      },
      {
        filename: "icon-20@3x.png", 
        idiom: "iphone",
        scale: "3x",
        size: "20x20"
      },
      {
        filename: "icon-29@2x.png",
        idiom: "iphone", 
        scale: "2x",
        size: "29x29"
      },
      {
        filename: "icon-29@3x.png",
        idiom: "iphone",
        scale: "3x", 
        size: "29x29"
      },
      {
        filename: "icon-40@2x.png",
        idiom: "iphone",
        scale: "2x",
        size: "40x40"
      },
      {
        filename: "icon-40@3x.png",
        idiom: "iphone", 
        scale: "3x",
        size: "40x40"
      },
      {
        filename: "icon-60@2x.png",
        idiom: "iphone",
        scale: "2x",
        size: "60x60"
      },
      {
        filename: "icon-60@3x.png",
        idiom: "iphone",
        scale: "3x",
        size: "60x60"
      },
      {
        filename: "icon-1024.png",
        idiom: "ios-marketing",
        scale: "1x",
        size: "1024x1024"
      }
    ],
    info: {
      author: "xcode",
      version: 1
    }
  };
  
  fs.writeFileSync(contentsPath, JSON.stringify(contents, null, 2));
  console.log('✅ Contents.json actualizat');
};

// Funcție principală
const main = () => {
  try {
    createDirectories();
    generateIcons();
    updateIOSContents();
    
    console.log('\n🎉 Script completat!');
    console.log('\n📋 Următorii pași:');
    console.log('1. Generează iconițele din logo.svg folosind un tool online');
    console.log('2. Pune iconițele în directoarele create');
    console.log('3. Fă un build nou cu: npm run ios sau npm run android');
    
  } catch (error) {
    console.error('❌ Eroare:', error.message);
    process.exit(1);
  }
};

main();

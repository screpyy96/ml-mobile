# Imagini în MeseriasLocal App

## Structura folderului

Acest folder conține toate imaginile folosite în aplicație.

## Tipuri de imagini suportate

- **SVG** - Pentru logo-uri și iconițe vectoriale
- **PNG** - Pentru imagini cu transparență
- **JPG/JPEG** - Pentru fotografii
- **GIF** - Pentru animații

## Cum să folosești imaginile

### 1. Pentru SVG-uri (recomandat pentru logo-uri și iconițe):

```tsx
import Logo from '../../assets/images/logo.svg';

// În componenta ta:
<Logo width={120} height={120} />
```

### 2. Pentru imagini raster (PNG, JPG, etc.):

```tsx
import { Image } from 'react-native';

// În componenta ta:
<Image 
  source={require('../../assets/images/example.png')} 
  style={{ width: 120, height: 120 }} 
  resizeMode="contain" 
/>
```

### 3. Folosind fișierul index (pentru organizare):

```tsx
import { Images } from '../../assets/images';

// În componenta ta:
<Image source={Images.logo} style={styles.logo} />
```

## Organizare recomandată

- `logo.svg` - Logo-ul principal al aplicației
- `icons/` - Iconițe pentru butoane și navigare
- `backgrounds/` - Imagini de fundal
- `avatars/` - Imagini de profil default
- `categories/` - Imagini pentru categorii de servicii

## Note importante

1. **SVG-uri**: Asigură-te că ai instalat `react-native-svg`
2. **Dimensiuni**: Folosește dimensiuni optime pentru mobile
3. **Performanță**: Optimizează imaginile înainte de a le adăuga
4. **Naming**: Folosește nume descriptive în camelCase

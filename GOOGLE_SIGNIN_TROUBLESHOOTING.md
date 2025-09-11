# Google Sign-In Troubleshooting

## Erori comune și soluții

### 1. "RNGoogleSignin could not be found"

**Cauza:** Modulul nativ nu este instalat corect.

**Soluții:**
```bash
# 1. Reinstalează dependențele
npm install @react-native-google-signin/google-signin

# 2. Curăță cache-ul
npx react-native start --reset-cache

# 3. Reinstalează pod-urile pentru iOS
cd ios && pod install && cd ..

# 4. Recompilează aplicația
npx react-native run-ios
```

### 2. "DEVELOPER_ERROR"

**Cauza:** Client ID incorect sau SHA-1 fingerprint greșit.

**Soluții:**
- Verifică Client ID în `src/config/googleAuth.ts`
- Verifică SHA-1 fingerprint în Google Cloud Console
- Asigură-te că folosești Client ID-ul pentru Android/iOS, nu Web

### 3. "SIGN_IN_REQUIRED"

**Cauza:** User-ul nu este conectat sau token-ul a expirat.

**Soluții:**
```typescript
// Verifică dacă user-ul este conectat
const isSignedIn = await googleSignIn.isSignedIn();

// Dacă nu este conectat, forțează sign-in
if (!isSignedIn) {
  await googleSignIn.signOut(); // Curăță starea
  const userInfo = await googleSignIn.signIn();
}
```

### 4. "NETWORK_ERROR"

**Cauza:** Probleme de conexiune sau configurație.

**Soluții:**
- Verifică conexiunea la internet
- Verifică că Google Play Services sunt instalate (Android)
- Verifică că aplicația are permisiuni de internet

### 5. "PLAY_SERVICES_NOT_AVAILABLE"

**Cauza:** Google Play Services nu sunt disponibile (Android).

**Soluții:**
```typescript
// Verifică Google Play Services
await GoogleSignin.hasPlayServices();
```

## Testare și Debug

### 1. Testează modulul
```typescript
const testGoogleSignIn = async () => {
  try {
    console.log('🧪 Testing Google Sign-In...');
    
    // Test configurație
    configureGoogleSignIn();
    console.log('✅ Configuration OK');
    
    // Test disponibilitate
    const isSignedIn = await googleSignIn.isSignedIn();
    console.log('📊 Is signed in:', isSignedIn);
    
    // Test get current user
    const currentUser = await googleSignIn.getCurrentUser();
    console.log('👤 Current user:', currentUser);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};
```

### 2. Verifică log-urile
```bash
# Pentru iOS
npx react-native log-ios

# Pentru Android
npx react-native log-android
```

### 3. Verifică configurația
```typescript
// Verifică că Client ID-ul este corect
console.log('Client ID:', '447522045620-3o02ugei8ghntm0fhld38tl18shgpef1.apps.googleusercontent.com');

// Verifică că URL scheme-ul este configurat (iOS)
// În Info.plist: com.googleusercontent.apps.447522045620-3o02ugei8ghntm0fhld38tl18shgpef1
```

## Configurare completă

### 1. Google Cloud Console
- ✅ Proiect creat
- ✅ Google Sign-In API activat
- ✅ OAuth 2.0 Client ID creat pentru Android/iOS
- ✅ SHA-1 fingerprint adăugat (Android)

### 2. Aplicație React Native
- ✅ `@react-native-google-signin/google-signin` instalat
- ✅ `pod install` rulat pentru iOS
- ✅ Client ID configurat în `googleAuth.ts`
- ✅ URL scheme configurat în `Info.plist` (iOS)

### 3. Testare
- ✅ Testat pe device fizic (nu simulator)
- ✅ Google Play Services disponibile (Android)
- ✅ Conexiune la internet
- ✅ Log-uri verificate

## Comenzi utile

```bash
# Reinstalează totul
rm -rf node_modules && npm install
cd ios && pod install && cd ..
npx react-native start --reset-cache

# Curăță build-ul
cd ios && xcodebuild clean && cd ..
cd android && ./gradlew clean && cd ..

# Recompilează
npx react-native run-ios
npx react-native run-android
```

## Contact

Dacă problemele persistă, verifică:
1. Versiunea React Native
2. Versiunea @react-native-google-signin/google-signin
3. Configurația Google Cloud Console
4. Log-urile complete din console

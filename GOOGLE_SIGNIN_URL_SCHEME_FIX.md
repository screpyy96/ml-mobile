# Fix pentru URL Scheme Google Sign-In

## Problema
```
Your app is missing support for the following URL schemes: com.googleusercontent.apps.447522045620-mr3kmgt80oplbeocm7m4hsoiq4kv242n
```

## Soluții

### 1. Verifică Info.plist
Asigură-te că `ios/MeseriasLocalAppNew/Info.plist` conține:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.googleusercontent.apps.447522045620-mr3kmgt80oplbeocm7m4hsoiq4kv242n</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.447522045620-mr3kmgt80oplbeocm7m4hsoiq4kv242n</string>
        </array>
    </dict>
</array>
```

### 2. Curăță și recompilează
```bash
# Curăță build-ul iOS
cd ios && xcodebuild clean -workspace MeseriasLocalAppNew.xcworkspace -scheme MeseriasLocalAppNew

# Recompilează aplicația
cd .. && npx react-native run-ios --simulator="iPhone 15"
```

### 3. Verifică în Xcode
1. Deschide `ios/MeseriasLocalAppNew.xcworkspace` în Xcode
2. Selectează proiectul `MeseriasLocalAppNew`
3. Mergi la tab-ul "Info"
4. Verifică că "URL Types" conține URL scheme-ul corect

### 4. Verifică configurația Google Auth
În `src/config/googleAuth.ts`:
```typescript
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '447522045620-3o02ugei8ghntm0fhld38tl18shgpef1.apps.googleusercontent.com',
    iosClientId: '447522045620-mr3kmgt80oplbeocm7m4hsoiq4kv242n.apps.googleusercontent.com',
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  });
};
```

### 5. Verifică Google Cloud Console
1. Mergi la [Google Cloud Console](https://console.cloud.google.com/)
2. Selectează proiectul tău
3. Mergi la "APIs & Services" > "Credentials"
4. Verifică că iOS OAuth Client are:
   - **Bundle ID**: `com.iosif.meseriaslocalapp`
   - **Team ID**: `Q8D3C5T8DH`

### 6. Testează pe Device Fizic
- Google Sign-In nu funcționează complet pe simulator
- Testează pe iPhone fizic pentru funcționalitate completă

### 7. Debug în Cod
Adaugă în `LoginScreen.tsx`:
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
    
    showSuccessToast('Google Sign-In module funcționează!');
  } catch (error) {
    console.error('❌ Google Sign-In test failed:', error);
    showErrorToast('Google Sign-In module nu funcționează');
  }
};
```

## Comenzi utile

```bash
# Curăță totul
rm -rf node_modules && npm install
cd ios && pod install && cd ..
npx react-native start --reset-cache

# Recompilează
npx react-native run-ios --simulator="iPhone 15"
```

## Verificări finale

1. ✅ Info.plist conține URL scheme corect
2. ✅ Aplicația a fost recompilată
3. ✅ Google Cloud Console configurat corect
4. ✅ iOS Client ID configurat în cod
5. ✅ Testat pe device fizic (opțional pentru testare completă)

## Contact

Dacă problema persistă:
1. Verifică log-urile complete din console
2. Testează pe device fizic
3. Verifică că toate Client ID-urile sunt corecte

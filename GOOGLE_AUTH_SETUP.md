# Google Sign-In Setup pentru MeseriasLocal

## 1. Configurare Google Cloud Console

### Pasul 1: Creează un proiect în Google Cloud Console
1. Mergi la [Google Cloud Console](https://console.cloud.google.com/)
2. Creează un proiect nou sau selectează unul existent
3. Activează Google Sign-In API

### Pasul 2: Configurează OAuth 2.0
1. Mergi la "APIs & Services" > "Credentials"
2. Creează un "OAuth 2.0 Client ID"
3. Selectează tipul de aplicație:
   - **Android**: Pentru aplicația mobile
   - **iOS**: Pentru aplicația iOS
   - **Web**: Pentru backend (dacă ai)

### Pasul 3: Configurează pentru Android
1. Creează un OAuth 2.0 Client ID pentru Android
2. Adaugă SHA-1 fingerprint-ul aplicației
3. Pachetul: `com.meseriaslocalappnew`

### Pasul 4: Configurează pentru iOS
1. Creează un OAuth 2.0 Client ID pentru iOS
2. Bundle ID: `com.meseriaslocalappnew`
3. Adaugă URL-urile de redirect

## 2. Configurare în Aplicație

### Pasul 1: Actualizează configurația
În `src/config/googleAuth.ts`, înlocuiește:
```typescript
webClientId: '447522045620-3o02ugei8ghntm0fhld38tl18shgpef1.apps.googleusercontent.com'
```
cu ID-ul real din Google Cloud Console.

### Pasul 2: Configurare Android
În `android/app/build.gradle`, adaugă:
```gradle
defaultConfig {
    // ... existing config
    resValue "string", "server_client_id", "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com"
}
```

### Pasul 3: Configurare iOS
În `ios/MeseriasLocalAppNew/Info.plist`, adaugă:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
        </array>
    </dict>
</array>
```

## 3. Integrare cu Supabase

### Pasul 1: Configurează Supabase Auth
1. Mergi la Supabase Dashboard > Authentication > Providers
2. Activează Google provider
3. Adaugă Client ID și Client Secret din Google Cloud Console

### Pasul 2: Implementează în AuthContext
În `src/context/AuthContext.tsx`, adaugă:
```typescript
const signInWithGoogle = async (idToken: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase Google Sign-In error:', error);
    throw error;
  }
};
```

## 4. Testare

### Pasul 1: Testează pe device fizic
- Google Sign-In nu funcționează pe simulator
- Testează pe un device Android/iOS real

### Pasul 2: Verifică log-urile
- Urmărește console.log pentru debugging
- Verifică erorile în Google Cloud Console

## 5. Troubleshooting

### Probleme comune:
1. **"DEVELOPER_ERROR"**: Verifică SHA-1 fingerprint
2. **"SIGN_IN_REQUIRED"**: User-ul nu este conectat
3. **"NETWORK_ERROR"**: Probleme de conexiune

### Debug:
```typescript
// Verifică dacă Google Play Services sunt disponibile
await GoogleSignin.hasPlayServices();

// Verifică dacă user-ul este conectat
const isSignedIn = await GoogleSignin.isSignedIn();

// Obține user-ul curent
const currentUser = await GoogleSignin.getCurrentUser();
```

## 6. Securitate

### Best Practices:
1. Nu expune Client Secret în cod
2. Folosește HTTPS pentru toate request-urile
3. Validează token-urile pe backend
4. Implementează logout corect

### Logout:
```typescript
const handleLogout = async () => {
  try {
    await GoogleSignin.signOut();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

# Configurare Google Auth cu Supabase

## ✅ **Status actual:**
- ✅ Google Sign-In funcționează (URL scheme rezolvat)
- ❌ Eroare "Bad ID token" la integrarea cu Supabase

## 🔧 **Soluția pentru "Bad ID token":**

### **1. Verifică configurația Google Cloud Console**

În [Google Cloud Console](https://console.cloud.google.com/):

1. **Mergi la "APIs & Services" > "Credentials"**
2. **Verifică Web OAuth Client:**
   - **Authorized JavaScript origins:**
     ```
     https://rcnpakhabqbqmnvuwjzo.supabase.co
     ```
   - **Authorized redirect URIs:**
     ```
     https://rcnpakhabqbqmnvuwjzo.supabase.co/auth/v1/callback
     ```

### **2. Configurează Supabase Dashboard**

În [Supabase Dashboard](https://supabase.com/dashboard):

1. **Selectează proiectul tău**
2. **Mergi la "Authentication" > "Providers"**
3. **Activează "Google"**
4. **Completează:**
   - **Client ID:** `447522045620-3o02ugei8ghntm0fhld38tl18shgpef1.apps.googleusercontent.com`
   - **Client Secret:** (obținut din Google Cloud Console)
   - **Redirect URL:** `https://rcnpakhabqbqmnvuwjzo.supabase.co/auth/v1/callback`

### **3. Verifică codul actual**

În `src/screens/auth/LoginScreen.tsx`:
```typescript
const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    showLoading('Conectare cu Google...');
    
    // Sign in with Google
    const userInfo = await googleSignIn.signIn();
    console.log('Google Sign-In successful:', userInfo);
    
    // Get the ID token for Supabase
    const tokens = await googleSignIn.getTokens();
    console.log('🔑 Google tokens received:', {
      idToken: tokens.idToken ? 'Present' : 'Missing',
      accessToken: tokens.accessToken ? 'Present' : 'Missing'
    });
    
    if (!tokens.idToken) {
      throw new Error('ID token not received from Google');
    }
    
    // Sign in to Supabase with Google ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: tokens.idToken,
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Supabase Google Sign-In successful:', data);
    
    hideLoading();
    showSuccessToast('Conectare reușită cu Google!');
  } catch (error: any) {
    hideLoading();
    console.error('Google Sign-In Error:', error);
    showErrorToast('Conectarea cu Google a eșuat. Încearcă din nou.');
    Vibration.vibrate([0, 100, 50, 100]);
  } finally {
    setLoading(false);
  }
};
```

### **4. Debug și troubleshooting**

#### **A. Verifică log-urile**
În console, caută:
```
🔑 Google tokens received: { idToken: 'Present', accessToken: 'Present' }
```

#### **B. Testează cu cod alternativ**
Dacă problema persistă, încearcă:
```typescript
// Alternativă: folosește signInWithOAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'yourapp://auth/callback'
  }
});
```

#### **C. Verifică configurația Google Auth**
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

### **5. Pași de verificare**

1. ✅ **Google Sign-In funcționează** (URL scheme rezolvat)
2. 🔄 **Configurează Supabase Dashboard** cu Google provider
3. 🔄 **Verifică Google Cloud Console** redirect URIs
4. 🔄 **Testează din nou** autentificarea

### **6. Comenzi utile**

```bash
# Restart Metro bundler
npx react-native start --reset-cache

# Recompilează aplicația
npx react-native run-ios --simulator="iPhone 15"
```

### **7. Verificări finale**

- ✅ Google Sign-In module funcționează
- ✅ ID token este primit de la Google
- ✅ Supabase Dashboard are Google provider activat
- ✅ Google Cloud Console are redirect URI corect
- ✅ Testat pe device fizic (opțional)

## 🚀 **Următorii pași:**

1. **Configurează Supabase Dashboard** cu Google provider
2. **Verifică Google Cloud Console** redirect URIs
3. **Testează din nou** autentificarea
4. **Verifică log-urile** pentru debugging

## 📞 **Suport**

Dacă problema persistă:
1. Verifică log-urile complete din console
2. Asigură-te că toate Client ID-urile sunt corecte
3. Testează pe device fizic pentru funcționalitate completă

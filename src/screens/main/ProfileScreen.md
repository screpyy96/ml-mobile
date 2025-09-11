# ProfileScreen - Funcționalitatea de Logout

## Descriere
ProfileScreen conține funcționalitatea completă de logout pentru aplicația MeseriasLocal.

## Butoane de Logout

### 1. Buton Rapid în Header
- **Locație**: Header-ul ecranului de profil
- **Design**: Buton text cu iconița "logout"
- **Culoare**: Roșu (colors.error)
- **Text**: "Ieșire"
- **Funcționalitate**: Deconectare directă cu confirmare

### 2. Buton Principal de Logout
- **Locație**: Card separat în partea de jos a ecranului
- **Design**: Buton outlined cu iconița "logout"
- **Culoare**: Roșu (colors.error)
- **Text**: "Deconectează-te"
- **Funcționalitate**: Deconectare cu confirmare

## Procesul de Deconectare

### 1. Confirmare
```typescript
Alert.alert(
  'Deconectare',
  'Sunteți sigur că doriți să vă deconectați din aplicație?',
  [
    { text: 'Anulează', style: 'cancel' },
    { text: 'Deconectează', onPress: handleSignOut, style: 'destructive' },
  ]
);
```

### 2. Procesul de Deconectare
```typescript
const signOut = async () => {
  try {
    console.log('🚪 Începere proces deconectare...');
    
    await supabase.auth.signOut();  // Deconectare din Supabase
    setUser(null);                  // Resetare user în context
    await AsyncStorage.clear();     // Ștergere date locale
    
    console.log('✅ Deconectare reușită');
  } catch (error) {
    console.error('❌ Eroare la deconectare:', error);
  }
};
```

### 3. Navigare după Deconectare
- Utilizatorul este redirecționat automat către **AuthNavigator**
- Se afișează **WelcomeScreen** pentru logare/înregistrare
- Toate datele locale sunt șterse

## Logging și Debug

### Console Logs
- `🚪 Începere proces deconectare...` - Începutul procesului
- `✅ Deconectare reușită` - Deconectare completă
- `👋 Utilizator deconectat cu succes` - Confirmare în UI
- `❌ Eroare la deconectare: [error]` - Erori (dacă apar)

### Gestionarea Erorilor
- Erorile sunt prinse și logate în console
- Utilizatorul primește alert cu mesaj de eroare
- Procesul se oprește în caz de eroare

## Stiluri CSS

### Buton Rapid (Header)
```typescript
logoutButton: {
  minWidth: 0,
}
```

### Buton Principal
```typescript
signOutButton: {
  borderWidth: 1,
  marginTop: 8,
},
signOutButtonContent: {
  paddingVertical: 8,
}
```

## Testare

### Pentru a testa logout-ul:
1. **Loghează-te** în aplicație
2. **Navighează** la tab-ul "Profil"
3. **Apasă** butonul "Ieșire" din header sau "Deconectează-te" din card
4. **Confirmă** deconectarea în dialog
5. **Verifică** că ești redirecționat la WelcomeScreen

### Verificări:
- ✅ Utilizatorul este deconectat din Supabase
- ✅ Context-ul este resetat (user = null)
- ✅ Datele locale sunt șterse
- ✅ Navigarea funcționează corect
- ✅ Console logs apar corect

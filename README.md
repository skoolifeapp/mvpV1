# Skoolife - Application Mobile Native

Application de gestion de vie étudiante développée avec Expo et React Native.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)
- Xcode (pour iOS)
- Android Studio (pour Android)

### Installation
```bash
npm install
```

### Développement
```bash
# Démarrer le serveur de développement
npm run dev

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android

# Lancer sur Web
npm run web
```

## 📱 Build et Déploiement

### Configuration EAS
1. Créer un compte Expo : https://expo.dev
2. Configurer EAS :
```bash
eas login
eas build:configure
```

### Builds de développement
```bash
# Build pour iOS (simulateur)
npm run build:ios

# Build pour Android (APK)
npm run build:android

# Build pour toutes les plateformes
npm run build:all
```

### Builds de production
```bash
# Production iOS (pour App Store)
eas build --platform ios --profile production

# Production Android (AAB pour Play Store)
eas build --platform android --profile production
```

## 🍎 Configuration iOS

### Prérequis
- Compte Apple Developer
- Xcode 15+
- Certificats de développement et distribution

### Étapes
1. Configurer votre Apple Developer Account dans EAS
2. Générer les certificats automatiquement avec EAS
3. Build et test sur TestFlight
4. Soumission à l'App Store

### Commandes iOS
```bash
# Prebuild pour inspection locale
npx expo prebuild --platform ios

# Build de développement
eas build --platform ios --profile development

# Soumission à l'App Store
npm run submit:ios
```

## 🤖 Configuration Android

### Prérequis
- Google Play Console Account
- Android Studio
- Keystore pour signature

### Étapes
1. Configurer Google Play Console
2. Générer le keystore avec EAS
3. Build AAB pour production
4. Upload sur Play Console

### Commandes Android
```bash
# Prebuild pour inspection locale
npx expo prebuild --platform android

# Build de développement (APK)
eas build --platform android --profile development

# Build de production (AAB)
eas build --platform android --profile production

# Soumission au Play Store
npm run submit:android
```

## 🔧 Configuration des Stores

### App Store (iOS)
1. Créer l'app dans App Store Connect
2. Configurer les métadonnées
3. Ajouter les captures d'écran
4. Configurer les informations de l'app
5. Soumettre pour review

### Google Play Store (Android)
1. Créer l'app dans Play Console
2. Configurer le listing de l'app
3. Ajouter les captures d'écran
4. Configurer les informations de contenu
5. Publier en test interne puis production

## 📋 Permissions

### iOS (Info.plist)
- NSCameraUsageDescription : Appareil photo
- NSPhotoLibraryUsageDescription : Galerie photos
- NSCalendarsUsageDescription : Calendrier
- NSFaceIDUsageDescription : Authentification biométrique

### Android (AndroidManifest.xml)
- CAMERA : Appareil photo
- READ_EXTERNAL_STORAGE : Lecture fichiers
- READ_CALENDAR : Accès calendrier
- USE_BIOMETRIC : Authentification biométrique

## 🏗️ Structure du projet

```
skoolife/
├── app/                    # Routes Expo Router
├── assets/                 # Images et ressources
├── components/            # Composants réutilisables
├── contexts/              # Contextes React
├── hooks/                 # Hooks personnalisés
├── app.json              # Configuration Expo
├── eas.json              # Configuration EAS Build
└── metro.config.js       # Configuration Metro
```

## 🔐 Variables d'environnement

Créer un fichier `.env` :
```
EXPO_PROJECT_ID=your-expo-project-id
APPLE_ID=your-apple-id
GOOGLE_SERVICE_ACCOUNT_KEY=path-to-service-account.json
```

## 📚 Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [App Store Guidelines](https://developer.apple.com/app-store/guidelines/)
- [Google Play Policies](https://play.google.com/about/developer-content-policy/)

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation Expo
2. Consulter les logs EAS Build
3. Tester sur un appareil physique
4. Vérifier les permissions et configurations
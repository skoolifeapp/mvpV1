export default {
  expo: {
    name: "Skoolife",
    slug: "skoolife",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#FFD840"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.skoolife.app",
      buildNumber: "1",
      infoPlist: {
        CFBundleDisplayName: "Skoolife",
        NSCameraUsageDescription: "Cette application utilise l'appareil photo pour scanner des documents et prendre des photos.",
        NSPhotoLibraryUsageDescription: "Cette application accède à votre photothèque pour sélectionner et sauvegarder des images.",
        NSCalendarsUsageDescription: "Cette application accède à votre calendrier pour synchroniser vos événements.",
        NSRemindersUsageDescription: "Cette application accède à vos rappels pour gérer vos tâches.",
        NSFaceIDUsageDescription: "Cette application utilise Face ID pour sécuriser l'accès à vos données financières.",
        NSLocationWhenInUseUsageDescription: "Cette application utilise votre localisation pour vous proposer des services adaptés.",
        UIBackgroundModes: ["background-fetch", "background-processing"]
      },
      config: {
        usesNonExemptEncryption: false
      }
    },
    android: {
      package: "com.skoolife.app",
      versionCode: 1,
      compileSdkVersion: 34,
      targetSdkVersion: 34,
      buildToolsVersion: "34.0.0",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.READ_CALENDAR",
        "android.permission.WRITE_CALENDAR",
        "android.permission.USE_FINGERPRINT",
        "android.permission.USE_BIOMETRIC",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#FFD840"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser",
      "expo-camera",
      "expo-haptics",
      [
        "expo-build-properties",
        {
          ios: {
            newArchEnabled: true
          },
          android: {
            newArchEnabled: true,
            enableProguardInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PROJECT_ID || "your-project-id-here"
      }
    }
  }
};
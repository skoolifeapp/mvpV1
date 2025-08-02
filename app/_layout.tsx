import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Hide splash screen after app is ready
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };
    
    // Small delay to ensure everything is loaded
    setTimeout(hideSplashScreen, 1000);
  }, []);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar 
        style={Platform.OS === 'ios' ? 'dark' : 'auto'} 
        backgroundColor="#FFD840"
      />
    </ThemeProvider>
  );
}

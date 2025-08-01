import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ArrowLeft } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import {
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Inter_400Regular,
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { useRouter } from 'expo-router';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function SignUpScreen() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleSignUp = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Compte créé !',
        'Votre compte a été créé avec succès. Découvrez Skoolife+ pour une expérience complète !',
        [
          {
            text: 'Plus tard',
            style: 'cancel',
            onPress: () => router.replace('/(tabs)/home'),
          },
          {
            text: 'Découvrir Skoolife+',
            onPress: () => router.push('/subscription'),
          },
        ]
      );
    }, 1500);
  };

  const handleLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2E2E2E" strokeWidth={2} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/SKOOLIFE - Logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez la communauté Skoolife</Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.form}>
            {/* Name Fields */}
            <View style={styles.nameContainer}>
              <View style={[styles.inputGroup, styles.nameInput]}>
                <View style={styles.inputContainer}>
                  <User size={20} color="#6B7280" strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Prénom"
                    placeholderTextColor="#9CA3AF"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.nameInput]}>
                <View style={styles.inputContainer}>
                  <User size={20} color="#6B7280" strokeWidth={2} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Nom"
                    placeholderTextColor="#9CA3AF"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#6B7280" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Adresse email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Mot de passe"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#6B7280" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#6B7280" strokeWidth={2} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#6B7280" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#6B7280" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? 'Création...' : 'Créer mon compte'}
              </Text>
              {!isLoading && <ArrowRight size={20} color="#2E2E2E" strokeWidth={2} />}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>J'ai déjà un compte</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              En créant un compte, vous acceptez nos{' '}
              <Text style={styles.linkText}>Conditions d'utilisation</Text>
              {' '}et notre{' '}
              <Text style={styles.linkText}>Politique de confidentialité</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#2E2E2E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  nameInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2E2E2E',
  },
  eyeButton: {
    padding: 4,
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD840',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    marginTop: 12,
    gap: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#2E2E2E',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#2E2E2E',
  },
  footer: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#FFD840',
    fontWeight: '600',
  },
});
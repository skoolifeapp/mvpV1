import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Crown, Check, ArrowLeft, Star, Calendar, FileText, ChartBar as BarChart3, Shield, Zap, Users } from 'lucide-react-native';
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

export default function SubscriptionScreen() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
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

  const features = [
    {
      icon: <Calendar size={20} color="#FFD840" strokeWidth={2} />,
      title: 'Planning avancé',
      description: 'Synchronisation Google Calendar et rappels intelligents'
    },
    {
      icon: <FileText size={20} color="#FFD840" strokeWidth={2} />,
      title: 'Stockage illimité',
      description: 'Sauvegardez tous vos documents sans limite'
    },
    {
      icon: <BarChart3 size={20} color="#FFD840" strokeWidth={2} />,
      title: 'Analyses détaillées',
      description: 'Statistiques avancées sur vos performances'
    },
    {
      icon: <Shield size={20} color="#FFD840" strokeWidth={2} />,
      title: 'Sauvegarde cloud',
      description: 'Vos données protégées et synchronisées'
    },
    {
      icon: <Zap size={20} color="#FFD840" strokeWidth={2} />,
      title: 'Fonctionnalités premium',
      description: 'Accès à toutes les nouveautés en avant-première'
    },
    {
      icon: <Users size={20} color="#FFD840" strokeWidth={2} />,
      title: 'Support prioritaire',
      description: 'Assistance dédiée et réponse rapide'
    }
  ];

  const handleSubscribe = () => {
    setIsLoading(true);
    
    // Simulate payment process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Félicitations ! 🎉',
        `Vous êtes maintenant abonné à Skoolife+ ${selectedPlan === 'monthly' ? 'mensuel' : 'annuel'} !`,
        [
          {
            text: 'Commencer',
            onPress: () => router.replace('/(tabs)/home'),
          },
        ]
      );
    }, 2000);
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2E2E2E" strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Passer</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Crown size={48} color="#FFD840" strokeWidth={2} />
          </View>
          <Text style={styles.heroTitle}>Skoolife+</Text>
          <Text style={styles.heroSubtitle}>
            Débloquez tout le potentiel de votre vie étudiante
          </Text>
          
          {/* Rating */}
          <View style={styles.rating}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={16} color="#FFD840" fill="#FFD840" strokeWidth={2} />
              ))}
            </View>
            <Text style={styles.ratingText}>4.9/5 • Plus de 10 000 étudiants satisfaits</Text>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Choisissez votre formule</Text>
          
          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>Mensuel</Text>
                <Text style={styles.planPrice}>2,99 €<Text style={styles.planPeriod}>/mois</Text></Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedPlan === 'monthly' && styles.radioButtonSelected
              ]}>
                {selectedPlan === 'monthly' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Yearly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.popularPlan,
              selectedPlan === 'yearly' && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Le plus populaire</Text>
            </View>
            <View style={styles.planHeader}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>Annuel</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.planPrice}>29,99 €<Text style={styles.planPeriod}>/an</Text></Text>
                  <Text style={styles.savings}>Économisez 17%</Text>
                </View>
                <Text style={styles.monthlyEquivalent}>Soit 2,50 €/mois</Text>
              </View>
              <View style={[
                styles.radioButton,
                selectedPlan === 'yearly' && styles.radioButtonSelected
              ]}>
                {selectedPlan === 'yearly' && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Ce qui est inclus</Text>
          
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.featureIcon}>
                {feature.icon}
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Check size={20} color="#10B981" strokeWidth={2} />
            </View>
          ))}
        </View>

        {/* Subscribe Button */}
        <View style={styles.subscribeSection}>
          <TouchableOpacity
            style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            <Text style={styles.subscribeButtonText}>
              {isLoading ? 'Traitement...' : 
               selectedPlan === 'monthly' ? 'S\'abonner pour 2,99 €/mois' : 'S\'abonner pour 29,99 €/an'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.subscribeNote}>
            Annulation possible à tout moment • Essai gratuit de 7 jours
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En vous abonnant, vous acceptez nos{' '}
            <Text style={styles.linkText}>Conditions d'abonnement</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  crownContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFF7ED',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    color: '#2E2E2E',
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  rating: {
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  pricingSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  pricingTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#FFD840',
    backgroundColor: '#FFFBEB',
  },
  selectedPlan: {
    borderColor: '#FFD840',
    backgroundColor: '#FFFBEB',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    left: 20,
    backgroundColor: '#FFD840',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    color: '#2E2E2E',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#2E2E2E',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#2E2E2E',
  },
  planPeriod: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  savings: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  monthlyEquivalent: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FFD840',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD840',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featuresTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#2E2E2E',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  subscribeSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  subscribeButton: {
    backgroundColor: '#FFD840',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonDisabled: {
    opacity: 0.7,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#2E2E2E',
  },
  subscribeNote: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
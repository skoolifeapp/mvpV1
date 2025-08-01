import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { 
  ChevronRight, 
} from 'lucide-react-native';
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
import { useTheme } from '@/contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const dashboardData = {
    tasksPending: 2,
    tasksCompleted: 5,
    tasksProgress: 71,
    todayEvents: 2,
    weekEvents: 8,
    monthlyIncome: 1380,
    monthlyExpenses: 605,
    budgetPercentage: 34,
  };

  const navigateToModule = (module: string) => {
    router.push(`/(tabs)/${module}` as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            Tableau de bord
          </Text>
          <Text style={styles.syncText}>Synchronisé en temps réel</Text>
        </View>

        {/* Tasks Section */}
        <TouchableOpacity 
          style={[
            styles.summarySection,
            { 
              backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#FFD840'
            }
          ]}
          onPress={() => navigateToModule('tasks')}
          activeOpacity={0.7}
        >
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Mes tâches
            </Text>
            <ChevronRight size={16} color="#6B7280" strokeWidth={2} />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                À faire
              </Text>
              <Text style={styles.tasksPendingText}>{dashboardData.tasksPending}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Terminées
              </Text>
              <Text style={styles.tasksCompletedText}>{dashboardData.tasksCompleted}</Text>
            </View>
          </View>

          <View style={styles.budgetProgress}>
            <Text style={[styles.budgetLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Progression: {dashboardData.tasksProgress}%
            </Text>
            <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${dashboardData.tasksProgress}%` }
                ]} 
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Planning Section */}
        <TouchableOpacity 
          style={[
            styles.summarySection,
            { 
              backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#FFD840'
            }
          ]}
          onPress={() => navigateToModule('planning')}
          activeOpacity={0.7}
        >
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Mon planning
            </Text>
            <ChevronRight size={16} color="#6B7280" strokeWidth={2} />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Aujourd'hui
              </Text>
              <Text style={styles.planningTodayText}>{dashboardData.todayEvents}</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Cette semaine
              </Text>
              <Text style={styles.planningWeekText}>{dashboardData.weekEvents}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Finance Section */}
        <TouchableOpacity 
          style={[
            styles.summarySection,
            { 
              backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#FFD840'
            }
          ]}
          onPress={() => navigateToModule('finance')}
          activeOpacity={0.7}
        >
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Ce mois-ci
            </Text>
            <ChevronRight size={16} color="#6B7280" strokeWidth={2} />
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Revenus
              </Text>
              <Text style={styles.incomeText}>+{dashboardData.monthlyIncome} €</Text>
            </View>
            <View style={styles.summaryStatItem}>
              <Text style={[styles.summaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Dépenses
              </Text>
              <Text style={styles.expenseText}>-{dashboardData.monthlyExpenses} €</Text>
            </View>
          </View>

          <View style={styles.budgetProgress}>
            <Text style={[styles.budgetLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Budget utilisé: {dashboardData.budgetPercentage}%
            </Text>
            <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${dashboardData.budgetPercentage}%` }
                ]} 
              />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  syncText: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  summarySection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  incomeText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#10B981',
  },
  expenseText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#EF4444',
  },
  tasksPendingText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#F59E0B',
  },
  tasksCompletedText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#10B981',
  },
  planningTodayText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#3B82F6',
  },
  planningWeekText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#6366F1',
  },
  budgetProgress: {
    marginTop: 4,
  },
  budgetLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD840',
    borderRadius: 4,
  },
});
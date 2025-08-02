import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { ChevronRight, User, Settings, LogOut, X, Bell, CircleHelp as HelpCircle, Moon } from 'lucide-react-native';
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

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  categoryColor: string;
  bankName: string;
  isUncategorized?: boolean;
}

interface BudgetCategory {
  id: string;
  name: string;
  budgeted: number;
  spent: number;
  color: string;
}

SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  
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

  // Données financières synchronisées avec le module Finance
  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Salaire Janvier',
      amount: 1200,
      date: '15/01/2025',
      category: 'Salaire',
      type: 'income',
      categoryColor: '#10B981',
      bankName: 'Crédit Agricole',
    },
    {
      id: '2',
      title: 'Courses Carrefour',
      amount: -45.80,
      date: '14/01/2025',
      category: 'Alimentation',
      type: 'expense',
      categoryColor: '#EF4444',
      bankName: 'Crédit Agricole',
    },
    {
      id: '3',
      title: 'Virement reçu',
      amount: 150,
      date: '12/01/2025',
      category: '',
      type: 'income',
      categoryColor: '#6B7280',
      bankName: 'Crédit Agricole',
      isUncategorized: true,
    },
  ];

  const budgetCategories: BudgetCategory[] = [
    {
      id: '1',
      name: 'Alimentation',
      budgeted: 300,
      spent: 0,
      color: '#EF4444',
    },
    {
      id: '2',
      name: 'Transport',
      budgeted: 150,
      spent: 0,
      color: '#F59E0B',
    },
    {
      id: '3',
      name: 'Loisirs',
      budgeted: 200,
      spent: 0,
      color: '#3B82F6',
    },
    {
      id: '4',
      name: 'Logement',
      budgeted: 800,
      spent: 0,
      color: '#8B5CF6',
    },
  ];

  // Calculer les dépenses par catégorie à partir des transactions
  const calculateCategorySpending = () => {
    const categorySpending: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense' && !t.isUncategorized)
      .forEach(transaction => {
        const category = transaction.category;
        const amount = Math.abs(transaction.amount);
        categorySpending[category] = (categorySpending[category] || 0) + amount;
      });
    
    return categorySpending;
  };

  const categorySpending = calculateCategorySpending();

  // Mettre à jour les catégories de budget avec les vraies dépenses
  const updatedBudgetCategories = budgetCategories.map(category => ({
    ...category,
    spent: categorySpending[category.name] || 0
  }));

  // Calculs financiers synchronisés
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = updatedBudgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetPercentage = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  const dashboardData = {
    tasksPending,
    tasksCompleted,
    tasksProgress,
    todayEvents,
    weekEvents,
    monthlyIncome: totalIncome,
    monthlyExpenses: totalExpenses,
    budgetPercentage: budgetPercentage,
  };
  const userData = {
    name: 'Alex Martin',
    email: 'alex.martin@skoolife.com',
    initial: 'A',
  };

  const navigateToModule = (module: string) => {
    router.push(`/(tabs)/${module}` as any);
  };

  const handleMenuAction = (action: string) => {
    setIsUserMenuVisible(false);
    
    switch (action) {
      case 'profile':
        Alert.alert('Profil', 'Fonctionnalité à venir');
        break;
      case 'settings':
        Alert.alert('Paramètres', 'Fonctionnalité à venir');
        break;
      case 'notifications':
        Alert.alert('Notifications', 'Fonctionnalité à venir');
        break;
      case 'nightmode':
        toggleDarkMode();
        Alert.alert(
          'Mode nuit',
          `Mode ${!isDarkMode ? 'nuit' : 'jour'} activé !`,
          [{ text: 'OK', style: 'default' }]
        );
        break;
      case 'help':
        Alert.alert('Aide', 'Fonctionnalité à venir');
        break;
      case 'logout':
        Alert.alert(
          'Déconnexion',
          'Êtes-vous sûr de vouloir vous déconnecter ?',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Déconnexion', 
              style: 'destructive', 
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
        break;
    }
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={[styles.greeting, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Tableau de bord
              </Text>
              <Text style={styles.syncText}>Synchronisé en temps réel</Text>
            </View>
            <TouchableOpacity 
              style={styles.userButton}
              onPress={() => setIsUserMenuVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.userAvatar}>{userData.initial}</Text>
            </TouchableOpacity>
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

      {/* User Menu Modal */}
      <Modal
        visible={isUserMenuVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsUserMenuVisible(false)}
      >
        <SafeAreaView style={[styles.menuContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          {/* Menu Header */}
          <View style={styles.menuHeader}>
            <View style={styles.menuHeaderLeft}>
              <Text style={[styles.menuTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Mon compte
              </Text>
              <Text style={[styles.menuSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Gérez votre profil Skoolife
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setIsUserMenuVisible(false)} 
              style={styles.closeButton}
            >
              <X size={24} color={isDarkMode ? "#F9FAFB" : "#2E2E2E"} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* User Profile Section */}
          <View style={[
            styles.profileSection,
            { 
              backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : '#FFD840'
            }
          ]}>
            <View style={[styles.profileAvatar, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
              <Text style={[styles.profileAvatarText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                {userData.initial}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                {userData.name}
              </Text>
              <Text style={[styles.profileEmail, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                {userData.email}
              </Text>
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.menuOptions}>
            <TouchableOpacity 
              style={[styles.menuOption, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}
              onPress={() => handleMenuAction('profile')}
              activeOpacity={0.7}
            >
              <User size={20} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
              <Text style={[styles.menuOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Mon profil
              </Text>
              <ChevronRight size={16} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuOption, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}
              onPress={() => handleMenuAction('notifications')}
              activeOpacity={0.7}
            >
              <Bell size={20} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
              <Text style={[styles.menuOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Notifications
              </Text>
              <ChevronRight size={16} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuOption, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}
              onPress={() => handleMenuAction('nightmode')}
              activeOpacity={0.7}
            >
              <Moon size={20} color={isDarkMode ? "#FFD840" : "#6B7280"} strokeWidth={2} />
              <Text style={[styles.menuOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Mode nuit {isDarkMode ? '(Activé)' : ''}
              </Text>
              <ChevronRight size={16} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuOption, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}
              onPress={() => handleMenuAction('settings')}
              activeOpacity={0.7}
            >
              <Settings size={20} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
              <Text style={[styles.menuOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Paramètres
              </Text>
              <ChevronRight size={16} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuOption, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}
              onPress={() => handleMenuAction('help')}
              activeOpacity={0.7}
            >
              <HelpCircle size={20} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
              <Text style={[styles.menuOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Aide & Support
              </Text>
              <ChevronRight size={16} color={isDarkMode ? "#D1D5DB" : "#6B7280"} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.menuOption, 
                styles.logoutOption,
                { backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2' }
              ]}
              onPress={() => handleMenuAction('logout')}
              activeOpacity={0.7}
            >
              <LogOut size={20} color="#EF4444" strokeWidth={2} />
              <Text style={[styles.menuOptionText, styles.logoutText]}>
                Déconnexion
              </Text>
              <ChevronRight size={16} color="#EF4444" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
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
  userButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFD840',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#2E2E2E',
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
  // Menu Styles
  menuContainer: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuHeaderLeft: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    padding: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  menuOptions: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuOptionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  logoutOption: {
    marginTop: 16,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '500',
  },
});
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
import { 
  ChevronRight, 
  User, 
  Settings, 
  LogOut, 
  X, 
  Bell, 
  CircleHelp as HelpCircle, 
  Moon 
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

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  dueDate: string;
  completed: boolean;
  categoryColor: string;
}

interface Activity {
  id: string;
  title: string;
  color: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

interface DayData {
  day: string;
  date: string;
  fullDate: Date;
  activities: Activity[];
  isToday?: boolean;
  isSelected?: boolean;
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

  // Données des tâches synchronisées avec le module Tasks
  const tasks: Task[] = [
    // Aucune tâche par défaut - sera rempli dynamiquement
  ];

  // Données du planning synchronisées avec le module Planning
  const getMondayOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekData = (startDate: Date): DayData[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    
    const activitiesData: { [key: string]: Activity[] } = {};
    
    return days.map((day, index) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + index);
      
      const isToday = currentDate.getTime() === today.getTime();
      
      return {
        day,
        date: `${currentDate.getDate()} ${months[currentDate.getMonth()]}`,
        fullDate: new Date(currentDate),
        activities: activitiesData[index.toString()] || [],
        isToday,
      };
    });
  };

  const currentWeekStart = getMondayOfWeek(new Date());
  const weekData = getWeekData(currentWeekStart);

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

  // Calculs des tâches synchronisés
  const tasksPending = tasks.filter(task => !task.completed).length;
  const tasksCompleted = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const tasksProgress = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

  // Calculs du planning synchronisés
  const today = new Date();
  const todayEvents = weekData.find(day => day.isToday)?.activities.length || 0;
  const weekEvents = weekData.reduce((total, day) => total + day.activities.length, 0);

  const dashboardData = {
    tasksPending: tasksPending,
    tasksCompleted: tasksCompleted,
    tasksProgress: tasksProgress,
    todayEvents: todayEvents,
    weekEvents: weekEvents,
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
            <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Tableau de bord
            </Text>
            <TouchableOpacity 
              style={styles.userButton}
              onPress={() => setIsUserMenuVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.userAvatar}>{userData.initial}</Text>
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <View style={[
            styles.welcomeSection,
            { 
              backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
              borderColor: isDarkMode ? '#4B5563' : 'transparent'
            }
          ]}>
            <Text style={[styles.welcomeTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Bonjour Alex 👋
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </Text>
          </View>

          {/* Overview Cards */}
          <View style={styles.overviewSection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Vue d'ensemble
            </Text>
            
            <View style={styles.metricsGrid}>
              {/* Tasks Metric */}
              <TouchableOpacity
                style={[
                  styles.metricSquare,
                  { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }
                ]}
                onPress={() => navigateToModule('tasks')}
                activeOpacity={0.8}
              >
                <View style={styles.metricContent}>
                  <Text style={[styles.metricLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Tâches
                  </Text>
                  <Text style={[styles.metricValue, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    {dashboardData.tasksPending}
                  </Text>
                  <Text style={[styles.metricUnit, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    en attente
                  </Text>
                </View>
                <View style={styles.metricChart}>
                  <View style={[
                    styles.progressCircle,
                    { borderColor: isDarkMode ? '#4B5563' : '#E5E7EB' }
                  ]}>
                    <View 
                      style={[
                        styles.progressArc,
                        { 
                          borderColor: '#10B981',
                          transform: [{ rotate: `${(dashboardData.tasksProgress * 3.6)}deg` }]
                        }
                      ]} 
                    />
                    <Text style={[styles.progressPercent, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {dashboardData.tasksProgress}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Planning Metric */}
              <TouchableOpacity
                style={[
                  styles.metricSquare,
                  { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }
                ]}
                onPress={() => navigateToModule('planning')}
                activeOpacity={0.8}
              >
                <View style={styles.metricContent}>
                  <Text style={[styles.metricLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Aujourd'hui
                  </Text>
                  <Text style={[styles.metricValue, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    {dashboardData.todayEvents}
                  </Text>
                  <Text style={[styles.metricUnit, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    événements
                  </Text>
                </View>
                <View style={styles.metricChart}>
                  <View style={[
                    styles.progressCircle,
                    { borderColor: isDarkMode ? '#4B5563' : '#E5E7EB' }
                  ]}>
                    <View 
                      style={[
                        styles.progressArc,
                        { 
                          borderColor: '#3B82F6',
                          transform: [{ rotate: `${Math.min(dashboardData.weekEvents * 15, 360)}deg` }]
                        }
                      ]} 
                    />
                    <Text style={[styles.progressPercent, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {dashboardData.weekEvents}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Finance Metric */}
              <TouchableOpacity
                style={[
                  styles.metricSquare,
                  { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }
                ]}
                onPress={() => navigateToModule('finance')}
                activeOpacity={0.8}
              >
                <View style={styles.metricContent}>
                  <Text style={[styles.metricLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Budget
                  </Text>
                  <Text style={[styles.metricValue, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    {dashboardData.monthlyExpenses}€
                  </Text>
                  <Text style={[styles.metricUnit, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    dépensés
                  </Text>
                </View>
                <View style={styles.metricChart}>
                  <View style={[
                    styles.progressCircle,
                    { borderColor: isDarkMode ? '#4B5563' : '#E5E7EB' }
                  ]}>
                    <View 
                      style={[
                        styles.progressArc,
                        { 
                          borderColor: dashboardData.budgetPercentage > 80 ? '#EF4444' : '#FFD840',
                          transform: [{ rotate: `${Math.min(dashboardData.budgetPercentage * 3.6, 360)}deg` }]
                        }
                      ]} 
                    />
                    <Text style={[styles.progressPercent, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {dashboardData.budgetPercentage}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Documents Metric */}
              <TouchableOpacity
                style={[
                  styles.metricSquare,
                  { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }
                ]}
                onPress={() => navigateToModule('documents')}
                activeOpacity={0.8}
              >
                <View style={styles.metricContent}>
                  <Text style={[styles.metricLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Documents
                  </Text>
                  <Text style={[styles.metricValue, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    0
                  </Text>
                  <Text style={[styles.metricUnit, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    fichiers
                  </Text>
                </View>
                <View style={styles.metricChart}>
                  <View style={[
                    styles.progressCircle,
                    { borderColor: isDarkMode ? '#4B5563' : '#E5E7EB' }
                  ]}>
                    <View 
                      style={[
                        styles.progressArc,
                        { 
                          borderColor: '#8B5CF6',
                          transform: [{ rotate: '0deg' }]
                        }
                      ]} 
                    />
                    <Text style={[styles.progressPercent, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      0
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Activity Section */}
          <View style={styles.activitySection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Activité récente
            </Text>
            
            <View style={styles.activityContainer}>
              {dashboardData.tasksPending > 0 && (
                <View style={[
                  styles.activityCard,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                    borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                  }
                ]}>
                  <View style={[styles.activityIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                    <Text style={styles.activityEmoji}>⏳</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {dashboardData.tasksPending} tâche{dashboardData.tasksPending > 1 ? 's' : ''} en attente
                    </Text>
                    <Text style={[styles.activitySubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                      À terminer
                    </Text>
                  </View>
                </View>
              )}
              
              {dashboardData.todayEvents > 0 && (
                <View style={[
                  styles.activityCard,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                    borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                  }
                ]}>
                  <View style={[styles.activityIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                    <Text style={styles.activityEmoji}>📅</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {dashboardData.todayEvents} événement{dashboardData.todayEvents > 1 ? 's' : ''} aujourd'hui
                    </Text>
                    <Text style={[styles.activitySubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                      Planning du jour
                    </Text>
                  </View>
                </View>
              )}
              
              <View style={[
                styles.activityCard,
                { 
                  backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                  borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                }
              ]}>
                <View style={[styles.activityIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                  <Text style={styles.activityEmoji}>💰</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Budget utilisé à {dashboardData.budgetPercentage}%
                  </Text>
                  <Text style={[styles.activitySubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    {dashboardData.monthlyExpenses}€ dépensés ce mois
                  </Text>
                </View>
              </View>
              
              {(dashboardData.tasksPending === 0 && dashboardData.todayEvents === 0) && (
                <View style={[
                  styles.activityCard,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                    borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                  }
                ]}>
                  <View style={[styles.activityIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                    <Text style={styles.activityEmoji}>✨</Text>
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      Tout est à jour !
                    </Text>
                    <Text style={[styles.activitySubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                      Aucune tâche ou événement en attente
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
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
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
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
  welcomeSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  overviewSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricSquare: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  metricChart: {
    alignItems: 'flex-end',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressArc: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressPercent: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  activityContainer: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
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
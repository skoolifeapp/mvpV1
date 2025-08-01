import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { ChevronLeft, ChevronRight, Plus, X, Save, Type, DollarSign, Tag, Calendar, CreditCard, CreditCard as Edit3, Trash2, ChartPie as PieChart, Receipt, RefreshCw } from 'lucide-react-native';
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
import { useTheme } from '@/contexts/ThemeContext';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  categoryColor: string;
}

type TabType = 'transactions' | 'budget';

SplashScreen.preventAutoHideAsync();

export default function FinanceScreen() {
  const { isDarkMode } = useTheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('transactions');
  const [isAddTransactionVisible, setIsAddTransactionVisible] = useState(false);
  const [isEditTransactionVisible, setIsEditTransactionVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddBudgetVisible, setIsAddBudgetVisible] = useState(false);
  const [isEditBudgetVisible, setIsEditBudgetVisible] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any | null>(null);
  const [budgetCategories, setBudgetCategories] = useState([
    { name: 'Alimentation', budget: 200, spent: 0, color: '#EF4444' },
    { name: 'Transport', budget: 150, spent: 0, color: '#F59E0B' },
    { name: 'Logement', budget: 500, spent: 0, color: '#8B5CF6' },
    { name: 'Loisirs', budget: 100, spent: 0, color: '#10B981' },
    { name: 'Études', budget: 80, spent: 0, color: '#3B82F6' },
    { name: 'Santé', budget: 70, spent: 0, color: '#EC4899' },
  ]);
  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: '',
    categoryColor: '#EF4444',
  });
  const [newBudget, setNewBudget] = useState({
    name: '',
    budget: '',
    color: '#EF4444',
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const incomeCategories = [
    { name: 'Salaire', color: '#10B981' },
    { name: 'Freelance', color: '#3B82F6' },
    { name: 'Bourse', color: '#8B5CF6' },
    { name: 'Famille', color: '#F59E0B' },
    { name: 'Autre', color: '#6366F1' },
  ];

  const expenseCategories = [
    { name: 'Alimentation', color: '#EF4444' },
    { name: 'Transport', color: '#F59E0B' },
    { name: 'Logement', color: '#8B5CF6' },
    { name: 'Loisirs', color: '#10B981' },
    { name: 'Études', color: '#3B82F6' },
    { name: 'Santé', color: '#EC4899' },
  ];

  const getCurrentMonthTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentDate.getMonth() &&
             transactionDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const currentMonthTransactions = getCurrentMonthTransactions();
  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  
  const totalBudget = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
  const budgetUsed = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetRemaining = totalBudget - budgetUsed;

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatMonth = (date: Date) => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const closeAddTransaction = () => {
    setIsAddTransactionVisible(false);
    setNewTransaction({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: '',
      categoryColor: '#EF4444',
    });
  };

  const openEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      title: transaction.title,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      categoryColor: transaction.categoryColor,
    });
    setIsEditTransactionVisible(true);
  };

  const closeEditTransaction = () => {
    setIsEditTransactionVisible(false);
    setEditingTransaction(null);
    setNewTransaction({
      title: '',
      amount: '',
      type: 'expense',
      category: '',
      date: '',
      categoryColor: '#EF4444',
    });
  };

  const deleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Supprimer la transaction',
      'Êtes-vous sûr de vouloir supprimer cette transaction ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setTransactions(transactions.filter(t => t.id !== transactionId));
            Alert.alert('Succès', 'Transaction supprimée avec succès !');
          },
        },
      ]
    );
  };

  const saveTransaction = () => {
    if (!newTransaction.title.trim() || !newTransaction.amount.trim()) {
      Alert.alert('Erreur', 'Le titre et le montant sont obligatoires');
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Le montant doit être un nombre positif');
      return;
    }

    if (editingTransaction) {
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        title: newTransaction.title.trim(),
        amount: amount,
        type: newTransaction.type,
        category: newTransaction.category || (newTransaction.type === 'income' ? 'Autre' : 'Alimentation'),
        date: newTransaction.date || new Date().toISOString().split('T')[0],
        categoryColor: newTransaction.categoryColor,
      };

      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? updatedTransaction : t
      ));

      closeEditTransaction();
      Alert.alert('Succès', 'Transaction modifiée avec succès !');
    } else {
      const transactionToAdd: Transaction = {
        id: Date.now().toString(),
        title: newTransaction.title.trim(),
        amount: amount,
        type: newTransaction.type,
        category: newTransaction.category || (newTransaction.type === 'income' ? 'Autre' : 'Alimentation'),
        date: newTransaction.date || new Date().toISOString().split('T')[0],
        categoryColor: newTransaction.categoryColor,
      };

      setTransactions([...transactions, transactionToAdd]);
      closeAddTransaction();
      Alert.alert('Succès', 'Transaction ajoutée avec succès !');
    }
  };

  const getCurrentCategories = () => {
    return newTransaction.type === 'income' ? incomeCategories : expenseCategories;
  };

  const handleConnectBank = () => {
    Alert.alert(
      'Connexion bancaire',
      'Fonctionnalité de connexion bancaire à venir !',
      [{ text: 'OK' }]
    );
  };

  const closeAddBudget = () => {
    setIsAddBudgetVisible(false);
    setNewBudget({
      name: '',
      budget: '',
      color: '#EF4444',
    });
  };

  const openEditBudget = (budget: any) => {
    setEditingBudget(budget);
    setNewBudget({
      name: budget.name,
      budget: budget.budget.toString(),
      color: budget.color,
    });
    setIsEditBudgetVisible(true);
  };

  const closeEditBudget = () => {
    setIsEditBudgetVisible(false);
    setEditingBudget(null);
    setNewBudget({
      name: '',
      budget: '',
      color: '#EF4444',
    });
  };

  const deleteBudget = (budgetName: string) => {
    Alert.alert(
      'Supprimer le budget',
      'Êtes-vous sûr de vouloir supprimer ce budget ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setBudgetCategories(budgetCategories.filter(budget => budget.name !== budgetName));
            Alert.alert('Succès', 'Budget supprimé avec succès !');
          },
        },
      ]
    );
  };

  const saveBudget = () => {
    if (!newBudget.name.trim() || !newBudget.budget.trim()) {
      Alert.alert('Erreur', 'Le nom et le montant du budget sont obligatoires');
      return;
    }

    const budgetAmount = parseFloat(newBudget.budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      Alert.alert('Erreur', 'Le montant doit être un nombre positif');
      return;
    }

    if (editingBudget) {
      const updatedBudget = {
        ...editingBudget,
        name: newBudget.name.trim(),
        budget: budgetAmount,
        color: newBudget.color,
      };

      setBudgetCategories(budgetCategories.map(budget => 
        budget.name === editingBudget.name ? updatedBudget : budget
      ));

      closeEditBudget();
      Alert.alert('Succès', 'Budget modifié avec succès !');
    } else {
      const budgetToAdd = {
        name: newBudget.name.trim(),
        budget: budgetAmount,
        spent: 0,
        color: newBudget.color,
      };

      setBudgetCategories([...budgetCategories, budgetToAdd]);
      closeAddBudget();
      Alert.alert('Succès', 'Budget ajouté avec succès !');
    }
  };

  const renderTabButton = (tab: TabType, label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton,
        { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      {icon}
      <Text style={[
        styles.tabButtonText,
        activeTab === tab && styles.activeTabButtonText,
        { color: isDarkMode ? '#D1D5DB' : '#6B7280' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderBudgetCategory = (category: typeof budgetCategories[0]) => {
    const percentage = category.budget > 0 ? (category.spent / category.budget) * 100 : 0;
    const getProgressColor = () => {
      if (percentage < 60) return '#10B981';
      if (percentage < 80) return '#F59E0B';
      return '#EF4444';
    };

    return (
      <View key={category.name} style={[
        styles.budgetCategoryCard,
        { 
          backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
        }
      ]}>
        <View style={styles.budgetCategoryHeader}>
          <View style={styles.budgetCategoryInfo}>
            <View style={[styles.budgetCategoryIcon, { backgroundColor: category.color }]}>
              <Text style={styles.budgetCategoryIconText}>
                {category.name.charAt(0)}
              </Text>
            </View>
            <Text style={[styles.budgetCategoryName, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              {category.name}
            </Text>
          </View>
          <View style={styles.budgetCategoryRight}>
            <Text style={[styles.budgetCategoryAmount, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              {category.spent}€ / {category.budget}€
            </Text>
            <View style={styles.budgetCategoryActions}>
              <TouchableOpacity 
                style={[styles.budgetActionButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}
                onPress={() => openEditBudget(category)}
                activeOpacity={0.7}
              >
                <Edit3 size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.budgetActionButton, styles.deleteBudgetButton, { backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2' }]}
                onPress={() => deleteBudget(category.name)}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color="#DC2626" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.budgetProgress}>
          <View style={[styles.budgetProgressBar, { backgroundColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View 
              style={[
                styles.budgetProgressFill,
                { 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: getProgressColor()
                }
              ]} 
            />
          </View>
          <Text style={[styles.budgetProgressText, { color: getProgressColor() }]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={[
          styles.monthNavigation,
          {
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : 'transparent'
          }
        ]}>
          <TouchableOpacity onPress={() => navigateMonth('prev')} activeOpacity={0.7}>
            <ChevronLeft size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            {formatMonth(currentDate)}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth('next')} activeOpacity={0.7}>
            <ChevronRight size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
        </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollableContent} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={[
          styles.balanceCard,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : '#FFD840'
          }
        ]}>
          <Text style={[styles.balanceLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
            Balance du mois
          </Text>
          <Text style={[
            styles.balanceAmount,
            { color: balance >= 0 ? '#10B981' : '#EF4444' }
          ]}>
            {balance >= 0 ? '+' : ''}{balance.toFixed(2)} €
          </Text>
          
          <View style={styles.balanceStats}>
            <View style={styles.balanceStatItem}>
              <Text style={[styles.balanceStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Revenus
              </Text>
              <Text style={styles.incomeText}>+{totalIncome.toFixed(2)} €</Text>
            </View>
            <View style={styles.balanceStatItem}>
              <Text style={[styles.balanceStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Dépenses
              </Text>
              <Text style={styles.expenseText}>-{totalExpenses.toFixed(2)} €</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {renderTabButton('transactions', 'Transactions', <Receipt size={20} color={activeTab === 'transactions' ? '#2E2E2E' : (isDarkMode ? '#D1D5DB' : '#6B7280')} strokeWidth={2} />)}
          {renderTabButton('budget', 'Budget', <PieChart size={20} color={activeTab === 'budget' ? '#2E2E2E' : (isDarkMode ? '#D1D5DB' : '#6B7280')} strokeWidth={2} />)}
        </View>

        {/* Tab Content */}
        {activeTab === 'transactions' ? (
          <View style={styles.transactionsSection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Transactions
            </Text>
            
            {currentMonthTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <DollarSign size={48} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={1.5} />
                <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Aucune transaction
                </Text>
                <Text style={[styles.emptyStateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                  Connectez votre compte bancaire pour synchroniser automatiquement vos transactions.
                </Text>
              </View>
            ) : (
              <View style={styles.transactionsContainer}>
                {currentMonthTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(transaction => (
                    <View key={transaction.id} style={[
                      styles.transactionCard,
                      { 
                        backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                        borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                      }
                    ]}>
                      <View style={styles.transactionContent}>
                        <Text style={[styles.transactionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                          {transaction.title}
                        </Text>
                        
                        <View style={styles.transactionMeta}>
                          <View style={[styles.categoryTag, { backgroundColor: transaction.categoryColor }]}>
                            <Text style={styles.categoryText}>{transaction.category}</Text>
                          </View>
                          <Text style={[styles.transactionDate, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                            {transaction.date}
                          </Text>
                        </View>
                        
                        <View style={styles.transactionActions}>
                          <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}
                            onPress={() => openEditTransaction(transaction)}
                          >
                            <Edit3 size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                            <Text style={[styles.actionText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                              Modifier
                            </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteAction, { backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2' }]}
                            onPress={() => deleteTransaction(transaction.id)}
                          >
                            <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                            <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <Text style={[
                        styles.transactionAmount,
                        { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }
                      ]}>
                        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.budgetSection}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Budget mensuel
            </Text>
            
            {/* Budget Summary */}
            <View style={[
              styles.budgetSummaryCard,
              { 
                backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                borderColor: isDarkMode ? '#4B5563' : '#FFD840'
              }
            ]}>
              <Text style={[styles.budgetSummaryLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Budget total
              </Text>
              <Text style={[styles.budgetSummaryAmount, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                {totalBudget}€
              </Text>
              
              <View style={styles.budgetSummaryStats}>
                <View style={styles.budgetSummaryStatItem}>
                  <Text style={[styles.budgetSummaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Dépensé
                  </Text>
                  <Text style={styles.budgetUsedText}>{budgetUsed}€</Text>
                </View>
                <View style={styles.budgetSummaryStatItem}>
                  <Text style={[styles.budgetSummaryStatLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Restant
                  </Text>
                  <Text style={styles.budgetRemainingText}>{budgetRemaining}€</Text>
                </View>
              </View>
            </View>
            
            {/* Budget Categories */}
            <View style={styles.budgetCategoriesContainer}>
              {budgetCategories.map(renderBudgetCategory)}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      {activeTab === 'transactions' ? (
        <TouchableOpacity 
          style={[styles.floatingAddButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]}
          onPress={() => setIsAddTransactionVisible(true)}
        >
          <RefreshCw size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
        </TouchableOpacity>
      ) : activeTab === 'budget' && (
        <TouchableOpacity 
          style={[styles.floatingAddButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]}
          onPress={() => setIsAddBudgetVisible(true)}
        >
          <Plus size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
        </TouchableOpacity>
      )}

      {/* Add Transaction Modal */}
      <Modal
        visible={isAddTransactionVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddTransaction}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Nouvelle transaction
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Gérez vos finances
              </Text>
            </View>
            <TouchableOpacity onPress={closeAddTransaction} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Type Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Type de transaction
              </Text>
              <View style={styles.typeGrid}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'income' && styles.selectedType,
                    { backgroundColor: '#10B981' + '20' }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'income',
                    categoryColor: '#10B981',
                    category: ''
                  })}
                >
                  <Text style={[styles.typeOptionText, { color: '#10B981' }]}>
                    Revenu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'expense' && styles.selectedType,
                    { backgroundColor: '#EF4444' + '20' }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'expense',
                    categoryColor: '#EF4444',
                    category: ''
                  })}
                >
                  <Text style={[styles.typeOptionText, { color: '#EF4444' }]}>
                    Dépense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Title Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Type size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Titre *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="Ex: Courses alimentaires"
                placeholderTextColor="#9CA3AF"
                value={newTransaction.title}
                onChangeText={(text) => setNewTransaction({...newTransaction, title: text})}
                maxLength={50}
              />
            </View>

            {/* Amount Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <DollarSign size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Montant *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={newTransaction.amount}
                onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Category Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Tag size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Catégorie
                </Text>
              </View>
              <View style={styles.categoryGrid}>
                {getCurrentCategories().map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: category.color },
                      newTransaction.category === category.name && styles.selectedCategory
                    ]}
                    onPress={() => setNewTransaction({
                      ...newTransaction, 
                      category: category.name,
                      categoryColor: category.color
                    })}
                  >
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Calendar size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Date
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={newTransaction.date}
                onChangeText={(text) => setNewTransaction({...newTransaction, date: text})}
                maxLength={10}
              />
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer la transaction</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        visible={isEditTransactionVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditTransaction}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Modifier la transaction
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Mettez à jour vos informations
              </Text>
            </View>
            <TouchableOpacity onPress={closeEditTransaction} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Type Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Type de transaction
              </Text>
              <View style={styles.typeGrid}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'income' && styles.selectedType,
                    { backgroundColor: '#10B981' + '20' }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'income',
                    categoryColor: '#10B981',
                    category: ''
                  })}
                >
                  <Text style={[styles.typeOptionText, { color: '#10B981' }]}>
                    Revenu
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'expense' && styles.selectedType,
                    { backgroundColor: '#EF4444' + '20' }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'expense',
                    categoryColor: '#EF4444',
                    category: ''
                  })}
                >
                  <Text style={[styles.typeOptionText, { color: '#EF4444' }]}>
                    Dépense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Title Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Type size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Titre *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="Ex: Courses alimentaires"
                placeholderTextColor="#9CA3AF"
                value={newTransaction.title}
                onChangeText={(text) => setNewTransaction({...newTransaction, title: text})}
                maxLength={50}
              />
            </View>

            {/* Amount Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <DollarSign size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Montant *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                value={newTransaction.amount}
                onChangeText={(text) => setNewTransaction({...newTransaction, amount: text})}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Category Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Tag size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Catégorie
                </Text>
              </View>
              <View style={styles.categoryGrid}>
                {getCurrentCategories().map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: category.color },
                      newTransaction.category === category.name && styles.selectedCategory
                    ]}
                    onPress={() => setNewTransaction({
                      ...newTransaction, 
                      category: category.name,
                      categoryColor: category.color
                    })}
                  >
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Calendar size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Date
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={newTransaction.date}
                onChangeText={(text) => setNewTransaction({...newTransaction, date: text})}
                maxLength={10}
              />
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Add Budget Modal */}
      <Modal
        visible={isAddBudgetVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddBudget}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Nouveau budget
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Créez un nouveau budget mensuel
              </Text>
            </View>
            <TouchableOpacity onPress={closeAddBudget} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Name Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Type size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Nom du budget *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="Ex: Vêtements"
                placeholderTextColor="#9CA3AF"
                value={newBudget.name}
                onChangeText={(text) => setNewBudget({...newBudget, name: text})}
                maxLength={30}
              />
            </View>

            {/* Budget Amount Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <DollarSign size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Montant mensuel *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={newBudget.budget}
                onChangeText={(text) => setNewBudget({...newBudget, budget: text})}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Color Selection */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Tag size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Couleur
                </Text>
              </View>
              <View style={styles.categoryGrid}>
                {[
                  { color: '#EF4444', name: 'Rouge' },
                  { color: '#F59E0B', name: 'Orange' },
                  { color: '#10B981', name: 'Vert' },
                  { color: '#3B82F6', name: 'Bleu' },
                  { color: '#8B5CF6', name: 'Violet' },
                  { color: '#EC4899', name: 'Rose' },
                ].map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.color}
                    style={[
                      styles.colorOptionBudget,
                      { backgroundColor: colorOption.color },
                      newBudget.color === colorOption.color && styles.selectedColorBudget
                    ]}
                    onPress={() => setNewBudget({...newBudget, color: colorOption.color})}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Créer le budget</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        visible={isEditBudgetVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditBudget}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Modifier le budget
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Mettez à jour votre budget
              </Text>
            </View>
            <TouchableOpacity onPress={closeEditBudget} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Name Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Type size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Nom du budget *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="Ex: Vêtements"
                placeholderTextColor="#9CA3AF"
                value={newBudget.name}
                onChangeText={(text) => setNewBudget({...newBudget, name: text})}
                maxLength={30}
              />
            </View>

            {/* Budget Amount Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <DollarSign size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Montant mensuel *
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={newBudget.budget}
                onChangeText={(text) => setNewBudget({...newBudget, budget: text})}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Color Selection */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Tag size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Couleur
                </Text>
              </View>
              <View style={styles.categoryGrid}>
                {[
                  { color: '#EF4444', name: 'Rouge' },
                  { color: '#F59E0B', name: 'Orange' },
                  { color: '#10B981', name: 'Vert' },
                  { color: '#3B82F6', name: 'Bleu' },
                  { color: '#8B5CF6', name: 'Violet' },
                  { color: '#EC4899', name: 'Rose' },
                ].map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.color}
                    style={[
                      styles.colorOptionBudget,
                      { backgroundColor: colorOption.color },
                      newBudget.color === colorOption.color && styles.selectedColorBudget
                    ]}
                    onPress={() => setNewBudget({...newBudget, color: colorOption.color})}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Sauvegarder</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedHeader: {
    backgroundColor: 'inherit',
  },
  scrollableContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
  },
  bankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  connectBankButton: {
    backgroundColor: '#FFD840',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectBankButtonText: {
    color: '#2E2E2E',
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    fontSize: 14,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  balanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceStatItem: {
    alignItems: 'center',
  },
  balanceStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  incomeText: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#10B981',
  },
  expenseText: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#EF4444',
  },
  // Tab Styles
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: '#FFD840',
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  activeTabButtonText: {
    color: '#2E2E2E',
    fontWeight: '600',
  },
  transactionsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingTop: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Manrope-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 8,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 6,
  },
  deleteAction: {},
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  deleteText: {
    color: '#EF4444',
  },
  transactionAmount: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginLeft: 16,
  },
  // Budget Styles
  budgetSection: {
    paddingHorizontal: 20,
  },
  budgetSummaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  budgetSummaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },
  budgetSummaryAmount: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  budgetSummaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSummaryStatItem: {
    alignItems: 'center',
  },
  budgetSummaryStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  budgetUsedText: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#EF4444',
  },
  budgetRemainingText: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#10B981',
  },
  budgetCategoriesContainer: {
    gap: 12,
  },
  budgetCategoryCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
  },
  budgetCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetCategoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetCategoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  budgetCategoryIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
  },
  budgetCategoryName: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  budgetCategoryAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetCategoryRight: {
    alignItems: 'flex-end',
  },
  budgetCategoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  budgetActionButton: {
    padding: 6,
    borderRadius: 6,
  },
  deleteBudgetButton: {},
  colorOptionBudget: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorBudget: {
    borderColor: '#2E2E2E',
    borderWidth: 3,
  },
  budgetProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetProgressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetProgressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  // Floating Button
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedType: {
    borderColor: '#2E2E2E',
  },
  typeOptionText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategory: {
    borderColor: '#2E2E2E',
  },
  categoryOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD840',
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    color: '#2E2E2E',
  },
});
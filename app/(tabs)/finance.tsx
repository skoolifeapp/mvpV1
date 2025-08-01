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
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Tag, 
  ChevronDown,
  CreditCard as Edit3,
  Check
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

SplashScreen.preventAutoHideAsync();

export default function FinanceScreen() {
  const { isDarkMode } = useTheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const [transactions, setTransactions] = useState<Transaction[]>([
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
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [isCategorizeVisible, setIsCategorizeVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditTransactionVisible, setIsEditTransactionVisible] = useState(false);

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
    { name: 'Autre', color: '#6B7280' },
  ];

  const expenseCategories = [
    { name: 'Alimentation', color: '#EF4444' },
    { name: 'Transport', color: '#F59E0B' },
    { name: 'Logement', color: '#8B5CF6' },
    { name: 'Loisirs', color: '#3B82F6' },
    { name: 'Santé', color: '#10B981' },
    { name: 'Éducation', color: '#6366F1' },
    { name: 'Autre', color: '#6B7280' },
  ];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const uncategorizedCount = transactions.filter(t => t.isUncategorized).length;

  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulation de synchronisation
    setTimeout(() => {
      setIsSyncing(false);
      Alert.alert(
        'Synchronisation terminée',
        'Vos nouvelles transactions ont été importées. Vous pouvez maintenant les catégoriser.',
        [{ text: 'Compris', style: 'default' }]
      );
    }, 2000);
  };

  const handleConnectBank = () => {
    Alert.alert('Connexion bancaire', 'Fonctionnalité de connexion à venir');
  };

  const openCategorizeModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsCategorizeVisible(true);
  };

  const closeCategorizeModal = () => {
    setIsCategorizeVisible(false);
    setSelectedTransaction(null);
  };

  const categorizeTransaction = (category: string, color: string) => {
    if (!selectedTransaction) return;

    const updatedTransactions = transactions.map(t => 
      t.id === selectedTransaction.id 
        ? { ...t, category, categoryColor: color, isUncategorized: false }
        : t
    );

    setTransactions(updatedTransactions);
    closeCategorizeModal();
    Alert.alert('Succès', 'Transaction catégorisée avec succès !');
  };

  const openEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionVisible(true);
  };

  const closeEditTransaction = () => {
    setIsEditTransactionVisible(false);
    setSelectedTransaction(null);
  };

  const updateTransaction = (category: string, color: string) => {
    if (!selectedTransaction) return;

    const updatedTransactions = transactions.map(t => 
      t.id === selectedTransaction.id 
        ? { ...t, category, categoryColor: color, isUncategorized: false }
        : t
    );

    setTransactions(updatedTransactions);
    closeEditTransaction();
    Alert.alert('Succès', 'Transaction modifiée avec succès !');
  };

  const renderTransaction = (transaction: Transaction) => (
    <TouchableOpacity 
      key={transaction.id} 
      style={[
        styles.transactionCard,
        transaction.isUncategorized && styles.uncategorizedCard,
        { 
          backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
          borderColor: isDarkMode ? '#4B5563' : (transaction.isUncategorized ? '#F59E0B' : '#FFD840')
        }
      ]}
      onPress={() => transaction.isUncategorized ? openCategorizeModal(transaction) : openEditTransaction(transaction)}
      activeOpacity={0.7}
    >
      <View style={[styles.transactionIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
        {transaction.type === 'income' ? (
          <TrendingUp size={20} color="#10B981" strokeWidth={2} />
        ) : (
          <TrendingDown size={20} color="#EF4444" strokeWidth={2} />
        )}
      </View>
      
      <View style={styles.transactionContent}>
        <Text style={[styles.transactionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          {transaction.title}
        </Text>
        
        <View style={styles.transactionMeta}>
          {transaction.isUncategorized ? (
            <View style={styles.uncategorizedTag}>
              <Text style={styles.uncategorizedText}>À catégoriser</Text>
            </View>
          ) : (
            <View style={[styles.categoryTag, { backgroundColor: transaction.categoryColor }]}>
              <Text style={styles.categoryText}>{transaction.category}</Text>
            </View>
          )}
          
          <Text style={[styles.transactionDate, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
            {transaction.date} • {transaction.bankName}
          </Text>
        </View>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: transaction.type === 'income' ? '#10B981' : '#EF4444' }
        ]}>
          {transaction.type === 'income' ? '+' : ''}{transaction.amount.toFixed(2)} €
        </Text>
        {transaction.isUncategorized && (
          <View style={[styles.editButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
            <Edit3 size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            Mes Finances
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.syncButton,
            isSyncing && styles.syncButtonActive,
            { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }
          ]}
          onPress={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw 
            size={24} 
            color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} 
            strokeWidth={2}
            style={[isSyncing && styles.spinning]}
          />
        </TouchableOpacity>
      </View>

      {/* Bank Connection Section */}
      <View style={[
        styles.bankSection,
        { 
          backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
          borderColor: isDarkMode ? '#4B5563' : 'transparent'
        }
      ]}>
        <View style={styles.bankInfo}>
          <DollarSign size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.bankText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            Compte bancaire
          </Text>
        </View>
        <TouchableOpacity style={styles.connectBankButton} onPress={handleConnectBank}>
          <Text style={styles.connectBankButtonText}>Connecter</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={[
        styles.balanceCard,
        { 
          backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
        }
      ]}>
        <View style={styles.balanceHeader}>
          <Text style={[styles.balanceTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            Balance du mois
          </Text>
        </View>
        
        <Text style={[
          styles.balanceAmount,
          { color: balance >= 0 ? '#10B981' : '#EF4444' }
        ]}>
          {balance >= 0 ? '+' : ''}{balance.toFixed(2)} €
        </Text>
        
        <View style={styles.balanceDetails}>
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Revenus
            </Text>
            <Text style={[styles.balanceValue, { color: '#10B981' }]}>
              +{totalIncome.toFixed(2)} €
            </Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={[styles.balanceLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Dépenses
            </Text>
            <Text style={[styles.balanceValue, { color: '#EF4444' }]}>
              -{totalExpenses.toFixed(2)} €
            </Text>
          </View>
        </View>
      </View>

      {/* Uncategorized Alert */}
      {uncategorizedCount > 0 && (
        <View style={[styles.alertCard, { backgroundColor: isDarkMode ? '#7C2D12' : '#FEF3C7' }]}>
          <Text style={[styles.alertText, { color: isDarkMode ? '#FED7AA' : '#92400E' }]}>
            {uncategorizedCount} transaction{uncategorizedCount > 1 ? 's' : ''} à catégoriser
          </Text>
        </View>
      )}

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          Transactions récentes
        </Text>
        
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <DollarSign size={48} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Aucune transaction
            </Text>
            <Text style={[styles.emptyStateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Connectez votre banque pour voir vos transactions automatiquement.
            </Text>
          </View>
        ) : (
          <View style={styles.transactionsContainer}>
            {transactions.map(renderTransaction)}
          </View>
        )}
      </ScrollView>

      {/* Categorize Modal */}
      <Modal
        visible={isCategorizeVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeCategorizeModal}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Catégoriser la transaction
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                {selectedTransaction?.title}
              </Text>
            </View>
            <TouchableOpacity onPress={closeCategorizeModal} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.categoriesSection}>
              <Text style={[styles.categoriesTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                {selectedTransaction?.type === 'income' ? 'Catégories de revenus' : 'Catégories de dépenses'}
              </Text>
              
              <View style={styles.categoriesGrid}>
                {(selectedTransaction?.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryOption,
                      { 
                        backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                      }
                    ]}
                    onPress={() => categorizeTransaction(category.name, category.color)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryColorDot, { backgroundColor: category.color }]} />
                    <Text style={[styles.categoryOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {category.name}
                    </Text>
                    <Check size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
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
                {selectedTransaction?.title}
              </Text>
            </View>
            <TouchableOpacity onPress={closeEditTransaction} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.categoriesSection}>
              <Text style={[styles.categoriesTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                {selectedTransaction?.type === 'income' ? 'Catégories de revenus' : 'Catégories de dépenses'}
              </Text>
              
              <View style={styles.categoriesGrid}>
                {(selectedTransaction?.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryOption,
                      { 
                        backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                      }
                    ]}
                    onPress={() => updateTransaction(category.name, category.color)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.categoryColorDot, { backgroundColor: category.color }]} />
                    <Text style={[styles.categoryOptionText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                      {category.name}
                    </Text>
                    <Check size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  syncButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  syncButtonActive: {
    opacity: 0.7,
  },
  spinning: {
    transform: [{ rotate: '360deg' }],
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
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  balanceHeader: {
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  alertCard: {
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  alertText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    textAlign: 'center',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    lineHeight: 24,
  },
  transactionsContainer: {
    paddingBottom: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
  },
  uncategorizedCard: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
  uncategorizedTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
  },
  uncategorizedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 4,
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
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
  categoriesSection: {
    marginBottom: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryOptionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
});
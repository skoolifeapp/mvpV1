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
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Save, 
  Type, 
  DollarSign, 
  Calendar, 
  Tag, 
  Trash2, 
  CreditCard as Edit3 
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
  type: 'income' | 'expense';
  category: string;
  date: string;
  categoryColor: string;
}

type FilterType = 'Toutes' | 'Revenus' | 'Dépenses';

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
      title: 'Salaire job étudiant',
      amount: 450,
      type: 'income',
      category: 'Travail',
      date: '2025-01-15',
      categoryColor: '#10B981',
    },
    {
      id: '2',
      title: 'Courses alimentaires',
      amount: 85.50,
      type: 'expense',
      category: 'Alimentation',
      date: '2025-01-14',
      categoryColor: '#EF4444',
    },
    {
      id: '3',
      title: 'Aide familiale',
      amount: 200,
      type: 'income',
      category: 'Famille',
      date: '2025-01-10',
      categoryColor: '#8B5CF6',
    },
    {
      id: '4',
      title: 'Transport mensuel',
      amount: 65,
      type: 'expense',
      category: 'Transport',
      date: '2025-01-08',
      categoryColor: '#F59E0B',
    },
  ]);

  const [currentFilter, setCurrentFilter] = useState<FilterType>('Toutes');
  const [isAddTransactionVisible, setIsAddTransactionVisible] = useState(false);
  const [isEditTransactionVisible, setIsEditTransactionVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    title: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    date: '',
    categoryColor: '#EF4444',
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
    { name: 'Travail', color: '#10B981' },
    { name: 'Famille', color: '#8B5CF6' },
    { name: 'Bourse', color: '#3B82F6' },
    { name: 'Freelance', color: '#6366F1' },
    { name: 'Investissement', color: '#059669' },
    { name: 'Autre', color: '#6B7280' },
  ];

  const expenseCategories = [
    { name: 'Alimentation', color: '#EF4444' },
    { name: 'Transport', color: '#F59E0B' },
    { name: 'Logement', color: '#8B5CF6' },
    { name: 'Études', color: '#3B82F6' },
    { name: 'Loisirs', color: '#10B981' },
    { name: 'Santé', color: '#EC4899' },
    { name: 'Vêtements', color: '#6366F1' },
    { name: 'Autre', color: '#6B7280' },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    switch (currentFilter) {
      case 'Revenus':
        return transaction.type === 'income';
      case 'Dépenses':
        return transaction.type === 'expense';
      default:
        return true;
    }
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

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
    if (!newTransaction.title.trim()) {
      Alert.alert('Erreur', 'Le titre de la transaction est obligatoire');
      return;
    }

    if (!newTransaction.amount.trim() || isNaN(parseFloat(newTransaction.amount))) {
      Alert.alert('Erreur', 'Le montant doit être un nombre valide');
      return;
    }

    if (editingTransaction) {
      const updatedTransaction: Transaction = {
        ...editingTransaction,
        title: newTransaction.title.trim(),
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        category: newTransaction.category || (newTransaction.type === 'income' ? 'Autre' : 'Autre'),
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
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        category: newTransaction.category || (newTransaction.type === 'income' ? 'Autre' : 'Autre'),
        date: newTransaction.date || new Date().toISOString().split('T')[0],
        categoryColor: newTransaction.categoryColor,
      };

      setTransactions([transactionToAdd, ...transactions]);
      closeAddTransaction();
      Alert.alert('Succès', 'Transaction ajoutée avec succès !');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const sign = type === 'income' ? '+' : '-';
    return `${sign}${amount.toFixed(2)} €`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          Mes Finances
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]}
          onPress={() => setIsAddTransactionVisible(true)}
        >
          <Plus size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[
          styles.summaryCard,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : '#10B981'
          }
        ]}>
          <View style={styles.summaryHeader}>
            <TrendingUp size={20} color="#10B981" strokeWidth={2} />
            <Text style={[styles.summaryLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Revenus
            </Text>
          </View>
          <Text style={styles.incomeAmount}>+{totalIncome.toFixed(2)} €</Text>
        </View>

        <View style={[
          styles.summaryCard,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : '#EF4444'
          }
        ]}>
          <View style={styles.summaryHeader}>
            <TrendingDown size={20} color="#EF4444" strokeWidth={2} />
            <Text style={[styles.summaryLabel, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              Dépenses
            </Text>
          </View>
          <Text style={styles.expenseAmount}>-{totalExpenses.toFixed(2)} €</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['Toutes', 'Revenus', 'Dépenses'] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              currentFilter === filter && styles.activeFilterTab,
              { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }
            ]}
            onPress={() => setCurrentFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              currentFilter === filter && styles.activeFilterText,
              { color: isDarkMode ? '#D1D5DB' : '#6B7280' }
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList} showsVerticalScrollIndicator={false}>
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <DollarSign size={48} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              {currentFilter === 'Toutes' ? 'Aucune transaction' : 
               currentFilter === 'Revenus' ? 'Aucun revenu' : 
               'Aucune dépense'}
            </Text>
            <Text style={[styles.emptyStateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {currentFilter === 'Toutes' ? 'Commencez par ajouter votre première transaction !' :
               currentFilter === 'Revenus' ? 'Vous n\'avez enregistré aucun revenu.' :
               'Vous n\'avez enregistré aucune dépense.'}
            </Text>
            <TouchableOpacity 
              style={[styles.addTransactionButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]} 
              onPress={() => setIsAddTransactionVisible(true)}
            >
              <Plus size={20} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
              <Text style={[styles.addTransactionButtonText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Ajouter une transaction
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.transactionsContainer}>
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(transaction => (
              <View key={transaction.id} style={[
                styles.transactionCard,
                { 
                  backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                  borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                }
              ]}>
                <View style={[styles.transactionIcon, { backgroundColor: transaction.categoryColor + '20' }]}>
                  {transaction.type === 'income' ? (
                    <TrendingUp size={20} color={transaction.categoryColor} strokeWidth={2} />
                  ) : (
                    <TrendingDown size={20} color={transaction.categoryColor} strokeWidth={2} />
                  )}
                </View>
                
                <View style={styles.transactionContent}>
                  <Text style={[styles.transactionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    {transaction.title}
                  </Text>
                  
                  <View style={styles.transactionMeta}>
                    <View style={[styles.categoryTag, { backgroundColor: transaction.categoryColor }]}>
                      <Text style={styles.categoryText}>{transaction.category}</Text>
                    </View>
                    <Text style={[styles.transactionDate, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.transactionActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditTransaction(transaction)}
                    >
                      <Edit3 size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                      <Text style={[styles.actionText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                        Modifier
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteAction]}
                      onPress={() => deleteTransaction(transaction.id)}
                    >
                      <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                      <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.amountText,
                    transaction.type === 'income' ? styles.incomeText : styles.expenseText
                  ]}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
                Ajoutez un revenu ou une dépense
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
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'income' && styles.selectedType,
                    { 
                      backgroundColor: newTransaction.type === 'income' ? '#10B981' : (isDarkMode ? '#374151' : '#F9FAFB'),
                      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                    }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'income',
                    category: '',
                    categoryColor: '#10B981'
                  })}
                >
                  <TrendingUp size={20} color={newTransaction.type === 'income' ? '#FFFFFF' : '#10B981'} strokeWidth={2} />
                  <Text style={[
                    styles.typeOptionText,
                    { color: newTransaction.type === 'income' ? '#FFFFFF' : (isDarkMode ? '#D1D5DB' : '#2E2E2E') }
                  ]}>
                    Revenu
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'expense' && styles.selectedType,
                    { 
                      backgroundColor: newTransaction.type === 'expense' ? '#EF4444' : (isDarkMode ? '#374151' : '#F9FAFB'),
                      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                    }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'expense',
                    category: '',
                    categoryColor: '#EF4444'
                  })}
                >
                  <TrendingDown size={20} color={newTransaction.type === 'expense' ? '#FFFFFF' : '#EF4444'} strokeWidth={2} />
                  <Text style={[
                    styles.typeOptionText,
                    { color: newTransaction.type === 'expense' ? '#FFFFFF' : (isDarkMode ? '#D1D5DB' : '#2E2E2E') }
                  ]}>
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
                placeholder="Ex: Salaire, Courses, Transport..."
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
                keyboardType="decimal-pad"
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
                {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
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
                placeholder="AAAA-MM-JJ (optionnel)"
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
                Mettez à jour les informations
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
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'income' && styles.selectedType,
                    { 
                      backgroundColor: newTransaction.type === 'income' ? '#10B981' : (isDarkMode ? '#374151' : '#F9FAFB'),
                      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                    }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'income',
                    category: '',
                    categoryColor: '#10B981'
                  })}
                >
                  <TrendingUp size={20} color={newTransaction.type === 'income' ? '#FFFFFF' : '#10B981'} strokeWidth={2} />
                  <Text style={[
                    styles.typeOptionText,
                    { color: newTransaction.type === 'income' ? '#FFFFFF' : (isDarkMode ? '#D1D5DB' : '#2E2E2E') }
                  ]}>
                    Revenu
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    newTransaction.type === 'expense' && styles.selectedType,
                    { 
                      backgroundColor: newTransaction.type === 'expense' ? '#EF4444' : (isDarkMode ? '#374151' : '#F9FAFB'),
                      borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                    }
                  ]}
                  onPress={() => setNewTransaction({
                    ...newTransaction, 
                    type: 'expense',
                    category: '',
                    categoryColor: '#EF4444'
                  })}
                >
                  <TrendingDown size={20} color={newTransaction.type === 'expense' ? '#FFFFFF' : '#EF4444'} strokeWidth={2} />
                  <Text style={[
                    styles.typeOptionText,
                    { color: newTransaction.type === 'expense' ? '#FFFFFF' : (isDarkMode ? '#D1D5DB' : '#2E2E2E') }
                  ]}>
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
                placeholder="Ex: Salaire, Courses, Transport..."
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
                keyboardType="decimal-pad"
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
                {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
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
                placeholder="AAAA-MM-JJ (optionnel)"
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
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 8,
  },
  summaryLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  incomeAmount: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#10B981',
  },
  expenseAmount: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    color: '#EF4444',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
    justifyContent: 'center',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: '#FFD840',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#2E2E2E',
    fontWeight: '600',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
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
    marginBottom: 24,
    lineHeight: 24,
  },
  addTransactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addTransactionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
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
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
  },
  incomeText: {
    color: '#10B981',
  },
  expenseText: {
    color: '#EF4444',
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
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  selectedType: {},
  typeOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
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
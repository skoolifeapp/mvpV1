import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { 
  Search, 
  Upload, 
  Eye, 
  Trash2, 
  FileText, 
  ChevronDown,
  X,
  Save,
  Type,
  Tag,
  File,
  Plus
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

interface Document {
  id: string;
  name: string;
  category: string;
  size: string;
  date: string;
  categoryColor: string;
}

type SortType = 'Nom' | 'Date' | 'Taille' | 'Catégorie';

SplashScreen.preventAutoHideAsync();

export default function DocumentsScreen() {
  const { isDarkMode } = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const [documents, setDocuments] = useState<Document[]>([
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes les catégories');
  const [currentSort, setCurrentSort] = useState<SortType>('Nom');
  const [isAddDocumentVisible, setIsAddDocumentVisible] = useState(false);
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    category: '',
    size: '',
    categoryColor: '#8B5CF6',
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const categories = [
    { name: 'Administratif', color: '#8B5CF6' },
    { name: 'École', color: '#3B82F6' },
    { name: 'Personnel', color: '#10B981' },
    { name: 'Travail', color: '#F59E0B' },
    { name: 'Santé', color: '#EF4444' },
    { name: 'Finance', color: '#6366F1' },
  ];

  const allCategories = ['Toutes les catégories', ...categories.map(cat => cat.name)];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes les catégories' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (currentSort) {
      case 'Nom':
        return a.name.localeCompare(b.name);
      case 'Date':
        return new Date(b.date.split('/').reverse().join('-')).getTime() - 
               new Date(a.date.split('/').reverse().join('-')).getTime();
      case 'Taille':
        const getSizeInBytes = (size: string) => {
          const value = parseFloat(size);
          if (size.includes('MB')) return value * 1024 * 1024;
          if (size.includes('KB')) return value * 1024;
          return value;
        };
        return getSizeInBytes(b.size) - getSizeInBytes(a.size);
      case 'Catégorie':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  const closeAddDocument = () => {
    setIsAddDocumentVisible(false);
    setNewDocument({
      name: '',
      category: '',
      size: '',
      categoryColor: '#8B5CF6',
    });
  };

  const closeUploadModal = () => {
    setIsUploadModalVisible(false);
  };

  const handleFileUpload = () => {
    Alert.alert(
      'Upload de fichier',
      'Fonctionnalité d\'upload en cours de développement. Pour l\'instant, utilisez le bouton "Ajouter un document" pour créer manuellement vos entrées.',
      [{ text: 'Compris', style: 'default' }]
    );
    closeUploadModal();
  };

  const saveDocument = () => {
    if (!newDocument.name.trim()) {
      Alert.alert('Erreur', 'Le nom du document est obligatoire');
      return;
    }

    const documentToAdd: Document = {
      id: Date.now().toString(),
      name: newDocument.name.trim(),
      category: newDocument.category || 'Personnel',
      size: newDocument.size || '0 KB',
      date: new Date().toLocaleDateString('fr-FR'),
      categoryColor: newDocument.categoryColor,
    };

    setDocuments([...documents, documentToAdd]);
    closeAddDocument();
    Alert.alert('Succès', 'Document ajouté avec succès !');
  };

  const deleteDocument = (documentId: string) => {
    Alert.alert(
      'Supprimer le document',
      'Êtes-vous sûr de vouloir supprimer ce document ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setDocuments(documents.filter(doc => doc.id !== documentId));
            Alert.alert('Succès', 'Document supprimé avec succès !');
          },
        },
      ]
    );
  };

  const viewDocument = (document: Document) => {
    Alert.alert('Aperçu', `Ouverture de ${document.name}`);
  };

  const renderSortButton = (sortType: SortType) => (
    <TouchableOpacity
      key={sortType}
      style={[
        styles.sortButton,
        currentSort === sortType && styles.activeSortButton,
        { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }
      ]}
      onPress={() => setCurrentSort(sortType)}
    >
      <Text style={[
        styles.sortButtonText,
        currentSort === sortType && styles.activeSortButtonText,
        { color: isDarkMode ? '#D1D5DB' : '#6B7280' }
      ]}>
        {sortType}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            Mes Documents
          </Text>
          <Text style={[styles.documentCount, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
            {documents.length} documents
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <View style={styles.documentsButton}>
          <File size={20} color="#2E2E2E" strokeWidth={2} />
          <Text style={styles.documentsButtonText}>Documents</Text>
        </View>
        <TouchableOpacity 
          style={[styles.uploadButton, { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }]}
          onPress={() => setIsUploadModalVisible(true)}
        >
          <Upload size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          <Text style={[styles.uploadButtonText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
            Upload
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[
        styles.searchContainer,
        { 
          backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
          borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
        }
      ]}>
        <Search size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
        <TextInput
          style={[styles.searchInput, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}
          placeholder="Rechercher des documents..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Filter */}
      <TouchableOpacity 
        style={[
          styles.categoryFilter,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
            borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
          }
        ]}
        onPress={() => setIsCategoryDropdownVisible(true)}
      >
        <Text style={[styles.categoryFilterText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          {selectedCategory}
        </Text>
        <ChevronDown size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
      </TouchableOpacity>

      {/* Sort Buttons */}
      <View style={styles.sortContainer}>
        {(['Nom', 'Date', 'Taille', 'Catégorie'] as SortType[]).map(renderSortButton)}
      </View>

      {/* Documents List */}
      <ScrollView style={styles.documentsList} showsVerticalScrollIndicator={false}>
        {sortedDocuments.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={48} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={1.5} />
            <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Aucun document
            </Text>
            <Text style={[styles.emptyStateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {searchQuery || selectedCategory !== 'Toutes les catégories' 
                ? 'Aucun document ne correspond à vos critères de recherche.'
                : 'Commencez par ajouter votre premier document !'}
            </Text>
            {!searchQuery && selectedCategory === 'Toutes les catégories' && (
              <TouchableOpacity 
                style={[styles.addDocumentButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]} 
                onPress={() => setIsAddDocumentVisible(true)}
              >
                <Upload size={20} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
                <Text style={[styles.addDocumentButtonText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Ajouter un document
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.documentsContainer}>
            {sortedDocuments.map(document => (
              <View key={document.id} style={[
                styles.documentCard,
                { 
                  backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                  borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                }
              ]}>
                <View style={[styles.documentIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                  <FileText size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                </View>
                
                <View style={styles.documentContent}>
                  <Text style={[styles.documentName, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    {document.name}
                  </Text>
                  
                  <View style={styles.documentMeta}>
                    <View style={[styles.categoryTag, { backgroundColor: document.categoryColor }]}>
                      <Text style={styles.categoryText}>{document.category}</Text>
                    </View>
                    <Text style={[styles.documentInfo, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                      {document.size} • {document.date}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.documentActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}
                    onPress={() => viewDocument(document)}
                  >
                    <Eye size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton, { backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2' }]}
                    onPress={() => deleteDocument(document.id)}
                  >
                    <Trash2 size={20} color="#EF4444" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Category Dropdown Modal */}
      <Modal
        visible={isCategoryDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsCategoryDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setIsCategoryDropdownVisible(false)}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
            {allCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.dropdownItem,
                  selectedCategory === category && styles.selectedDropdownItem,
                  { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  setIsCategoryDropdownVisible(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedCategory === category && styles.selectedDropdownItemText,
                  { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Document Modal */}
      <Modal
        visible={isAddDocumentVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddDocument}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Nouveau document
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Ajoutez un document à votre collection
              </Text>
            </View>
            <TouchableOpacity onPress={closeAddDocument} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Name Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Type size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Nom du document *
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
                placeholder="Ex: Certificat de scolarité.pdf"
                placeholderTextColor="#9CA3AF"
                value={newDocument.name}
                onChangeText={(text) => setNewDocument({...newDocument, name: text})}
                maxLength={100}
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
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.name}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: category.color },
                      newDocument.category === category.name && styles.selectedCategory
                    ]}
                    onPress={() => setNewDocument({
                      ...newDocument, 
                      category: category.name,
                      categoryColor: category.color
                    })}
                  >
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Size Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <File size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Taille (optionnel)
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
                placeholder="Ex: 2.5 MB"
                placeholderTextColor="#9CA3AF"
                value={newDocument.size}
                onChangeText={(text) => setNewDocument({...newDocument, size: text})}
                maxLength={20}
              />
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveDocument}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer le document</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Upload Modal */}
      <Modal
        visible={isUploadModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeUploadModal}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Importer un document
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Sélectionnez un fichier depuis votre appareil
              </Text>
            </View>
            <TouchableOpacity onPress={closeUploadModal} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.uploadContent}>
            {/* Upload Zone */}
            <TouchableOpacity 
              style={[
                styles.uploadZone,
                { 
                  backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                  borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                }
              ]} 
              onPress={handleFileUpload}
            >
              <Upload size={48} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={1.5} />
              <Text style={[styles.uploadZoneTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Cliquez pour sélectionner un fichier
              </Text>
              <Text style={[styles.uploadZoneSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                ou glissez-déposez votre document ici
              </Text>
              <Text style={[styles.uploadZoneFormats, { color: isDarkMode ? '#9CA3AF' : '#9CA3AF' }]}>
                Formats supportés: PDF, DOC, DOCX, JPG, PNG
              </Text>
            </TouchableOpacity>

            {/* Upload Options */}
            <View style={styles.uploadOptions}>
              <TouchableOpacity 
                style={[
                  styles.uploadOption,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                  }
                ]} 
                onPress={handleFileUpload}
              >
                <View style={[styles.uploadOptionIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                  <Upload size={24} color="#3B82F6" strokeWidth={2} />
                </View>
                <View style={styles.uploadOptionContent}>
                  <Text style={[styles.uploadOptionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Depuis l'appareil
                  </Text>
                  <Text style={[styles.uploadOptionSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Parcourir vos fichiers locaux
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.uploadOption,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                  }
                ]} 
                onPress={handleFileUpload}
              >
                <View style={[styles.uploadOptionIcon, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}>
                  <FileText size={24} color="#10B981" strokeWidth={2} />
                </View>
                <View style={styles.uploadOptionContent}>
                  <Text style={[styles.uploadOptionTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Prendre une photo
                  </Text>
                  <Text style={[styles.uploadOptionSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    Scanner un document avec l'appareil photo
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Manual Entry */}
            <View style={[styles.manualEntry, { borderTopColor: isDarkMode ? '#4B5563' : '#E5E7EB' }]}>
              <Text style={[styles.manualEntryTitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Ou créer manuellement
              </Text>
              <TouchableOpacity 
                style={[styles.manualEntryButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]}
                onPress={() => {
                  closeUploadModal();
                  setIsAddDocumentVisible(true);
                }}
              >
                <Plus size={20} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
                <Text style={[styles.manualEntryButtonText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Ajouter un document
                </Text>
              </TouchableOpacity>
            </View>
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
  documentCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  documentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD840',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  documentsButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    color: '#2E2E2E',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  categoryFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  categoryFilterText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
    justifyContent: 'center',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeSortButton: {
    backgroundColor: '#FFD840',
    borderColor: '#FFD840',
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#2E2E2E',
    fontWeight: '600',
  },
  documentsList: {
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
  addDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addDocumentButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  documentsContainer: {
    paddingBottom: 20,
  },
  documentCard: {
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
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentContent: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 8,
  },
  documentMeta: {
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
  documentInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {},
  // Dropdown Styles
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  selectedDropdownItem: {
    backgroundColor: '#FFF7ED',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  selectedDropdownItemText: {
    color: '#F59E0B',
    fontWeight: '600',
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
  // Upload Modal Styles
  uploadContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  uploadZoneTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  uploadZoneSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  uploadZoneFormats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  uploadOptions: {
    marginBottom: 32,
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
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
  uploadOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  uploadOptionContent: {
    flex: 1,
  },
  uploadOptionTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 4,
  },
  uploadOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  manualEntry: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
  },
  manualEntryTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 16,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  manualEntryButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
});
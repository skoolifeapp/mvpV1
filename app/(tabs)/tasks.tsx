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
  Platform,
  Dimensions,
} from 'react-native';
import { 
  Plus, 
  Settings, 
  X, 
  Type, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  Save, 
  Trash2, 
  Edit3 
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

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  category: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  dueDate: string;
  completed: boolean;
  categoryColor: string;
}

type FilterType = 'Toutes' | 'À faire' | 'Faites';

SplashScreen.preventAutoHideAsync();

export default function TasksScreen() {
  const { isDarkMode } = useTheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('Toutes');
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const [isEditTaskVisible, setIsEditTaskVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    priority: 'Moyenne' as 'Haute' | 'Moyenne' | 'Basse',
    dueDate: '',
    categoryColor: '#8B5CF6',
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const categories = [
    { name: 'Études', color: '#8B5CF6' },
    { name: 'Personnel', color: '#10B981' },
    { name: 'Travail', color: '#3B82F6' },
    { name: 'Sport', color: '#F59E0B' },
    { name: 'Famille', color: '#EF4444' },
    { name: 'Loisirs', color: '#6366F1' },
  ];

  const priorities = [
    { name: 'Haute', color: '#EF4444' },
    { name: 'Moyenne', color: '#F59E0B' },
    { name: 'Basse', color: '#10B981' },
  ];

  const filteredTasks = tasks.filter(task => {
    switch (currentFilter) {
      case 'À faire':
        return !task.completed;
      case 'Faites':
        return task.completed;
      default:
        return true;
    }
  });

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate,
      categoryColor: task.categoryColor,
    });
    setIsEditTaskVisible(true);
  };

  const closeEditTask = () => {
    setIsEditTaskVisible(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      category: '',
      priority: 'Moyenne',
      dueDate: '',
      categoryColor: '#8B5CF6',
    });
  };

  const closeAddTask = () => {
    setIsAddTaskVisible(false);
    setNewTask({
      title: '',
      category: '',
      priority: 'Moyenne',
      dueDate: '',
      categoryColor: '#8B5CF6',
    });
  };

  const openCalendar = () => {
    if (newTask.dueDate) {
      const dateParts = newTask.dueDate.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) {
          setCalendarDate(parsedDate);
        } else {
          setCalendarDate(new Date());
        }
      }
    } else {
      setCalendarDate(new Date());
    }
    setShowCalendar(true);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  const selectCalendarDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setNewTask({...newTask, dueDate: formattedDate});
    setShowCalendar(false);
  };

  const deleteTask = (taskId: string) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== taskId));
            Alert.alert('Succès', 'Tâche supprimée avec succès !');
          },
        },
      ]
    );
  };

  const saveTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Erreur', 'Le titre de la tâche est obligatoire');
      return;
    }

    if (editingTask) {
      const updatedTask: Task = {
        ...editingTask,
        title: newTask.title.trim(),
        category: newTask.category || 'Personnel',
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        categoryColor: newTask.categoryColor,
      };

      setTasks(tasks.map(task => 
        task.id === editingTask.id ? updatedTask : task
      ));

      closeEditTask();
      Alert.alert('Succès', 'Tâche modifiée avec succès !');
    } else {
      const taskToAdd: Task = {
        id: Date.now().toString(),
        title: newTask.title.trim(),
        category: newTask.category || 'Personnel',
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        completed: false,
        categoryColor: newTask.categoryColor,
      };

      setTasks([...tasks, taskToAdd]);
      closeAddTask();
      Alert.alert('Succès', 'Tâche ajoutée avec succès !');
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(calendarDate);
    if (direction === 'prev') {
      newDate.setMonth(calendarDate.getMonth() - 1);
    } else {
      newDate.setMonth(calendarDate.getMonth() + 1);
    }
    setCalendarDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelectedDate = (date: Date) => {
    if (!newTask.dueDate) return false;
    const selectedDate = new Date(newTask.dueDate);
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarDate);
    const firstDay = getFirstDayOfMonth(calendarDate);
    const days = [];
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
      const today = isToday(date);
      const selected = isSelectedDate(date);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            styles.calendarDayButton,
            today && styles.calendarToday,
            selected && styles.calendarSelected,
          ]}
          onPress={() => selectCalendarDate(date)}
        >
          <Text style={[
            styles.calendarDayText,
            today && styles.calendarTodayText,
            selected && styles.calendarSelectedText,
            { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.calendar, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity 
            style={[styles.calendarNavButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}
            onPress={() => navigateMonth('prev')}
          >
            <Text style={[styles.calendarNavText, { color: isDarkMode ? '#F9FAFB' : '#6B7280' }]}>‹</Text>
          </TouchableOpacity>
          
          <Text style={[styles.calendarTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
          </Text>
          
          <TouchableOpacity 
            style={[styles.calendarNavButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}
            onPress={() => navigateMonth('next')}
          >
            <Text style={[styles.calendarNavText, { color: isDarkMode ? '#F9FAFB' : '#6B7280' }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarDayNames}>
          {dayNames.map((dayName) => (
            <View key={dayName} style={styles.calendarDayName}>
              <Text style={[styles.calendarDayNameText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                {dayName}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {days}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          Ma To-Do List
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.settingsButton, { backgroundColor: isDarkMode ? '#374151' : '#F9FAFB' }]}>
            <Settings size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]}
            onPress={() => setIsAddTaskVisible(true)}
          >
            <Plus size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['Toutes', 'À faire', 'Faites'] as FilterType[]).map((filter) => (
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

      {/* Tasks List */}
      <ScrollView style={styles.tasksList} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              {currentFilter === 'Toutes' ? 'Aucune tâche' : 
               currentFilter === 'À faire' ? 'Aucune tâche à faire' : 
               'Aucune tâche terminée'}
            </Text>
            <Text style={[styles.emptyStateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {currentFilter === 'Toutes' ? 'Commencez par ajouter votre première tâche !' :
               currentFilter === 'À faire' ? 'Toutes vos tâches sont terminées !' :
               'Vous n\'avez pas encore terminé de tâches.'}
            </Text>
            {currentFilter !== 'Faites' && (
              <TouchableOpacity 
                style={[styles.addTaskButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]} 
                onPress={() => setIsAddTaskVisible(true)}
              >
                <Plus size={20} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
                <Text style={[styles.addTaskButtonText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Ajouter une tâche
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.tasksContainer}>
            {filteredTasks.map(task => (
              <View key={task.id} style={[
                styles.taskCard, 
                task.completed && styles.completedTask,
                { 
                  backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
                  borderColor: isDarkMode ? '#4B5563' : '#FFD840'
                }
              ]}>
                <TouchableOpacity
                  style={[styles.checkbox, task.completed && styles.checkedBox]}
                  onPress={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                
                <View style={styles.taskContent}>
                  <Text style={[
                    styles.taskTitle, 
                    task.completed && styles.completedTaskTitle,
                    { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }
                  ]}>
                    {task.title}
                  </Text>
                  
                  <View style={styles.taskMeta}>
                    <View style={[styles.categoryTag, { backgroundColor: task.categoryColor }]}>
                      <Text style={styles.categoryText}>{task.category}</Text>
                    </View>
                    
                    <View style={[styles.priorityTag, { backgroundColor: priorities.find(p => p.name === task.priority)?.color + '20' }]}>
                      <AlertTriangle size={12} color={priorities.find(p => p.name === task.priority)?.color} strokeWidth={2} />
                      <Text style={[styles.priorityText, { color: priorities.find(p => p.name === task.priority)?.color }]}>
                        {task.priority}
                      </Text>
                    </View>
                    
                    {task.dueDate && (
                      <Text style={[styles.dueDateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                        {task.dueDate}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.taskActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditTask(task)}
                    >
                      <Edit3 size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
                      <Text style={[styles.actionText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                        Modifier
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteAction]}
                      onPress={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                      <Text style={[styles.actionText, styles.deleteText]}>Supprimer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={isAddTaskVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddTask}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Nouvelle tâche
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Organisez votre quotidien
              </Text>
            </View>
            <TouchableOpacity onPress={closeAddTask} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
                placeholder="Ex: Réviser le cours de mathématiques"
                placeholderTextColor="#9CA3AF"
                value={newTask.title}
                onChangeText={(text) => setNewTask({...newTask, title: text})}
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
                      newTask.category === category.name && styles.selectedCategory
                    ]}
                    onPress={() => setNewTask({
                      ...newTask, 
                      category: category.name,
                      categoryColor: category.color
                    })}
                  >
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Priority Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <AlertTriangle size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Priorité
                </Text>
              </View>
              <View style={styles.priorityGrid}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.name}
                    style={[
                      styles.priorityOption,
                      { backgroundColor: priority.color + '20' },
                      newTask.priority === priority.name && styles.selectedPriority
                    ]}
                    onPress={() => setNewTask({...newTask, priority: priority.name as any})}
                  >
                    <AlertTriangle size={16} color={priority.color} strokeWidth={2} />
                    <Text style={[styles.priorityOptionText, { color: priority.color }]}>
                      {priority.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Due Date Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Calendar size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Date d'échéance
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                  }
                ]}
                onPress={openCalendar}
              >
                <Text style={[
                  styles.dateInputText,
                  !newTask.dueDate && styles.placeholderText,
                  { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }
                ]}>
                  {newTask.dueDate || 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer la tâche</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        visible={isEditTaskVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditTask}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Modifier la tâche
              </Text>
              <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                Mettez à jour vos informations
              </Text>
            </View>
            <TouchableOpacity onPress={closeEditTask} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
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
                placeholder="Ex: Réviser le cours de mathématiques"
                placeholderTextColor="#9CA3AF"
                value={newTask.title}
                onChangeText={(text) => setNewTask({...newTask, title: text})}
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
                      newTask.category === category.name && styles.selectedCategory
                    ]}
                    onPress={() => setNewTask({
                      ...newTask, 
                      category: category.name,
                      categoryColor: category.color
                    })}
                  >
                    <Text style={styles.categoryOptionText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Priority Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <AlertTriangle size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Priorité
                </Text>
              </View>
              <View style={styles.priorityGrid}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.name}
                    style={[
                      styles.priorityOption,
                      { backgroundColor: priority.color + '20' },
                      newTask.priority === priority.name && styles.selectedPriority
                    ]}
                    onPress={() => setNewTask({...newTask, priority: priority.name as any})}
                  >
                    <AlertTriangle size={16} color={priority.color} strokeWidth={2} />
                    <Text style={[styles.priorityOptionText, { color: priority.color }]}>
                      {priority.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Due Date Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <Calendar size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Date d'échéance
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.textInput,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB'
                  }
                ]}
                onPress={openCalendar}
              >
                <Text style={[
                  styles.dateInputText,
                  !newTask.dueDate && styles.placeholderText,
                  { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }
                ]}>
                  {newTask.dueDate || 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={closeCalendar}
      >
        <View style={styles.calendarOverlay}>
          <View style={[styles.calendarContainer, { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }]}>
            <View style={[styles.calendarModalHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
              <Text style={[styles.calendarModalTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Sélectionner une date
              </Text>
              <TouchableOpacity onPress={closeCalendar} style={styles.calendarCloseButton}>
                <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            {renderCalendar()}
          </View>
        </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
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
  tasksList: {
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
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addTaskButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  tasksContainer: {
    paddingBottom: 20,
  },
  taskCard: {
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
  completedTask: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFD840',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 8,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskMeta: {
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
  priorityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  dueDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  taskActions: {
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
    borderBottomColor: '#F3F4F6',
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
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPriority: {
    borderColor: '#2E2E2E',
  },
  priorityOptionText: {
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
  dateInputText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  // Calendar Styles
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  calendarContainer: {
    borderRadius: 16,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  calendarModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  calendarModalTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
  },
  calendarCloseButton: {
    padding: 4,
  },
  calendar: {
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarNavText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calendarTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
  },
  calendarDayNames: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  calendarDayName: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarDayNameText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (300 - 40) / 7,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  calendarDayButton: {
    borderRadius: 20,
  },
  calendarToday: {
    backgroundColor: '#E5E7EB',
  },
  calendarSelected: {
    backgroundColor: '#FFD840',
  },
  calendarDayText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  calendarTodayText: {
    fontWeight: '600',
    color: '#2E2E2E',
  },
  calendarSelectedText: {
    fontWeight: '600',
    color: '#2E2E2E',
  },
});
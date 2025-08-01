import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  X, 
  Clock, 
  MapPin, 
  Plus, 
  Save, 
  Type, 
  User,
  CreditCard as Edit3, 
  Trash2 
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
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
import {
  DMSans_400Regular,
} from '@expo-google-fonts/dm-sans';
import { SplashScreen } from 'expo-router';

const { width } = Dimensions.get('window');

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

const getMondayOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const formatWeekRange = (startDate: Date): string => {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  
  if (startDate.getMonth() === endDate.getMonth()) {
    return `Semaine du ${startDate.getDate()} ${months[startDate.getMonth()]}`;
  } else {
    return `Semaine du ${startDate.getDate()} ${months[startDate.getMonth()]} - ${endDate.getDate()} ${months[endDate.getMonth()]}`;
  }
};

const initialWeekStart = getMondayOfWeek(new Date());
const initialWeekData = getWeekData(initialWeekStart);

export default function PlanningScreen() {
  const { isDarkMode } = useTheme();
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Bold': Poppins_700Bold,
    'Manrope-Bold': Manrope_700Bold,
    'Inter-Regular': Inter_400Regular,
    'DMSans-Regular': DMSans_400Regular,
  });

  const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart);
  const [weekData, setWeekData] = useState<DayData[]>(initialWeekData);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [currentWeek, setCurrentWeek] = useState(formatWeekRange(initialWeekStart));
  const [isDayViewVisible, setIsDayViewVisible] = useState(false);
  const [isAddEventVisible, setIsAddEventVisible] = useState(false);
  const [isEditEventVisible, setIsEditEventVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Activity | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    color: '#FFD840',
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    
    setCurrentWeekStart(newWeekStart);
    setCurrentWeek(formatWeekRange(newWeekStart));
    setWeekData(getWeekData(newWeekStart));
    setSelectedDay(null);
  };

  const handleDayPress = (dayData: DayData) => {
    setSelectedDay(dayData);
    setIsDayViewVisible(true);
  };

  const closeDayView = () => {
    setIsDayViewVisible(false);
    setSelectedDay(null);
  };

  const closeAddEvent = () => {
    setIsAddEventVisible(false);
    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      color: '#FFD840',
    });
  };

  const openEditEvent = (activity: Activity) => {
    setEditingEvent(activity);
    setNewEvent({
      title: activity.title,
      startTime: activity.startTime || '',
      endTime: activity.endTime || '',
      location: activity.location || '',
      description: activity.description || '',
      color: activity.color,
    });
    setIsEditEventVisible(true);
  };

  const closeEditEvent = () => {
    setIsEditEventVisible(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      color: '#FFD840',
    });
  };

  const deleteEvent = (eventId: string) => {
    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            if (!selectedDay) return;

            const updatedWeekData = weekData.map(day => {
              if (day.fullDate.getTime() === selectedDay.fullDate.getTime()) {
                return {
                  ...day,
                  activities: day.activities.filter(activity => activity.id !== eventId)
                };
              }
              return day;
            });

            setWeekData(updatedWeekData);
            
            const updatedSelectedDay = updatedWeekData.find(
              day => day.fullDate.getTime() === selectedDay.fullDate.getTime()
            );
            if (updatedSelectedDay) {
              setSelectedDay(updatedSelectedDay);
            }

            Alert.alert('Succès', 'Événement supprimé avec succès !');
          },
        },
      ]
    );
  };

  const saveEvent = () => {
    if (!newEvent.title.trim()) {
      Alert.alert('Erreur', 'Le titre de l\'événement est obligatoire');
      return;
    }

    if (!selectedDay) return;

    let updatedWeekData;

    if (editingEvent) {
      const updatedEvent: Activity = {
        ...editingEvent,
        title: newEvent.title.trim(),
        startTime: newEvent.startTime || undefined,
        endTime: newEvent.endTime || undefined,
        location: newEvent.location || undefined,
        description: newEvent.description || undefined,
        color: newEvent.color,
      };

      updatedWeekData = weekData.map(day => {
        if (day.fullDate.getTime() === selectedDay.fullDate.getTime()) {
          return {
            ...day,
            activities: day.activities.map(activity => 
              activity.id === editingEvent.id ? updatedEvent : activity
            )
          };
        }
        return day;
      });
    } else {
      const eventToAdd: Activity = {
        id: Date.now().toString(),
        title: newEvent.title.trim(),
        startTime: newEvent.startTime || undefined,
        endTime: newEvent.endTime || undefined,
        location: newEvent.location || undefined,
        description: newEvent.description || undefined,
        color: newEvent.color,
      };

      updatedWeekData = weekData.map(day => {
        if (day.fullDate.getTime() === selectedDay.fullDate.getTime()) {
          return {
            ...day,
            activities: [...day.activities, eventToAdd]
          };
        }
        return day;
      });
    }

    setWeekData(updatedWeekData);
    
    const updatedSelectedDay = updatedWeekData.find(
      day => day.fullDate.getTime() === selectedDay.fullDate.getTime()
    );
    if (updatedSelectedDay) {
      setSelectedDay(updatedSelectedDay);
    }

    if (editingEvent) {
      closeEditEvent();
      Alert.alert('Succès', 'Événement modifié avec succès !');
    } else {
      closeAddEvent();
      Alert.alert('Succès', 'Événement ajouté avec succès !');
    }
  };

  const handleConnectCalendar = () => {
    Alert.alert('Google Calendar', 'Fonctionnalité de connexion à venir');
  };

  const renderActivity = (activity: Activity) => (
    <View key={activity.id} style={[styles.activity, { backgroundColor: activity.color }]}>
      <Text style={styles.activityText}>{activity.title}</Text>
    </View>
  );

  const renderDayViewActivity = (activity: Activity) => (
    <TouchableOpacity key={activity.id} style={[
      styles.dayViewActivity,
      { backgroundColor: isDarkMode ? '#374151' : '#FFFFFF' }
    ]} activeOpacity={0.7}>
      <View style={[styles.activityColorBar, { backgroundColor: activity.color }]} />
      <View style={styles.activityContent}>
        <Text style={[styles.activityTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          {activity.title}
        </Text>
        {activity.startTime && activity.endTime && (
          <View style={styles.activityTime}>
            <Clock size={14} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
            <Text style={[styles.activityTimeText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {activity.startTime} - {activity.endTime}
            </Text>
          </View>
        )}
        {activity.location && (
          <View style={styles.activityLocation}>
            <MapPin size={14} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
            <Text style={[styles.activityLocationText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {activity.location}
            </Text>
          </View>
        )}
        {activity.description && (
          <Text style={[styles.activityDescription, { color: isDarkMode ? '#D1D5DB' : '#2E2E2E' }]}>
            {activity.description}
          </Text>
        )}
      </View>
      <View style={styles.activityActions}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: isDarkMode ? '#4B5563' : '#F9FAFB' }]}
          onPress={() => openEditEvent(activity)}
          activeOpacity={0.7}
        >
          <Edit3 size={18} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton, { backgroundColor: isDarkMode ? '#7F1D1D' : '#FEF2F2' }]}
          onPress={() => deleteEvent(activity.id)}
          activeOpacity={0.7}
        >
          <Trash2 size={18} color="#DC2626" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const eventColors = [
    { color: '#FFD840', name: 'Jaune solaire' },
    { color: '#F6BE00', name: 'Jaune foncé' },
    { color: '#4F46E5', name: 'Indigo' },
    { color: '#059669', name: 'Vert' },
    { color: '#DC2626', name: 'Rouge' },
    { color: '#7C3AED', name: 'Violet' },
  ];

  const renderDay = (dayData: DayData) => {
    return (
      <TouchableOpacity
        key={dayData.day}
        onPress={() => handleDayPress(dayData)}
        activeOpacity={0.7}
        style={[
          styles.dayCard,
          dayData.isToday && styles.todayCard,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : (dayData.isToday ? '#FFD840' : 'transparent')
          }
        ]}
      >
        <Text style={[styles.dayName, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
          {dayData.day}
        </Text>
        <Text style={[styles.dayDate, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
          {dayData.date}
        </Text>
        <View style={styles.activitiesContainer}>
          {dayData.activities.slice(0, 2).map(renderActivity)}
          {dayData.activities.length > 2 && (
            <Text style={[styles.moreActivities, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              +{dayData.activities.length - 2} autres
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
            Mon Planning
          </Text>
        </View>

        {/* Google Calendar Section */}
        <View style={[
          styles.calendarSection,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : 'transparent'
          }
        ]}>
          <View style={styles.calendarInfo}>
            <Calendar size={20} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
            <Text style={[styles.calendarText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              Google Calendar
            </Text>
          </View>
          <TouchableOpacity style={styles.connectButton} onPress={handleConnectCalendar}>
            <Text style={styles.connectButtonText}>Connecter</Text>
          </TouchableOpacity>
        </View>

        {/* Week Navigation */}
        <View style={[
          styles.weekNavigation,
          { 
            backgroundColor: isDarkMode ? '#374151' : '#FFFFFF',
            borderColor: isDarkMode ? '#4B5563' : 'transparent'
          }
        ]}>
          <TouchableOpacity onPress={() => navigateWeek('prev')} activeOpacity={0.7}>
            <ChevronLeft size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.weekInfo}>
            <Text style={[styles.weekTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
              {currentWeek}
            </Text>
            <Text style={styles.todayIndicator}>Aujourd'hui</Text>
          </View>
          <TouchableOpacity onPress={() => navigateWeek('next')} activeOpacity={0.7}>
            <ChevronRight size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {weekData.map(renderDay)}
        </View>
      </ScrollView>

      {/* Day View Modal */}
      <Modal
        visible={isDayViewVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeDayView}
      >
        <SafeAreaView style={[styles.dayViewContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.dayViewHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.dayViewHeaderLeft}>
              <Text style={[styles.dayViewTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                {selectedDay?.day} {selectedDay?.date}
              </Text>
              <Text style={[styles.dayViewSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                {selectedDay?.activities.length || 0} événement(s)
              </Text>
            </View>
            <TouchableOpacity onPress={closeDayView} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.dayViewContent} showsVerticalScrollIndicator={false}>
            {selectedDay?.activities.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={48} color={isDarkMode ? '#D1D5DB' : '#6B7280'} strokeWidth={1.5} />
                <Text style={[styles.emptyStateTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Aucun événement
                </Text>
                <Text style={[styles.emptyStateText, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                  Vous n'avez aucun événement prévu pour cette journée.
                </Text>
                <TouchableOpacity 
                  style={[styles.addEventButton, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]} 
                  onPress={() => setIsAddEventVisible(true)}
                >
                  <Plus size={20} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
                  <Text style={[styles.addEventButtonText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Ajouter un événement
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.activitiesList}>
                {selectedDay?.activities
                  .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                  .map(renderDayViewActivity)}
              </View>
            )}
          </ScrollView>

          {selectedDay?.activities.length > 0 && (
            <View style={[styles.dayViewFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
              <TouchableOpacity 
                style={[styles.addEventButtonFixed, { backgroundColor: isDarkMode ? '#374151' : '#FFD840' }]} 
                onPress={() => setIsAddEventVisible(true)}
              >
                <Plus size={20} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
                <Text style={[styles.addEventButtonText, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Ajouter un événement
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        visible={isAddEventVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeAddEvent}
      >
        <SafeAreaView style={[styles.addEventContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.addEventHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.addEventHeaderLeft}>
              <Text style={[styles.addEventTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Nouvel événement
              </Text>
              <Text style={[styles.addEventSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                {selectedDay?.day} {selectedDay?.date}
              </Text>
            </View>
            <TouchableOpacity onPress={closeAddEvent} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.addEventContent} showsVerticalScrollIndicator={false}>
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
                placeholder="Ex: Cours de mathématiques"
                placeholderTextColor="#9CA3AF"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({...newEvent, title: text})}
                maxLength={50}
              />
            </View>

            {/* Time Fields */}
            <View style={styles.timeContainer}>
              <View style={styles.timeField}>
                <View style={styles.fieldHeader}>
                  <Clock size={20} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Début
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
                  placeholder="09:00"
                  placeholderTextColor="#9CA3AF"
                  value={newEvent.startTime}
                  onChangeText={(text) => setNewEvent({...newEvent, startTime: text})}
                  maxLength={5}
                />
              </View>
              <View style={styles.timeField}>
                <View style={styles.fieldHeader}>
                  <Clock size={20} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Fin
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
                  placeholder="10:30"
                  placeholderTextColor="#9CA3AF"
                  value={newEvent.endTime}
                  onChangeText={(text) => setNewEvent({...newEvent, endTime: text})}
                  maxLength={5}
                />
              </View>
            </View>

            {/* Location Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <MapPin size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Lieu
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
                placeholder="Ex: Amphithéâtre A, Salle 204"
                placeholderTextColor="#9CA3AF"
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({...newEvent, location: text})}
                maxLength={100}
              />
            </View>

            {/* Description Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <User size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Description
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput, 
                  styles.textArea,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="Détails supplémentaires..."
                placeholderTextColor="#9CA3AF"
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Color Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Couleur
              </Text>
              <View style={styles.colorGrid}>
                {eventColors.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: colorOption.color },
                      newEvent.color === colorOption.color && styles.selectedColor
                    ]}
                    onPress={() => setNewEvent({...newEvent, color: colorOption.color})}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.addEventFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveEvent}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer l'événement</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        visible={isEditEventVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditEvent}
      >
        <SafeAreaView style={[styles.addEventContainer, { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }]}>
          <View style={[styles.addEventHeader, { borderBottomColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <View style={styles.addEventHeaderLeft}>
              <Text style={[styles.addEventTitle, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Modifier l'événement
              </Text>
              <Text style={[styles.addEventSubtitle, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                {selectedDay?.day} {selectedDay?.date}
              </Text>
            </View>
            <TouchableOpacity onPress={closeEditEvent} style={styles.closeButton}>
              <X size={24} color={isDarkMode ? '#F9FAFB' : '#2E2E2E'} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.addEventContent} showsVerticalScrollIndicator={false}>
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
                placeholder="Ex: Cours de mathématiques"
                placeholderTextColor="#9CA3AF"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent({...newEvent, title: text})}
                maxLength={50}
              />
            </View>

            {/* Time Fields */}
            <View style={styles.timeContainer}>
              <View style={styles.timeField}>
                <View style={styles.fieldHeader}>
                  <Clock size={20} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Début
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
                  placeholder="09:00"
                  placeholderTextColor="#9CA3AF"
                  value={newEvent.startTime}
                  onChangeText={(text) => setNewEvent({...newEvent, startTime: text})}
                  maxLength={5}
                />
              </View>
              <View style={styles.timeField}>
                <View style={styles.fieldHeader}>
                  <Clock size={20} color="#6B7280" strokeWidth={2} />
                  <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                    Fin
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
                  placeholder="10:30"
                  placeholderTextColor="#9CA3AF"
                  value={newEvent.endTime}
                  onChangeText={(text) => setNewEvent({...newEvent, endTime: text})}
                  maxLength={5}
                />
              </View>
            </View>

            {/* Location Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <MapPin size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Lieu
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
                placeholder="Ex: Amphithéâtre A, Salle 204"
                placeholderTextColor="#9CA3AF"
                value={newEvent.location}
                onChangeText={(text) => setNewEvent({...newEvent, location: text})}
                maxLength={100}
              />
            </View>

            {/* Description Field */}
            <View style={styles.formGroup}>
              <View style={styles.fieldHeader}>
                <User size={20} color="#6B7280" strokeWidth={2} />
                <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                  Description
                </Text>
              </View>
              <TextInput
                style={[
                  styles.textInput, 
                  styles.textArea,
                  { 
                    backgroundColor: isDarkMode ? '#374151' : '#F9FAFB',
                    borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    color: isDarkMode ? '#F9FAFB' : '#2E2E2E'
                  }
                ]}
                placeholder="Détails supplémentaires..."
                placeholderTextColor="#9CA3AF"
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            {/* Color Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.fieldLabel, { color: isDarkMode ? '#F9FAFB' : '#2E2E2E' }]}>
                Couleur
              </Text>
              <View style={styles.colorGrid}>
                {eventColors.map((colorOption) => (
                  <TouchableOpacity
                    key={colorOption.color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: colorOption.color },
                      newEvent.color === colorOption.color && styles.selectedColor
                    ]}
                    onPress={() => setNewEvent({...newEvent, color: colorOption.color})}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.addEventFooter, { borderTopColor: isDarkMode ? '#4B5563' : '#F3F4F6' }]}>
            <TouchableOpacity style={styles.saveButton} onPress={saveEvent}>
              <Save size={20} color="#2E2E2E" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Enregistrer l'événement</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  calendarSection: {
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
  calendarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  connectButton: {
    backgroundColor: '#FFD840',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#2E2E2E',
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
    fontSize: 14,
  },
  weekNavigation: {
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
  weekInfo: {
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 16,
    fontFamily: 'Manrope-Bold',
    marginBottom: 4,
  },
  todayIndicator: {
    fontSize: 12,
    color: '#F6BE00',
    fontFamily: 'Inter-Regular',
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  dayCard: {
    width: (width - 32) / 2 - 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#FFD840',
  },
  dayName: {
    fontSize: 14,
    fontFamily: 'Manrope-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 12,
  },
  activitiesContainer: {
    gap: 6,
  },
  activity: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  activityText: {
    color: '#2E2E2E',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  moreActivities: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  // Day View Modal Styles
  dayViewContainer: {
    flex: 1,
  },
  dayViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  dayViewHeaderLeft: {
    flex: 1,
  },
  dayViewTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  dayViewSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  closeButton: {
    padding: 8,
  },
  dayViewContent: {
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
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addEventButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    fontWeight: '600',
  },
  // Add Event Modal Styles
  addEventContainer: {
    flex: 1,
  },
  addEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  addEventHeaderLeft: {
    flex: 1,
  },
  addEventTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  addEventSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  addEventContent: {
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  timeField: {
    flex: 1,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#2E2E2E',
    borderWidth: 3,
  },
  addEventFooter: {
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
  activitiesList: {
    paddingVertical: 20,
  },
  dayViewActivity: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityColorBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  activityContent: {
    flex: 1,
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'Manrope-Bold',
    marginBottom: 8,
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  activityTimeText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  activityLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityLocationText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingVertical: 16,
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {},
  dayViewFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  addEventButtonFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
});
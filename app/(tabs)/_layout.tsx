import { Tabs } from 'expo-router';
import { House, DollarSign, SquareCheck as CheckSquare, Calendar, FileText } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler, 
  withSpring, 
  runOnJS 
} from 'react-native-reanimated';
import { Dimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const tabs = [
  { name: 'home', route: '/(tabs)/home' },
  { name: 'finance', route: '/(tabs)/finance' },
  { name: 'tasks', route: '/(tabs)/tasks' },
  { name: 'planning', route: '/(tabs)/planning' },
  { name: 'documents', route: '/(tabs)/documents' },
];

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const translateX = useSharedValue(0);
  const containerTranslateX = useSharedValue(0);
  
  const navigateToTab = (index: number) => {
    if (index >= 0 && index < tabs.length) {
      setCurrentIndex(index);
      containerTranslateX.value = withSpring(-index * SCREEN_WIDTH, {
        damping: 20,
        stiffness: 90,
      });
      router.push(tabs[index].route as any);
    }
  };

  useEffect(() => {
    containerTranslateX.value = withSpring(-currentIndex * SCREEN_WIDTH, {
      damping: 20,
      stiffness: 90,
    });
  }, [currentIndex]);
  
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
      context.startContainerX = containerTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      
      // Coulissement progressif du conteneur
      const newTranslateX = context.startContainerX + event.translationX;
      const minTranslateX = -(tabs.length - 1) * SCREEN_WIDTH;
      const maxTranslateX = 0;
      
      // Limiter le déplacement aux bornes
      containerTranslateX.value = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
    },
    onEnd: (event) => {
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD && event.velocityX < -500;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD && event.velocityX > 500;
      
      if (shouldSwipeLeft) {
        // Swipe vers la gauche - module suivant
        const nextIndex = currentIndex + 1;
        if (nextIndex < tabs.length) {
          runOnJS(navigateToTab)(nextIndex);
        } else {
          // Retour à la position actuelle si on ne peut pas aller plus loin
          containerTranslateX.value = withSpring(-currentIndex * SCREEN_WIDTH, {
            damping: 20,
            stiffness: 90,
          });
        }
      } else if (shouldSwipeRight) {
        // Swipe vers la droite - module précédent
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          runOnJS(navigateToTab)(prevIndex);
        } else {
          // Retour à la position actuelle si on ne peut pas aller plus loin
          containerTranslateX.value = withSpring(-currentIndex * SCREEN_WIDTH, {
            damping: 20,
            stiffness: 90,
          });
        }
      } else {
        // Retour à la position actuelle si le swipe n'est pas assez fort
        containerTranslateX.value = withSpring(-currentIndex * SCREEN_WIDTH, {
          damping: 20,
          stiffness: 90,
        });
      }
      
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    },
  });
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: containerTranslateX.value }],
    };
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <Animated.View style={[
            { 
              flex: 1,
              flexDirection: 'row',
              width: SCREEN_WIDTH * tabs.length,
            }, 
            containerAnimatedStyle
          ]}>
            {tabs.map((tab, index) => (
              <View key={tab.name} style={{ width: SCREEN_WIDTH, flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: isDarkMode ? '#374151' : '#E5E7EB',
                paddingBottom: 8,
                paddingTop: 8,
                height: 70,
              },
              tabBarActiveTintColor: '#FCD34D',
              tabBarInactiveTintColor: isDarkMode ? '#9CA3AF' : '#6B7280',
              tabBarLabelStyle: {
                fontSize: 0,
              },
              swipeEnabled: false, // Désactivé car on gère manuellement
              animationEnabled: true,
            }}>
            <Tabs.Screen
              name="home"
              options={{
                title: 'Accueil',
                tabBarIcon: ({ size, color }) => (
                  <House size={size} color={color} strokeWidth={2} />
                ),
              }}
            />
            <Tabs.Screen
              name="finance"
              options={{
                title: 'Finance',
                tabBarIcon: ({ size, color }) => (
                  <DollarSign size={size} color={color} strokeWidth={2} />
                ),
              }}
            />
            <Tabs.Screen
              name="tasks"
              options={{
                title: 'Tâches',
                tabBarIcon: ({ size, color }) => (
                  <CheckSquare size={size} color={color} strokeWidth={2} />
                ),
              }}
            />
            <Tabs.Screen
              name="planning"
              options={{
                title: 'Planning',
                tabBarIcon: ({ size, color }) => (
                  <Calendar size={size} color={color} strokeWidth={2} />
                ),
              }}
            />
            <Tabs.Screen
              name="documents"
              options={{
                title: 'Documents',
                tabBarIcon: ({ size, color }) => (
                  <FileText size={size} color={color} strokeWidth={2} />
                ),
              }}
            />
          </Tabs>
              </View>
            ))}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}
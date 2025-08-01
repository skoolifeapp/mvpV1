import { Tabs } from 'expo-router';
import { House, DollarSign, SquareCheck as CheckSquare, Calendar, FileText } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#FCD34D',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 0,
        },
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
  );
}
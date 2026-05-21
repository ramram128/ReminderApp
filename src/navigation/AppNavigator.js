import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ReminderDetailsScreen from '../screens/ReminderDetailsScreen';
import AboutDeveloperScreen from '../screens/AboutDeveloperScreen';
import AlarmScreen from '../screens/AlarmScreen';
import { notificationService } from '../services/notificationService';
import { navigationRef } from './navigationUtils';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ initialRouteName = 'Home', initialParams = null }) => {
  useEffect(() => {
    // Handle foreground notification interaction
    const unsubscribe = notificationService.setupListeners((notification) => {
      handleNotificationNavigation(notification);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationNavigation = (notification) => {
    console.log('Handling foreground/background notification navigation:', notification?.data);
    if (notification && notification.data && notification.data.message) {
      const { type, message, scheduledTime, createdTime } = notification.data;
      
      const screenName = type === 'custom_alarm' ? 'Alarm' : 'ReminderDetails';
      const params = type === 'custom_alarm' ? {
        message: message,
        notificationId: notification.id,
        timestamp: scheduledTime,
      } : {
        message: message,
        type: type,
        scheduledTime: scheduledTime,
        createdTime: createdTime,
      };

      if (navigationRef.isReady()) {
        navigationRef.navigate(screenName, params);
      }
    }
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F8FAFC',
          },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontWeight: '700',
            color: '#111827',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Reminder App' }}
        />
        <Stack.Screen 
          name="ReminderDetails" 
          component={ReminderDetailsScreen} 
          initialParams={initialRouteName === 'ReminderDetails' ? initialParams : null}
          options={{ title: 'Reminder Details' }}
        />
        <Stack.Screen 
          name="AboutDeveloper" 
          component={AboutDeveloperScreen} 
          options={{ 
            title: 'About Developer',
            presentation: 'modal'
          }}
        />
        <Stack.Screen 
          name="Alarm" 
          component={AlarmScreen} 
          initialParams={initialRouteName === 'Alarm' ? initialParams : null}
          options={{ 
            headerShown: false,
            animation: 'fade'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

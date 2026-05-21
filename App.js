import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import notifee from '@notifee/react-native';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [initialNavigation, setInitialNavigation] = useState({
    route: 'Home',
    params: null,
    isReady: false,
  });

  useEffect(() => {
    const checkInitialNotification = async () => {
      try {
        const initialNotification = await notifee.getInitialNotification();
        
        if (initialNotification && initialNotification.notification && initialNotification.notification.data) {
          const { type, message, scheduledTime, createdTime } = initialNotification.notification.data;
          
          if (type === 'custom_alarm') {
            setInitialNavigation({
              route: 'Alarm',
              params: {
                message,
                notificationId: initialNotification.notification.id,
                timestamp: scheduledTime,
              },
              isReady: true,
            });
          } else {
            setInitialNavigation({
              route: 'ReminderDetails',
              params: {
                message,
                type,
                scheduledTime,
                createdTime,
              },
              isReady: true,
            });
          }
        } else {
          // Normal app launch
          setInitialNavigation({
            route: 'Home',
            params: null,
            isReady: true,
          });
        }
      } catch (error) {
        console.error('Error checking initial notification:', error);
        setInitialNavigation({ route: 'Home', params: null, isReady: true });
      }
    };

    checkInitialNotification();
  }, []);

  if (!initialNavigation.isReady) {
    return null; // Or a splash screen
  }

  return (
    <SafeAreaProvider>
      <AppNavigator 
        initialRouteName={initialNavigation.route}
        initialParams={initialNavigation.params}
      />
    </SafeAreaProvider>
  );
};

export default App;

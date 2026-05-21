/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Handle background notifications
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  // Check if the user pressed the notification
  if (type === EventType.PRESS && pressAction.id === 'default') {
    // The app will open automatically, and we'll handle the notification in App.js/AppNavigator.js
    console.log('User pressed notification in background', notification.data);
  }
});

// Register foreground service for alarms to work when app is killed
notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    console.log('Background foreground service started for alarm', notification.id);
  });
});

AppRegistry.registerComponent(appName, () => App);

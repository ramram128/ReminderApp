import notifee, {
  AndroidImportance,
  TriggerType,
  TriggerAccuracy,
  EventType,
  AndroidPermissionStatus,
  AndroidCategory,
  AndroidGroupAlertBehavior
} from '@notifee/react-native';
import { Platform, Alert } from 'react-native';

class NotificationService {
  constructor() {
    this.bootstrap();
  }

  async bootstrap() {
    // Request permissions for Android 13+ and iOS
    await this.requestPermission();

    // Create default channel for Android
    // Create default channel for Android
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'reminders',
        name: 'Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
      });

      // Create MAX-importance ALARM channel with system default sound
      await notifee.createChannel({
        id: 'alarm',
        name: 'Alarms',
        importance: AndroidImportance.MAX, // Upgraded to MAX
        sound: 'default', // Using system default alarm sound
        vibration: true,
        vibrationPattern: [300, 500, 300, 500],
      });
    }
  }

  async requestPermission() {
    // 1. Basic notification permission
    const settings = await notifee.requestPermission();

    if (Platform.OS === 'android') {
      // Check and prompt for system alert window permission (Display over other apps)
      if (Platform.OS === 'android' && typeof notifee.isAndroidConfiguredForFullScreenIntent === 'function') {
        const canDrawOverOtherApps = await notifee.isAndroidConfiguredForFullScreenIntent();
        if (!canDrawOverOtherApps) {
          Alert.alert(
            'Action Required: Full Screen Alarm',
            'To allow the alarm to pop up automatically on Android 14, please enable "Allow full screen intents" in the next screen.\n\nSearch for "Manage full screen intents" if prompted.',
            [
              { text: 'Later' },
              { text: 'Open Settings', onPress: () => notifee.openAlarmSettings() }
            ]
          );
        }
      }

      // 2. Check for Exact Alarm permission (Android 12/13/14+)
      const androidSettings = await notifee.getNotificationSettings();
      if (androidSettings.android.alarm === 0) { // 0 = DENIED
        Alert.alert(
          'Permission Required',
          'This app needs "Alarm & Reminders" permission to show notifications on time. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => notifee.openAlarmSettings() }
          ]
        );
      }

      // 3. Check for Battery Optimization
      const batteryOptimizationEnabled = await notifee.isBatteryOptimizationEnabled();
      if (batteryOptimizationEnabled) {
        Alert.alert(
          'Battery Optimization',
          'To ensure reminders work in the background, please disable battery optimization for this app.',
          [
            { text: 'Later', style: 'cancel' },
            { text: 'Open Settings', onPress: () => notifee.openBatteryOptimizationSettings() }
          ]
        );
      }
    }

    return settings.authorizationStatus >= 1;
  }

  async displayImmediateNotification() {
    await notifee.displayNotification({
      title: 'Reminder Set',
      body: 'Your reminder has been scheduled successfully.',
      android: {
        channelId: 'reminders',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  }

  /**
   * Schedule a notification for a specific time
   * @param {string} message The reminder message
   * @param {Date} triggerTime The Date object when the notification should trigger
   * @param {string} type The type of reminder ('30_second' or 'custom_alarm')
   */
  async scheduleReminder(message, triggerTime, type = '30_second') {
    if (!(triggerTime instanceof Date)) {
      triggerTime = new Date(triggerTime);
    }

    const timestamp = triggerTime.getTime();
    console.log(`[DEBUG] Scheduling reminder for ${triggerTime.toISOString()} (${timestamp})`);
    console.log(`[DEBUG] Current time: ${new Date().toISOString()} (${Date.now()})`);

    if (timestamp <= Date.now()) {
      throw new Error('Scheduled time must be in the future');
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: timestamp,
      alarmManager: {
        allowWhileIdle: true,
      },
      accuracy: TriggerAccuracy.EXACT,
    };

    try {
      const notificationId = `${type}_${timestamp}`;
      const isAlarm = type === 'custom_alarm';

      await notifee.createTriggerNotification(
        {
          id: notificationId,
          title: isAlarm ? '🚨 ALARM 🚨Click Me...' : '🔔 Quick Reminder',
          body: isAlarm ? `TIME UP: ${message}` : 'You have a reminder. Click to view it.',
          data: {
            message: message,
            type: type,
            scheduledTime: triggerTime.toISOString(),
            createdTime: new Date().toISOString(),
          },
          android: {
            channelId: isAlarm ? 'alarm' : 'reminders',
            importance: isAlarm ? AndroidImportance.MAX : AndroidImportance.HIGH,
            priority: isAlarm ? 1 : 0, // 1 is high/max for priority
            category: isAlarm ? AndroidCategory.ALARM : undefined,
            visibility: 1, // Public
            pressAction: {
              id: 'default',
              launchActivity: 'default',
            },
            fullScreenAction: isAlarm ? {
              id: 'default',
              launchActivity: 'default',
            } : undefined,
            loopSound: isAlarm,
            sound: 'default',
            vibrationPattern: isAlarm ? [300, 500, 300, 500] : undefined,
            lightUpScreen: isAlarm,
            ongoing: isAlarm,
            autoCancel: false, // Don't dismiss automatically for alarms
            asAlarmClock: isAlarm, // Important for real alarm behavior
            // Add foreground service for maximum reliability
            foregroundService: isAlarm,
          },
          ios: {
            sound: 'default',
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
          },
        },
        trigger,
      );
      console.log(`[DEBUG] ${type} notification created successfully for ${timestamp}`);
      // Check and prompt for system alert window permission (Display over other apps)
      const settings = await notifee.getNotificationSettings();
      // Check and prompt for system alert window permission (Display over other apps)
      if (Platform.OS === 'android' && typeof notifee.isAndroidConfiguredForFullScreenIntent === 'function') {
        const canDrawOverOtherApps = await notifee.isAndroidConfiguredForFullScreenIntent();
        if (!canDrawOverOtherApps) {
          Alert.alert(
            'Alarm Setup Incomplete',
            'On Android 14, you MUST allow "Full screen intents" for the alarm to wake your phone.\n\nPlease enable it in: Settings > Apps > Special app access > Manage full screen intents.',
            [
              { text: 'Later' },
              { text: 'Open Settings', onPress: () => notifee.openAlarmSettings() }
            ]
          );
        }
      }
    } catch (error) {
      console.error('[DEBUG] Failed to create trigger notification:', error);
      throw error;
    }
  }

  // Set up listeners for notification events
  setupListeners(onNotificationOpen) {
    // Foreground events
    const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        onNotificationOpen(detail.notification);
      }
    });

    // Register foreground service for alarms
    notifee.registerForegroundService((notification) => {
      return new Promise(() => {
        // This service will keep running while the alarm is active
        // The sound and looping are handled by the system because of the channel/category
        console.log('Foreground service started for alarm', notification.id);
      });
    });

    // Background events are handled in index.js via notifee.onBackgroundEvent
    return unsubscribeForeground;
  }

  async getInitialNotification() {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      return initialNotification.notification;
    }
    return null;
  }
}

export const notificationService = new NotificationService();

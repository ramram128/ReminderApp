import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import notifee from '@notifee/react-native';
import { notificationService } from '../services/notificationService';

const AlarmScreen = ({ route, navigation }) => {
  const { message, notificationId, timestamp } = route.params || {};
  const [currentTime, setCurrentTime] = useState(new Date());
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Clock timer
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      clearInterval(timer);
      pulse.stop();
    };
  }, []);

  const handleStop = async () => {
    // 1. Cancel the specific notification (stops sound)
    if (notificationId) {
      await notifee.cancelNotification(notificationId);
    }
    // 2. Navigate back to home
    navigation.replace('Home');
  };

  const handleSnooze = async () => {
    // 1. Cancel current notification
    if (notificationId) {
      await notifee.cancelNotification(notificationId);
    }
    // 2. Schedule a new one for 5 minutes later
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);
    await notificationService.scheduleReminder(message, snoozeTime, 'custom_alarm');

    // 3. Go back to home
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <View style={styles.content}>
        <Text style={styles.timeText}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>

        <View style={styles.pulseContainer}>
          <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
            <Ionicons name="alarm" size={80} color="#FFFFFF" />
          </Animated.View>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.alarmLabel}>ALARM</Text>
          <Text style={styles.messageText}>{message || 'Wake up!'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.snoozeButton]}
            onPress={handleSnooze}
          >
            <Text style={styles.snoozeText}>SNOOZE</Text>
            <Text style={styles.snoozeSubtext}>5 minutes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.stopButton]}
            onPress={handleStop}
          >
            <Ionicons name="close" size={32} color="#FFFFFF" />
            <Text style={styles.stopText}>STOP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Deep dark background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 60,
  },
  timeText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(79, 70, 229, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  messageContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alarmLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 4,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 30,
    gap: 20,
  },
  actionButton: {
    flex: 1,
    height: 100,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snoozeButton: {
    backgroundColor: '#334155',
  },
  snoozeText: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
  },
  snoozeSubtext: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  stopButton: {
    backgroundColor: '#EF4444', // Danger red
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  stopText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
});

export default AlarmScreen;

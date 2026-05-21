import React, { useState, useLayoutEffect, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '../components/CustomButton';
import { notificationService } from '../services/notificationService';
import { storageService } from '../services/storageService';

const ReminderItem = React.memo(({ item, onDelete }) => (
  <View style={styles.reminderCard}>
    <View style={styles.reminderHeader}>
      <View style={styles.bellIconContainer}>
        <Ionicons name="notifications" size={18} color="#4F46E5" />
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>

    <Text style={styles.reminderMessage} numberOfLines={2}>
      {item.message}
    </Text>

    <View style={styles.reminderFooter}>
      <View style={styles.footerItem}>
        <Ionicons name="alarm-outline" size={14} color="#64748B" />
        <Text style={styles.footerText}>
          {new Date(item.customReminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.footerItem}>
        <Ionicons name="calendar-outline" size={14} color="#64748B" />
        <Text style={styles.footerText}>
          {new Date(item.customReminderTime).toLocaleDateString()}
        </Text>
      </View>
    </View>
  </View>
));

const HomeScreen = ({ navigation }) => {
  const [reminder, setReminder] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminders, setReminders] = useState([]);

  const REMINDER_DELAY = 30000; // 30 seconds in milliseconds

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.devIconContainer}
          onPress={() => navigation.navigate('AboutDeveloper')}
        >
          <Text style={styles.devIconText}>PR</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <Ionicons name="notifications-outline" size={24} color="#4F46E5" />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const data = await storageService.getReminders();
    setReminders(data);
  };

  const handleDeleteReminder = async (id) => {
    try {
      const updated = await storageService.deleteReminder(id);
      setReminders(updated);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete reminder');
    }
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      const newDate = new Date(selectedDate);
      newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      setSelectedDate(newDate);
    }
  };

  const onTimeChange = (event, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours(), time.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const handleSetReminder = async () => {
    if (!reminder.trim()) {
      Alert.alert('Error', 'Please enter a reminder message');
      return;
    }

    try {
      // 1. Calculate trigger times
      const triggerTime30s = new Date(Date.now() + REMINDER_DELAY);
      const customTriggerTime = selectedDate;

      console.log('[DEBUG] 30s Trigger Time:', triggerTime30s);
      console.log('[DEBUG] Custom Trigger Time:', customTriggerTime);

      if (customTriggerTime <= new Date()) {
        Alert.alert('Error', 'Custom alarm time must be in the future');
        return;
      }

      // 2. Immediate notification to confirm
      await notificationService.displayImmediateNotification();

      // 3. Schedule 30-second reminder (assessment requirement)
      await notificationService.scheduleReminder(reminder, triggerTime30s, '30_second');

      // 4. Schedule custom alarm reminder
      await notificationService.scheduleReminder(reminder, customTriggerTime, 'custom_alarm');

      // 5. Save to local storage
      const newReminder = {
        id: Date.now().toString(),
        message: reminder,
        createdTime: new Date().toISOString(),
        customReminderTime: customTriggerTime.toISOString(),
        status: 'scheduled'
      };
      const updatedReminders = await storageService.saveReminder(newReminder);
      setReminders(updatedReminders);

      setReminder('');
      Alert.alert(
        'Success',
        'Reminders scheduled and saved! You will get one in 30 seconds and another at the selected time.'
      );
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Failed to schedule reminder');
    }
  };

  const homeHeader = useMemo(() => (
    <View>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Stay Notified</Text>
        <Text style={styles.welcomeSubtitle}>Create your reminder and we'll notify you.</Text>
      </View>

      <View style={[styles.card, isFocused && styles.cardFocused]}>
        <Text style={styles.label}>Reminder Message</Text>
        <TextInput
          style={styles.input}
          placeholder="What do you want to be reminded about?"
          placeholderTextColor="#94A3B8"
          value={reminder}
          onChangeText={setReminder}
          multiline
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <Text style={styles.label}>Select Custom Alarm Time</Text>
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
            <Text style={styles.dateTimeText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#4F46E5" />
            <Text style={styles.dateTimeText}>
              {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}

        <CustomButton
          title="Set Reminder"
          onPress={handleSetReminder}
          style={styles.button}
        />
      </View>

      <Text style={styles.sectionTitle}>Previous Reminders</Text>
    </View>
  ), [reminder, isFocused, selectedDate, showDatePicker, showTimePicker]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReminderItem item={item} onDelete={handleDeleteReminder} />}
          ListHeaderComponent={homeHeader}
          contentContainerStyle={styles.scrollContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No reminders yet</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  headerLeft: {
    marginLeft: 16,
  },
  devIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  devIconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  welcomeContainer: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardFocused: {
    borderColor: '#4F46E5',
    shadowOpacity: 0.1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#1E293B',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  button: {
    marginTop: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 40,
    marginBottom: 20,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bellIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  statusBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  deleteButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  reminderMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    lineHeight: 22,
  },
  reminderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

export default HomeScreen;

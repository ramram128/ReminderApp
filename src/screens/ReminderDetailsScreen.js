import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReminderDetailsScreen = ({ route }) => {
  const { message, scheduledTime, createdTime, type } = route.params || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="time" size={40} color="#4F46E5" />
          </View>
        </View>

        <Text style={styles.title}>Reminder Details</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Message</Text>
          <Text style={styles.messageText}>{message || 'No message provided'}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.timeRow}>
            <View>
              <Text style={styles.smallLabel}>Created At</Text>
              <Text style={styles.timeValue}>{formatDate(createdTime)}</Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View>
              <Text style={styles.smallLabel}>Reminder Type</Text>
              <Text style={[styles.timeValue, styles.typeValue]}>
                {type === '30_second' ? 'Quick Reminder (30s)' : 'Scheduled Alarm'}
              </Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View>
              <Text style={styles.smallLabel}>Scheduled For</Text>
              <Text style={styles.timeValue}>{formatDate(scheduledTime)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 28,
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  smallLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  typeValue: {
    color: '#4F46E5',
    textTransform: 'capitalize',
  },
});

export default ReminderDetailsScreen;

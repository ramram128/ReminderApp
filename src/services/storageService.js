import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDERS_KEY = 'REMINDERS';

class StorageService {
  /**
   * Get all reminders sorted by newest first
   */
  async getReminders() {
    try {
      const data = await AsyncStorage.getItem(REMINDERS_KEY);
      if (!data) return [];
      
      const reminders = JSON.parse(data);
      // Sort by createdTime newest first
      return reminders.sort((a, b) => 
        new Date(b.createdTime) - new Date(a.createdTime)
      );
    } catch (error) {
      console.error('Failed to load reminders:', error);
      return [];
    }
  }

  /**
   * Save a new reminder
   */
  async saveReminder(reminder) {
    try {
      const reminders = await this.getReminders();
      const newReminders = [reminder, ...reminders];
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(newReminders));
      return newReminders;
    } catch (error) {
      console.error('Failed to save reminder:', error);
      throw error;
    }
  }

  /**
   * Delete a reminder by ID
   */
  async deleteReminder(id) {
    try {
      const reminders = await this.getReminders();
      const filteredReminders = reminders.filter(r => r.id !== id);
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(filteredReminders));
      return filteredReminders;
    } catch (error) {
      console.error('Failed to delete reminder:', error);
      throw error;
    }
  }

  /**
   * Update reminder status (e.g., from 'scheduled' to 'completed')
   */
  async updateReminderStatus(id, status) {
    try {
      const reminders = await this.getReminders();
      const updatedReminders = reminders.map(r => 
        r.id === id ? { ...r, status } : r
      );
      await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(updatedReminders));
      return updatedReminders;
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../components/CustomButton';

const AboutDeveloperScreen = ({ navigation }) => {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profileInitials}>PR</Text>
          </View>
        </View>

        <Text style={styles.name}>PrakashRam J</Text>
        <Text style={styles.role}>React Native Developer</Text>

        <View style={styles.bioContainer}>
          <Text style={styles.bio}>
            Motivated and enthusiastic B.Tech IT graduate with hands-on experience in frontend, full stack, and mobile app development. Skilled in React Native, web technologies, and UI-focused application development. Passionate about building user-friendly applications, learning new technologies, and solving real-world problems through software development.
          </Text>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink('https://github.com/ramram128/')}
          >
            <Ionicons name="logo-github" size={24} color="#111827" />
            <Text style={styles.socialText}>GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openLink('https://www.linkedin.com/in/prakashram-j-prakashram-j/')}
          >
            <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
            <Text style={styles.socialText}>LinkedIn</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title="Back to App"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 32,
  },
  bioContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  bio: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  socialText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  backButton: {
    width: '100%',
  },
});

export default AboutDeveloperScreen;

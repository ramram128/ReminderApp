# 🔔 ReminderApp

A production-ready **Reminder & Alarm application** built with **React Native CLI**, featuring local push notifications that work even when the app is killed.

---

## ✨ Features

| Feature | Description |
|---|---|
| **30-Second Quick Reminder** | Schedules a reminder notification 30 seconds from now for assessment/demo purposes |
| **Custom Alarm** | Set a precise date & time for a full-screen alarm |
| **Full-Screen Alarm UI** | Dedicated alarm screen with Snooze (5 min) and Stop controls |
| **Killed-State Notifications** | Notifications fire reliably even when the app is completely closed |
| **Direct Notification Navigation** | Tapping a notification opens the exact screen (Details or Alarm) without any flicker |
| **Reminder History** | All reminders are persisted locally using AsyncStorage |
| **Modern UI** | Clean, SaaS-inspired design with smooth animations |
| **About Developer** | Developer profile screen accessible from the home screen |

---

## 📱 Screenshots

> App opens directly to the correct screen when a notification is tapped — no HomeScreen flash.

---

## 🛠 Tech Stack

- **Framework**: React Native CLI (v0.85)
- **Language**: JavaScript (ES2022+)
- **Navigation**: `@react-navigation/native-stack`
- **Notifications**: `@notifee/react-native` (v9)
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Icons**: `react-native-vector-icons` (Ionicons)
- **Date/Time Picker**: `@react-native-community/datetimepicker`

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 22
- JDK 17+
- Android Studio with an emulator or a physical device
- React Native CLI environment set up ([guide](https://reactnative.dev/docs/environment-setup))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ramram128/ReminderApp.git
cd ReminderApp

# 2. Install dependencies
npm install

# 3. Start Metro bundler
npx react-native start

# 4. Run on Android (in a separate terminal)
npx react-native run-android
```

---

## 🔔 Android Permissions Required

The following permissions are needed for full functionality on Android:

- `POST_NOTIFICATIONS` — Show notifications (Android 13+)
- `SCHEDULE_EXACT_ALARM` — Fire notifications at the exact scheduled time
- `USE_FULL_SCREEN_INTENT` — Show alarm full-screen even on lock screen
- `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` — Prevent Doze mode from delaying alarms
- `FOREGROUND_SERVICE` — Keep alarm service running in the background

---

## 📦 Building a Release APK

```bash
cd android && ./gradlew assembleRelease
```

Output APKs will be in:
`android/app/build/outputs/apk/release/`

> The build is configured with Proguard, R8 minification, and resource shrinking for maximum size reduction.

---

## 🗂 Project Structure

```
src/
├── components/         # Reusable UI components (CustomButton)
├── navigation/         # App navigator + global navigationRef
│   ├── AppNavigator.js
│   └── navigationUtils.js
├── screens/            # All application screens
│   ├── HomeScreen.js
│   ├── AlarmScreen.js
│   ├── ReminderDetailsScreen.js
│   └── AboutDeveloperScreen.js
└── services/           # Business logic
    ├── notificationService.js  # Schedules & handles all notifications
    └── storageService.js       # AsyncStorage CRUD for reminders
```

---

## 👨‍💻 Developer

**Prakash Ram**
- 🎓 B.Tech IT Graduate
- 💼 React Native & Full Stack Developer
- 🐙 GitHub: [github.com/ramram128](https://github.com/ramram128)

---

## 📄 License

This project is for educational/assessment purposes.

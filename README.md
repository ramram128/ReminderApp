# Reminder App

A complete cross-platform Reminder Application built with React Native CLI.

## Features
- Create reminders with custom messages.
- Immediate notification confirmation.
- Scheduled notification after 30 seconds.
- Deep linking from notification to reminder details.
- Works in background and killed states.
- Modern SaaS-inspired UI.

## Tech Stack
- **Framework**: React Native CLI
- **Language**: JavaScript
- **Navigation**: React Navigation (Native Stack)
- **Notifications**: @notifee/react-native
- **Icons**: react-native-vector-icons

## Getting Started

### Prerequisites
- Node.js (v22+)
- React Native Environment Setup
- Android Studio / Xcode

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. For iOS, install pods:
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App
- **Android**: `npm run android`
- **iOS**: `npm run ios`

## Project Structure
```
src/
 ├── screens/           # UI Screens (Home, Details, About)
 ├── services/          # Notification Service
 ├── navigation/        # App Navigator
 ├── components/        # Reusable UI Components
 └── assets/            # Static assets
```

## Notification Setup
- **Android**: Uses a high-priority channel `reminder-channel`. Requires `POST_NOTIFICATIONS` and `SCHEDULE_EXACT_ALARM` permissions.
- **iOS**: Uses `UNUserNotificationCenter` via Notifee. Requires permissions on first launch.

## Developer
**Prakash Ram**
- Role: React Native Developer
- GitHub: [github.com](https://github.com)
- LinkedIn: [linkedin.com](https://linkedin.com)

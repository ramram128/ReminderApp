# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# React Native
-keep class com.facebook.react.bridge.CatalystInstanceImpl { *; }
-keep class com.facebook.react.bridge.JavaScriptExecutor { *; }
-keep class com.facebook.react.bridge.ReactBridge { *; }
-keep class com.facebook.react.bridge.BaseJavaModule { *; }
-keep class com.facebook.react.uimanager.ViewManager { *; }
-keep class com.facebook.react.uimanager.events.Event { *; }

# Notifee
-keep class io.invertase.notifee.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Keep filenames and line numbers for better error reporting in crashlytics
-keepattributes SourceFile,LineNumberTable

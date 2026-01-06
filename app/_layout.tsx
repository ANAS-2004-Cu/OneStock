import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

const RootLayout = () => {
  useEffect(() => {
    // Hide navigation bar on Android
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      // Optionally, you can set behavior for when user swipes up
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="(User)/(MainTabs)" /> */}
      {/* <Stack.Screen name="(User)/(ProfileTabs)" /> */}
      {/* <Stack.Screen name="(User)/(Cart)" /> */}
      {/* <Stack.Screen name="(User)/(Pages)" /> */}
    </Stack>
  );
}
export default RootLayout;
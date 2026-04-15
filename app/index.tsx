import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler, Image, StyleSheet, View } from 'react-native';
import { fetchManageDocs } from '../Backend/Firebase/DBAPI';
import { useUserStore } from '../Backend/Zustand/UserStore';

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const handleNavigation = async () => {
      setTimeout(async () => {
        try {
          const manageResponse = await fetchManageDocs();
          await AsyncStorage.setItem('unUpadtingManageDocs', JSON.stringify(manageResponse.unUpadtingManageDocs));
          await AsyncStorage.setItem('UpadtingManageDocs', JSON.stringify(manageResponse.UpadtingManageDocs));
          await useUserStore.getState().bootstrapAuth();
          const { isLoggedIn } = useUserStore.getState();
            router.replace('./Home');
        } catch (_error) {
          Alert.alert('Error', 'A connection error occurred. Please try again later.', [{ text: 'OK', onPress: () => BackHandler.exitApp() }], { cancelable: false });
        }
      }, 5000);
    };
    handleNavigation();
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{height: '100%', width: '100%'}}>
        <Image source={require('../assets/images/Logo.gif')} style={styles.logo} resizeMode='contain' />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: "100%",
  },
});

export default Index
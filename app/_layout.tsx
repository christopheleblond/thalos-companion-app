import { StorageKeys } from '@/constants/StorageKeys';
import { User } from '@/model/User';
import { uuid } from '@/utils/Utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { SplashScreen, Tabs } from "expo-router";
import { createContext, useEffect, useState } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type AppContextProps = {
  user?: User,
  refreshs: { [key: string]: string },
  refresh: (key: string) => void,
  setUser: (user: User) => void
}
export const AppContext = createContext<AppContextProps>({
  refreshs: {},
  refresh: (key: string) => { },
  setUser: (user: User) => { }
})

export default function RootLayout() {

  AsyncStorage.getItem(StorageKeys.USER_ID).then(userId => {
    if (userId === null) {
      return AsyncStorage.setItem(StorageKeys.USER_ID, uuid())
    } else {
      return Promise.resolve(JSON.parse(userId))
    }
  })

  const [appContext, setAppContext] = useState<AppContextProps>({
    refreshs: {},
    refresh: (key: string) => {
      setAppContext(prev => {
        return {
          ...prev,
          refreshs: { ...prev.refreshs, [key]: new Date().toISOString() }
        }
      })
    },
    setUser: (user: User) => {
      setAppContext(prev => ({
        ...prev,
        user
      }))
    }
  })

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/spacemono.ttf'),
    Flowers: require('../assets/fonts/flowers.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <AppContext.Provider value={appContext}>
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{
        title: 'Accueil',
        tabBarIcon: () => (<MaterialIcons size={24} name={'home'} />)
      }} />
      <Tabs.Screen name="agenda" options={{
        title: 'Agenda',
        tabBarIcon: () => (<MaterialIcons size={24} name={'calendar-month'} />)
      }} />
      <Tabs.Screen name="[eventId]" options={{
        href: null
      }} />
      <Tabs.Screen name="events" options={{
        href: null
      }} />
      <Tabs.Screen name="days/[dayId]" options={{
        href: null
      }} />
    </Tabs>
  </AppContext.Provider>;
}
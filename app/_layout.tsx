import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFonts } from "expo-font";
import { SplashScreen, Tabs } from "expo-router";
import { createContext, useEffect, useState } from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export type AppContextProps = {
  refreshs: { [key: string]: string },
  refresh: (key: string) => void
}
export const AppContext = createContext<AppContextProps>({
  refreshs: {},
  refresh: (key: string) => { }
})

export default function RootLayout() {

  const [appContext, setAppContext] = useState<AppContextProps>({
    refreshs: {},
    refresh: (key: string) => {
      setAppContext(prev => {
        return {
          ...prev,
          refreshs: { ...prev.refreshs, [key]: new Date().toISOString() }
        }
      })
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
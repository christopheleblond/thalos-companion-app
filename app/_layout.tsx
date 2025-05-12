import IconButton from '@/components/IconButton';
import SettingsFormModal from '@/components/modals/SettingsFormModal';
import { Colors } from '@/constants/Colors';
import { StorageKeys } from '@/constants/StorageKeys';
import { User } from '@/model/User';
import { uuid } from '@/utils/Utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from "expo-font";
import { SplashScreen, Tabs } from "expo-router";
import { createContext, useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

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
    <SafeAreaView style={styles.container}>

      {<SettingsFormModal visible={settingsModalVisible} closeFunction={() => setSettingsModalVisible(false)} onSuccess={(prefs) => {
        appContext.refresh(`home.events`)
        appContext.refresh(`agenda`)
      }} />}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('@/assets/images/icon50.png')} width={50} height={24} />
          <Text style={{ color: 'white', fontWeight: 'bold', paddingLeft: 5, fontSize: 20, fontFamily: 'Flowers' }} >La Voie du Thalos</Text>
        </View>
        <View style={{ borderRadius: 50, elevation: 2 }}>
          <IconButton icon="settings" color={Colors.white} onPress={() => setSettingsModalVisible(true)} />
        </View>
      </View>

      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{
          title: 'Accueil',
          tabBarIcon: () => (<MaterialIcons size={24} name={'home'} />)
        }} />
        <Tabs.Screen name="agenda" options={{
          title: 'Agenda',
          tabBarIcon: () => (<MaterialIcons size={24} name={'calendar-month'} />)
        }} />
        <Tabs.Screen name="keys" options={{
          title: 'Badges',
          tabBarIcon: () => (<MaterialIcons size={24} name={'key'} />)
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
    </SafeAreaView>
  </AppContext.Provider>;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.red
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  headerRight: {
  },
  body: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
    elevation: 2,
    backgroundColor: 'whitesmoke'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'center',
    position: 'absolute',
    right: 10,
    bottom: 60
  },
  newButton: {
    backgroundColor: Colors.red,
    elevation: 2,
    margin: 5,
    padding: 10,
    borderRadius: 50
  },
  emptyList: {
    flex: 1,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionMonth: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.gray
  }
})


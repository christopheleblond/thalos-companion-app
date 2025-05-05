import { StorageKeys } from "@/constants/StorageKeys";
import { UserPreferences } from "@/model/UserPreferences";
import AsyncStorage, { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useUserId } from "./useUserId";

export async function useLocalUserPreferences(): Promise<UserPreferences> {

    const userId = await useUserId();

    const prefs = await useAsyncStorage(StorageKeys.USER_PREFERENCES).getItem()
    if (prefs === null) {
        const defaultPrefs = { id: userId, firstName: '', name: '' } as UserPreferences;
        await AsyncStorage.setItem(StorageKeys.USER_PREFERENCES, JSON.stringify(defaultPrefs))
        const read = await AsyncStorage.getItem(StorageKeys.USER_PREFERENCES)
        if (read !== null) {
            return JSON.parse(read);
        } else {
            throw new Error('Unable to read user preferences')
        }
    }

    return JSON.parse(prefs);
}
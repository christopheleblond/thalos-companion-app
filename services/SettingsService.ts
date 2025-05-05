import { StorageKeys } from "@/constants/StorageKeys";
import { User } from "@/model/User";
import { UserPreferences } from "@/model/UserPreferences";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, ApiService } from "./Api";

class SettingsService {

    constructor(private api: ApiService) {
    }

    async save(prefs: Partial<UserPreferences>): Promise<UserPreferences> {

        const user = await this.api.saveOrUpdateUser({
            id: prefs.id,
            firstName: prefs.firstName,
            name: prefs.name,
        } as User, prefs.isNew)

        await AsyncStorage.setItem(StorageKeys.USER_PREFERENCES, JSON.stringify(prefs));

        const saved = await this.get()
        if (saved === null) {
            return Promise.reject('No prefs');
        } else {
            return Promise.resolve(saved);
        }
    }

    async get(): Promise<UserPreferences | null> {
        const saved = await AsyncStorage.getItem(StorageKeys.USER_PREFERENCES)
        if (saved) {
            return Promise.resolve(JSON.parse(saved) as UserPreferences);
        } else {
            return Promise.resolve(null)
        }
    }
}

export const settingsService = new SettingsService(API);

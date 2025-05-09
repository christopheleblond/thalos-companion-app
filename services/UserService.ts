import { StorageKeys } from "@/constants/StorageKeys";
import { User } from "@/model/User";
import { uuid } from "@/utils/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, ApiService } from "../api/Api";

class UserService {
    constructor(private api: ApiService) {
    }

    getUserId(): Promise<string> {
        return AsyncStorage.getItem(StorageKeys.USER_ID)
            .then(userId => {
                if (userId === null) {
                    const newUserId = uuid();
                    return AsyncStorage.setItem(StorageKeys.USER_ID, newUserId)
                        .then(() => Promise.resolve(newUserId))
                } else {
                    return Promise.resolve(userId)
                }
            })
    }

    getUserById(userId: string): Promise<User | null> {
        return this.api.findUserById(userId);
    }

    createUser(user: User): Promise<User> {
        return this.api.saveOrUpdateUser(user)
    }
}

export const userService = new UserService(API)
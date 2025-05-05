import { StorageKeys } from "@/constants/StorageKeys";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export function useUserId(): Promise<string> {
    return useAsyncStorage(StorageKeys.USER_ID).getItem()
        .then(userId => {
            if (userId === null) {
                throw new Error('No userId set')
            } else {
                return userId
            }
        })
}
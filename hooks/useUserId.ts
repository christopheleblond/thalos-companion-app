import { StorageKeys } from "@/constants/StorageKeys";
import { uuid } from "@/utils/Utils";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useUserId(): string {

    const localUserId = useAsyncStorage(StorageKeys.USER_ID)
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        console.log('UseEffect To get userId')
        localUserId.getItem()
            .then(value => {
                console.log('GetItem', value)
                if (value === null) {
                    const newId = uuid()
                    return localUserId.setItem(newId)
                        .then(() => Promise.resolve(newId))
                } else {
                    return Promise.resolve(value)
                }
            })
            .then(id => {
                setUserId(id)
                console.log('Set User id = ', id)
            })
            .catch(error => console.error('Get Item error', error))
    })

    console.log('Return userId', userId)

    return userId;
}
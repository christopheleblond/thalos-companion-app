import { AppContext } from "@/app/_layout";
import { User } from "@/model/User";
import { userService } from "@/services/UserService";
import { isNotEmpty } from "@/utils/Utils";
import { useContext, useEffect, useState } from "react";
import { useUserId } from "./useUserId";

export function useUser(): User | null {
    const appContext = useContext(AppContext)
    const userId = useUserId()
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        if (appContext.user && isNotEmpty(appContext.user.id)) {
            setUser(appContext.user)
        } else {
            userService.getUserById(userId)
                .then(existing => {
                    if (existing === null) {
                        return userService.createUser({
                            id: userId
                        } as User)
                    } else {
                        return Promise.resolve(existing)
                    }
                })
                .then(user => {
                    appContext.setUser(user)
                    setUser(user)
                })
        }
    }, [userId, appContext])

    return user;
}
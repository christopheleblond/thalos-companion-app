import { AppContext } from "@/app/_layout";
import { userService } from "@/services/UserService";
import { isNotEmpty } from "@/utils/Utils";
import { useContext } from "react";
import { useUserId } from "./useUserId";

export async function useUser() {
    const appContext = useContext(AppContext)

    if (appContext.user && isNotEmpty(appContext.user.id)) {
        return Promise.resolve(appContext.user);

    } else {
        const userId = await useUserId();
        const user = await userService.getUserById(userId)
        if (user != null) {
            appContext.setUser(user);
            console.log('Set user in app context', user)
        } else {
            console.error('Unable to find user by id ', userId)
        }
    }
}
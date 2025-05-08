import { User } from "@/model/User";
import { API, ApiService } from "./Api";

class UserService {
    constructor(private api: ApiService) {

    }

    getUserById(userId: string): Promise<User | null> {
        return this.api.findUserById(userId);
    }

    createUser(user: User): Promise<User> {
        return this.api.saveOrUpdateUser(user, true)
    }
}

export const userService = new UserService(API)
import { User } from "@/model/User";
import { API, ApiService } from "./Api";

class UserService {
    constructor(private api: ApiService) {

    }

    getUserById(userId: string): Promise<User | null> {
        return this.api.findUserById(userId);
    }
}

export const userService = new UserService(API)
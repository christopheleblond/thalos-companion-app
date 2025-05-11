import { API, ApiService } from "@/api/Api";
import { RoomKey } from "@/model/RoomKey";

class KeyService {
    constructor(private api: ApiService) {
    }

    findAllKeys(): Promise<RoomKey[]> {
        return this.api.findAllKeys();
    }

    updateKey(key: RoomKey): Promise<RoomKey> {
        return this.api.updateKey(key);
    }
}

export const keyService = new KeyService(API);
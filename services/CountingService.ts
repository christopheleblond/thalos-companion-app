import { API, ApiService } from "@/api/Api";
import { DayCounts } from "@/model/Counting";

class CountingService {

    constructor(private api: ApiService) { }

    saveOrUpdateCounting(counts: DayCounts): Promise<void> {
        return this.api.saveCountings(counts);
    }

    getCounting(dayId: string): Promise<DayCounts | null> {
        return this.api.getCountings(dayId)
    }
}

export const countingService = new CountingService(API)
import { Occupation } from "@/components/OccupationStats";

class RoomService {

    hours: string[] = []

    constructor() {
        for (let i = 8; i < 24; i++) {
            this.hours.push(`${i}h`);
        }
    }

    getRoomOccupationStats(roomId: string): Occupation[] {
        return this.hours.map(hh => ({
            hour: hh,
            tables: Math.floor(Math.random() * 10) - 4
        } as Occupation))
    }
}
export const roomService = new RoomService()
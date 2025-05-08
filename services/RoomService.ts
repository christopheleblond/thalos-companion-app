import { Occupation } from "@/components/OccupationStats";
import { AgendaEvent } from "@/model/AgendaEvent";
import { Room } from "@/model/Room";
import { clamp, eventIsActiveAt } from "@/utils/Utils";
import { API, ApiService } from "./Api";

class RoomService {

    hours: string[] = []

    constructor(private api: ApiService) {
        for (let i = 9; i < 24; i++) {
            this.hours.push(`${i}h`)
            this.hours.push(`${i}h30`)
        }
    }

    getRoomOccupationStatsFromEvents(room: Room, events: AgendaEvent[]): Promise<Occupation[]> {

        const occupations = this.hours.map(hh => {

            const tables = events.filter(e => e.room?.id === room.id && eventIsActiveAt(e, hh))
                .map(e => e.tables)
                .reduce((acc, cur) => {
                    if (acc !== undefined && cur !== undefined) {
                        return acc + cur;
                    } else {
                        return 0;
                    }
                }, 0)

            return {
                hour: hh,
                tables: tables,
                availableTables: clamp((room.capacity || 0) - (tables || 0), 0, room.capacity)
            } as Occupation;
        })

        return Promise.resolve(occupations)
    }

    async getRoomOccupationStats(room: Room, dayId: string): Promise<Occupation[]> {
        const events = await this.api.findEventsByDayIdAndRoomId(dayId, room.id);
        return events.map(e => ({
            hour: e.start,
            tables: e.tables,
            availableTables: 10
        } as Occupation))
    }
}
export const roomService = new RoomService(API)
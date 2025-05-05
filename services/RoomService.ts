import { Occupation } from "@/components/OccupationStats";
import { AgendaEvent } from "@/model/AgendaEvent";
import { eventIsActiveAt } from "@/utils/Utils";
import { API, ApiService } from "./Api";

class RoomService {

    hours: string[] = []

    constructor(private api: ApiService) {
        for (let i = 9; i < 24; i++) {
            this.hours.push(`${i}h`)
            this.hours.push(`${i}h30`)
        }
    }

    getRoomOccupationStatsFromEvents(roomId: string, events: AgendaEvent[]): Promise<Occupation[]> {

        const occupations = this.hours.map(hh => {

            const tables = events.filter(e => e.room?.id === roomId && eventIsActiveAt(e, hh))
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
                tables: tables
            } as Occupation;
        })

        return Promise.resolve(occupations)
    }

    getRoomOccupationStats(roomId: string, dayId: string): Promise<Occupation[]> {
        return this.api.findEventsByDayIdAndRoomId(dayId, roomId)
            .then(events => {

                return [];
            });
    }
}
export const roomService = new RoomService(API)
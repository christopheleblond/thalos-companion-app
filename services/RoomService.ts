import { Occupation } from "@/components/OccupationStats";
import { AgendaEvent } from "@/model/AgendaEvent";
import { OpenCloseRoom, Room } from "@/model/Room";
import { clamp, eventIsActiveAt } from "@/utils/Utils";
import { API, ApiService } from "../api/Api";

class RoomService {

    hours: string[] = []

    constructor(private api: ApiService) {
        for (let i = 9; i < 24; i++) {
            this.hours.push(`${i}h`)
            this.hours.push(`${i}h30`)
        }
    }

    getOpenCloseConfig(dayId: string): Promise<OpenCloseRoom> {
        return this.api.findOpenCloseConfiguration(dayId).then(result => {
            if (result == null) {
                return {
                    dayId,
                    openAt: '20h'
                } as OpenCloseRoom;
            } else {
                return result;
            }
        });
    }

    saveOpenCloseConfig(config: OpenCloseRoom): Promise<void> {
        return this.api.saveOpenCloseConfiguration(config)
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

            const availableTables = clamp((room.capacity || 0) - (tables || 0), 0, room.capacity)
            return {
                hour: hh,
                tables: tables,
                availableTables,
                capacity: room.capacity,
                rate: room.capacity ? ((room.capacity - availableTables) / room.capacity) : undefined
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
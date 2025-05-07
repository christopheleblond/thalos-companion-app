import { AgendaEvent } from "@/model/AgendaEvent";
import { fromActivityId, fromGameDayId, fromRoomId, getEndTime, getStartTime } from "@/utils/Utils";
import { API, ApiService } from "./Api";

class AgendaService {

    constructor(private api: ApiService) { }

    findEventById(eventId: string): Promise<AgendaEvent> {
        return this.api.findEventById(eventId);
    }

    findEventsOfDay(dayId: string): Promise<AgendaEvent[]> {
        return this.api.findEventsByDayId(dayId);
    }

    findAllEvents(): Promise<AgendaEvent[]> {
        return this.api.findAllEvents();
    }

    saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        const day = fromGameDayId(event.dayId);
        if(day === null || !event?.durationInMinutes) {
            throw new Error('Unable to save event : ' + event)
        }
        const enriched = {
            ...event,            
            day,
            activity: fromActivityId(event.activityId),
            room: fromRoomId(event.roomId),
            startTime: getStartTime(day!, event.start!),
            endTime: getEndTime(day!, event.start!, event.durationInMinutes)
        } as Partial<AgendaEvent>;

        if (event.id) {
            return this.api.updateEvent(enriched);
        } else {
            return this.api.saveEvent(enriched);
        }
    }

    deleteEvent(eventId: string): Promise<void> {
        return this.api.deleteEvent(eventId);
    }
}

export const agendaService = new AgendaService(API);

import { AgendaEvent } from "@/model/AgendaEvent";
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
        if (event.id) {
            return this.api.updateEvent(event);
        } else {
            return this.api.saveEvent(event);
        }
    }

    deleteEvent(eventId: string): Promise<void> {
        return this.api.deleteEvent(eventId);
    }
}

export const agendaService = new AgendaService(API);
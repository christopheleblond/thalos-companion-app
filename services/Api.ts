import { AgendaEvent } from "@/model/AgendaEvent";
import { fromActivityId, fromGameDayId, fromRoomId } from "@/utils/Utils";

const baseUrl = 'http://192.168.1.51:3000';

export class ApiService {

    findEventById(eventId: string): Promise<AgendaEvent> {
        console.log('findEventById() ', eventId);
        return fetch(`${baseUrl}/events?id=${eventId}`, { method: 'GET' })
            .then(resp => resp.json())
            .then(json => ({
                ...json[0],
                title: json[0]['name'],
                day: fromGameDayId(json[0]['dayId']),
                room: fromRoomId(json[0]['roomId']),
                activity: fromActivityId(json[0]['activityId']),
            } as AgendaEvent))
    }

    findEventsByDayId(dayId: string): Promise<AgendaEvent[]> {
        console.log('findEventsByDayId()', dayId);
        return fetch(`${baseUrl}/events?dayId=${dayId}`)
            .then(resp => resp.json()).then(json => json.map(a => ({
                ...a,
                title: a['name'],
                day: fromGameDayId(a['dayId']),
                room: fromRoomId(a['roomId']),
                activity: fromActivityId(a['activityId']),
            } as AgendaEvent)))
    }

    findAllEvents(): Promise<AgendaEvent[]> {
        console.log('findAllEvents()')
        return fetch(`${baseUrl}/events`, { method: 'GET' })
            .then(resp => resp.json()).then(json => json.map(a => ({
                ...a,
                title: a['name'],
                day: fromGameDayId(a['dayId']),
                room: fromRoomId(a['roomId']),
                activity: fromActivityId(a['activityId']),
            } as AgendaEvent)))
    }

    saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        console.log('saveEvent()', event)
        return fetch(`${baseUrl}/events`, {
            method: 'POST', body: JSON.stringify(event), headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json()).then(a => ({
            ...a,
            title: a['name'],
            day: fromGameDayId(a['dayId']),
            room: fromRoomId(a['roomId']),
            activity: fromActivityId(a['activityId']),
        }));
    }

    updateEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        console.log('updateEvent()', event)
        return fetch(`${baseUrl}/events/${event.id}`, {
            method: 'PUT', body: JSON.stringify(event), headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json()).then(a => ({
            ...a,
            title: a['name'],
            day: fromGameDayId(a['dayId']),
            room: fromRoomId(a['roomId']),
            activity: fromActivityId(a['activityId']),
        }));
    }

    deleteEvent(eventId: string): Promise<void> {
        console.log('deleteEvent()', eventId)
        return fetch(`${baseUrl}/events/${eventId}`, { method: 'DELETE' }).then();
    }
}

export const API = new ApiService()
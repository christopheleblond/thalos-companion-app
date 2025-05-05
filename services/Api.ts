import { AgendaEvent } from "@/model/AgendaEvent";
import { User } from "@/model/User";
import { fromActivityId, fromGameDayId, fromRoomId } from "@/utils/Utils";

const baseUrl = 'http://192.168.1.51:3000';

const agendaEventMapper = (json: any): AgendaEvent => {
    return {
        ...json,
        title: json['name'],
        day: fromGameDayId(json['dayId']),
        durationInMinutes: json['duration'],
        room: fromRoomId(json['roomId']),
        activity: fromActivityId(json['activityId']),
    }
}

const userMapper = (json: any): User => {
    return {
        id: json['id'],
        name: json['name'],
        firstName: json['firstName']
    } as User;
}

export class ApiService {

    findUserById(userId: string): Promise<User | null> {
        return fetch(`${baseUrl}/users/${userId}`, { method: 'GET' })
            .then(resp => {
                if (resp.status === 200) {
                    return resp.json();
                } else if (resp.status === 404) {
                    return Promise.resolve(null);
                }
                throw new Error(`${resp.status} - ${resp.statusText}`)
            })
            .then(json => {
                if (json !== null) {
                    return userMapper(json);
                } else {
                    return null;
                }
            })
    }

    saveOrUpdateUser(user: User, isNew = false): Promise<User> {
        if (isNew) {
            return fetch(`${baseUrl}/users`, {
                method: 'POST', body: JSON.stringify(user), headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => resp.json())
                .then(userMapper);
        } else {
            return fetch(`${baseUrl}/users/${user.id}`, {
                method: 'PUT', body: JSON.stringify(user), headers: {
                    'Content-Type': 'application/json'
                }
            }).then(resp => resp.json())
                .then(userMapper);
        }
    }

    findEventById(eventId: string): Promise<AgendaEvent> {
        console.log('findEventById() ', eventId);
        return fetch(`${baseUrl}/events?id=${eventId}`, { method: 'GET' })
            .then(resp => resp.json())
            .then(json => agendaEventMapper(json[0]))
    }

    findEventsByDayId(dayId: string): Promise<AgendaEvent[]> {
        console.log('findEventsByDayId()', dayId);
        return fetch(`${baseUrl}/events?dayId=${dayId}`)
            .then(resp => resp.json()).then(json => json.map(agendaEventMapper))
    }

    findEventsByDayIdAndRoomId(dayId: string, roomId: string): Promise<AgendaEvent[]> {
        console.log('findEventsByDayIdAndRoomId()', dayId);
        return fetch(`${baseUrl}/events?dayId=${dayId}&roomId=${roomId}`)
            .then(resp => resp.json()).then(json => json.map(agendaEventMapper))
    }

    findAllEvents(): Promise<AgendaEvent[]> {
        console.log('findAllEvents()')
        return fetch(`${baseUrl}/events`, { method: 'GET' })
            .then(resp => resp.json()).then(json => json.map(agendaEventMapper))
    }

    saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        console.log('saveEvent()', event)
        return fetch(`${baseUrl}/events`, {
            method: 'POST', body: JSON.stringify(event), headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
            .then(agendaEventMapper);
    }

    updateEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        console.log('updateEvent()', event)
        return fetch(`${baseUrl}/events/${event.id}`, {
            method: 'PUT', body: JSON.stringify(event), headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
            .then(agendaEventMapper);
    }

    deleteEvent(eventId: string): Promise<void> {
        console.log('deleteEvent()', eventId)
        return fetch(`${baseUrl}/events/${eventId}`, { method: 'DELETE' }).then();
    }
}

export const API = new ApiService()
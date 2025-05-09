import { ACTIVITIES } from "@/constants/Activities";
import { ROOMS } from "@/constants/Rooms";
import { AgendaEvent } from "@/model/AgendaEvent";
import { User } from "@/model/User";
import { fromActivityId, fromGameDayId, fromRoomId } from "@/utils/Utils";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "@firebase/firestore";
import { FirebaseDb } from '../firebaseConfig';
import { ApiService } from "./Api";

const Collections = {
    USERS: 'users',
    EVENTS: 'events'
}

export const agendaEventMapper = (id: string, json: any, rooms = ROOMS, activities = ACTIVITIES): AgendaEvent => {
    return {
        ...json,
        id,
        day: fromGameDayId(json['dayId']),
        room: fromRoomId(json['roomId'], rooms),
        activity: fromActivityId(json['activityId'], activities),
    }
}

const mapToDto = (json: Partial<AgendaEvent>): Partial<AgendaEvent> => {
    return {
        dayId: json.dayId,
        activityId: json.activityId,
        roomId: json.roomId,
        creator: json.creator,
        description: json.description,
        durationInMinutes: json.durationInMinutes,
        start: json.start,
        title: json.title,
        tables: json.tables,
        startTime: json.startTime,
        endTime: json.endTime
    }
}

class FirestoreApi implements ApiService {
    findUserById(userId: string): Promise<User | null> {
        console.log('FS findUserById()', userId)
        return getDoc(doc(FirebaseDb, Collections.USERS, userId)).then(res => {
            return res.data() ? {
                ...res.data()
            } as User : null
        })
    }

    saveOrUpdateUser(user: User): Promise<User> {
        console.log('saveOrUpdateUser()', user)
        return setDoc(doc(FirebaseDb, Collections.USERS, user.id), user)
            .then(() => this.findUserById(user.id))
            .then(user => {
                if (user === null) {
                    throw new Error('Fail to create user')
                }
                return Promise.resolve(user)
            })
    }

    findEventById(eventId: string): Promise<AgendaEvent | null> {
        console.log('findEventById()', eventId)
        return getDoc(doc(FirebaseDb, Collections.EVENTS, eventId)).then(res => {
            return res.data() ? agendaEventMapper(res.id, res.data()) : null
        })
    }

    findEventsByDayId(dayId: string): Promise<AgendaEvent[]> {
        console.log('findEventsByDayIdAndRoomId()', dayId)
        const q = query(collection(FirebaseDb, Collections.EVENTS), where("dayId", "==", dayId));
        return getDocs(q).then(results => {
            return results.docs.map(doc => agendaEventMapper(doc.id, doc.data()))
        })
    }

    findEventsByDayIdAndRoomId(dayId: string, roomId: string): Promise<AgendaEvent[]> {
        console.log('findEventsByDayIdAndRoomId()', dayId, roomId)
        const q = query(collection(FirebaseDb, Collections.EVENTS), where("dayId", "==", dayId), where("roomId", "==", roomId));
        return getDocs(q).then(results => {
            return results.docs.map(doc => agendaEventMapper(doc.id, doc.data()))
        })
    }

    findAllEvents(): Promise<AgendaEvent[]> {
        console.log('findAllEvents()')
        return getDocs(collection(FirebaseDb, Collections.EVENTS)).then(results => {
            const events = results.docs.map(doc => agendaEventMapper(doc.id, doc.data()))
            console.log('Events', events);
            return events;
        })
    }

    saveEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        console.log('saveEvent()', event)
        return addDoc(collection(FirebaseDb, Collections.EVENTS), mapToDto(event))
            .then(res => this.findEventById(res.id))
            .then(event => {
                if (event === null) {
                    throw new Error('No event found with id ')
                } else {
                    return Promise.resolve(event)
                }
            })
    }

    updateEvent(event: Partial<AgendaEvent>): Promise<AgendaEvent> {
        console.log('updateEvent()', event)
        if (event && event.id) {
            return setDoc(doc(FirebaseDb, Collections.EVENTS, event.id), mapToDto(event))
                .then(() => this.findEventById(event.id!))
                .then(event => {
                    if (event === null) {
                        throw new Error('No event found with id ')
                    } else {
                        return Promise.resolve(event)
                    }
                })
        } else {
            throw new Error('Unable to update event with id empty' + event)
        }
    }

    deleteEvent(eventId: string): Promise<void> {
        console.log('deleteEvent()', eventId)
        return deleteDoc(doc(FirebaseDb, Collections.EVENTS, eventId))
    }
}

export const firestoreApi = new FirestoreApi()
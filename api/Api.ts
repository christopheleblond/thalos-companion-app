import { AgendaEvent } from "@/model/AgendaEvent";
import { DayCounts } from "@/model/Counting";
import { OpenCloseRoom } from "@/model/Room";
import { RoomKey } from "@/model/RoomKey";
import { User } from "@/model/User";
import { firestoreApi } from "./FirestoreApi";

export interface ApiService {

    findUserById: (userId: string) => Promise<User | null>,

    saveOrUpdateUser: (user: User) => Promise<User>,

    findEventById: (eventId: string) => Promise<AgendaEvent | null>,

    findEventsByDayId: (dayId: string) => Promise<AgendaEvent[]>,

    findEventsByDayIdAndRoomId: (dayId: string, roomId: string) => Promise<AgendaEvent[]>,

    findAllEvents: () => Promise<AgendaEvent[]>,

    saveEvent: (event: Partial<AgendaEvent>) => Promise<AgendaEvent>,

    updateEvent: (event: Partial<AgendaEvent>) => Promise<AgendaEvent>,

    deleteEvent: (eventId: string) => Promise<void>,

    findAllUsers: () => Promise<User[]>,

    findAllKeys: () => Promise<RoomKey[]>,

    updateKey: (key: RoomKey) => Promise<RoomKey>,

    saveCountings: (counts: DayCounts) => Promise<void>,

    getCountings: (dayId: string) => Promise<DayCounts | null>,

    findOpenCloseConfiguration: (dayId: string) => Promise<OpenCloseRoom | null>,

    saveOpenCloseConfiguration: (config: OpenCloseRoom) => Promise<void>
}

export const API = firestoreApi;
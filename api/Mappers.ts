import { ACTIVITIES } from "@/constants/Activities"
import { ROOMS } from "@/constants/Rooms"
import { AgendaEvent } from "@/model/AgendaEvent"
import { RoomKey } from "@/model/RoomKey"
import { User } from "@/model/User"
import { fromActivityId, fromGameDayId, fromRoomId } from "@/utils/Utils"

export const mapDtoToAgendaEvent = (id: string, json: any, rooms = ROOMS, activities = ACTIVITIES): AgendaEvent => {
    return {
        ...json,
        id,
        day: fromGameDayId(json['dayId']),
        room: fromRoomId(json['roomId'], rooms),
        activity: fromActivityId(json['activityId'], activities),
    }
}

export const mapAgendaEventToDto = (json: Partial<AgendaEvent>): Partial<AgendaEvent> => {
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

export const mapDtoToUser = (id: string, json: any): User => {
    return {
        ...json,
        id,
    } as User;
}

export const mapDtoToRoomKey = (id: string, json: any): RoomKey => {
    return {
        ...json,
        id
    } as RoomKey;
}
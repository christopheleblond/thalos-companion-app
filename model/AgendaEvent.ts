import { Activity } from "./Activity";
import { GameDay } from "./GameDay";
import { Room } from "./Room";
import { User } from "./User";

export interface AgendaEvent {
    id: string;
    title: string;
    dayId?: string;
    day: GameDay;
    start: string;
    durationInMinutes: number;
    startTime?: number;
    endTime?: number;
    roomId?: string;
    room?: Room;
    tables?: number;
    activityId?: string;
    activity?: Activity;
    description?: string;
    creator?: User;
}

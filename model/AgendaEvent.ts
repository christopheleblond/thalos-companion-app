import { Activity } from "./Activity";
import { GameDay } from "./GameDay";
import { Room } from "./Room";
import { User } from "./User";

export interface AgendaEvent {
    id: string;
    title: string;
    day: GameDay;
    start: string;
    durationInMinutes: number;
    end?: string;
    room?: Room;
    tables?: number;
    activity?: Activity;
    description?: string;
    creator?: User;
}

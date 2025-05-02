import { Activity } from "./Activity";
import { GameDay } from "./GameDay";
import { Room } from "./Room";

export interface AgendaEvent {
    id: string;
    title: string;
    day: GameDay;
    start: string;
    end?: string;
    room?: Room;
    tables?: number;
    activity?: Activity;
    description?: string;
}

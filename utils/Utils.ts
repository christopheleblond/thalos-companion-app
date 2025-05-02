import { ACTIVITIES } from "@/constants/Activities";
import { DaysOfWeek, Months } from "@/constants/Months";
import { ROOMS } from "@/constants/Rooms";
import { Activity } from "@/model/Activity";
import { GameDay } from "@/model/GameDay";
import { Room } from "@/model/Room";

export function fromActivityId(id: string): Activity | undefined {
    return ACTIVITIES.find(a => a.id === id);
}

export function fromGameDayId(id: string): GameDay {
    const date = new Date(id)
    return {
        id,
        date
    } as GameDay;
}

export function printGameDay(gameDay: GameDay): string {
    const day = DaysOfWeek[gameDay.date.getDay()]
    const dom = gameDay.date.getDate()
    const month = Months[gameDay.date.getMonth()]
    const yyyy = gameDay.date.getFullYear();
    return `${day} ${dom} ${month} ${yyyy}`;
}

export function fromRoomId(roomId: string): Room | undefined {
    return ROOMS.find(r => r.id === roomId);
}

export function removeAll(arr: string[], value: string): string[] {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

import { GameDay } from "@/model/GameDay";

const [FRIDAY, SATURDAY] = [5, 6];

class CalendarService {

    constructor(private gameDays: number[]) { }

    buildDayId(date: Date) {
        return date.toJSON().slice(0, 10);
    }

    buildDaysFromDate(start: Date, limit = 30): GameDay[] {
        let current = start;
        let result: GameDay[] = []
        for (let i = 0; i < limit; i++) {
            if (this.gameDays.includes(start.getDay())) {
                result.push({
                    id: this.buildDayId(current),
                    date: new Date(current)
                } as GameDay);
            }

            current.setDate(current.getDate() + 1);
        }
        return result;
    }

    hours(): string[] {
        const results = [];
        for (let h = 14; h < 24; h++) {
            results.push(`${h}h`);
            results.push(`${h}h30`);
        }
        return results;
    }

    nextGameDay(current: GameDay): GameDay {
        const date = new Date(current.id);
        date.setDate(current.date.getDate() + 1);
        while (!this.gameDays.includes(date.getDay())) {
            date.setDate(date.getDate() + 1);
        }
        return {
            id: this.buildDayId(date),
            date: date
        } as GameDay;
    }

    previousGameDay(current: GameDay): GameDay {
        const date = new Date(current.id);
        date.setDate(current.date.getDate() - 1);
        while (!this.gameDays.includes(date.getDay())) {
            date.setDate(date.getDate() - 1);
        }
        return {
            id: this.buildDayId(date),
            date: date
        } as GameDay;
    }
}

export const calendarService = new CalendarService([FRIDAY, SATURDAY])
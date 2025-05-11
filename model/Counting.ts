type Counts = { [key: string]: number }

export interface DayCounts {
    dayId: string;
    afternoon?: Counts,
    night?: Counts
}


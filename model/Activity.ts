export interface Activity {
    id: string;
    name: string;
    filterable?: boolean;
    countable?: boolean;
    style: { color: string, backgroundColor: string };
}

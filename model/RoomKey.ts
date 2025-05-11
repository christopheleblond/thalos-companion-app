export interface RoomKey {
    id: string,
    name: string,
    owner?: {
        id: string,
        name: string
    }
}

export interface Room {
    id: string;
    name: string;
    capacity?: number;
    virtual?: boolean;
}

export interface OpenCloseRoom {
    dayId: string;
    opener?: {
        id: string;
        name: string;
    };
    openAt: string;
    closer?: {
        id: string;
        name: string;
    };
}
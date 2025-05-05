export type YesOrNo = 'yes' | 'no'

export function parseYesOrNo(val: string): YesOrNo | undefined {
    const trimAndLc = val.trim().toLowerCase()
    return trimAndLc === 'yes' ? 'yes' : trimAndLc === 'no' ? 'no' : undefined;
}

export interface UserPreferences {
    id: string;
    firstName: string;
    name: string;
    isNew?: boolean;
    activities?: { [key: string]: YesOrNo }
}
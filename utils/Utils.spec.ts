import { AgendaEvent } from "@/model/AgendaEvent"
import { GameDay } from "@/model/GameDay"
import { eventIsInTimeSlot, getEndTime, getStartTime, isEmpty, isNotEmpty } from "./Utils"

describe('Utils.isEmpty() tests', () => {
    it('isEmpty should return true when empty string', () => {
        expect(isEmpty('')).toBeTruthy()
    })

    it('isEmpty should return true when null string', () => {
        expect(isEmpty(null)).toBeTruthy()
    })

    it('isEmpty should false true when string', () => {
        expect(isEmpty('string')).toBeFalsy()
    })
})

describe('Utils.isNotEmpty() tests', () => {
    it('isNotEmpty should return true when string', () => {
        expect(isNotEmpty('valid')).toBeTruthy()
    })

    it('isNotEmpty should return false when null string', () => {
        expect(isNotEmpty(null)).toBeFalsy()
    })

    it('isNotEmpty should false true when empty string', () => {
        expect(isNotEmpty('')).toBeFalsy()
    })
})

describe('Start & end Time tests', () => {
    it('Utils.getStartTime()', () => {
        const startTime = getStartTime({
                date: new Date('2025-01-01')
            } as GameDay, '15h');
        expect(new Date(startTime).toISOString()).toBe('2025-01-01T15:00:00.000Z')
        expect(startTime).toBe(1735743600000); 
    })

    it('Utils.getEndTime()', () => {
        const endTime = getEndTime({
                date: new Date('2025-01-01')
            } as GameDay,
            '15h',
            120)

        expect(new Date(endTime).toISOString()).toBe('2025-01-01T17:00:00.000Z')
        expect(endTime).toBe(1735750800000);
    })
})

describe('Event is in time slot tests', () => {
    it('Event is after of time slot', () => {
        const event = {
            startTime: new Date('2025-06-01T15:00:00Z').getTime(),
            endTime: new Date('2025-06-01T17:00:00Z').getTime(),
        } as AgendaEvent;
        expect(eventIsInTimeSlot(event, new Date('2025-06-01T12:00:00Z').getTime(),new Date('2025-06-01T14:00:00Z').getTime())).toBeFalsy();
    })

    it('Event is before of time slot', () => {
        const event = {
            startTime: new Date('2025-06-01T15:00:00Z').getTime(),
            endTime: new Date('2025-06-01T17:00:00Z').getTime(),
        } as AgendaEvent;
        expect(eventIsInTimeSlot(event, new Date('2025-06-01T17:00:00Z').getTime(),new Date('2025-06-01T19:00:00Z').getTime())).toBeFalsy();
    })

    it('Event is completly in the time slot', () => {
        const event = {
            startTime: new Date('2025-06-01T15:00:00Z').getTime(),
            endTime: new Date('2025-06-01T19:00:00Z').getTime(),
        } as AgendaEvent;
        expect(eventIsInTimeSlot(event, new Date('2025-06-01T15:00:00Z').getTime(),new Date('2025-06-01T17:00:00Z').getTime())).toBeTruthy();
    })

    it('Event is partially in the time slot', () => {
        const event = {
            startTime: new Date('2025-06-01T14:00:00Z').getTime(),
            endTime: new Date('2025-06-01T16:00:00Z').getTime(),
        } as AgendaEvent;
        expect(eventIsInTimeSlot(event, new Date('2025-06-01T15:00:00Z').getTime(),new Date('2025-06-01T17:00:00Z').getTime())).toBeTruthy();
    })

    it('Event is partially in the time slot', () => {
        const event = {
            startTime: new Date('2025-06-01T16:00:00Z').getTime(),
            endTime: new Date('2025-06-01T19:00:00Z').getTime(),
        } as AgendaEvent;
        expect(eventIsInTimeSlot(event, new Date('2025-06-01T15:00:00Z').getTime(),new Date('2025-06-01T17:00:00Z').getTime())).toBeTruthy();
    })
})
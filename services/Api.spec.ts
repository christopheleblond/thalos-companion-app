import { Activity } from "@/model/Activity"
import { Room } from "@/model/Room"
import { agendaEventMapper } from "./Api"

describe('Agenda event mapper tests', () => {
    it('Should map successfully json', () => {

        const activities: Activity[] = [
            {id: 'jds', name: 'JDS', style: {color: 'blue', backgroundColor: 'white'}},
            {id: 'jdr', name: 'JDR', style: {color: 'red', backgroundColor: 'white'}},
        ]

        const rooms: Room[] = [
            {id: 'main', name: 'Grande Salle'}
        ]

        const result = agendaEventMapper({
            id: '123456',
            name: 'Event name',
            day: {
                id: '2025-01-01'
            },
            room: {
                id: 'main'
            },
            startTime: 1735743600000,
            endTime: 1735750800000,
            durationInMinutes: 120,
            activity: {
                id: 'jdr'
            }
        }, rooms, activities)

        expect(result).toMatchInlineSnapshot(`
{
  "activity": {
    "id": "jdr",
    "name": "JDR",
    "style": {
      "backgroundColor": "white",
      "color": "red",
    },
  },
  "day": {
    "date": 2025-01-01T00:00:00.000Z,
    "id": "2025-01-01",
  },
  "durationInMinutes": 120,
  "endTime": 1735750800000,
  "id": "123456",
  "name": "Event name",
  "room": {
    "id": "main",
    "name": "Grande Salle",
  },
  "startTime": 1735743600000,
  "title": "Event name",
}
`)
    })
})
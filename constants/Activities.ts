import { Activity } from "@/model/Activity";
import { Colors } from "./Colors";

export const ACTIVITIES: Activity[] = [
    {
        id: 'jds',
        name: 'Jeu de société',
        style: { color: 'black', backgroundColor: Colors.orange }
    },
    {
        id: 'jdr',
        name: 'Jeu de rôle',
        style: { color: 'white', backgroundColor: Colors.blue }
    },
    {
        id: 'w40k',
        name: 'Warhammer 40K',
        style: { color: 'white', backgroundColor: Colors.purple }
    },
    {
        id: 'aos',
        name: 'Age Of Sigmar',
        style: { color: 'white', backgroundColor: Colors.green }
    },
    {
        id: 'bb',
        name: 'Bloodbowl',
        style: { color: 'white', backgroundColor: Colors.red2 }
    },
    {
        id: 'escape',
        name: 'Escape Game',
        style: { color: 'black', backgroundColor: Colors.orange2 }
    },
    {
        id: 'murder',
        name: 'Murder Party',
        style: { color: 'black', backgroundColor: Colors.lightgreen }
    },
    {
        id: 'reunion',
        name: 'Réunion',
        style: { color: 'white', backgroundColor: Colors.black2 }
    },
    {
        id: 'autre',
        name: 'Autre',
        style: { color: 'white', backgroundColor: Colors.gray }
    },
    {
        id: 'ae',
        name: 'Auberge Espagnole',
        style: { color: 'black', backgroundColor: Colors.yellow }
    }
]
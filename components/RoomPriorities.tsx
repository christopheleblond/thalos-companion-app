import { GameDay } from "@/model/GameDay";
import { getWeekNumber } from "@/utils/Utils";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type Props = ViewProps & {
    day: GameDay
}

export default function RoomPriorities({ day }: Props) {
    return <View style={styles.roomsPriorityActivities}>
        {/* Semaines paires Fig=Grande salle, Algéco=JDS */}
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>Grande salle & Annexe</Text>
            <Text>{getWeekNumber(day.date) % 2 === 0 ? 'Figurines' : 'Autres activités'}</Text>
        </View>
        <View style={{
            flex: 1, alignItems: 'center'
        }}>
            < Text style={{ fontWeight: 'bold' }}> Algéco</Text>
            <Text>{getWeekNumber(day.date) % 2 === 0 ? 'Autres activités' : 'Figurines'}</Text>
        </View>
    </View >
}

const styles = StyleSheet.create({
    roomsPriorityActivities: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'lightgray'
    }
})
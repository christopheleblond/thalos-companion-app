import { roomService } from "@/services/RoomService";
import { StyleSheet, Text, View } from "react-native";

export type Occupation = { hour: string, tables: number }

type Props = {
    roomId: string
}

export default function OccupationStats(props: Props) {

    const stats: Occupation[] = roomService.getRoomOccupationStats(props.roomId)

    return <View style={styles.container}>
        {stats && stats.filter(st => st.tables > 0).map(st => (<View key={st.hour} style={{ flex: 1, alignItems: 'center' }}>
            <Text>{st.tables}</Text>
            <View style={{ flex: 1, justifyContent: 'flex-end', width: 20 }}>
                <View style={[styles.stat, { height: st.tables * 3 }]} />
            </View>
            <Text>{st.hour}</Text>
        </View>))}
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1
    },
    stat: {
        margin: 2,
        backgroundColor: 'green'
    }
})
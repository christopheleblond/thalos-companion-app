import { Colors } from "@/constants/Colors";
import { AgendaEvent } from "@/model/AgendaEvent";
import { Room } from "@/model/Room";
import { roomService } from "@/services/RoomService";
import { clamp } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export type Occupation = { hour: string, tables: number, availableTables: number, rate?: number, roomCapacity: number }

type Props = {
    room: Room;
    dayId?: string;
    events?: AgendaEvent[],
}

export default function OccupationStats(props: Props) {

    const [stats, setStats] = useState<Occupation[]>([]);

    useEffect(() => {
        if (props.events) {
            roomService.getRoomOccupationStatsFromEvents(props.room, props.events)
                .then(stats => {
                    setStats(stats)
                })
        } else if (props.dayId) {
            roomService.getRoomOccupationStats(props.room, props.dayId)
                .then(stats => {
                    setStats(stats)
                })
        }

    }, [props.dayId, props.room, props.events]);

    const colorByOccupationRate = (rate: number | undefined) => {
        if (rate === undefined) {
            return Colors.gray;
        }
        if (rate >= 0.9) {
            return Colors.red;
        } else if (rate >= 0.75) {
            return Colors.orange;
        } else if (rate >= 0.5) {
            return Colors.orange2;
        } else {
            return Colors.green;
        }
    }

    return <>
        {!stats || stats.filter(s => s.tables > 0).length === 0 ? <Text style={{ color: 'gray', alignSelf: 'center' }}>Disponible toute la journée</Text> :
            <ScrollView style={styles.container} horizontal={true}>
                {stats && stats.map(st => (<View key={st.hour} style={{ flex: 1, alignItems: 'center' }}>
                    <Text>{st.tables > 0 && st.tables < st.roomCapacity ? st.tables : <MaterialIcons name={st.tables === 0 ? "check-circle" : "block"} color={st.tables === 0 ? Colors.green : Colors.red} />}</Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', width: 20 }}>
                        <View style={[styles.stat, { height: clamp(st.tables * 3, 0, 100), backgroundColor: colorByOccupationRate(st.rate) }]} />
                    </View>
                    {st.hour.endsWith('h') ? <Text>{st.hour}</Text> : <Text />}
                </View>))}
            </ScrollView>}</>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flex: 1
    },
    stat: {
        margin: 0,
        backgroundColor: 'green'
    }
})
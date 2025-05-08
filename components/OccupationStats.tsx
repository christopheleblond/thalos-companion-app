import { AgendaEvent } from "@/model/AgendaEvent";
import { roomService } from "@/services/RoomService";
import { clamp } from "@/utils/Utils";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export type Occupation = { hour: string, tables: number }

type Props = {
    roomId: string;
    dayId?: string;
    events?: AgendaEvent[]
}

export default function OccupationStats(props: Props) {

    const [stats, setStats] = useState<Occupation[]>([]);

    useEffect(() => {
        if (props.events) {
            roomService.getRoomOccupationStatsFromEvents(props.roomId, props.events)
                .then(stats => {
                    setStats(stats)
                })
        } else if (props.dayId) {
            roomService.getRoomOccupationStats(props.roomId, props.dayId)
                .then(stats => {
                    setStats(stats)
                })
        }

    }, [props.dayId, props.roomId, props.events]);

    return <>
        {!stats || stats.filter(s => s.tables > 0).length === 0 ? <Text style={{ color: 'gray', alignSelf: 'center' }}>Disponible toute la journée</Text> :
            <ScrollView style={styles.container} horizontal={true}>
                {stats && stats.map(st => (<View key={st.hour} style={{ flex: 1, alignItems: 'center' }}>
                    <Text>{st.tables}</Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end', width: 20 }}>
                        <View style={[styles.stat, { height: clamp(st.tables * 3, 0, 100) }]} />
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
        margin: 2,
        backgroundColor: 'green'
    }
})
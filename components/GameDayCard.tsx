import { AppContext } from "@/app/_layout";
import { Colors } from "@/constants/Colors";
import { AgendaEvent } from "@/model/AgendaEvent";
import { GameDay } from "@/model/GameDay";
import { agendaService } from "@/services/AgendaService";
import { printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Card, { CardProps } from "./Card";

type Props = CardProps & {
    day: GameDay
}

export default function GameDayCard({ day, ...props }: Props) {

    const appContext = useContext(AppContext)
    const [events, setEvents] = useState<AgendaEvent[]>([])
    const [loading, setLoading] = useState(false);

    const needARefresh = appContext.refreshs[`agenda.${day.id}`];

    useEffect(() => {
        setLoading(true);
        agendaService.findEventsOfDay(day.id)
            .then(events => {
                setEvents(events)
                setLoading(false)
            }).catch(error => {
                console.error(error);
                setLoading(false);
            })
    }, [day, needARefresh])

    return <Card style={[styles.container, day.date.getDay() === 5 ? styles.friday : null]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <MaterialIcons name="calendar-today" color={'gray'} />
            <Text style={styles.day}>{printGameDay(day)}</Text>
        </View>

        {loading ? <ActivityIndicator color={Colors.red} size={"small"} /> : null
        }
        <View style={{ paddingTop: 10 }}>
            {!events || events.length === 0 ? <Text style={styles.emptyText}>Aucun évènement prévu</Text> : null}
            {events && events.map(e => (<Text style={[styles.event, { ...e.activity?.style }]} key={e.id}>{e.start} - {e.activity?.name} : {e.title}</Text>))}
        </View>
    </Card >
}

const styles = StyleSheet.create({
    container: {

    },
    day: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'gray'
    },
    friday: {
        marginTop: 10,
        marginBottom: -1
    },
    event: {
        backgroundColor: 'gray',
        borderRadius: 5,
        padding: 5,
        marginBottom: 5
    },
    emptyText: {
        color: 'gray'
    }
})
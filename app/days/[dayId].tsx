import AgendaEventCard from "@/components/AgendaEventCard";
import Card from "@/components/Card";
import IconButton from "@/components/IconButton";
import CountingFormModal from "@/components/modals/CountingFormModal";
import EventFormModal from "@/components/modals/EventFormModal";
import OccupationStats from "@/components/OccupationStats";
import RoomPriorities from "@/components/RoomPriorities";
import { Colors } from "@/constants/Colors";
import { ROOMS } from "@/constants/Rooms";
import { AgendaEvent } from "@/model/AgendaEvent";
import { GameDay } from "@/model/GameDay";
import { agendaService } from "@/services/AgendaService";
import { calendarService } from "@/services/CalendarService";
import { printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { AppContext } from "../_layout";

export default function GameDayPage() {

    const appContext = useContext(AppContext)
    const router = useRouter();
    const params = useLocalSearchParams<{ dayId: string }>();
    const [day, setDay] = useState<GameDay | null>(null);
    const [previousDay, setPreviousDay] = useState<GameDay | null>(null)
    const [nextDay, setNextDay] = useState<GameDay | null>(null)

    const [events, setEvents] = useState<AgendaEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [eventFormModalVisible, setEventFormModalVisible] = useState(false);
    const [countingFormModalVisible, setCountingFormModalVisible] = useState(false);

    const goPrevious = () => {
        router.replace(`/days/${previousDay?.id}`)
    }

    const goNext = () => {
        router.replace(`/days/${nextDay?.id}`)
    }

    const realRooms = ROOMS.filter(r => !r.virtual)

    const needARefresh = appContext.refreshs[`agenda.${day?.id}`];

    useEffect(() => {
        setLoading(true)
        setDay({
            id: params.dayId,
            date: new Date(params.dayId)
        } as GameDay)

        agendaService.findEventsOfDay(params.dayId)
            .then(events => {
                setEvents(events)
                setLoading(false)
            }).catch(error => setLoading(false))
    }, [params.dayId, needARefresh])

    useEffect(() => {
        if (day) {
            setPreviousDay(calendarService.previousGameDay(day))
            setNextDay(calendarService.nextGameDay(day))
        }
    }, [day])

    return <View style={{ flex: 1, padding: 10 }}>

        <EventFormModal
            visible={eventFormModalVisible}
            dayId={params.dayId}
            closeFunction={() => setEventFormModalVisible(false)} onSuccess={(event) => {
                appContext.refresh(`home.events`)
                appContext.refresh(`agenda.${event?.day.id}`)
            }} />

        {day ? <CountingFormModal dayId={day?.id} title={`Comptage : ${printGameDay(day)}`} visible={countingFormModalVisible} closeFunction={() => setCountingFormModalVisible(false)} onSuccess={() => setCountingFormModalVisible(false)} /> : null}

        <View key="1" style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <IconButton icon="arrow-left" color="gray" onPress={() => goPrevious()} />
            {day ? <Text style={styles.dayText}>{printGameDay(day)}</Text> : null}
            <IconButton icon="arrow-right" color="gray" onPress={() => goNext()} />
        </View>
        {loading ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={Colors.red} size={50} /></View> : <ScrollView style={{ flex: 1 / 2 }}>
            {events?.length === 0 ? <View style={{ padding: 50, alignItems: 'center' }}>
                <Text>Rien de prévu pour l&lsquo;instant</Text>
            </View> : events.map(e => (<AgendaEventCard key={e.id} event={e} onPress={() => router.push(`/${e.id}`)} />))}
            <View style={{ flexDirection: 'row', padding: 10, alignSelf: 'center', backgroundColor: Colors.red, borderRadius: 50 }}>
                <IconButton icon="add" size={50} color={'white'} onPress={() => setEventFormModalVisible(true)} />
                <IconButton icon="pin" size={50} color={'white'} onPress={() => setCountingFormModalVisible(true)} />
            </View>
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingTop: 10 }}>
                    <MaterialIcons name="home" size={20} color={Colors.gray} />
                    <Text style={styles.subtitle}>Occupation des salles</Text>
                </View>
                {day ? <RoomPriorities day={day} /> : null}
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', paddingTop: 10 }}>
                    <MaterialIcons name="table-restaurant" size={20} color={Colors.gray} />
                    <Text style={styles.subtitle}>Nombre de tables utilisées</Text>
                </View>
                {realRooms.map(r => (<Card key={r.id}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                        <MaterialIcons name="location-on" size={20} />
                        <Text>{r.name} ({r.capacity} tables)</Text>
                    </View>

                    {day && <OccupationStats room={r} events={events} />}
                </Card>))}
            </View>
        </ScrollView>}
    </View>;
}

const styles = StyleSheet.create({
    dayText: {
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: 20,
        borderBottomWidth: 1
    },
    subtitle: {
        color: Colors.gray,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})
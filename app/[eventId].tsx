import AgendaEventCard from "@/components/AgendaEventCard";
import EventFormModal from "@/components/modals/EventFormModal";
import { Colors } from "@/constants/Colors";
import { AgendaEvent } from "@/model/AgendaEvent";
import { agendaService } from "@/services/AgendaService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppContext } from "./_layout";

export default function AgendaEventPage() {

    const appContext = useContext(AppContext);
    const router = useRouter();
    const params = useLocalSearchParams<{ eventId: string }>();
    const [event, setEvent] = useState<AgendaEvent | undefined>(undefined);
    const [refresh, setRefresh] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false)

    const onDelete = () => {
        appContext.refresh('home.events');
        appContext.refresh(`agenda.${event?.day.id}`)
        router.back();
    }

    useEffect(() => {
        setLoading(true)
        agendaService.findEventById(params.eventId)
            .then(e => {
                if (e === null) {
                    console.error('No event found with id ', params.eventId)
                } else {
                    setEvent(e);
                }
                setLoading(false)
            }).catch(error => setLoading(false))
    }, [params.eventId, refresh])

    return (<View style={styles.container}>
        {loading ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={Colors.red} size={50} /></View> : null}
        <EventFormModal event={event} title="Modifier" visible={editMode} closeFunction={() => setEditMode(false)} onSuccess={() => {
            setRefresh(new Date().toISOString());
            appContext.refresh('home.events');
            appContext.refresh(`agenda.${event?.day.id}`);
        }} />
        {event && !loading ? <AgendaEventCard event={event} complete={true} showButtons={true} onDelete={onDelete} onEdit={() => setEditMode(true)} /> : null}
    </View >)
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {

    },
    body: {}
})
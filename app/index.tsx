import AgendaEventCard from "@/components/AgendaEventCard";
import IconButton from "@/components/IconButton";
import EventFormModal from "@/components/modals/EventFormModal";
import SettingsFormModal from "@/components/modals/SettingsFormModal";
import { Colors } from "@/constants/Colors";
import { AgendaEvent } from "@/model/AgendaEvent";
import { agendaService } from "@/services/AgendaService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { AppContext } from "./_layout";

export default function Main() {

    const appContext = useContext(AppContext)

    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [eventFormModalVisible, setEventFormModalVisible] = useState(false);

    const router = useRouter();
    const [events, setEvents] = useState<AgendaEvent[]>([]);
    const [loading, setLoading] = useState(false)

    const needARefresh = appContext.refreshs['home.events']

    useEffect(() => {
        setLoading(true)
        agendaService.findAllEvents().then(events => {
            setEvents(events)
            setLoading(false)
        })
    }, [needARefresh])

    return (<SafeAreaView style={styles.container}>

        <SettingsFormModal visible={settingsModalVisible} closeFunction={() => setSettingsModalVisible(false)} onSuccess={(prefs) => { }} />
        <EventFormModal visible={eventFormModalVisible} closeFunction={() => setEventFormModalVisible(false)} onSuccess={(event) => {
            appContext.refresh(`home.events`)
            appContext.refresh(`agenda.${event?.day.id}`)
        }} />

        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Image source={require('@/assets/images/icon50.png')} width={50} height={24} />
                <Text style={{ color: 'white', fontWeight: 'bold', paddingLeft: 5, fontSize: 20, fontFamily: 'Flowers' }} >La Voie du Thalos</Text>
            </View>
            <IconButton icon="settings" onPress={() => setSettingsModalVisible(true)} />
        </View>

        <View style={styles.body}>
            <FlatList
                data={events}
                onRefresh={() => appContext.refresh('home.events')}
                refreshing={loading}
                keyExtractor={item => item.id}
                ListEmptyComponent={() => <View style={styles.emptyList}>
                    <MaterialIcons name={'close'} color={'gray'} size={50} />
                    <Text>Aucun évènement prévu.</Text>
                    <IconButton icon="refresh" color={'gray'} size={50} onPress={() => appContext.refresh('home.events')} />
                </View>}
                renderItem={({ item }) => (<AgendaEventCard key={item.id} event={item} onPress={() => router.push(`/${item.id}`)} />)} />
            <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                <IconButton style={styles.newButton} icon="add" onPress={() => setEventFormModalVisible(true)} />
            </View>
        </View>

    </SafeAreaView>);
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.red
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    headerRight: {
    },
    body: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 5,
        elevation: 2,
        backgroundColor: 'whitesmoke'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 60
    },
    newButton: {
        backgroundColor: Colors.red,
        elevation: 2,
        margin: 5,
        padding: 10,
        borderRadius: 50
    },
    emptyList: {
        flex: 1,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }
})


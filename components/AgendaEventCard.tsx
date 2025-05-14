import { Colors } from "@/constants/Colors";
import { durationToString } from "@/constants/Durations";
import { TOUTE_LA_SALLE } from "@/constants/Rooms";
import { AgendaEvent } from "@/model/AgendaEvent";
import { agendaService } from "@/services/AgendaService";
import { printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Card, { CardProps } from "./Card";
import IconButton from "./IconButton";

type Props = CardProps & {
    event: Partial<AgendaEvent>,
    complete?: boolean,
    showButtons?: boolean,
    onPress?: () => void,
    onEdit?: () => void,
    onDelete?: () => void
};

export default function AgendaEventCard({ style, event, ...rest }: Props) {

    const [loading, setLoading] = useState(false)

    const confirmDeleteEvent = (event: Partial<AgendaEvent>) => {
        Alert.alert(`Supprimer l'évènement ${event.title} ?`, "",
            [
                {
                    text: 'Annuler',
                    onPress: () => {
                    },
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    onPress: () => {
                        setLoading(true)
                        agendaService.deleteEvent(event.id!)
                            .then(() => {
                                if (rest.onDelete) {
                                    rest.onDelete()
                                }
                                setLoading(false);
                            })
                    }
                }
            ]);
    }

    const duration = event.durationInMinutes ? durationToString(event.durationInMinutes) : null;

    const { width, height } = Dimensions.get('window');

    return <Card style={{ flex: 1, borderLeftWidth: 10, borderLeftColor: event.activity?.style.backgroundColor }}>
        {loading ? <View style={[styles.backdropContainer, { width, height }]}>
            <View style={[styles.backdrop, { width, height }]}></View>
            <ActivityIndicator style={{ flex: 1, zIndex: 3 }} color={Colors.red} size={100} />
        </View> : null}
        <Pressable onPress={rest.onPress} style={[styles.container, {}, style]}>
            {/* TAG Activité */}
            {event.activity ? <View style={[styles.activity, { backgroundColor: event.activity.style.backgroundColor, alignSelf: 'flex-start' }]}>
                <Text style={styles.activityName}>{event.activity.name}</Text>
            </View> : null}
            {/* Date  */}
            {event.day ? <View style={styles.cardItem}>
                <Text style={styles.eventDateText}>{printGameDay(event.day)}</Text>
            </View> : <Text>?</Text>}
            {/* Heure de début-fin */}
            {event.start ? <View style={styles.hours}>
                <MaterialIcons name={'schedule'} color={'gray'} size={20} style={{ paddingRight: 3 }} />
                <Text style={styles.eventHoursText}>{event.start}</Text>
                {duration ? <Text style={styles.eventHoursText}> ({`${duration.label}`})</Text> : null}
            </View> : <Text>?</Text>}

            {/* Nom */}
            <View style={styles.title}>
                <Text style={{ fontSize: (event.title && event.title?.length < 15 ? 30 : event.title && event?.title?.length < 20 ? 25 : 20) }}>{event.title}</Text>
            </View>

            {/* Creator */}
            {rest.complete ? <View style={styles.creator}>
                {event.creator ? <View style={{ flexDirection: 'row', gap: 3 }}><Text>Crée par</Text><Text style={{ fontStyle: 'italic' }}>{event.creator.name}</Text></View> : null}
            </View> : null}

            {/* Description */}
            {rest.complete ? <ScrollView scrollEnabled={true} style={styles.description}>
                {event.description ? <Text>{event.description}</Text> : <Text>Pas de description</Text>}
            </ScrollView> : null}

            {/* Salle */}
            {event.room ? <View style={styles.location}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                    <MaterialIcons name={'location-on'} color={'gray'} size={20} />
                    <Text>{event.room.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialIcons name={'table-restaurant'} color={'gray'} size={20} />
                    <Text>: {event.tables !== TOUTE_LA_SALLE ? `${event.tables}` : 'Toute la salle'}</Text>
                </View>
            </View> : null}

            {rest.showButtons ? <View style={styles.buttons}>
                <IconButton icon="edit-note" color="gray" size={32} onPress={() => rest.onEdit ? rest.onEdit() : null} />
                <IconButton icon="delete" color={Colors.red} size={32} onPress={() => confirmDeleteEvent(event)} />
            </View> : null}
        </Pressable>
    </Card>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    cardItem: {
        alignItems: 'center'
    },
    hours: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        flexDirection: 'row',
        gap: 3,
        alignItems: 'center'
    },
    activity: {
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 50,
    },
    activityName: {
        fontSize: 10,
        color: 'white'
    },
    location: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    eventDateText: {
        textTransform: 'uppercase',
        fontSize: 18,
        fontWeight: 'bold'
    },
    eventHoursText: {
        fontSize: 16
    },
    creator: {

    },
    description: {
    },
    buttons: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    backdropContainer: {
        position: 'absolute',
        zIndex: 2,
    },
    backdrop: {
        position: 'absolute',
        zIndex: 2,
        backgroundColor: Colors.black,
        opacity: 0.5
    }
})
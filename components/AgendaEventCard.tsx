import { Colors } from "@/constants/Colors";
import { durationToString } from "@/constants/Durations";
import { AgendaEvent } from "@/model/AgendaEvent";
import { agendaService } from "@/services/AgendaService";
import { printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
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
                        agendaService.deleteEvent(event.id!).then(() => {
                            rest.onDelete ? rest.onDelete() : null;
                        })
                    }
                }
            ]);
    }

    const duration = event.durationInMinutes ? durationToString(event.durationInMinutes) : null;

    return <Card style={{ borderLeftWidth: 10, borderLeftColor: event.activity?.style.backgroundColor }}>
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
                <Text style={{ fontSize: 30 }}>{event.title}</Text>
            </View>

            {/* Creator */}
            {rest.complete ? <View style={styles.creator}>
                {event.creator ? <View style={{ flexDirection: 'row', gap: 3 }}><Text>Crée par</Text><Text style={{ fontStyle: 'italic' }}>{event.creator.name}</Text></View> : null}
            </View> : null}

            {/* Description */}
            {rest.complete ? <View style={styles.description}>
                {event.description ? <Text>{event.description}</Text> : <Text>Pas de description</Text>}
            </View> : null}

            {/* Salle */}
            {event.room ? <View style={styles.location}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                    <MaterialIcons name={'location-on'} color={'gray'} size={20} />
                    <Text>{event.room.name}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <MaterialIcons name={'table-restaurant'} color={'gray'} size={20} />
                    <Text>: {event.tables !== 99 ? `${event.tables}` : 'Toute la salle'}</Text>
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
        flex: 1,
        margin: 5,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    buttons: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    }
})
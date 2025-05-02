import { Colors } from "@/constants/Colors";
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

    return <Pressable android_ripple={{ color: Colors.red, foreground: true }} onPress={rest.onPress}>
        <Card style={[styles.container, { borderLeftColor: event.activity?.style.backgroundColor }, style]}>
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
                {event.end ? <Text style={styles.eventHoursText}> - {event.end}</Text> : null}
            </View> : <Text>?</Text>}

            {/* Nom */}
            <View style={styles.title}>
                <Text style={{ fontSize: 30 }}>{event.title}</Text>
            </View>

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

            {/* Description */}
            {rest.complete ? <View style={styles.description}>
                <Text>{event.description}</Text>
            </View> : null}

            {rest.showButtons ? <View style={styles.buttons}>
                <IconButton icon="edit-note" color="gray" size={32} onPress={() => rest.onEdit ? rest.onEdit() : null} />
                <IconButton icon="delete" color={Colors.red} size={32} onPress={() => confirmDeleteEvent(event)} />
            </View> : null}
        </Card>
    </Pressable>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        borderLeftWidth: 10
    },
    cardItem: {
        flex: 1,
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
    description: {
        margin: 5,
        alignSelf: 'flex-start'
    },
    buttons: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    }
})
import { ACTIVITIES } from "@/constants/Activities";
import { Colors } from "@/constants/Colors";
import { Durations } from "@/constants/Durations";
import { ROOMS, TABLES, TOUTE_LA_SALLE } from "@/constants/Rooms";
import { Room } from "@/model/Room";
import { agendaService } from "@/services/AgendaService";
import { calendarService } from "@/services/CalendarService";
import { CustomFormProps, hasError } from "@/utils/FormUtils";
import { clamp, eventIsInTimeSlot, fromGameDayId, getEndTime, getStartTime, printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import IconButton from "../IconButton";
import { FormData } from "../modals/EventFormModal";
import CustomSelect from "./CustomSelect";
import FormInputText from "./FormInputText";

export function RoomSelectOption({ room, remainingTables }: { room: Room, remainingTables: number }) {

    return <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                {remainingTables === 0 ? <IconButton icon="warning" color={Colors.red} size={20} /> : null}
                <Text style={[styles.optionText, remainingTables === 0 ? { color: Colors.red } : null]}>{room.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={[styles.optionText, remainingTables === 0 ? { color: Colors.red } : null]}>{remainingTables}</Text>
                <MaterialIcons name="table-restaurant" />
            </View>

        </View>
        {remainingTables === 0 ? <View>
            <Text style={styles.optionRoomFull}>Plus de table de disponible !</Text>
        </View> : null}
    </>
}

type RemaingTables = {
    [roomId: string]: number;
}

export default function EventForm(props: CustomFormProps<FormData>) {

    const days = calendarService.buildDaysFromDate(new Date(), 60);
    const hours = calendarService.hours();
    const durations = Durations;
    const [rooms, setRooms] = useState<Room[]>([])

    const init = ROOMS.map(r => ({ [r.id]: r.capacity || TOUTE_LA_SALLE }))
        .reduce((prev, cur) => {
            const roomId = Object.keys(cur)[0]
            const value = cur[roomId]
            return {
                ...prev,
                [roomId]: value
            }
        }, {} as RemaingTables)

    const [roomOccupations, setRoomOccupations] = useState<RemaingTables>(init)

    useEffect(() => {
        let currentOccupation = { ...init }
        if (props.formData.dayId && props.formData.start && props.formData.durationInMinutes > 0) {
            const day = fromGameDayId(props.formData.dayId)
            const startTime = getStartTime(day!, props.formData.start)
            const endTime = getEndTime(day!, props.formData.start, props.formData.durationInMinutes)
            agendaService.findEventsOfDay(props.formData.dayId).then(events => {
                console.log('events', events.map(e => e.id))
                events
                    .filter(e => e.id !== props.formData.id
                        && eventIsInTimeSlot(e, startTime, endTime)
                    )
                    .forEach(event => {
                        currentOccupation = {
                            ...currentOccupation,
                            [event.roomId!]: clamp((currentOccupation[event.roomId!] - (event.tables || 0)), 0, 100)
                        }
                    })
                setRoomOccupations(currentOccupation)
            })
        }

    }, [props.formData.id, props.formData.dayId, props.formData.start, props.formData.durationInMinutes])

    const getRemainingTablesOfRoom = (room: Room) => {
        return roomOccupations[room.id] ?? 0
    }

    return <ScrollView>
        <FormInputText disabled={props.disabled}
            label="Nom"
            value={props.formData.title}
            onChangeText={(text) => props.onChange({ ...props.formData, title: text })} />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? <Text style={styles.fieldError}>Le nom est obligatoire</Text> : null}
        {props.state?.submitted && (hasError(props.errors, 'nameIsLower') || hasError(props.errors, 'nameIsHigher')) ? <Text style={styles.fieldError}>Le nom doit être entre 3 et 20 caractères</Text> : null}
        {props.state?.submitted && hasError(props.errors, 'nameIsInvalid') ? <Text style={styles.fieldError}>Le nom doit être alphanumérique (caractères spéciaux autorisés : # @ *)</Text> : null}

        <CustomSelect label="Date"
            data={days}
            getId={(d) => d.id}
            value={props.formData.dayId}
            onChange={(it) => props.onChange({ ...props.formData, dayId: it.id })}
            renderOptionText={(it) => printGameDay(it)}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'dateIsEmpty') ? <Text style={styles.fieldError}>La date est obligatoire</Text> : null}

        <CustomSelect label="Début à"
            data={hours}
            getId={(h) => h}
            value={props.formData.start}
            onChange={(it) => props.onChange({ ...props.formData, start: it })}
            renderOptionText={(it: string) => it}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'startHourIsEmpty') ? <Text style={styles.fieldError}>L&lsquo;heure de début est obligatoire</Text> : null}

        <CustomSelect label="Durée"
            data={durations}
            getId={(h) => h.valueInMinutes}
            value={props.formData.durationInMinutes}
            onChange={(it) => props.onChange({ ...props.formData, durationInMinutes: it.valueInMinutes })}
            renderOptionText={(it) => it.label}
            disabled={props.disabled}
        />

        <CustomSelect label="Activité principale"
            data={ACTIVITIES}
            getId={(r) => r.id}
            value={props.formData.activityId}
            onChange={(it) => props.onChange({ ...props.formData, activityId: it.id })}
            renderOptionText={(it) => it.name}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'activityIsEmpty') ? <Text style={styles.fieldError}>L&lsquo;activité principale est obligatoire</Text> : null}

        {props.formData.dayId && props.formData.start && props.formData.durationInMinutes ? <CustomSelect label="Salle"
            data={ROOMS}
            getId={(r) => r.id}
            value={props.formData.roomId}
            onChange={(it) => props.onChange({ ...props.formData, roomId: it.id })}
            renderOptionText={(it) => (it.name)}
            renderOption={(it) => (<RoomSelectOption room={it} remainingTables={getRemainingTablesOfRoom(it) ?? 0} />)}
            isOptionDisabled={(it) => getRemainingTablesOfRoom(it) === 0}
            disabled={props.disabled}
        /> : null}
        {props.state?.submitted && hasError(props.errors, 'roomIsEmpty') ? <Text style={styles.fieldError}>La salle est obligatoire</Text> : null}

        <CustomSelect label="Nombre de tables à réserver"
            data={TABLES}
            getId={(t) => t}
            value={props.formData.tables}
            onChange={(t) => props.onChange({ ...props.formData, tables: t })}
            renderOptionText={(t) => t === TOUTE_LA_SALLE ? 'Toute la salle' : t + ' tables'}
            disabled={props.disabled}
        />

        <FormInputText
            disabled={props.disabled}
            multiline={true} numberOfLines={10}
            label="Description"
            value={props.formData.description || ''}
            onChangeText={(text) => props.onChange({ ...props.formData, description: text })} />
    </ScrollView>
}

const styles = StyleSheet.create({
    fieldError: {
        color: Colors.red
    },
    optionText: {
        color: Colors.black
    },
    optionRoomFull: {
        backgroundColor: Colors.red,
        padding: 5,
        marginTop: 5,
        borderRadius: 50,
        color: Colors.white,
        alignContent: 'center'
    }
})
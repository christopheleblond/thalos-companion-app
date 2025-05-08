import { ACTIVITIES } from "@/constants/Activities";
import { Colors } from "@/constants/Colors";
import { Durations } from "@/constants/Durations";
import { ROOMS, TABLES } from "@/constants/Rooms";
import { Room } from "@/model/Room";
import { calendarService } from "@/services/CalendarService";
import { CustomFormProps, hasError } from "@/utils/FormUtils";
import { printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FormData } from "../modals/EventFormModal";
import CustomSelect from "./CustomSelect";
import FormInputText from "./FormInputText";

export function RoomSelectOption({ room, remainingTables }: { room: Room, remainingTables: number }) {

    return <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.optionText}>{room.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Text style={styles.optionText}>{remainingTables}
                </Text>
                <MaterialIcons name="table-restaurant" />
            </View>
        </View>
    </>
}

export default function EventForm(props: CustomFormProps<FormData>) {

    const days = calendarService.buildDaysFromDate(new Date(), 60);
    const hours = calendarService.hours();
    const durations = Durations;

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

        <CustomSelect label="Salle"
            data={ROOMS}
            getId={(r) => r.id}
            value={props.formData.roomId}
            onChange={(it) => props.onChange({ ...props.formData, roomId: it.id })}
            renderOption={(it) => (<RoomSelectOption room={it} remainingTables={0} />)}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'roomIsEmpty') ? <Text style={styles.fieldError}>La salle est obligatoire</Text> : null}

        <CustomSelect label="Nombre de tables à réserver"
            data={TABLES}
            getId={(t) => t}
            value={props.formData.tables}
            onChange={(t) => props.onChange({ ...props.formData, tables: t })}
            renderOptionText={(t) => t === 99 ? 'Toute la salle' : t + ' tables'}
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
    }
})
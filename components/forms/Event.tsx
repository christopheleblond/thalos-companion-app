import { ACTIVITIES } from "@/constants/Activities";
import { Colors } from "@/constants/Colors";
import { Durations } from "@/constants/Durations";
import { ROOMS, TABLES } from "@/constants/Rooms";
import { calendarService } from "@/services/CalendarService";
import { CustomFormProps, hasError } from "@/utils/FormUtils";
import { printGameDay } from "@/utils/Utils";
import { ScrollView, StyleSheet, Text } from "react-native";
import { FormData } from "../modals/EventForm";
import CustomSelect from "./CustomSelect";
import FormInputText from "./FormInputText";

export default function EventForm(props: CustomFormProps<FormData>) {

    const days = calendarService.buildDaysFromDate(new Date(), 60);
    const hours = calendarService.hours();
    const durations = Durations;

    return <ScrollView>
        <FormInputText disabled={props.disabled}
            label="Nom"
            value={props.formData.name}
            onChangeText={(text) => props.onChange({ ...props.formData, name: text })} />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? <Text style={styles.fieldError}>Le nom est obligatoire</Text> : null}
        {props.state?.submitted && (hasError(props.errors, 'nameIsLower') || hasError(props.errors, 'nameIsHigher')) ? <Text style={styles.fieldError}>Le nom doit être entre 3 et 20 caractères</Text> : null}
        {props.state?.submitted && hasError(props.errors, 'nameIsInvalid') ? <Text style={styles.fieldError}>Le nom doit être alphanumérique (caractères spéciaux autorisés : # @ *)</Text> : null}

        <CustomSelect label="Date"
            data={days}
            getId={(d) => d.id}
            value={props.formData.dayId}
            onChange={(it) => props.onChange({ ...props.formData, dayId: it.id })}
            renderLabel={(it) => printGameDay(it)}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'dateIsEmpty') ? <Text style={styles.fieldError}>La date est obligatoire</Text> : null}

        <CustomSelect label="Début à"
            data={hours}
            getId={(h) => h}
            value={props.formData.start}
            onChange={(it) => props.onChange({ ...props.formData, start: it })}
            renderLabel={(it) => it}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'startHourIsEmpty') ? <Text style={styles.fieldError}>L'heure de début est obligatoire</Text> : null}

        <CustomSelect label="Durée"
            data={durations}
            getId={(h) => h.valueInMinutes}
            value={props.formData.duration}
            onChange={(it) => props.onChange({ ...props.formData, duration: it.valueInMinutes })}
            renderLabel={(it) => it.label}
            disabled={props.disabled}
        />

        <CustomSelect label="Activité principale"
            data={ACTIVITIES}
            getId={(r) => r.id}
            value={props.formData.activityId}
            onChange={(it) => props.onChange({ ...props.formData, activityId: it.id })}
            renderLabel={(it) => it.name}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'activityIsEmpty') ? <Text style={styles.fieldError}>L'activité principale est obligatoire</Text> : null}

        <CustomSelect label="Salle"
            data={ROOMS}
            getId={(r) => r.id}
            value={props.formData.roomId}
            onChange={(it) => props.onChange({ ...props.formData, roomId: it.id })}
            renderLabel={(it) => it.name}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'roomIsEmpty') ? <Text style={styles.fieldError}>La salle est obligatoire</Text> : null}

        <CustomSelect label="Nombre de tables à réserver"
            data={TABLES}
            getId={(t) => t}
            value={props.formData.tables}
            onChange={(t) => props.onChange({ ...props.formData, tables: t })}
            renderLabel={(t) => t === 99 ? 'Toute la salle' : t}
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
    }
})
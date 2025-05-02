import { ACTIVITIES } from "@/constants/Activities";
import { ROOMS, TABLES } from "@/constants/Rooms";
import { calendarService } from "@/services/CalendarService";
import { printGameDay } from "@/utils/Utils";
import { ScrollView, Text } from "react-native";
import { FormData, FormState, ValidationErrors } from "../modals/EventForm";
import CustomSelect from "./CustomSelect";
import FormInputText from "./FormInputText";

type Props = {
    errors?: ValidationErrors,
    state?: FormState,
    onChange: (formData: FormData) => void,
    formData: FormData,
    disabled?: boolean
}

function hasError(errors: ValidationErrors | undefined, error: string): boolean {
    return !!errors && errors && errors[error];
}

export default function EventForm(props: Props) {

    const days = calendarService.buildDaysFromDate(new Date(), 60);
    const hours = calendarService.hours();

    return <ScrollView>
        <FormInputText disabled={props.disabled}
            label="Nom"
            value={props.formData.name}
            onChangeText={(text) => props.onChange({ ...props.formData, name: text })} />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? <Text>Le nom est obligatoire</Text> : null}

        <CustomSelect label="Date"
            data={days}
            getId={(d) => d.id}
            value={props.formData.dayId}
            onChange={(it) => props.onChange({ ...props.formData, dayId: it.id })}
            renderLabel={(it) => printGameDay(it)}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'dateIsEmpty') ? <Text>La date est obligatoire</Text> : null}

        <CustomSelect label="Début à"
            data={hours}
            getId={(h) => h}
            value={props.formData.start}
            onChange={(it) => props.onChange({ ...props.formData, start: it })}
            renderLabel={(it) => it}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'startHourIsEmpty') ? <Text>L'heure de début est obligatoire</Text> : null}

        <CustomSelect label="Fin à"
            data={['-', ...hours]}
            getId={(h) => h}
            value={props.formData.end}
            onChange={(it) => props.onChange({ ...props.formData, end: it })}
            renderLabel={(it) => it}
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
        {props.state?.submitted && hasError(props.errors, 'activityIsEmpty') ? <Text>L'activité principale est obligatoire</Text> : null}

        <CustomSelect label="Salle"
            data={ROOMS}
            getId={(r) => r.id}
            value={props.formData.roomId}
            onChange={(it) => props.onChange({ ...props.formData, roomId: it.id })}
            renderLabel={(it) => it.name}
            disabled={props.disabled}
        />
        {props.state?.submitted && hasError(props.errors, 'roomIsEmpty') ? <Text>La salle est obligatoire</Text> : null}

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
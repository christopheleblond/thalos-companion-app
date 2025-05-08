import { JUSQUA_LA_FERMETURE } from "@/constants/Durations";
import { TOUTE_LA_SALLE } from "@/constants/Rooms";
import { useUser } from "@/hooks/useUser";
import { AgendaEvent } from "@/model/AgendaEvent";
import { agendaService } from "@/services/AgendaService";
import { FormState, isFormValid, ValidationErrors, Validators } from "@/utils/FormUtils";
import { isEmpty } from "@/utils/Utils";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import EventForm from "../forms/EventForm";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";

export type FormData = {
    id?: string;
    title: string;
    dayId: string;
    start: string;
    end?: string;
    activityId: string;
    roomId: string;
    tables?: number;
    durationInMinutes: number;
    description?: string;
    creatorId?: string;
}

type Props = ModalPageProps & {
    onSuccess: (event: AgendaEvent) => void,
    title?: string,
    dayId?: string,
    roomId?: string,
    activityId?: string,
    event?: AgendaEvent
};

function validateForm(formData: FormData): ValidationErrors {
    return {
        nameIsEmpty: isEmpty(formData.title),
        nameIsLower: Validators.min(formData.title, 3),
        nameIsHigher: Validators.max(formData.title, 20),
        nameIsInvalid: !Validators.allowedCharacters(formData.title),
        dateIsEmpty: isEmpty(formData.dayId),
        dateIsPassed: Validators.dateIsPassed(new Date(formData.dayId)),
        startHourIsEmpty: isEmpty(formData.start),
        roomIsEmpty: isEmpty(formData.roomId),
        activityIsEmpty: isEmpty(formData.activityId)
    }
}

export default function EventFormModal(props: Props) {

    const emptyForm = ({ dayId, roomId, activityId, event }: Props) => ({
        id: undefined,
        title: '',
        dayId: dayId ?? '',
        start: '',
        durationInMinutes: JUSQUA_LA_FERMETURE.valueInMinutes,
        roomId: roomId ?? '',
        activityId: activityId ?? '',
        tables: TOUTE_LA_SALLE,
        description: '',
        ...(event ? event : {}),
    })

    const [formData, setFormData] = useState<FormData>(emptyForm(props));

    const [formState, setFormState] = useState<FormState>({ submitted: false });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [saving, setSaving] = useState(false)
    const user = useUser()

    const resetForm = () => {
        setFormData(emptyForm(props));
        setFormState({ submitted: false });
        setErrors({})
    }

    const saveForm = (formData: FormData) => {
        setSaving(true)
        agendaService.saveEvent({
            ...formData,
            creator: user != null ? user : {}
        } as Partial<AgendaEvent>).then((res) => {
            setSaving(false);
            try {
                props.onSuccess(res);
            } catch (error) {
                console.error('An error occured in success function', error)
            }

            props.closeFunction();
        })
    }

    const ACTIONS: ModalAction[] = [
        {
            name: 'cancel',
            label: 'Annuler',
            color: 'gray',
            onPress: () => props.closeFunction ? props.closeFunction() : console.error('No close function defined')
        },
        {
            name: 'save',
            label: 'Enregistrer',
            onPress: () => {
                setFormState({ ...formState, submitted: true })
                if (isFormValid(errors)) {
                    saveForm(formData)
                } else {
                    Alert.alert('Invalid', 'Le formulaire est invalide')
                }
            }
        }
    ]

    useEffect(() => {
        const errors = validateForm(formData);
        setErrors(errors);
    }, [formData])

    return (<ModalPage {...props} onShow={resetForm} options={{ title: props.title || 'Créer', actions: ACTIONS }}>
        <EventForm formData={formData} errors={errors} state={formState} onChange={newFormData => setFormData(newFormData)} disabled={saving} />
    </ModalPage>)
}

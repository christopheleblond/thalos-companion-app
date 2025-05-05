import { useUser } from "@/hooks/useUser";
import { AgendaEvent } from "@/model/AgendaEvent";
import { User } from "@/model/User";
import { agendaService } from "@/services/AgendaService";
import { FormState, isFormValid, ValidationErrors, Validators } from "@/utils/FormUtils";
import { isEmpty } from "@/utils/Utils";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import EventForm from "../forms/Event";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";

export type FormData = {
    name: string;
    dayId: string;
    start: string;
    end?: string;
    activityId: string;
    roomId: string;
    tables?: number;
    duration: number;
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
        nameIsEmpty: isEmpty(formData.name),
        nameIsLower: Validators.min(formData.name, 3),
        nameIsHigher: Validators.max(formData.name, 20),
        nameIsInvalid: !Validators.allowedCharacters(formData.name),
        dateIsEmpty: isEmpty(formData.dayId),
        dateIsPassed: Validators.dateIsPassed(new Date(formData.dayId)),
        startHourIsEmpty: isEmpty(formData.start),
        roomIsEmpty: isEmpty(formData.roomId),
        activityIsEmpty: isEmpty(formData.activityId)
    }
}

export default function EventFormModal(props: Props) {

    const [formData, setFormData] = useState<FormData>({

        name: '',
        dayId: props.dayId ?? '',
        start: '',
        duration: 99,
        roomId: props.roomId ?? '',
        activityId: props.activityId ?? '',
        tables: 99,
        description: '',
        ...(props.event ? props.event : {}),
    });

    const [formState, setFormState] = useState<FormState>({ submitted: false });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [saving, setSaving] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useUser()
        .then(user => user != null ? setUser(user) : null)

    const resetForm = () => {
        setFormData({
            name: '',
            dayId: props.dayId ?? '',
            start: '',
            duration: 99,
            roomId: props.roomId ?? '',
            activityId: props.activityId ?? '',
            tables: 99,
            description: '',
            ...(props.event ? props.event : {}),
        });
        setFormState({ submitted: false });
        setErrors({})
    }

    const ACTIONS: ModalAction[] = [
        {
            name: 'cancel',
            label: 'Annuler',
            onPress: () => props.closeFunction ? props.closeFunction() : console.error('No close function defined')
        },
        {
            name: 'save',
            label: 'Enregistrer',
            onPress: () => {
                setFormState({ ...formState, submitted: true })
                if (isFormValid(errors)) {
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

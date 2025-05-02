import { AgendaEvent } from "@/model/AgendaEvent";
import { agendaService } from "@/services/AgendaService";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import EventForm from "../forms/Event";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";

export type ValidationErrors = Record<string, boolean>;

export type FormData = {
    name: string;
    dayId: string;
    start: string;
    end?: string;
    activityId: string;
    roomId: string;
    tables?: number;
    description?: string;
}

type Props = ModalPageProps & {
    onSuccess: (event: AgendaEvent) => void,
    event?: AgendaEvent
};

function isEmpty(value: string): boolean {
    return !value || value.trim() === ''
}

function validateForm(formData: FormData): ValidationErrors {
    return {
        nameIsEmpty: isEmpty(formData.name),
        dateIsEmpty: isEmpty(formData.dayId),
        dateIsPassed: false,
        startHourIsEmpty: isEmpty(formData.start),
        roomIsEmpty: isEmpty(formData.roomId),
        activityIsEmpty: isEmpty(formData.activityId)
    }
}

function isFormValid(errors: ValidationErrors): boolean {
    return !errors || Object.keys(errors).every(e => !errors[e])
}

export type FormState = {
    submitted: boolean
}

export default function EventFormModal(props: Props) {

    const [formData, setFormData] = useState<FormData>({

        name: '',
        dayId: '',
        start: '',
        roomId: '',
        activityId: '',
        tables: 99,
        description: '',
        ...(props.event ? props.event : {}),
    });

    const [formState, setFormState] = useState<FormState>({ submitted: false });
    const [errors, setErrors] = useState<ValidationErrors>({});

    const [saving, setSaving] = useState(false)

    const resetForm = () => {
        setFormData({
            name: '',
            dayId: '',
            start: '',
            roomId: '',
            activityId: '',
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
                        ...formData
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

    return (<ModalPage {...props} onShow={resetForm} options={{ title: 'Créer', actions: ACTIONS }}>
        <EventForm formData={formData} errors={errors} state={formState} onChange={newFormData => setFormData(newFormData)} disabled={saving} />
    </ModalPage>)
}

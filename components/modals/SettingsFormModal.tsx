import { Colors } from "@/constants/Colors";
import { UserPreferences } from "@/model/UserPreferences";
import { settingsService } from "@/services/SettingsService";
import { userService } from "@/services/UserService";
import { FormState, isFormValid, ValidationErrors } from "@/utils/FormUtils";
import { isEmpty } from "@/utils/Utils";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";
import SettingsForm from "../forms/SettingsForm";

type Props = ModalPageProps & {
    onSuccess: (prefs: UserPreferences) => void
};

function validateForm(formData: UserPreferences): ValidationErrors {
    return {
        firstNameIsEmpty: isEmpty(formData.firstName),
        nameIsEmpty: isEmpty(formData.name)
    }
}

export default function SettingsFormModal(props: Props) {

    const [userPreferences, setUserPreferences] = useState<UserPreferences>({ id: '', firstName: '', name: '', activities: {}, isNew: true })
    const [formState, setFormState] = useState<FormState>({ submitted: false });
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        userService.getUserId()
            .then(userId => {
                return settingsService.get()
                    .then(prefs => {
                        if (prefs === null) {
                            setUserPreferences({ id: userId, name: '', firstName: '', isNew: true } as UserPreferences)
                        } else {
                            setUserPreferences(prefs)
                        }
                        setLoading(false)
                    })
            }).catch(err => setLoading(false))
    }, [])

    useEffect(() => {
        const errors = validateForm(userPreferences);
        setErrors(errors);
    }, [userPreferences])

    const ACTIONS: ModalAction[] = [
        {
            name: 'cancel',
            label: 'Annuler',
            disabled: loading || saving,
            color: 'gray',
            onPress: () => props.closeFunction ? props.closeFunction() : console.error('No close function defined')
        },
        {
            name: 'save',
            label: 'Enregistrer',
            disabled: loading || saving,
            onPress: () => {
                setFormState({ ...formState, submitted: true })
                if (isFormValid(errors)) {
                    setSaving(true)
                    settingsService.save({
                        ...userPreferences
                    } as UserPreferences).then((res) => {
                        setSaving(false);
                        if (props.onSuccess) {
                            try {
                                props.onSuccess(res);
                            } catch (error) {
                                console.error('An error occured in success function', error)
                            }
                        }
                        props.closeFunction();
                    })
                }
            }
        }
    ]

    return <ModalPage {...props} options={{ title: 'Préférences', actions: ACTIONS }}>
        {loading || saving ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={Colors.red} size={50} /></View> : null}
        {!loading && !saving ? <SettingsForm formData={userPreferences} state={formState} errors={errors} disabled={saving} onChange={setUserPreferences} /> : null}
    </ModalPage>
}
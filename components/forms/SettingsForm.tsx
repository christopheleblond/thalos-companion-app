import { ACTIVITIES } from "@/constants/Activities";
import { Colors } from "@/constants/Colors";
import { Activity } from "@/model/Activity";
import { parseYesOrNo, UserPreferences, YesOrNo } from "@/model/UserPreferences";
import { CustomFormProps, hasError } from "@/utils/FormUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import IconButton from "../IconButton";
import FormInputText from "./FormInputText";
import Radio from "./Radio";

type ActivityOption = {
    value: YesOrNo,
    label: string
}

export default function SettingsForm(props: CustomFormProps<UserPreferences>) {
    const clearLocalData = () => {
        Alert.alert('Réinitialiser toutes les données', 'Toutes les données locales vont être supprimées. Ok ?', [
            {
                text: 'Annuler',
                style: 'cancel'
            },
            {
                text: 'Supprimer',
                style: "destructive",
                onPress: () => {
                    AsyncStorage.clear(() => props.onChange({ ...props.formData, id: '', activities: {} }))
                }
            }
        ])
    }

    const activityChange = (activity: Activity, value: YesOrNo | undefined) => {
        props.onChange({
            ...props.formData,
            activities: { ...props.formData.activities, [activity.id]: (value ?? 'yes') }
        })
    }

    return <ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>ID: {props.formData.id}</Text>
            <IconButton icon="delete" color={Colors.black} size={30} onPress={clearLocalData} />
        </View>

        <FormInputText disabled={props.disabled}
            label="Prénom"
            value={props.formData?.firstName || ''}
            onChangeText={(text) => props.onChange({ ...props.formData, firstName: text })}
        />
        {props.state?.submitted && hasError(props.errors, 'firstNameIsEmpty') ? <Text style={styles.fieldError}>Le prénom est obligatoire</Text> : null}

        <FormInputText disabled={props.disabled}
            label="Pseudo"
            value={props.formData?.name || ''}
            onChangeText={(text) => props.onChange({ ...props.formData, name: text })} />
        {props.state?.submitted && hasError(props.errors, 'nameIsEmpty') ? <Text style={styles.fieldError}>Le pseudo est obligatoire</Text> : null}

        <View>
            <Text>Activités</Text>
            {ACTIVITIES.map(act => (
                <Radio key={act.id}
                    label={act.name}
                    options={[{ value: 'yes', label: 'Oui' } as ActivityOption, { value: 'no', label: 'Non' } as ActivityOption]}
                    value={props.formData.activities ? props.formData.activities[act.id] : 'yes'}
                    onChange={(val) => activityChange(act, parseYesOrNo(val))}
                />))}
        </View>

    </ScrollView>
}

const styles = StyleSheet.create({
    fieldError: {
        color: Colors.red
    }
})
import { ACTIVITIES } from "@/constants/Activities";
import { Colors } from "@/constants/Colors";
import { DayCounts } from "@/model/Counting";
import { countingService } from "@/services/CountingService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Card from "../Card";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";
import NumberInput from "../forms/NumberInput";

type Props = ModalPageProps & {
    title?: string,
    dayId: string,
    onSuccess: () => void,
    onChange?: (counts: DayCounts) => void
}

export default function CountingFormModal(props: Props) {

    const [counts, setCounts] = useState<DayCounts>({
        dayId: props.dayId
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        countingService.getCounting(props.dayId).then(counts => {
            if (counts !== null) {
                setCounts(counts)
            } else {
                setCounts({ dayId: props.dayId } as DayCounts)
            }
            setLoading(false)
        })
    }, [props.dayId])

    const ACTIONS: ModalAction[] = [
        {
            name: 'cancel',
            label: 'Annuler',
            disabled: loading,
            color: 'gray',
            onPress: () => props.closeFunction ? props.closeFunction() : console.error('No close function defined')
        },
        {
            name: 'save',
            label: 'Enregistrer',
            disabled: loading,
            onPress: () => {
                console.log('Save counts', counts)
                setLoading(true)
                countingService.saveOrUpdateCounting(counts)
                    .then(() => {
                        setLoading(false)
                        if (props.onSuccess) {
                            props.onSuccess()
                        }
                    })
                    .catch(err => setLoading(false))
            }
        }
    ]

    const setActivityCounts = (period: 'afternoon' | 'night', activityId: string, count: number): void => {
        setCounts(prev => {
            return {
                ...prev,
                [period]: { ...prev[period], [activityId]: count }
            }
        })
    }

    useEffect(() => {
        if (props.onChange) props.onChange(counts)
    }, [counts])

    const activities = ACTIVITIES.filter(a => a.countable);

    return <ModalPage {...props} options={{ title: props.title, actions: ACTIONS }}>
        {loading ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={Colors.red} size={50} /></View> : null}
        {!loading ? <ScrollView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <MaterialIcons name="sunny" size={30} />
                <Text style={{ fontSize: 20 }}>Après-midi</Text>
            </View>
            <View style={{ flex: 1 }}>
                {activities.map(act => (<Card key={act.id} style={{ flex: 1 }}>
                    <NumberInput label={act.name} value={counts.afternoon && counts.afternoon[act.id] !== undefined ? counts.afternoon[act.id] : 0} onChange={count => setActivityCounts('afternoon', act.id, count)} />
                </Card>))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <MaterialIcons name="nightlight" size={30} />
                <Text style={{ fontSize: 20 }}>Soirée</Text>
            </View>
            {activities.map(act => (<Card key={act.id} style={{ flex: 1 }}>
                <NumberInput label={act.name} value={counts.night && counts.night[act.id] !== undefined ? counts.night[act.id] : 0} onChange={count => setActivityCounts('night', act.id, count)} />
            </Card>))}
        </ScrollView> : null}
    </ModalPage>
}
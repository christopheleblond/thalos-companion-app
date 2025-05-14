import { GameDay } from "@/model/GameDay";
import { OpenCloseRoom } from "@/model/Room";
import { User } from "@/model/User";
import { calendarService } from "@/services/CalendarService";
import { roomService } from "@/services/RoomService";
import { userService } from "@/services/UserService";
import { printGameDay } from "@/utils/Utils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Card from "../Card";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";
import CustomSelect from "../forms/CustomSelect";

type Props = ModalPageProps & {
    day: GameDay,
    onSuccess: () => void
};

export default function OpenCloseRoomConfigModal({ day, onSuccess, ...props }: Props) {

    const [loading, setLoading] = useState(false)

    const hours = calendarService.hours(8, [15, 30, 45]);

    const [users, setUsers] = useState<User[]>([])

    const [model, setModel] = useState<OpenCloseRoom>({
        dayId: day.id,
        openAt: '20h'
    });

    useEffect(() => {
        setLoading(true)
        Promise.all([roomService.getOpenCloseConfig(day.id), userService.findAllUsers()])
            .then(([model, users]) => {
                setUsers(users)
                setModel(model)
                setLoading(false)
            })
    }, [day.id]);

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
                console.log('Save open/close configuration', model)
                setLoading(true)
                roomService.saveOpenCloseConfig(model).then(() => {
                    onSuccess();
                    props.closeFunction()
                    setLoading(false)
                }).catch(err => setLoading(false))
            }
        }
    ]


    return <ModalPage {...props} options={{ title: 'Ouverture et fermeture de la salle', actions: ACTIONS }}>
        <Text>{printGameDay(day)}</Text>
        <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="lock-open" size={20} />
                <Text style={styles.label}>Ouverture</Text>
            </View>

            <CustomSelect label="A"
                data={hours}
                getId={(h) => h}
                value={model?.openAt}
                disabled={loading}
                onChange={(h) => setModel((prev) => ({ ...prev, openAt: h }))}
                renderOptionText={(it: string) => it}
            />

            <CustomSelect label="Par"
                data={users}
                getId={(u) => u.id}
                disabled={loading}
                value={model.opener?.id}
                onChange={(u) => setModel((prev) => ({ ...prev, opener: { id: u.id, name: u.name }, closer: (prev.closer ?? { id: u.id, name: u.name }) }))}
                renderOptionText={(it: User) => `${it.name}`}
            />

        </Card>
        <Card>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="lock" size={20} />
                <Text style={styles.label}>Fermeture</Text>
            </View>


            <CustomSelect label="Par"
                data={users}
                getId={(u) => u.id}
                value={model.closer?.id}
                disabled={loading}
                onChange={(u) => setModel((prev) => ({ ...prev, closer: { id: u.id, name: u.name } }))}
                renderOptionText={(it: User) => `${it.name}`}
            />
        </Card>
    </ModalPage>
}

const styles = StyleSheet.create({
    label: {
        fontWeight: 'bold',
        fontSize: 20,
    }
})
import { Colors } from "@/constants/Colors";
import { User } from "@/model/User";
import { userService } from "@/services/UserService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import Card from "../Card";
import ModalPage, { ModalPageProps } from "../ModalPage";

type Props = ModalPageProps & {
    onSuccess: (user: User) => void,
    title?: string
};

function UserCard({ user }: { user: User }) {
    return <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="person" color={Colors.gray} size={30} />
            <Text>{user.firstName} | {user.name}</Text>
        </View>
    </Card>
}

export default function UserSelectModal(props: Props) {

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState('')

    useEffect(() => {
        setLoading(true)
        userService.findAllUsers()
            .then(users => {
                setUsers(users)
                setLoading(false)
            }).catch(err => setLoading(false))
    }, [refresh])

    const ACTIONS = [
        {
            name: 'cancel',
            label: 'Annuler',
            color: 'gray',
            onPress: () => props.closeFunction ? props.closeFunction() : console.error('No close function defined')
        },
    ]

    return <ModalPage {...props} options={{ title: props.title, actions: ACTIONS }}>
        {loading ? <View><ActivityIndicator color={Colors.red} size={50} /></View> : null}
        <FlatList
            onRefresh={() => setRefresh(new Date().toISOString())}
            refreshing={loading}
            data={users}
            renderItem={({ item }) => <Pressable android_ripple={{ color: Colors.red }} onPress={() => props.onSuccess(item)}><UserCard user={item} /></Pressable>}
            keyExtractor={(item) => item.id}
        />
    </ModalPage>
}
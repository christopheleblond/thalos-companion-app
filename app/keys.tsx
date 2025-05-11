import Card from "@/components/Card";
import UserSelectModal from "@/components/modals/UserSelectModal";
import { Colors } from "@/constants/Colors";
import { useUserId } from "@/hooks/useUserId";
import { RoomKey } from "@/model/RoomKey";
import { User } from "@/model/User";
import { keyService } from "@/services/KeyService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, ViewProps } from "react-native";

type Props = ViewProps & {
    roomKey: RoomKey,
    onChangeOwner: (user: User) => void
};

function RoomKeyCard({ roomKey, onChangeOwner, ...rest }: Props) {

    const userId = useUserId();

    const [userSelectModalVisible, setUserSelectModalVisible] = useState(false);

    const onSelectUser = (user: User) => {
        onChangeOwner(user);
        setUserSelectModalVisible(false)
    }

    return <Card>
        <UserSelectModal title="Qui ?" visible={userSelectModalVisible} closeFunction={() => setUserSelectModalVisible(false)} onSuccess={onSelectUser} />
        <Pressable onPress={() => setUserSelectModalVisible(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: Colors.gray, borderRadius: 10, padding: 3 }}>
                    <MaterialIcons name="key" color={Colors.white} size={50} />
                </View>
                <View style={{ flex: 1, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text>{roomKey.name}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: roomKey.owner ? Colors.green : 'lightgray', padding: 5, borderRadius: 20 }}>
                            <MaterialIcons name="person" size={30} />
                            {roomKey.owner ? <Text>{roomKey.owner.name}</Text> : <Text>?</Text>}
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    </Card >
}


export default function KeysPage({ style, ...props }: Props) {

    const [keys, setKeys] = useState<RoomKey[]>([])
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState('')

    const changeKeyOwner = (user: User, key: RoomKey) => {
        setLoading(true)
        keyService.updateKey({
            ...key,
            owner: {
                id: user.id,
                name: user.name ?? ''
            }
        })
            .then(res => {
                const foundIndex = keys.findIndex(k => k.id === res.id)
                if (foundIndex >= 0) {
                    const newKeys = [...keys]
                    newKeys[foundIndex] = { ...res }
                    setKeys(newKeys)
                }
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        keyService.findAllKeys().then(keys => {
            setKeys(keys)
            setLoading(false)
        }).catch(err => setLoading(false))
    }, [refresh])

    return <View {...props} style={[styles.container, style]}>
        <Text>Badges et Clés de la Salle</Text>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            {loading ? <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator color={Colors.red} size={50} /></View> : null}
            {!loading ? <FlatList
                data={keys}
                onRefresh={() => setRefresh(new Date().toISOString())}
                refreshing={loading}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => (<Text>Aucun clé configurée</Text>)}
                renderItem={({ item }) => (<RoomKeyCard roomKey={item} onChangeOwner={(user) => changeKeyOwner(user, item)} />)}>

            </FlatList> : null}
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
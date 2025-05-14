import { Colors } from "@/constants/Colors";
import { GameDay } from "@/model/GameDay";
import { OpenCloseRoom } from "@/model/Room";
import { roomService } from "@/services/RoomService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, ViewProps } from "react-native";
import Card from "./Card";

type Props = ViewProps & {
    day: GameDay
}

export function OpenAndCloseRoom({ day, ...props }: Props) {

    const [loading, setLoading] = useState(false)
    const [config, setConfig] = useState<OpenCloseRoom>({
        dayId: day.id,
        openAt: '20h'
    });

    useEffect(() => {
        setLoading(true)
        roomService.getOpenCloseConfig(day.id).then(config => {
            setConfig(config)
            setLoading(false)
        }).catch(err => setLoading(false))
    }, [day.id])

    return <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {loading ? <ActivityIndicator color={Colors.red} size={50} /> : null}
        <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: Colors.gray, marginRight: 10, padding: 5, borderRadius: 20 }}>
                <MaterialIcons name="lock-open" size={30} color={Colors.white} />
            </View>
            <View>
                <Text>Ouverture à <Text style={{ fontWeight: 'bold' }}>{config.openAt}</Text></Text>
                <Text>par : <Text style={{ fontWeight: 'bold' }}>{config.opener?.name ?? '--'}</Text></Text>
            </View>
        </Card>
        <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

            <View>
                <Text>Fermeture par :</Text>
                <Text style={{ fontWeight: 'bold' }}>{config.closer?.name ?? '--'}</Text>
            </View>
            <View style={{ backgroundColor: Colors.black, padding: 5, borderRadius: 20 }}>
                <MaterialIcons name="lock" size={30} color={Colors.white} />
            </View>
        </Card >
    </View >
}
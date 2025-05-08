import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, PressableProps } from "react-native";

export type IconSymbolName = React.ComponentProps<typeof MaterialIcons>['name'];

type Props = PressableProps & {
    icon: IconSymbolName,
    color?: string,
    size?: number
};

export default function IconButton(props: Props) {
    return (<Pressable {...props} android_ripple={{ color: 'red' }}>
        <MaterialIcons name={props.icon} color={props.color ?? 'white'} size={props.size ?? 50} />
    </Pressable>)
}
import { Colors } from "@/constants/Colors";
import { Text, TextProps } from "react-native";

type Props = TextProps & {
    color: keyof typeof Colors;
}

export default function ThemedText({ color, ...rest }: Props) {
    return (<Text {...rest} style={{ color: color }} />)
}
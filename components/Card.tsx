import { StyleSheet, View, ViewProps } from "react-native";

export type CardProps = ViewProps

export default function Card({ style, ...rest }: CardProps) {
    return <View {...rest} style={[styles.container, style]} />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        margin: 5,
        elevation: 3
    }
});
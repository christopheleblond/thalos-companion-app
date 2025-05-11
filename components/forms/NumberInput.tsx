import { Colors } from "@/constants/Colors"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import IconButton from "../IconButton"

type Props = {
    value: number,
    label: string,
    onChange?: (n: number) => void
}

export default function NumberInput(props: Props) {

    const [numberValue, setNumberValue] = useState(props.value)

    const inc = (dt: number) => {
        setNumberValue((prev) => prev + dt)
    }

    useEffect(() => {
        if (props.onChange) {
            props.onChange(numberValue)
        }
    }, [numberValue])

    return <View style={styles.container}>
        <View>
            <Text style={styles.label}>{props.label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <View style={styles.button}>
                <IconButton icon="remove" size={30} color={Colors.white} onPress={() => inc(-1)} />
            </View>
            <View style={{ minWidth: 0, alignItems: 'center' }}>
                <Text style={styles.value}>{numberValue}</Text>
            </View>
            <View style={styles.button}>
                <IconButton icon="add" size={30} color={Colors.white} onPress={() => inc(1)} />
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 20
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: Colors.red,
        borderRadius: 50
    }
})
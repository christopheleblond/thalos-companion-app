import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View, ViewProps } from "react-native"

type RadioOption = { value: string, label: string }

type Props = ViewProps & {
    label: string,
    value: string,
    options: RadioOption[],
    onChange: (value: string) => void
}

export default function Radio({ style, label, value, options, onChange, ...props }: Props) {

    const defaultValue = options ? options[0].value : '';
    const [checkedValue, setCheckedValue] = useState(value || defaultValue)

    useEffect(() => {
        if (onChange)
            onChange(checkedValue)
    }, [checkedValue, onChange])

    return <View style={[styles.container, style]} {...props}>
        <Text style={styles.label}>{label}</Text>
        <View style={{ flexDirection: 'row', gap: 5 }}>
            {options.map(o => (<Pressable key={o.value} onPress={() => setCheckedValue(o.value)} android_ripple={{ color: 'white' }}>
                <View style={[styles.option, checkedValue === o.value ? styles.checked : null]}>
                    <Text style={[checkedValue === o.value ? styles.checked : null]}>{o.label}</Text>
                </View></Pressable>))}
        </View>
    </View >
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    label: {
        fontSize: 20
    },
    option: {
        backgroundColor: 'lightgray',
        width: 80,
        borderRadius: 50,
        padding: 10,
        marginVertical: 5,
        alignItems: 'center'
    },
    checked: {
        backgroundColor: 'blue',
        color: 'white'
    }
})
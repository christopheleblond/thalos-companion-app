import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
    label: string,
    value: string,
    disabled?: boolean
}

export default function FormInputText(props: Props) {

    return <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        {!props.disabled ? <TextInput
            style={[props.style, styles.input]}
            {...props}
            value={props.value}
            onChangeText={props.onChangeText}
        /> : <Text style={styles.inputDisabled}>{props.value}</Text>}
    </View>
}

const styles = StyleSheet.create({
    container: {

    },
    label: {
        fontSize: 20
    },
    input: {
        fontSize: 20,
        backgroundColor: 'whitesmoke',
        padding: 15,
        fontWeight: 'bold',
        borderRadius: 5
    },
    inputDisabled: {
        color: 'gray',
        fontSize: 20,
        backgroundColor: 'whitesmoke',
        padding: 15,
        fontWeight: 'bold',
        borderRadius: 5
    }

});
import { Colors } from "@/constants/Colors";
import { Button, Modal, ModalProps, StyleSheet, Text, View } from "react-native";

export type ModalAction = {
    name: string,
    label?: string,
    color?: string,
    onPress: () => void
}

type ModalPageOptions = {
    title?: string,
    actions?: ModalAction[]
}

export type ModalPageProps = ModalProps & {
    closeFunction: () => void,
    options?: ModalPageOptions
};

export default function ModalPage(props: ModalPageProps) {
    return (<Modal {...props} transparent={true}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.headerName}>{props.options?.title}</Text>
                <View style={styles.modalBody}>
                    {props.children}
                </View>
                <View style={styles.modalFooter}>
                    {props.options?.actions && props.options?.actions?.map(action => (<View key={action.name} style={styles.modalAction}>
                        <Button title={action.label ?? action.name} color={action.color ?? Colors.red} onPress={action.onPress} />
                    </View>))}
                </View>
            </View>
        </View>
    </Modal >)
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
    },
    modalView: {
        flex: 1,
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    headerName: {
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold'
    },
    modalBody: {
        flex: 1,
        padding: 10
    },
    modalFooter: {
        flex: 1 / 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        gap: 10
    },
    modalAction: {
        flex: 1,
        alignContent: 'center'
    }
});
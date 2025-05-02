import { Text } from "react-native";
import ModalPage, { ModalAction, ModalPageProps } from "../ModalPage";

type Props = ModalPageProps;

export default function SettingsModal(props: Props) {

    const ACTIONS: ModalAction[] = [
        {
            name: 'cancel',
            label: 'Annuler',
            onPress: () => props.closeFunction ? props.closeFunction() : console.error('No close function defined')
        },
        {
            name: 'save',
            label: 'Enregistrer',
            onPress: () => { }
        }
    ]

    return <ModalPage {...props} options={{ title: 'Préférences', actions: ACTIONS }}>
        <Text>BODY</Text>
    </ModalPage>
}
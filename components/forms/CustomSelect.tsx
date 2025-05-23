import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type ItemT = any;

type Props = {
    label: string,
    data: ItemT[],
    value: ItemT | undefined,
    disabled?: boolean,
    getId: (item: ItemT) => string,
    renderOptionText?: (item: ItemT) => string,
    renderOption?: (item: ItemT) => React.ReactElement,
    isOptionDisabled?: (item: ItemT) => boolean,
    onChange: (item: ItemT) => void
}

export default function CustomSelect<ItemT>(props: Props) {

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const currentItem = props.data.find(i => props.getId(i) === props.value);
    const [selectedItem, setSelectedItem] = useState(currentItem)

    const setSelected = (item: ItemT) => {
        setSelectedItem(item);
        props.onChange(item);
        setDropdownVisible(false)
    }

    useEffect(() => {
        setSelectedItem(currentItem)
    }, [currentItem])

    const renderOptionOrText = (item: ItemT) => {
        return props.renderOption ? props.renderOption(item) : props.renderOptionText ? <Text>{props.renderOptionText(item)}</Text> : null
    }

    return <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        <Pressable style={styles.input} onPress={() => !props.disabled ? setDropdownVisible(pre => !pre) : null}>
            <View>{selectedItem && props.renderOptionText ? <Text>{props.renderOptionText(selectedItem)}</Text> : <Text>--</Text>}</View>
            <MaterialIcons name={dropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} color={'gray'} size={50} />
        </Pressable>
        {dropdownVisible && <View
            style={{ maxHeight: 500, zIndex: 100 }}>
            <ScrollView contentContainerStyle={{ overflow: 'hidden' }} nestedScrollEnabled={true}>
                <View style={styles.list}>
                    {props.data.map(d => (
                        <Pressable key={props.getId(d)} style={styles.option}
                            onPress={() => {
                                if (!props.isOptionDisabled || !props.isOptionDisabled(d)) {
                                    setSelected(d)
                                }
                            }}>
                            {renderOptionOrText(d)}
                        </Pressable>))}
                </View>
            </ScrollView>
        </View>}
    </View>
}

const styles = StyleSheet.create({
    container: {

    },
    label: {
        fontSize: 20
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'whitesmoke',
        padding: 5,
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1
    },
    inputText: {
        fontWeight: 'bold',
        fontSize: 15,
        padding: 5
    },
    inputDisabled: {
        color: 'gray'
    },
    list: {
        paddingTop: 5,
        elevation: 5,
        position: 'relative',
        backgroundColor: 'white'
    },
    option: {
        padding: 10,
        marginLeft: 5,
        borderWidth: 1,
    },
    optionText: {
        fontSize: 15
    }
})
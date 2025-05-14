import GameDayCard from "@/components/GameDayCard";
import IconButton from "@/components/IconButton";
import { Colors } from "@/constants/Colors";
import { Months } from "@/constants/Months";
import { GameDay } from "@/model/GameDay";
import { calendarService } from "@/services/CalendarService";
import { nowMinusDays } from "@/utils/Utils";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";

export default function Agenda() {

    const router = useRouter();
    const [days, setDays] = useState<GameDay[]>(calendarService.buildDaysFromDate(nowMinusDays(15), 30))

    const daysBefore = () => {
        const add1Day = new Date(days[0].date)
        add1Day.setDate(add1Day.getDate() - 30)
        setDays([...calendarService.buildDaysFromDate(add1Day, 30), ...days])
    }

    const moreDays = () => {
        const add1Day = new Date(days[days.length - 1].date)
        add1Day.setDate(add1Day.getDate() + 1)

        setDays([...days, ...calendarService.buildDaysFromDate(add1Day, 30)])
    }

    const sections = days
        .map(d => ({ title: Months[d.date.getMonth()].toUpperCase(), data: [d] }))
        .reduce((acc: { title: string, data: GameDay[] }[], cur) => {
            const foundIndex = acc.findIndex(i => i.title === cur.title);
            if (foundIndex >= 0) {
                acc[foundIndex] = { ...acc[foundIndex], data: [...acc[foundIndex].data, cur.data[0]] }
                return acc;
            } else {
                return [...acc, { ...cur }];
            }
        }, []);

    return (<View style={{ flex: 1 }}>
        <SectionList sections={sections}
            keyExtractor={({ id }) => id}
            renderSectionHeader={(item) => <Text style={{ alignSelf: 'center' }}>{item.section.title}</Text>}
            ListHeaderComponent={() => <View style={{ alignItems: 'center' }}><IconButton color={Colors.gray} icon="arrow-upward" onPress={() => daysBefore()} /></View>}
            ListFooterComponent={() => <View style={{ alignItems: 'center' }}><IconButton color={Colors.gray} icon="arrow-downward" onPress={() => moreDays()} /></View>}
            renderItem={({ item }) => (<Pressable onPress={() => router.push(`/days/${item.id}`)}>
                <GameDayCard day={item} />
            </Pressable>)}
        ></SectionList>
    </View >)
}
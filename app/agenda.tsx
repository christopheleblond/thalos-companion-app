import GameDayCard from "@/components/GameDayCard";
import { Colors } from "@/constants/Colors";
import { Months } from "@/constants/Months";
import { GameDay } from "@/model/GameDay";
import { calendarService } from "@/services/CalendarService";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Pressable, SectionList, Text, View } from "react-native";

export default function Agenda() {

    const router = useRouter();
    const [days, setDays] = useState<GameDay[]>(calendarService.buildDaysFromDate(new Date(), 30))

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

    useEffect(() => {

    }, [days])

    return (<View style={{ flex: 1 }}>
        <SectionList sections={sections}
            keyExtractor={({ id }) => id}
            renderSectionHeader={(item) => <Text style={{ alignSelf: 'center' }}>{item.section.title}</Text>}
            ListFooterComponent={() => <Button color={Colors.red} title="Voir plus ..." onPress={() => moreDays()}></Button>}
            renderItem={({ item }) => (<Pressable onPress={() => router.push(`/days/${item.id}`)}>
                <GameDayCard day={item} />
            </Pressable>)}
        ></SectionList>
    </View >)
}
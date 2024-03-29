import { ScrollView, View, Text, Alert } from "react-native"
import { useRoute } from '@react-navigation/native';
import dayjs from "dayjs";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../libs/axios";
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { HabitEmpty } from "../components/HabitEmpty";
import clsx from "clsx";

interface Params {
   date: string
}

interface DayInfoProps {
   completedHabits: string[];
   possibleHabits: {
      id: string;
      title: string;
   }[];
}

export function Habit() {
   const [loading, setLoading] = useState(true)
   const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
   const [completedHabits, setCompletedHabits] = useState<string[]>([]);

   const route = useRoute();
   const { date } = route.params as Params;

   const parsedDate = dayjs(date);
   const isPastDate =parsedDate.endOf('day').isBefore(new Date());
   const dayOfWeek = parsedDate.format('dddd');
   const dayAndMonth = parsedDate.format('DD/MM');

   const habitProgress = dayInfo?.possibleHabits.length ?
      generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
      : 0;

   async function fetchHabits() {
      try {
         setLoading(true);

         const response = await api.get('/day', { params: { date } });
         setDayInfo(response.data);
         setCompletedHabits(response.data.completedHabits)


         setLoading(false);

      } catch (error) {
         Alert.alert('Doh', 'Informations not delivered')
      }
   }

   async function HandleToggleHabit(habitId: string) {
      try {
         await api.patch(`/habits/${habitId}/toggle`)
         if (completedHabits.includes(habitId)) {
            setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId))
         } else {
            setCompletedHabits(prevState => [...prevState, habitId]);
         }
      } catch (error) {
         console.log(error)
      }
      
   }
   useEffect(() => {
      fetchHabits();
   }, []);

   if (loading) {
      return (
         <Loading />
      );
   }
   return (
      <View className=" flex-1 bg-background px-8 pt-16">
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
         >
            <BackButton />

            <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase ">
               {dayOfWeek}
            </Text>
            <Text className="text-white font-extrabold text-3xl">
               {dayAndMonth}
            </Text>

            <ProgressBar progress={habitProgress} />
            

            <View className={clsx("mt-6",{
               ["opacity-50"]: isPastDate
            })}>

               {
                  dayInfo?.possibleHabits ?
                  dayInfo?.possibleHabits.map(habit => (
                     <Checkbox
                        key={habit.id}
                        title={habit.title}
                        checked={completedHabits.includes(habit.id)}
                        disabled={isPastDate}
                        onPress={() => HandleToggleHabit(habit.id)}
                     />
                  ))
                  : <HabitEmpty />
               } 

            </View>
            {
               isPastDate && (
          
                  <Text className="text-white mt-10 text-center">
                     you can't change the past!
                  </Text>
                ) 
               
            }

         </ScrollView>

      </View>
   )
}
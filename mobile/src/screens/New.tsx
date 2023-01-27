import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { api } from "../libs/axios";
import colors from "tailwindcss/colors";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { Feather } from '@expo/vector-icons';

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']


export function New() {
   const [title, setTitle] = useState<string>()
   const [weekDays, setWeekDays] = useState<number[]>([])

   function handleToggleWeekDay(weekDayIndex: number) {
      if (weekDays.includes(weekDayIndex)) {
         setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
      } else {
         setWeekDays(prevState => [...prevState, weekDayIndex])
      }
   }

   async function handleCreateNewHabit() {
      try {
         if(!title|| weekDays.length === 0) {
            return (Alert.alert('new habit', 'Type new habit and select weekday.'))
         }

         await api.post('/habits', { title, weekDays});

         setTitle('');
         setWeekDays([]);

         Alert.alert('New habit','Habit created');
      } catch (error) {
         console.log(error);
         Alert.alert('Ops', 'we did it again...')
      } {

      }
  
   }
   return (
      <View className=" flex-1 bg-background px-8 pt-16">
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
         >

            <BackButton />
            <Text className="mt-6 text-white font-extrabold text-3xl">
               Create habit
            </Text>
            <Text className="mt-6 text-white font-semibold text-base">
               What we gonna do?
            </Text>
            <TextInput
               className="h-12 pl-4  rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-purple-600"
               placeholder="Exercicios, dormir bem, etc.."
               placeholderTextColor={colors.zinc[400]}
               onChangeText={setTitle}
               value={title}
            />
            <Text className="text-white mb-3 font-semibold text-base"
            >
               Which day?
            </Text>

            {availableWeekDays.map((weekDay, index) => (

               <Checkbox
                  key={weekDay}
                  title={weekDay}
                  checked={weekDays.includes(index)}
                  onPress={() => handleToggleWeekDay(index)}
               />
            ))
            }

            <TouchableOpacity
               className="w-full h-14 items-center justify-center flex-row bg-violet-600 rounded-md mt-6 "
               activeOpacity={0.7}
               onPress={handleCreateNewHabit}
            >
               <Feather
                  name="check"
                  size={20}
                  color={colors.white}
               />
               <Text className="font-semibold text-base text-white ml-2"
               >
                  Confirm
               </Text>
            </TouchableOpacity>
         </ScrollView>
      </View>
   )
}
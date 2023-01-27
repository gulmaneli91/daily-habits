import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function HabitEmpty() {
    const { navigate } = useNavigation();
    
    return (
        <Text className="text-zinc-400 text-base">
            let's start?

            <Text
                className="text-violet-400  text-base underline active:text-violet-500"
                onPress={() => navigate('new')}
            >
                create an habit
            </Text>
        </Text>
    )
}
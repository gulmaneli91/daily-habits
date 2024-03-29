import { TouchableOpacity, View, Text, TouchableOpacityProps } from "react-native";
import { Feather } from '@expo/vector-icons';
import colors from "tailwindcss/colors";

interface Props extends TouchableOpacityProps {
    title: string
    checked?: boolean

}

export function Checkbox({title, checked = false, ...rest }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row mb-2 itmes-center"
            {...rest}
        >
            {
                checked
                    ?
                    <View className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center">
                        <Feather
                            name="check"
                            size={20}
                            collor={colors.white}
                        />
                    </View>
                    :
                    <View className="h-8 w-8 bg-zinc-800 rounded-lg" />
            }

            <Text className="text-white text-base font-semibold ml-3">
                {title}
            </Text>
        </TouchableOpacity>
    )
}
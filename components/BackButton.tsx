import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "@/constants/theme";

export default function BackButton() {
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="mt-2 w-10 h-10 items-center justify-center"
    >
      <AntDesign name="arrow-left" size={22} color={colors.neutral.textPrimary} />
    </TouchableOpacity>
  );
}

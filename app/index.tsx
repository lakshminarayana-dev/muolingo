import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { colors, fontFamily } from "@/constants/theme";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-6">
      <Text className="h1 color-lingua-purple">Muolingo</Text>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => router.push("/onboarding")}
      >
        <Text style={styles.buttonText}>View Onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary.purple,
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: "#ffffff",
  },
});

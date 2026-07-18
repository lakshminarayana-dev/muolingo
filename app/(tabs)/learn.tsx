import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="h2">Learn</Text>
        <Text className="body-md text-text-secondary">Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

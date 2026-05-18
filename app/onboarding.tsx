import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { images } from "@/constants/images";

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* App logo + name */}
      <View className="flex-row items-center justify-center pt-6 gap-2">
        <Image source={images.mascotLogo} className="w-9 h-9" resizeMode="contain" />
        <Text className="font-poppins-bold text-xl text-text-primary">muolingo</Text>
      </View>

      {/* Hero heading */}
      <View className="px-8 mt-10">
        <Text className="font-poppins-bold text-[36px] leading-[44px] text-text-primary">
          {"Your AI language\n"}
          <Text className="text-lingua-purple">teacher.</Text>
        </Text>
        <Text className="font-poppins text-sm leading-[22px] text-text-secondary mt-2">
          Real conversations, personalized lessons, anytime, anywhere.
        </Text>
      </View>

      {/* Mascot with speech bubbles */}
      <View className="flex-1 items-center justify-center">
        <Image source={images.mascotWelcome} className="w-[260px] h-[280px]" resizeMode="contain" />
        <View
          className="absolute left-4 bottom-20 rounded-[20px] px-[14px] py-2 border-[1.5px] border-border bg-white"
          style={styles.shadow}
        >
          <Text className="font-poppins-medium text-sm text-text-primary">Hello!</Text>
        </View>
        <View
          className="absolute right-4 top-[50px] rounded-[20px] px-[14px] py-2 border-[1.5px] border-border bg-white"
          style={styles.shadow}
        >
          <Text className="font-poppins-medium text-sm text-text-primary">¡Hola!</Text>
        </View>
        <View
          className="absolute right-5 top-40 rounded-[20px] px-[14px] py-2 border-[1.5px] border-border bg-white"
          style={styles.shadow}
        >
          <Text className="font-poppins-medium text-sm text-[#e04040]">你好!</Text>
        </View>
      </View>

      {/* Get Started button */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          className="bg-lingua-purple rounded-[28px] h-[58px] flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
          onPress={() => router.push("/")}
        >
          <Text className="font-poppins-semibold text-base text-white">Get Started</Text>
          <Text className="font-poppins-bold text-[24px] leading-[26px] text-white">›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
});

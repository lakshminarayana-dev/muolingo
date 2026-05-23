import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6c4ef5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-6">
      <Text className="h1 color-lingua-purple">Muolingo</Text>
      <TouchableOpacity
        className="bg-lingua-purple rounded-3xl px-8 py-3.5"
        activeOpacity={0.85}
        onPress={() => router.push("/language-select")}
      >
        <Text className="font-poppins-semibold text-base text-white">Choose Language</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="rounded-3xl px-8 py-3.5 border border-border"
        activeOpacity={0.85}
        onPress={() => signOut()}
      >
        <Text className="font-poppins-semibold text-base text-text-secondary">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

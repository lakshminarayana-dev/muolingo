import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useLanguageStore } from "@/store/languageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { selectedCode, hasHydrated } = useLanguageStore();

  if (!isLoaded || !hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#6c4ef5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  if (!selectedCode) {
    return <Redirect href="/language-select" />;
  }

  return <Redirect href="/home" />;
}

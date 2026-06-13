import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, router } from "expo-router";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { LANGUAGES } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const { selectedCode, clearLanguage, hasHydrated } = useLanguageStore();

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

  const language = LANGUAGES.find((l) => l.code === selectedCode)!;

  return (
    <View className="flex-1 items-center justify-center gap-6">
      <Text className="h1 color-lingua-purple">Muolingo</Text>

      <View className="items-center gap-2">
        <View className="w-16 h-16 rounded-full overflow-hidden bg-surface">
          <Image
            source={{ uri: language.flag }}
            className="w-16 h-16"
            resizeMode="cover"
          />
        </View>
        <Text className="font-poppins-semibold text-lg text-text-primary">{language.name}</Text>
        <Text className="font-poppins text-sm text-text-secondary">{language.nativeName}</Text>
      </View>

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
      <TouchableOpacity
        className="rounded-3xl px-8 py-3.5 border border-red-300"
        activeOpacity={0.85}
        onPress={() => clearLanguage()}
      >
        <Text className="font-poppins-semibold text-base text-red-400">Clear Language (Test)</Text>
      </TouchableOpacity>
    </View>
  );
}

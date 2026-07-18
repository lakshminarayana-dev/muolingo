import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SUPPORTED_LANGUAGES } from "@/data/languages";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";
import type { LanguageCode } from "@/types/learning";

export default function LanguageSelectScreen() {
  const { selectedCode: storedCode, setSelectedCode: saveLanguage } = useLanguageStore();
  const [selectedCode, setSelectedCode] = useState<LanguageCode | null>(storedCode);
  const [search, setSearch] = useState("");

  const filtered = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#001328" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-poppins-semibold text-lg text-text-primary">
          Choose a language
        </Text>
        <View className="w-10" />
      </View>

      {/* Search bar */}
      <View className="px-4 mb-5">
        <View className="flex-row items-center bg-surface rounded-full px-4 h-11 gap-3">
          <Ionicons name="search-outline" size={18} color="#9ca3af" />
          <TextInput
            placeholder="Search languages"
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            className="flex-1 font-poppins text-sm text-text-primary py-0"
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      {/* Language list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        ListHeaderComponent={
          <Text className="font-poppins-semibold text-[15px] text-text-primary mb-2.5">
            Popular
          </Text>
        }
        renderItem={({ item }) => {
          const isSelected = item.code === selectedCode;
          return (
            <TouchableOpacity
              onPress={() => setSelectedCode(item.code as LanguageCode)}
              activeOpacity={0.7}
              className={`flex-row items-center py-3 px-3.5 mb-2 rounded-2xl ${
                isSelected
                  ? "border-2 border-lingua-purple bg-[#f0edff]"
                  : "border-[1.5px] border-border bg-white"
              }`}
            >
              <View className="w-11 h-11 rounded-full overflow-hidden bg-surface">
                <Image
                  source={{ uri: item.flag }}
                  className="w-11 h-11"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-poppins-semibold text-[15px] text-text-primary leading-5">
                  {item.name}
                </Text>
                <Text className="font-poppins text-xs text-text-secondary mt-0.5">
                  {item.learners} learners
                </Text>
              </View>
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={24} color="#6c4ef5" />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* Confirmation button */}
      <View className="px-4 pt-3 pb-3">
        <TouchableOpacity
          className="bg-lingua-purple rounded-[28px] h-14 items-center justify-center"
          activeOpacity={0.85}
          disabled={!selectedCode}
          onPress={() => {
            if (selectedCode) {
              saveLanguage(selectedCode);
              router.replace("/");
            }
          }}
        >
          <Text className="font-poppins-semibold text-base text-white">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earth decoration */}
      <Image
        source={images.earth}
        className="w-full h-35"
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}


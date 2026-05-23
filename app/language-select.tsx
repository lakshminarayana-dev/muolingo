import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LANGUAGES } from "@/data/languages";
import { images } from "@/constants/images";

export default function LanguageSelectScreen() {
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = LANGUAGES.filter(
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
            style={styles.searchInput}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      {/* Language list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Text style={styles.sectionLabel}>Popular</Text>
        }
        renderItem={({ item }) => {
          const isSelected = item.code === selectedCode;
          return (
            <TouchableOpacity
              onPress={() => setSelectedCode(item.code)}
              activeOpacity={0.7}
              style={[
                styles.languageItem,
                isSelected && styles.languageItemSelected,
              ]}
            >
              <View style={styles.flagContainer}>
                <Image
                  source={{ uri: item.flag }}
                  style={styles.flagImage}
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
          onPress={() => router.back()}
        >
          <Text className="font-poppins-semibold text-base text-white">
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earth decoration */}
      <Image
        source={images.earth}
        style={styles.earthImage}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#001328",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#001328",
    paddingVertical: 0,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  languageItemSelected: {
    borderWidth: 2,
    borderColor: "#6c4ef5",
    backgroundColor: "#f0edff",
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#f6f7fb",
  },
  flagImage: {
    width: 44,
    height: 44,
  },
  earthImage: {
    width: "100%",
    height: 140,
  },
});

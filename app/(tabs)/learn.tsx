import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LessonCard, { LessonStatus } from "@/components/LessonCard";
import { images } from "@/constants/images";
import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import { useLearningStore } from "@/store/learningStore";

type Tab = "lessons" | "practice";

export default function LearnScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { selectedCode } = useLanguageStore();
  const { completedLessonIds } = useLearningStore();
  const [activeTab, setActiveTab] = useState<Tab>("lessons");
  const [isSaved, setIsSaved] = useState(false);

  const language = LANGUAGES.find((l) => l.code === selectedCode);
  const unit = UNITS.find((u) => u.languageCode === selectedCode);
  const lessons = unit
    ? unit.lessonIds
        .map((id) => LESSONS.find((l) => l.id === id))
        .filter((l): l is (typeof LESSONS)[number] => l != null)
    : [];

  if (!language || !unit || lessons.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Text className="h3 text-center">Pick a language to start</Text>
          <Text className="body-md text-text-secondary text-center">
            Choose a language and we{"'"}ll build your learning path.
          </Text>
          <TouchableOpacity
            className="bg-lingua-purple rounded-full h-12 px-6 items-center justify-center mt-4"
            activeOpacity={0.85}
            onPress={() => router.push("/language-select")}
          >
            <Text className="font-poppins-semibold text-sm text-white">
              Choose a language
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const firstIncompleteIndex = lessons.findIndex(
    (l) => !completedLessonIds.includes(l.id)
  );
  const currentIndex =
    firstIncompleteIndex === -1 ? lessons.length - 1 : firstIncompleteIndex;
  const currentLesson = lessons[currentIndex];

  const getStatus = (lessonId: string, index: number): LessonStatus => {
    if (completedLessonIds.includes(lessonId)) return "completed";
    if (firstIncompleteIndex !== -1 && index === currentIndex)
      return "current";
    return "locked";
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 24 }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View className="px-5 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center -ml-2"
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#001328" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsSaved((v) => !v)}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={22}
                color="#6c4ef5"
              />
            </TouchableOpacity>
          </View>

          <Text className="h3 mt-1">{currentLesson.title}</Text>
          <Text className="body-sm text-text-secondary mt-0.5">
            Unit {unit.order} • {currentIndex + 1}/{lessons.length} lessons
          </Text>
        </View>

        {/* ── Hero image + Lessons/Practice tabs ─────────────────────────── */}
        <View className="mt-4">
          <View style={styles.heroWrap}>
            <Image
              source={images.palace}
              style={styles.heroPalace}
              resizeMode="contain"
            />
            <Image
              source={images.mascotWelcome}
              style={styles.heroMascot}
              resizeMode="contain"
            />
          </View>

          <View className="absolute -bottom-6 left-4 right-4">
            <View
              className="flex-row bg-white rounded-2xl p-1 shadow-bubble"
              style={{ elevation: 4 }}
            >
              <TouchableOpacity
                className="flex-1 items-center py-3"
                activeOpacity={0.8}
                onPress={() => setActiveTab("lessons")}
              >
                <Text
                  className={
                    activeTab === "lessons"
                      ? "font-poppins-semibold text-sm text-lingua-purple"
                      : "font-poppins text-sm text-text-secondary"
                  }
                >
                  Lessons
                </Text>
                {activeTab === "lessons" && (
                  <View className="h-0.5 w-10 bg-lingua-purple rounded-full mt-1.5" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 items-center py-3"
                activeOpacity={0.8}
                onPress={() => setActiveTab("practice")}
              >
                <Text
                  className={
                    activeTab === "practice"
                      ? "font-poppins-semibold text-sm text-lingua-purple"
                      : "font-poppins text-sm text-text-secondary"
                  }
                >
                  Practice
                </Text>
                {activeTab === "practice" && (
                  <View className="h-0.5 w-10 bg-lingua-purple rounded-full mt-1.5" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Lessons / Practice content ──────────────────────────────── */}
        <View className="px-5 mt-10">
          {activeTab === "lessons" ? (
            lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                status={getStatus(lesson.id, index)}
                onPress={() =>
                  router.push({
                    pathname: "/lesson/[id]",
                    params: { id: lesson.id },
                  })
                }
              />
            ))
          ) : (
            <View className="items-center justify-center py-16 px-4">
              <Ionicons name="flash-outline" size={40} color="#9ca3af" />
              <Text className="h4 mt-3 text-center">
                Practice mode is coming soon
              </Text>
              <Text className="body-sm text-text-secondary text-center mt-1">
                Review vocabulary and phrases from lessons you{"'"}ve already
                completed.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    width: "100%",
    height: 220,
    backgroundColor: "#f4efff",
    overflow: "hidden",
  },
  heroPalace: {
    position: "absolute",
    right: -20,
    bottom: -10,
    width: 190,
    height: 190,
  },
  heroMascot: {
    position: "absolute",
    left: 8,
    bottom: -16,
    width: 200,
    height: 200,
  },
});

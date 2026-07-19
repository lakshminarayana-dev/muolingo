import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import { useLanguageStore } from "@/store/languageStore";
import { useLearningStore } from "@/store/learningStore";

const NATIVE_GREETINGS: Record<string, string> = {
  es: "Hola",
  fr: "Salut",
  ja: "こんにちは",
  ko: "안녕",
  de: "Hallo",
  zh: "你好",
};

// Placeholder avatar for the AI video-call teacher — no real asset exists yet.
const AI_TEACHER_AVATAR =
  "https://picsum.photos/seed/muolingo-ai-teacher/200/200";

export default function HomeScreen() {
  const { user } = useUser();
  const tabBarHeight = useBottomTabBarHeight();
  const { selectedCode } = useLanguageStore();
  const { xpToday, dailyGoal, streak, completedLessonIds } = useLearningStore();

  const language = LANGUAGES.find((l) => l.code === selectedCode);
  const unit = UNITS.find((u) => u.languageCode === selectedCode);
  const lessons = unit
    ? LESSONS.filter((l) => unit.lessonIds.includes(l.id))
    : [];

  const nextLesson =
    lessons.find((l) => !completedLessonIds.includes(l.id)) ?? lessons[0];
  const isNextLessonDone = nextLesson
    ? completedLessonIds.includes(nextLesson.id)
    : false;
  const xpProgress = dailyGoal > 0 ? Math.min(xpToday / dailyGoal, 1) : 0;

  const firstName =
    user?.firstName ?? user?.username?.split(" ")[0] ?? "Learner";
  const greeting = language
    ? (NATIVE_GREETINGS[language.code] ?? "Hello")
    : "Hello";

  const planItems = nextLesson
    ? [
        {
          key: "lesson",
          icon: "book" as const,
          label: "Lesson",
          subtitle: nextLesson.title,
          tint: "purple" as const,
          // The lesson content itself is what surfaced this as "next up" —
          // treat it as already read; the remaining steps are what's left today.
          done: true,
        },
        {
          key: "conversation",
          icon: "headset" as const,
          label: "AI Conversation",
          subtitle: nextLesson.aiTeacherPrompt.topics[0]
            ? `Practice ${nextLesson.aiTeacherPrompt.topics[0]}`
            : "Practice speaking",
          tint: "purple" as const,
          done: isNextLessonDone,
        },
        {
          key: "words",
          icon: "chatbox-ellipses" as const,
          label: "New words",
          subtitle: `${nextLesson.vocabulary.length} words`,
          tint: "coral" as const,
          done: isNextLessonDone,
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-4 bg-white">
          <View className="flex-row items-center gap-3 flex-1 pr-3">
            <View style={styles.avatarWrap}>
              <Image
                source={language ? { uri: language.flag } : images.earth}
                style={styles.avatarImg}
                resizeMode="cover"
              />
            </View>
            <View className="shrink">
              <Text className="body-sm text-text-secondary">
                {greeting}! 👋
              </Text>
              <Text className="h3" numberOfLines={1}>
                {firstName}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-4 shrink-0">
            <View className="flex-row items-center gap-1">
              <Ionicons name="flame" size={22} color="#ff8a00" />
              <Text className="font-poppins-semibold text-base text-text-primary">
                {streak}
              </Text>
            </View>
            <Ionicons name="notifications-outline" size={22} color="#001328" />
          </View>
        </View>

        {/* ── Daily Goal ──────────────────────────────────────────────── */}
        <View className="mx-4 mt-2">
          <View className="rounded-3xl px-5 py-4 flex-row items-center justify-between bg-[#fdf1e2]">
            <View className="flex-1 pr-4">
              <Text className="body-sm text-text-secondary mb-1">
                Daily goal
              </Text>
              <Text className="font-poppins-bold text-[28px] text-text-primary">
                {xpToday}
                <Text className="font-poppins-medium text-base text-text-secondary">
                  {" "}
                  / {dailyGoal} XP
                </Text>
              </Text>
              <View style={styles.goalTrack}>
                <View
                  style={[styles.goalFill, { width: `${xpProgress * 100}%` }]}
                />
              </View>
            </View>
            <Image
              source={images.treasure}
              style={styles.treasureImg}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Continue Learning ───────────────────────────────────────── */}
        {language && unit && (
          <View className="mx-4 mt-4">
            <View
              style={styles.heroCard}
              className="bg-lingua-purple rounded-3xl overflow-hidden"
            >
              <View className="p-5" style={styles.heroText}>
                <Text className="font-poppins text-sm text-white/70">
                  Continue learning
                </Text>
                <Text className="font-poppins-bold text-[26px] text-white mt-1">
                  {language.name}
                </Text>
                <Text className="font-poppins text-sm text-white/70 mt-1">
                  Unit {unit.order}
                </Text>

                <View className="mt-4 bg-white rounded-full h-10 px-5 items-center justify-center self-start">
                  <Text className="font-poppins-semibold text-sm text-lingua-purple">
                    Continue
                  </Text>
                </View>
              </View>

              <Image
                source={images.palace}
                style={styles.palaceImg}
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        {/* ── Today's Plan ────────────────────────────────────────────── */}
        {planItems.length > 0 && (
          <View className="mx-4 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="h4">{"Today's plan"}</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/learn")}>
                <Text className="body-sm text-lingua-purple">View all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.planList}>
              {planItems.map((item) => (
                <View key={item.key} className="flex-row items-center gap-3">
                  <View
                    className={`w-11 h-11 rounded-xl items-center justify-center ${
                      item.tint === "purple" ? "bg-lingua-purple" : "bg-error"
                    }`}
                  >
                    <Ionicons name={item.icon} size={20} color="#ffffff" />
                  </View>

                  <View className="flex-1">
                    <Text className="font-poppins-semibold text-[15px] text-text-primary">
                      {item.label}
                    </Text>
                    <Text
                      className="body-sm text-text-secondary"
                      numberOfLines={1}
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  {item.done ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#6c4ef5"
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={22}
                      color="#d1d5db"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Next Up: AI Video Call ───────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/ai-teacher")}
          className="mx-4 mt-6 mb-2 bg-[#eef7ea] rounded-3xl p-4 flex-row items-center gap-4"
        >
          <View className="flex-1">
            <Text className="body-sm text-text-secondary mb-0.5">Next up</Text>
            <Text className="font-poppins-semibold text-base text-text-primary">
              AI Video Call
            </Text>
            <Text className="body-sm text-text-secondary mt-0.5">
              Practice speaking
            </Text>
          </View>

          <View style={styles.aiAvatarWrap}>
            <Image
              source={{ uri: AI_TEACHER_AVATAR }}
              style={styles.aiAvatarImg}
              resizeMode="cover"
            />
            <View style={styles.videoBadge}>
              <Ionicons name="videocam" size={13} color="#ffffff" />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: "#f6f7fb",
  },
  avatarImg: {
    width: 42,
    height: 42,
  },
  goalTrack: {
    height: 8,
    width: "70%",
    borderRadius: 4,
    backgroundColor: "#f7dfc0",
    overflow: "hidden",
    marginTop: 10,
  },
  goalFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#ff8a00",
  },
  treasureImg: {
    width: 76,
    height: 76,
  },
  heroCard: {
    position: "relative",
    minHeight: 168,
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  heroText: {
    maxWidth: "62%",
  },
  palaceImg: {
    position: "absolute",
    right: -14,
    bottom: -16,
    width: 170,
    height: 170,
  },
  planList: {
    gap: 18,
  },
  aiAvatarWrap: {
    width: 52,
    height: 52,
  },
  aiAvatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#dcdcdc",
  },
  videoBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#21c16b",
    borderWidth: 2,
    borderColor: "#eef7ea",
    alignItems: "center",
    justifyContent: "center",
  },
});

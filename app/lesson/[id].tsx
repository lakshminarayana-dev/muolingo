import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
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
import { colors } from "@/constants/theme";
import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";

type TeacherMessage = {
  text: string;
  translation?: string;
};

const FEEDBACK = [
  { label: "Speaking", value: "Excellent", color: colors.semantic.success },
  { label: "Pronunciation", value: "Great", color: colors.primary.blue },
  { label: "Grammar", value: "Good", color: colors.primary.purple },
] as const;

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface ControlButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  variant?: "default" | "danger";
  onPress: () => void;
}

function ControlButton({
  icon,
  label,
  active = true,
  variant = "default",
  onPress,
}: ControlButtonProps) {
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      className="flex-1 items-center"
    >
      <View
        className={`w-14 h-14 rounded-full items-center justify-center overflow-hidden ${
          isDanger
            ? "bg-error"
            : active
              ? "bg-white border border-border"
              : "bg-[#3a3a3a] border border-white/10"
        }`}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isDanger || !active ? "#ffffff" : colors.neutral.textPrimary}
          style={isDanger ? styles.hangupIcon : undefined}
        />
      </View>
      <Text style={styles.controlLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = LESSONS.find((l) => l.id === id);
  const unit = lesson ? UNITS.find((u) => u.id === lesson.unitId) : undefined;
  const language = unit
    ? LANGUAGES.find((l) => l.code === unit.languageCode)
    : undefined;

  const [micOn, setMicOn] = useState(true);
  const [subtitlesOn, setSubtitlesOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const messages = useMemo<TeacherMessage[]>(() => {
    if (!lesson) return [];
    return [
      { text: lesson.aiTeacherPrompt.introMessage },
      ...lesson.phrases.map((p) => ({
        text: p.text,
        translation: p.translation,
      })),
    ];
  }, [lesson]);

  if (!lesson || !unit || !language) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff" }}
        edges={["top", "left", "right", "bottom"]}
      >
        <View className="flex-1 items-center justify-center gap-2 px-8">
          <Text className="h3 text-center">Lesson not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentMessage = messages[messageIndex];

  const toggleCamera = () => {
    Haptics.selectionAsync();
    setCameraOn((v) => !v);
  };

  const toggleMic = () => {
    Haptics.selectionAsync();
    setMicOn((v) => !v);
  };

  const toggleSubtitles = () => {
    Haptics.selectionAsync();
    setSubtitlesOn((v) => !v);
  };

  const handleAdvanceMessage = () => {
    Haptics.selectionAsync();
    setMessageIndex((i) => (i + 1) % messages.length);
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#ffffff" }}
      edges={["top", "left", "right", "bottom"]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View className="flex-row items-center justify-between px-4 pt-2 pb-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.neutral.textPrimary}
            />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="h4">AI Teacher</Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <View className="w-2 h-2 rounded-full bg-success" />
              <Text className="caption">Online</Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={toggleCamera}
              activeOpacity={0.7}
              className={`h-9 px-2.5 rounded-full items-center justify-center border ${
                cameraOn
                  ? "bg-[#f0edff] border-lingua-purple"
                  : "border-border"
              }`}
              style={{ minWidth: 36 }}
            >
              <Ionicons
                name={cameraOn ? "videocam" : "videocam-off"}
                size={16}
                color={cameraOn ? colors.primary.purple : colors.neutral.textPrimary}
              />
            </TouchableOpacity>
            <View
              className="h-9 px-2.5 rounded-full items-center justify-center border border-border"
              style={{ minWidth: 36 }}
            >
              <Text className="caption">{formatDuration(elapsedSeconds)}</Text>
            </View>
            <View
              className="h-9 px-2.5 rounded-full items-center justify-center border border-border"
              style={{ minWidth: 36 }}
            >
              <Ionicons
                name="radio-outline"
                size={16}
                color={colors.neutral.textPrimary}
              />
            </View>
          </View>
        </View>

        {/* ── Teacher visual, speech bubble + call controls ───────────── */}
        <View style={styles.hero}>
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

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.65)"]}
            locations={[0.35, 1]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />

          <View
            style={[
              styles.cameraInset,
              !cameraOn && styles.cameraInsetOff,
            ]}
          >
            <Ionicons
              name={cameraOn ? "person" : "videocam-off-outline"}
              size={cameraOn ? 26 : 18}
              color="#ffffff"
            />
          </View>

          <View style={styles.heroBottom}>
            <View style={styles.bubbleWrap}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleAdvanceMessage}
                className="bg-white rounded-2xl px-4 py-3 flex-row items-center shadow-bubble"
                style={{ elevation: 4 }}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-poppins-semibold text-base text-text-primary">
                    {currentMessage.text}
                  </Text>
                  {subtitlesOn && currentMessage.translation && (
                    <Text className="body-sm text-text-secondary mt-0.5">
                      {currentMessage.translation}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="volume-high"
                  size={20}
                  color={colors.primary.purple}
                />
              </TouchableOpacity>
              <View style={styles.bubbleTail} />
            </View>

            <View className="flex-row mt-5">
              <ControlButton
                icon={cameraOn ? "videocam" : "videocam-off"}
                label="Camera"
                active={cameraOn}
                onPress={toggleCamera}
              />
              <ControlButton
                icon={micOn ? "mic" : "mic-off"}
                label="Mic"
                active={micOn}
                onPress={toggleMic}
              />
              <ControlButton
                icon="language"
                label="Subtitles"
                active={subtitlesOn}
                onPress={toggleSubtitles}
              />
              <ControlButton
                icon="call"
                label="End Call"
                variant="danger"
                onPress={handleEndCall}
              />
            </View>
          </View>
        </View>

        {/* ── Lesson feedback ──────────────────────────────────────────── */}
        <View
          className="mx-4 mt-6 mb-6 rounded-2xl bg-white border border-border flex-row"
          style={{ elevation: 2 }}
        >
          {FEEDBACK.map((item, index) => (
            <View
              key={item.label}
              className={`flex-1 items-center py-4 ${
                index > 0 ? "border-l border-border" : ""
              }`}
            >
              <Text className="caption">{item.label}</Text>
              <Text
                className="font-poppins-semibold text-sm mt-1"
                style={{ color: item.color }}
              >
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 560,
    backgroundColor: "#f4efff",
    padding: 16,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  heroPalace: {
    position: "absolute",
    right: -30,
    bottom: -20,
    width: 240,
    height: 240,
    opacity: 0.5,
  },
  heroMascot: {
    position: "absolute",
    left: "50%",
    marginLeft: -140,
    bottom: 230,
    width: 280,
    height: 280,
  },
  heroBottom: {
    width: "100%",
  },
  cameraInset: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 64,
    height: 84,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraInsetOff: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bubbleWrap: {
    position: "relative",
  },
  bubbleTail: {
    position: "absolute",
    bottom: -6,
    left: 28,
    width: 16,
    height: 16,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "45deg" }],
    borderBottomLeftRadius: 3,
  },
  hangupIcon: {
    transform: [{ rotate: "135deg" }],
  },
  controlLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    lineHeight: 15,
    color: "#ffffff",
    marginTop: 6,
  },
});

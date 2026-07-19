import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { Lesson } from "@/types/learning";

export type LessonStatus = "completed" | "current" | "locked";

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  status: LessonStatus;
  onPress: () => void;
}

export default function LessonCard({
  lesson,
  index,
  status,
  onPress,
}: LessonCardProps) {
  const isCurrent = status === "current";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`flex-row items-center rounded-2xl px-4 py-4 mb-3 ${
        isCurrent
          ? "bg-[#f0edff] border-2 border-lingua-purple"
          : "bg-white border-[1.5px] border-border"
      }`}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`caption ${isCurrent ? "text-lingua-purple" : ""}`}
        >
          Lesson {index + 1}
        </Text>
        <Text
          className={`font-poppins-semibold text-base mt-0.5 ${
            isCurrent ? "text-lingua-purple" : "text-text-primary"
          }`}
        >
          {lesson.title}
        </Text>

        {isCurrent && (
          <Text className="body-sm text-lingua-purple mt-0.5">
            In progress
          </Text>
        )}
        {status === "locked" && (
          <Text className="caption mt-0.5">
            0 / {lesson.activities.length} steps
          </Text>
        )}
      </View>

      {status === "completed" && (
        <Ionicons
          name="checkmark-circle"
          size={28}
          color={colors.semantic.success}
        />
      )}
      {isCurrent && (
        <Image
          source={images.palace}
          style={{ width: 44, height: 44 }}
          resizeMode="contain"
        />
      )}
      {status === "locked" && (
        <Ionicons name="lock-closed" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );
}

import type { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
}

export default function SocialButton({ icon, label, onPress }: SocialButtonProps) {
  return (
    <TouchableOpacity
      className="relative items-center justify-center border-[1.5px] border-border rounded-[14px] h-14 px-5 mb-3 bg-white"
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View className="absolute left-5 top-0 bottom-0 w-6 items-center justify-center">
        {icon}
      </View>
      <Text className="font-poppins-medium text-sm text-text-primary">
        {label}
      </Text>
    </TouchableOpacity>
  );
}

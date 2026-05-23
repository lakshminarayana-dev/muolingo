import type { ReactNode } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";
import { colors } from "@/constants/theme";

interface AuthInputProps extends TextInputProps {
  label: string;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export default function AuthInput({
  label,
  rightElement,
  containerClassName = "",
  ...inputProps
}: AuthInputProps) {
  return (
    <View
      className={`border-[1.5px] border-border rounded-[14px] px-4 pt-2 pb-3 bg-white ${containerClassName}`}
    >
      <Text className="font-poppins text-xs text-text-secondary mb-0.5">{label}</Text>
      <View className={rightElement ? "flex-row items-center" : undefined}>
        <TextInput
          className={`font-poppins text-[15px] text-text-primary p-0 m-0${rightElement ? " flex-1" : ""}`}
          placeholderTextColor={colors.neutral.textSecondary}
          {...inputProps}
        />
        {rightElement}
      </View>
    </View>
  );
}

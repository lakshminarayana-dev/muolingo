import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native";

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
}

export default function PrimaryButton({ label, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className="bg-lingua-purple rounded-[14px] py-3 px-4 items-center justify-center mt-6"
      activeOpacity={0.85}
      {...props}
    >
      <Text className="font-poppins-semibold text-base text-white">{label}</Text>
    </TouchableOpacity>
  );
}

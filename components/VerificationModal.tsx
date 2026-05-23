import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface VerificationModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  error?: string;
}

export default function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  onResend,
  error: externalError,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef<TextInput>(null);

  const errorMessage = externalError || localError;

  useEffect(() => {
    if (visible) {
      setCode("");
      setLocalError("");
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const handleCodeChange = async (text: string) => {
    if (isVerifying) return;
    const digits = text.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(digits);
    setLocalError("");

    if (digits.length === 6) {
      setIsVerifying(true);
      try {
        await onVerify(digits);
      } catch (err: unknown) {
        const clerkErr = err as { errors?: { message: string }[]; message?: string };
        setLocalError(clerkErr.errors?.[0]?.message ?? clerkErr.message ?? "Invalid code. Try again.");
        setCode("");
        setTimeout(() => inputRef.current?.focus(), 100);
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleResend = async () => {
    setLocalError("");
    try {
      await onResend();
    } catch (err: unknown) {
      const clerkErr = err as { errors?: { message: string }[]; message?: string };
      setLocalError(clerkErr.errors?.[0]?.message ?? "Failed to resend code.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <TouchableOpacity
          className="absolute inset-0 bg-black/45"
          onPress={onClose}
          activeOpacity={1}
        />

        <View className="bg-white rounded-t-[28px] px-6 pb-11 pt-3 items-center">
          <View className="w-10 h-1 bg-border rounded-full mb-7" />

          <Text className="font-poppins-bold text-[22px] text-text-primary text-center mb-2.5">
            Check your email ✉️
          </Text>
          <Text className="font-poppins text-sm text-text-secondary text-center leading-5.5 mb-8">
            {"We sent a 6-digit code to\n"}
            <Text className="font-poppins-semibold text-text-primary">
              {email || "your email"}
            </Text>
          </Text>

          <TouchableOpacity
            className={`flex-row gap-2.5 ${errorMessage ? "mb-2" : "mb-8"}`}
            onPress={() => inputRef.current?.focus()}
            activeOpacity={1}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <View
                key={i}
                className={`w-12 h-14.5 rounded-xl border-[1.5px] items-center justify-center ${
                  code.length >= i
                    ? "border-lingua-purple bg-white"
                    : "border-border bg-surface"
                }`}
              >
                <Text className="font-poppins-bold text-[22px] text-text-primary">
                  {code[i] ?? ""}
                </Text>
              </View>
            ))}
          </TouchableOpacity>

          {errorMessage ? (
            <Text className="font-poppins text-xs text-error mb-6 text-center">
              {errorMessage}
            </Text>
          ) : null}

          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={handleCodeChange}
            keyboardType="number-pad"
            maxLength={6}
            className="absolute w-px h-px opacity-0"
            caretHidden
            editable={!isVerifying}
          />

          <Text className="font-poppins text-[13px] text-text-secondary">
            {"Didn't receive a code? "}
            <Text
              className="font-poppins-semibold text-lingua-purple"
              onPress={handleResend}
            >
              Resend
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

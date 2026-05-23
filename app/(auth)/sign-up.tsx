import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useSignUp } from "@clerk/expo";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import AuthInput from "@/components/AuthInput";
import PrimaryButton from "@/components/PrimaryButton";
import SocialSection from "@/components/SocialSection";
import VerificationModal from "@/components/VerificationModal";

export default function SignUpScreen() {
  const { signUp, fetchStatus } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setError("");
    const { error: signUpError } = await signUp.password({ emailAddress: email, password });
    if (signUpError) {
      setError(signUpError.message ?? "Sign up failed.");
      return;
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) {
      setError(sendError.message ?? "Failed to send verification code.");
      return;
    }
    setShowModal(true);
  };

  const handleVerify = async (code: string) => {
    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) throw verifyError;
    if (signUp.status === "complete") {
      await signUp.finalize();
      router.replace("/");
    }
  };

  const handleResend = async () => {
    const { error: resendError } = await signUp.verifications.sendEmailCode();
    if (resendError) throw resendError;
  };

  const isLoading = fetchStatus === "fetching";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-poppins-bold text-[28px] leading-9 text-text-primary mt-5">
          Create your account
        </Text>
        <Text className="font-poppins text-sm text-text-secondary mt-1">
          Start your language journey today ✨
        </Text>

        <View className="items-center mt-6">
          <Image source={images.mascotAuth} className="w-40 h-35" resizeMode="contain" />
        </View>

        <AuthInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="alex@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerClassName="mt-5"
        />

        <AuthInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          containerClassName="mt-3"
          rightElement={
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              className="pl-2 py-0.5"
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.neutral.textSecondary}
              />
            </TouchableOpacity>
          }
        />

        {error ? (
          <Text className="font-poppins text-xs text-error mt-2">{error}</Text>
        ) : null}

        <PrimaryButton
          label="Sign Up"
          onPress={handleSignUp}
          disabled={isLoading || !email || !password}
        />

        <SocialSection />

        <View className="flex-row items-center justify-center mt-2">
          <Text className="font-poppins text-sm text-text-secondary">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
            <Text className="font-poppins-semibold text-sm text-lingua-purple">Log in</Text>
          </TouchableOpacity>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>

      <VerificationModal
        visible={showModal}
        email={email}
        onClose={() => setShowModal(false)}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    </SafeAreaView>
  );
}

import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useSignIn } from "@clerk/expo";
import { images } from "@/constants/images";
import AuthInput from "@/components/AuthInput";
import PrimaryButton from "@/components/PrimaryButton";
import SocialSection from "@/components/SocialSection";
import VerificationModal from "@/components/VerificationModal";

export default function SignInScreen() {
  const { signIn, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    const { error: sendError } = await signIn.emailCode.sendCode({ emailAddress: email });
    if (sendError) {
      setError(sendError.message ?? "Failed to send verification code.");
      return;
    }
    setShowModal(true);
  };

  const handleVerify = async (code: string) => {
    const { error: verifyError } = await signIn.emailCode.verifyCode({ code });
    if (verifyError) throw verifyError;
    if (signIn.status === "complete") {
      await signIn.finalize();
      router.replace("/");
    }
  };

  const handleResend = async () => {
    const { error: resendError } = await signIn.emailCode.sendCode({ emailAddress: email });
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
          Welcome back!
        </Text>
        <Text className="font-poppins text-sm text-text-secondary mt-1">
          Sign in to continue your journey 🌍
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

        {error ? (
          <Text className="font-poppins text-xs text-error mt-2">{error}</Text>
        ) : null}

        <PrimaryButton
          label="Sign In"
          onPress={handleSignIn}
          disabled={isLoading || !email}
        />

        <SocialSection />

        <View className="flex-row items-center justify-center mt-2">
          <Text className="font-poppins text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-up")}>
            <Text className="font-poppins-semibold text-sm text-lingua-purple">Sign Up</Text>
          </TouchableOpacity>
        </View>
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

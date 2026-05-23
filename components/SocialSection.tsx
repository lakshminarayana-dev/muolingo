import { useSSO } from "@clerk/expo";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Text, View } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import SocialButton from "./SocialButton";

WebBrowser.maybeCompleteAuthSession();

export default function SocialSection() {
  const { startSSOFlow } = useSSO();

  const handleSSO = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/", { scheme: "muolingo" }),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("SSO error:", err);
    }
  };

  return (
    <>
      <View className="flex-row items-center gap-3 my-6">
        <View className="flex-1 h-px bg-border" />
        <Text className="font-poppins text-sm text-text-secondary">
          or continue with
        </Text>
        <View className="flex-1 h-px bg-border" />
      </View>

      <SocialButton
        icon={<AntDesign name="google" size={20} color="#DB4437" />}
        label="Continue with Google"
        onPress={() => handleSSO("oauth_google")}
      />
      <SocialButton
        icon={<FontAwesome name="facebook" size={20} color="#1877F2" />}
        label="Continue with Facebook"
        onPress={() => handleSSO("oauth_facebook")}
      />
      <SocialButton
        icon={<AntDesign name="apple" size={20} color="#000000" />}
        label="Continue with Apple"
        onPress={() => handleSSO("oauth_apple")}
      />
    </>
  );
}

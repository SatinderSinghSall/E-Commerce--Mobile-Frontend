import { COLORS } from "@/assets/constants";
import { useSignIn } from "@clerk/clerk-expo";
import type { EmailCodeFactor } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import LoadingOverlay from "../components/LoadingOverlay";

const InputField = React.memo(({ label, ...props }: any) => (
  <View className="mb-4">
    <Text className="text-primary font-medium mb-2">{label}</Text>
    <TextInput
      className="w-full bg-surface px-4 py-4 rounded-xl text-primary"
      placeholderTextColor="#999"
      autoCapitalize="none"
      autoCorrect={false}
      blurOnSubmit={false}
      {...props}
    />
  </View>
));

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = emailAddress && password.length >= 6;

  const goBackSafe = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const onSignInPress = async () => {
    if (!isLoaded || !isFormValid) return;
    setLoading(true);

    try {
      const attempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      } else if (attempt.status === "needs_second_factor") {
        const factor = attempt.supportedSecondFactors?.find(
          (f): f is EmailCodeFactor => f.strategy === "email_code",
        );

        if (factor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: factor.emailAddressId,
          });

          setShowEmailCode(true);
          Toast.show({ type: "success", text1: "Code sent" });
        }
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Sign in failed",
        text2: err?.errors?.[0]?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!code) return;

    setLoading(true);
    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch {
      Toast.show({ type: "error", text1: "Invalid code" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading && <LoadingOverlay />}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="always"
        >
          <TouchableOpacity onPress={goBackSafe}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>

          {!showEmailCode ? (
            <>
              <View className="items-center mt-6 mb-10">
                <Text className="text-3xl font-bold text-primary">
                  Welcome Back
                </Text>
                <Text className="text-secondary mt-2">Sign in to continue</Text>
              </View>

              <InputField
                label="Email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="user@example.com"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />

              <InputField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                textContentType="password"
                autoComplete="password"
              />

              <TouchableOpacity
                disabled={!isFormValid || loading}
                onPress={onSignInPress}
                className={`py-4 rounded-full items-center mt-4 ${
                  !isFormValid ? "bg-gray-300" : "bg-primary"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">Sign In</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-8">
                <Text className="text-secondary">Don’t have an account?</Text>
                <Link href="/sign-up">
                  <Text className="text-primary font-bold ml-1"> Sign up</Text>
                </Link>
              </View>
            </>
          ) : (
            <>
              <View className="items-center mt-10 mb-10">
                <Text className="text-3xl font-bold text-primary">
                  Verify Email
                </Text>
                <Text className="text-secondary mt-2 text-center">
                  Enter the 6-digit code
                </Text>
              </View>

              <TextInput
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoCorrect={false}
                className="bg-surface p-5 rounded-xl text-center text-xl tracking-[8px] mb-6"
              />

              <TouchableOpacity
                onPress={onVerifyPress}
                className="bg-primary py-4 rounded-full items-center"
              >
                <Text className="text-white font-bold text-lg">Verify</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

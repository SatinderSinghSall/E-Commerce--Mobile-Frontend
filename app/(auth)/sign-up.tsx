import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Link } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { COLORS } from "@/assets/constants";
import React from "react";
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

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    emailAddress && password.length >= 6 && firstName && lastName;

  const goBackSafe = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const onSignUpPress = async () => {
    if (!isLoaded || !isFormValid) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);

      Toast.show({
        type: "success",
        text1: "Verification code sent",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Signup failed",
        text2: err?.errors?.[0]?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!code) {
      Toast.show({
        type: "error",
        text1: "Enter verification code",
      });
      return;
    }

    setLoading(true);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch {
      Toast.show({
        type: "error",
        text1: "Invalid code",
      });
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

          {!pendingVerification ? (
            <>
              {/* Header */}
              <View className="items-center mt-6 mb-10">
                <Text className="text-3xl font-bold text-primary">
                  Create Account
                </Text>
                <Text className="text-secondary mt-2">
                  Sign up to get started
                </Text>
              </View>

              <InputField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                textContentType="givenName"
                autoComplete="name"
              />

              <InputField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                textContentType="familyName"
                autoComplete="name"
              />

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
                textContentType="newPassword"
                autoComplete="password-new"
              />

              <TouchableOpacity
                disabled={!isFormValid || loading}
                onPress={onSignUpPress}
                className={`py-4 rounded-full items-center mt-4 ${
                  !isFormValid ? "bg-gray-300" : "bg-primary"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">Continue</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center mt-8">
                <Text className="text-secondary">Already have an account?</Text>
                <Link href="/sign-in">
                  <Text className="text-primary font-bold ml-1"> Login</Text>
                </Link>
              </View>
            </>
          ) : (
            <>
              {/* Verification */}
              <View className="items-center mt-10 mb-10">
                <Text className="text-3xl font-bold text-primary">
                  Verify Email
                </Text>
                <Text className="text-secondary text-center mt-2">
                  Enter the 6-digit code sent to your email
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
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">Verify</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

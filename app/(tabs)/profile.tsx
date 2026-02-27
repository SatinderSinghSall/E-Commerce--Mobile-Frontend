import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/assets/constants";
import GuestProfile from "../components/GuestProfile";
import Toast from "react-native-toast-message";
import { useUser, useAuth } from "@clerk/clerk-expo";

export default function Profile() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      setShowLogoutModal(false);
      router.replace("/sign-in");

      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Logout failed",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  const initials =
    (user?.firstName?.charAt(0) ?? "") + (user?.lastName?.charAt(0) ?? "");

  // Loading state while Clerk loads
  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profile" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16, paddingBottom: 30 }
        }
      >
        {!user ? (
          <GuestProfile />
        ) : (
          <>
            {/* PROFILE HEADER */}
            <View className="items-center mb-10">
              {/* Avatar */}
              {user.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="w-24 h-24 rounded-full"
                  style={{
                    borderWidth: 3,
                    borderColor: "#fff",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    elevation: 4,
                  }}
                />
              ) : (
                <View
                  className="w-24 h-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Text className="text-white text-2xl font-bold">
                    {initials}
                  </Text>
                </View>
              )}

              {/* Name */}
              <Text className="text-2xl font-semibold text-gray-900 mt-3">
                {user.firstName} {user.lastName}
              </Text>

              {/* Email */}
              <Text className="text-gray-500 text-sm mt-1">
                {user.primaryEmailAddress?.emailAddress}
              </Text>

              {/* ADMIN BADGE */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  onPress={() => router.push("/admin")}
                  className="mt-4 px-5 py-2 rounded-full flex-row items-center"
                  style={{ backgroundColor: COLORS.primary + "15" }}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text className="ml-2 text-primary font-semibold">
                    Admin Panel
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* PROFILE MENU */}
            <View
              className="bg-white rounded-2xl p-2 mb-6"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  className={`flex-row items-center px-4 py-4 ${
                    index !== PROFILE_MENU.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                  onPress={() => router.push(item.route as any)}
                >
                  <View
                    className="w-11 h-11 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: COLORS.primary + "12" }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>

                  <Text className="flex-1 text-gray-800 font-medium text-base">
                    {item.title}
                  </Text>

                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              onPress={() => setShowLogoutModal(true)}
              className="py-4 rounded-2xl items-center"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <Text className="text-red-500 font-semibold">Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center px-6">
          <View className="bg-white w-full rounded-3xl p-6">
            {/* Icon */}
            <View
              className="w-16 h-16 rounded-full items-center justify-center self-center mb-4"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <Ionicons name="log-out-outline" size={28} color="#EF4444" />
            </View>

            {/* Title */}
            <Text className="text-xl font-semibold text-center text-gray-900">
              Logout?
            </Text>

            {/* Message */}
            <Text className="text-gray-500 text-center mt-2 mb-6">
              Are you sure you want to logout from your account?
            </Text>

            {/* Buttons */}
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl items-center mr-2"
                style={{ backgroundColor: "#F3F4F6" }}
                disabled={loggingOut}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-1 py-3 rounded-xl items-center ml-2"
                style={{ backgroundColor: "#EF4444" }}
                disabled={loggingOut}
              >
                {loggingOut ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-medium">Logout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

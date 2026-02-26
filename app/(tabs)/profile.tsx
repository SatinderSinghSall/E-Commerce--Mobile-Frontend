import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { dummyUser } from "@/assets/assets";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/assets/constants";
import GuestProfile from "../components/GuestProfile";
import Toast from "react-native-toast-message";

export default function Profile() {
  const { user } = { user: dummyUser };
  const router = useRouter();

  const handleLogout = async () => {
    router.replace("/sign-in");
    Toast.show({
      type: "info",
      text1: "Logout Status:",
      text2: "You have been logout successfully.",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Profile" />

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          // Guest user Screen:
          <GuestProfile />
        ) : (
          <>
            {/* Profile Information */}
            <View className="items-center mb-10">
              {/* Avatar */}
              <View className="mb-3">
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
              </View>

              {/* Name */}
              <Text className="text-2xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </Text>

              {/* Email */}
              <Text className="text-gray-500 text-sm mt-1">
                {user.emailAddresses[0].emailAddress}
              </Text>

              {/* Admin Badge */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  onPress={() => router.push("/admin")}
                  className="mt-4 px-5 py-2 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: COLORS.primary + "15",
                  }}
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

            {/* User Profile Menu: */}
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
                  {/* Icon container */}
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

            {/* Logout Button: */}
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-200 py-4 rounded-2xl items-center"
            >
              <Text className="text-red-500 font-semibold">Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

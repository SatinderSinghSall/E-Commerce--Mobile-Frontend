import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/assets/constants";

export default function GuestProfile() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface justify-center px-6">
      {/* Premium Card */}
      <View
        className="bg-white rounded-3xl p-8 items-center"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 20,
          elevation: 6,
        }}
      >
        {/* Avatar Section */}
        <View className="items-center mb-6">
          {/* soft glow */}
          <View
            className="w-28 h-28 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.primary + "10" }}
          >
            <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center">
              <Ionicons
                name="person-outline"
                size={42}
                color={COLORS.primary}
              />
            </View>
          </View>
        </View>

        {/* Title */}
        <Text className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
          Welcome, Guest
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-500 text-center leading-6 mb-7 px-4">
          Sign in to track orders, save favorites, and enjoy a faster checkout
          experience.
        </Text>

        {/* Benefits */}
        <View className="w-full mb-8">
          {[
            { icon: "cube-outline", label: "Track your orders" },
            { icon: "heart-outline", label: "Save your favorites" },
            { icon: "flash-outline", label: "Lightning fast checkout" },
          ].map((item, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              <Text className="ml-3 text-gray-600 text-sm">{item.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/sign-in")}
          className="w-full py-4 rounded-2xl items-center"
          style={{
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            Login / Sign Up
          </Text>
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity onPress={() => router.push("/")} className="mt-6">
          <Text className="text-primary font-medium">Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

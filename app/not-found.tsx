import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/assets/constants";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {/* Icon */}
      <View className="bg-primary/10 p-6 rounded-full mb-6">
        <Ionicons name="bag-handle-outline" size={60} color={COLORS.primary} />
      </View>

      {/* Title */}
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        Oops! Page Not Found
      </Text>

      {/* Subtitle */}
      <Text className="text-gray-500 text-center mb-8 leading-6">
        The item you're looking for might have been removed, renamed, or is
        temporarily unavailable.
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        onPress={() => router.replace("/")}
        className="bg-primary px-8 py-4 rounded-2xl shadow-sm"
      >
        <Text className="text-white font-semibold text-base">
          Continue Shopping
        </Text>
      </TouchableOpacity>

      {/* Secondary Action */}
      <TouchableOpacity onPress={() => router.back()} className="mt-4">
        <Text className="text-primary font-medium">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

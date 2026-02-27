import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LogoutModal({
  visible,
  onCancel,
  onConfirm,
  loading,
}: any) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/40 items-center justify-center px-6 z-[999]">
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
            onPress={onCancel}
            className="flex-1 py-3 rounded-xl items-center mr-2"
            style={{ backgroundColor: "#F3F4F6" }}
            disabled={loading}
          >
            <Text className="text-gray-700 font-medium">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            className="flex-1 py-3 rounded-xl items-center ml-2"
            style={{ backgroundColor: "#EF4444" }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-medium">Logout</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

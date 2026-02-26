import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      <View className="bg-gray-100 p-6 rounded-full mb-6">
        <Ionicons name="cart-outline" size={48} color="#9CA3AF" />
      </View>

      <Text className="text-xl font-semibold text-gray-800 mb-2">
        Your cart is empty
      </Text>

      <Text className="text-gray-500 text-center mb-6 leading-5">
        Looks like you haven’t added anything yet.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/")}
        className="bg-primary px-8 py-3 rounded-xl shadow-sm"
      >
        <Text className="text-white font-semibold">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

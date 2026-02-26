import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { CartItemProps } from "@/assets/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/assets/constants";

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const imageUrl = item.product.images[0];

  return (
    <View
      className="flex-row mb-4 bg-white rounded-2xl p-3"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      {/* Product Image */}
      <View className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4">
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View className="flex-1 justify-between">
        {/* Top Row */}
        <View className="flex-row justify-between">
          <View className="flex-1 pr-2">
            <Text
              numberOfLines={2}
              className="text-gray-900 font-semibold text-sm mb-1"
            >
              {item.product.name}
            </Text>

            <Text className="text-gray-400 text-xs">Size: {item.size}</Text>
          </View>

          {/* Remove Button */}
          <TouchableOpacity
            onPress={onRemove}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Bottom Row */}
        <View className="flex-row justify-between items-center mt-3">
          {/* Price */}
          <Text className="text-primary font-bold text-base">
            ₹{item.product.price.toFixed(2)}
          </Text>

          {/* Quantity Stepper */}
          <View className="flex-row items-center bg-gray-100 rounded-full px-2 py-1">
            <TouchableOpacity
              className="px-2 py-1"
              onPress={() =>
                onUpdateQuantity && onUpdateQuantity(item.quantity - 1)
              }
            >
              <Ionicons name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>

            <Text className="text-gray-900 font-medium mx-2">
              {item.quantity}
            </Text>

            <TouchableOpacity
              className="px-2 py-1"
              onPress={() =>
                onUpdateQuantity && onUpdateQuantity(item.quantity + 1)
              }
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import EmptyCart from "../components/EmptyCart";
import CartItem from "../components/CartItem";
import { COLORS } from "@/assets/constants";

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const shippingCost = 500;
  const total = cartTotal + shippingCost;

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="My Cart" showBack />

      {cartItems.length > 0 ? (
        <>
          <ScrollView
            className="flex-1 px-4 mt-4"
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => removeFromCart(item.id, item.size)}
                onUpdateQuantity={(q) => updateQuantity(item.id, q, item.size)}
              />
            ))}
          </ScrollView>

          <View
            className="px-5 pt-5 pb-6 bg-white rounded-t-3xl"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            {/* FREE Shipping Message */}
            {cartTotal < 2000 && (
              <Text className="text-xs text-green-600 mb-3 text-center">
                Add ₹{(2000 - cartTotal).toFixed(0)} more for FREE delivery 🚚
              </Text>
            )}

            {/* Subtotal */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500">Subtotal</Text>
              <Text className="text-gray-800 font-medium">
                ₹{cartTotal.toFixed(2)}
              </Text>
            </View>

            {/* Shipping */}
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500">Shipping</Text>
              <Text className="text-gray-800 font-medium">
                ₹{shippingCost.toFixed(2)}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-200 mb-4" />

            {/* Total */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-lg font-semibold text-gray-900">Total</Text>
              <Text className="text-xl font-bold text-primary">
                ₹{total.toFixed(2)}
              </Text>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/checkout")}
              className="py-4 rounded-2xl items-center"
              style={{
                backgroundColor: COLORS.primary,
                shadowColor: COLORS.primary,
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <Text className="text-white font-semibold text-lg">
                Proceed to Checkout
              </Text>
            </TouchableOpacity>

            {/* Trust message */}
            <Text className="text-xs text-gray-400 text-center mt-3">
              Secure checkout • Easy returns • Trusted payments
            </Text>
          </View>
        </>
      ) : (
        <EmptyCart />
      )}
    </SafeAreaView>
  );
}

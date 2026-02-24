import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/assets/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/assets/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const fetchProduct = async () => {
    setProduct(dummyProducts.find((product) => product._id === id) as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    if (!product) {
      return (
        <SafeAreaView className="flex-1 justify-center items-center px-6 bg-white">
          <MaterialCommunityIcons
            name="package-variant-closed-remove"
            size={64}
            color={COLORS.primary}
          />

          <Text className="text-xl font-semibold mt-4 text-gray-800">
            Product Unavailable
          </Text>

          <Text className="text-gray-500 text-center mt-2">
            Sorry, this item is no longer available or may have been removed.
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 px-6 py-3 rounded-full"
            style={{ backgroundColor: COLORS.primary }}
          >
            <Text className="text-white font-semibold">Continue Shopping</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
  }

  const isLiked = isInWishlist(product._id);

  return (
    <View>
      <Text>[id]</Text>
    </View>
  );
}

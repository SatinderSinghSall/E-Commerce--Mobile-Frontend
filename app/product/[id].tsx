import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/assets/constants/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { dummyProducts } from "@/assets/assets";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/assets/constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart, cartItems, itemCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const insets = useSafeAreaInsets();

  const fetchProduct = async () => {
    const found: any = dummyProducts.find((product) => product._id === id);
    setProduct(found ?? null);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

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

  const isLiked = isInWishlist(product._id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        type: "info",
        text1: "No Size Selected:",
        text2: "Please select the size from the given size options.",
      });
      return;
    }
    addToCart(product, selectedSize || "");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Product Image Carousel: */}
        <View
          style={{ paddingTop: insets.top }}
          className="relative h-[450px] bg-[#f6f7f9] mb-6"
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(slide);
            }}
          >
            {product.images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: 450 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Header Actions: */}
          <View
            style={{ top: insets.top + 10 }}
            className="absolute left-4 right-4 flex-row justify-between items-center z-10"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 bg-white rounded-full items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Ionicons name="arrow-back" color={COLORS.primary} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleWishlist(product)}
              className="w-11 h-11 bg-white rounded-full items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                color={isLiked ? COLORS.accent : COLORS.primary}
                size={24}
              />
            </TouchableOpacity>
          </View>

          {/* Pagination Dots: */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images?.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === activeImageIndex
                    ? "w-6 bg-primary"
                    : "w-2 bg-gray-300 opacity-60"
                }`}
              />
            ))}
          </View>
        </View>

        {/* Product Information: */}
        <View className="px-5">
          {/* Product - Title & Rating: */}
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-semibold text-gray-900 flex-1 mr-4">
              {product.name}
            </Text>

            <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-full">
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text className="text-xs font-semibold ml-1">4.6</Text>
              <Text className="text-xs text-gray-500 ml-1">(85)</Text>
            </View>
          </View>

          {/* Product - Price: */}
          <Text className="text-3xl font-bold text-primary mb-2">
            ₹{product.price.toFixed(2)}
          </Text>

          {/* Product - Sizing Options: */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text className="text-base font-semibold text-gray-900 mb-3 mt-6">
                Select Size
              </Text>

              <View className="flex-row gap-3 mb-6 flex-wrap">
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full items-center justify-center border ${
                      selectedSize === size
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300"
                    }`}
                    style={{
                      shadowColor:
                        selectedSize === size ? COLORS.primary : "#000",
                      shadowOpacity: selectedSize === size ? 0.25 : 0,
                      shadowRadius: 6,
                      elevation: selectedSize === size ? 3 : 0,
                    }}
                  >
                    <Text
                      className={`text-sm font-semibold ${
                        selectedSize === size ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Product - Description: */}
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Description
          </Text>
          <Text className="text-gray-500 leading-7 mb-6">
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Product - Footer */}
      <View
        style={{ paddingBottom: insets.bottom }}
        className="absolute bottom-0 left-0 right-0 px-4 pt-4 bg-white border-t border-gray-200"
      >
        <View className="flex-row items-center">
          {/* Add to Cart Button */}
          <TouchableOpacity
            onPress={handleAddToCart}
            activeOpacity={0.9}
            className="flex-1 py-4 rounded-2xl items-center justify-center flex-row mr-3"
            style={{
              backgroundColor: COLORS.primary,
              shadowColor: COLORS.primary,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Ionicons name="bag-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">
              Add to Cart
            </Text>
          </TouchableOpacity>

          {/* Cart Icon Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/cart")}
            className="w-14 h-14 rounded-full border border-gray-200 items-center justify-center bg-white"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={22} color="#000" />

            {itemCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-primary rounded-full min-w-[18px] h-[18px] px-[4px] items-center justify-center">
                <Text className="text-white text-[10px] font-bold">
                  {itemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

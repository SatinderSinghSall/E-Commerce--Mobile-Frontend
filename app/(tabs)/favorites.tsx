import { View, Text } from "react-native";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import EmptyWishlist from "../components/EmptyWishlist";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { wishlist } = useWishlist();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Wishlist" showMenu showCart />

      {wishlist.length > 0 ? (
        <ScrollView
          className="flex-1 px-4 mt-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap justify-between">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyWishlist />
      )}
    </SafeAreaView>
  );
}

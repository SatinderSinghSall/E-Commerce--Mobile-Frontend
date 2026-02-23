import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const { width } = Dimensions.get("window");

export default function Sidebar({ visible, onClose }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const slideAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -width,
      useNativeDriver: true,
      damping: 24,
      stiffness: 120,
    }).start();
  }, [visible]);

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      className="absolute inset-0 z-[999]"
      style={{ elevation: 999 }}
    >
      {/* Premium overlay */}
      {visible && (
        <Pressable onPress={onClose} className="absolute inset-0 bg-black/55" />
      )}

      {/* Drawer */}
      <Animated.View
        style={{ transform: [{ translateX: slideAnim }] }}
        className="absolute left-0 top-0 bottom-0 w-[82%] bg-white pt-16 px-6"
      >
        {/* 👤 USER CARD */}
        <View className="mb-10">
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.pravatar.cc/200?img=12" }}
              className="w-14 h-14 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-lg font-semibold text-gray-900">
                Welcome back,
              </Text>
              <Text className="text-sm text-gray-500">Satinder 👋</Text>
            </View>
          </View>
        </View>

        {/* SHOP SECTION */}
        <Text className="text-xs uppercase tracking-widest text-gray-400 mb-3">
          SHOP
        </Text>

        {menuItems.map((item) => {
          const active = pathname === item.route;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                onClose();
                router.push(item.route);
              }}
              activeOpacity={0.7}
              className={`flex-row items-center py-4 px-3 rounded-xl mb-1 ${
                active ? "bg-gray-100" : ""
              }`}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={active ? "#000" : "#444"}
              />
              <Text
                className={`ml-4 text-[16px] ${
                  active ? "text-black font-semibold" : "text-gray-700"
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Divider */}
        <View className="h-px bg-gray-200 my-6" />

        {/* SUPPORT SECTION */}
        <Text className="text-xs uppercase tracking-widest text-gray-400 mb-3">
          ACCOUNT
        </Text>

        <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl">
          <Ionicons name="settings-outline" size={22} color="#444" />
          <Text className="ml-4 text-[16px] text-gray-700">Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl">
          <Ionicons name="help-circle-outline" size={22} color="#444" />
          <Text className="ml-4 text-[16px] text-gray-700">Help & Support</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity className="flex-row items-center py-4 px-3 rounded-xl mt-2">
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text className="ml-4 text-[16px] text-red-500 font-medium">
            Logout
          </Text>
        </TouchableOpacity>

        {/* PREMIUM FOOTER */}
        <View className="absolute bottom-8 left-6 right-6">
          <View className="h-px bg-gray-200 mb-4" />

          <Text className="text-center text-xs text-gray-400">
            Forever Store
          </Text>
          <Text className="text-center text-[11px] text-gray-400 mt-1">
            Version 1.0.0
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const menuItems = [
  { label: "Home", icon: "home-outline", route: "/(tabs)" },
  { label: "Shop", icon: "storefront-outline", route: "/shop" },
  { label: "Orders", icon: "receipt-outline", route: "/orders" },
  { label: "Wishlist", icon: "heart-outline", route: "/(tabs)/favorites" },
  { label: "Profile", icon: "person-outline", route: "/(tabs)/profile" },
];

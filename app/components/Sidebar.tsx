import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Sidebar({ visible, onClose }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // responsive drawer width
  const drawerWidth = Math.min(width * 0.82, 340);

  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : -drawerWidth,
      useNativeDriver: true,
      damping: 25,
      stiffness: 180,
      mass: 0.7,
    }).start();
  }, [visible, drawerWidth]);

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      style={{ elevation: 999 }}
      className="absolute inset-0 z-[999]"
    >
      {/* Overlay */}
      {visible && (
        <Pressable onPress={onClose} className="absolute inset-0 bg-black/40" />
      )}

      {/* Drawer */}
      <Animated.View
        style={{
          transform: [{ translateX: slideAnim }],
          width: drawerWidth,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        className="absolute left-0 top-0 bottom-0 bg-[#FAFAFA]"
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#111", "#2a2a2a"]}
          className="px-6 pb-8 pt-4 rounded-br-[36px]"
        >
          <View className="flex-row items-center">
            <Image
              source={{ uri: "https://i.pravatar.cc/200?img=12" }}
              className="w-16 h-16 rounded-full border-2 border-white"
            />

            <View className="ml-4">
              <Text className="text-white text-lg font-semibold">Welcome</Text>
              <Text className="text-gray-300 text-sm">Satinder Singh 👋</Text>
            </View>
          </View>
        </LinearGradient>

        {/* MENU */}
        <View
          className="px-5 mt-6"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* SHOP */}
          <Text className="text-xs tracking-widest text-gray-400 mb-4 ml-2">
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
                activeOpacity={0.85}
                className={`flex-row items-center py-4 px-4 rounded-2xl mb-2 ${
                  active ? "bg-white" : ""
                }`}
                style={
                  active
                    ? {
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 10,
                        elevation: 2,
                      }
                    : undefined
                }
              >
                {active && (
                  <View className="w-1.5 h-6 bg-black rounded-full mr-3" />
                )}

                <Ionicons
                  name={item.icon}
                  size={21}
                  color={active ? "#000" : "#666"}
                />

                <Text
                  className={`ml-4 text-[15.5px] ${
                    active ? "text-black font-semibold" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* divider */}
          <View className="h-px bg-gray-200 my-6" />

          {/* ACCOUNT */}
          <Text className="text-xs tracking-widest text-gray-400 mb-4 ml-2">
            ACCOUNT
          </Text>

          <MenuItem icon="settings-outline" label="Settings" />
          <MenuItem icon="help-circle-outline" label="Help & Support" />

          {/* Logout */}
          <TouchableOpacity className="flex-row items-center py-4 px-4 rounded-2xl mt-2">
            <Ionicons name="log-out-outline" size={21} color="#ef4444" />
            <Text className="ml-4 text-[15.5px] text-red-500 font-medium">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View
          style={{ bottom: insets.bottom + 10 }}
          className="absolute left-0 right-0 items-center"
        >
          <Text className="text-gray-400 text-xs tracking-wide">
            FOREVER STORE
          </Text>
          <Text className="text-gray-300 text-[11px] mt-1">Version 1.0.0</Text>
        </View>
      </Animated.View>
    </View>
  );
}

function MenuItem({ icon, label }: any) {
  return (
    <TouchableOpacity className="flex-row items-center py-4 px-4 rounded-2xl mb-2">
      <Ionicons name={icon} size={21} color="#666" />
      <Text className="ml-4 text-[15.5px] text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
}

const menuItems = [
  { label: "Home", icon: "home-outline", route: "/(tabs)" },
  { label: "Shop", icon: "storefront-outline", route: "/shop" },
  { label: "Orders", icon: "receipt-outline", route: "/orders" },
  { label: "Wishlist", icon: "heart-outline", route: "/(tabs)/favorites" },
  { label: "Profile", icon: "person-outline", route: "/(tabs)/profile" },
];

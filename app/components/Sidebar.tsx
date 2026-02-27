import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
  Image,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser, useAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import LogoutModal from "./LogoutModal";

export default function Sidebar({ visible, onClose }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useUser();
  const { signOut } = useAuth();

  const drawerWidth = Math.min(width * 0.82, 340);

  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: visible ? 0 : -drawerWidth,
        useNativeDriver: true,
        damping: 25,
        stiffness: 180,
      }),
      Animated.timing(overlayOpacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, drawerWidth]);

  const initials =
    (user?.firstName?.charAt(0) ?? "") + (user?.lastName?.charAt(0) ?? "");

  const navigate = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const logout = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      setShowLogout(false);
      router.replace("/sign-in");
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (route: string) =>
    pathname === route || pathname.startsWith(route);

  return (
    <View
      pointerEvents={visible ? "auto" : "none"}
      className="absolute inset-0 z-[999]"
    >
      {/* Overlay */}
      <Animated.View
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black/40"
      >
        <Pressable className="flex-1" onPress={onClose} />
      </Animated.View>

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
          colors={["#0f0f0f", "#2d2d2d"]}
          className="px-6 pb-8 pt-4 rounded-br-[36px]"
        >
          <View className="flex-row items-center">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                <Text className="text-white text-xl font-bold">
                  {initials || "G"}
                </Text>
              </View>
            )}

            <View className="ml-4">
              <Text className="text-white text-lg font-semibold">
                {user ? "Welcome" : "Hello 👋"}
              </Text>
              <Text className="text-gray-300 text-sm">
                {user
                  ? `${user.firstName ?? ""} ${user.lastName ?? ""}`
                  : "Guest User"}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* SCROLLABLE MENU */}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 90,
          }}
          className="px-5 mt-6"
        >
          <SectionLabel title="SHOP" />

          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={isActive(item.route)}
              onPress={() => navigate(item.route)}
            />
          ))}

          {/* Developer link (visible to all) */}
          <MenuItem
            icon="code-slash-outline"
            label="Developer"
            onPress={() =>
              Linking.openURL("https://satinder-portfolio.vercel.app/")
            }
          />

          {/* ADMIN SECTION */}
          {user?.publicMetadata?.role === "admin" && (
            <>
              <SectionLabel title="ADMIN" />
              <MenuItem
                icon="shield-checkmark-outline"
                label="Admin Panel"
                onPress={() => navigate("/admin")}
              />
            </>
          )}

          <View className="h-px bg-gray-200 my-6" />

          <SectionLabel title="ACCOUNT" />

          <MenuItem icon="settings-outline" label="Settings" />
          <MenuItem icon="help-circle-outline" label="Help & Support" />

          {/* Logout */}
          {user && (
            <TouchableOpacity
              onPress={() => setShowLogout(true)}
              className="flex-row items-center py-4 px-4 rounded-2xl mt-2"
            >
              <Ionicons name="log-out-outline" size={21} color="#ef4444" />
              <Text className="ml-4 text-[15.5px] text-red-500 font-medium">
                Logout
              </Text>
            </TouchableOpacity>
          )}
        </Animated.ScrollView>

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

      {/* Logout Modal */}
      <LogoutModal
        visible={showLogout}
        loading={loggingOut}
        onCancel={() => setShowLogout(false)}
        onConfirm={logout}
      />
    </View>
  );
}

function SectionLabel({ title }: any) {
  return (
    <Text className="text-xs tracking-widest text-gray-400 mb-4 ml-2">
      {title}
    </Text>
  );
}

function MenuItem({ icon, label, onPress, active }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
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
      {active && <View className="w-1.5 h-6 bg-black rounded-full mr-3" />}

      <Ionicons name={icon} size={21} color={active ? "#000" : "#666"} />

      <Text
        className={`ml-4 text-[15.5px] ${
          active ? "text-black font-semibold" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
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

import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/assets/constants";
import { useCart } from "@/context/CartContext";

export default function TabLayout() {
  const { cartItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: {
          height: 90,
          paddingTop: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#FOFOFO",
        },
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View className="relative">
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={30}
                color={color}
              />

              {cartItems?.length > 0 && (
                <View className="absolute -top-2 -right-2 bg-accent size-3 rounded-full items-center justify-center">
                  <Ionicons name="ellipse" size={6} color="white" />
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

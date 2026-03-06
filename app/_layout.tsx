import { Stack } from "expo-router";
import "@/global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const publishableKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_live_Y2xlcmsuc2F0aW5kZXJwb2V0cnkuY29tJA";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}

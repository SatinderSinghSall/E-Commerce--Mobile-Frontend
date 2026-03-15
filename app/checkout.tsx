import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import { Address } from "@/assets/constants/types";
import { dummyAddress } from "@/assets/assets";
import Toast from "react-native-toast-message";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { COLORS } from "@/assets/constants";
import Header from "./components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import api from "@/assets/constants/api";
import LottieView from "lottie-react-native";

export default function Checkout() {
  const { cartTotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");
  const [successModal, setSuccessModal] = useState(false);

  const insets = useSafeAreaInsets();

  const shipping = 200;
  const tax = 0;
  const total = cartTotal + shipping + tax;
  const router = useRouter();
  const { getToken } = useAuth();

  const fetchAddress = async () => {
    try {
      const token = await getToken();

      const { data } = await api.get("/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        const addressList = data.data;

        if (addressList.length > 0) {
          const defaultAddress =
            addressList.find((a: any) => a.isDefault) || addressList[0];

          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.log("Fetch Address Error:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add a shipping address.",
      });
      return;
    }

    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await api.post(
        "/orders",
        {
          shippingAddress: {
            street: selectedAddress.street,
            city: selectedAddress.city,
            state: selectedAddress.state,
            zipCode: selectedAddress.zipCode,
            country: selectedAddress.country,
          },
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setSuccessModal(true);

        setTimeout(() => {
          setSuccessModal(false);
          router.replace("/orders");
        }, 6000);
      }
    } catch (error) {
      console.log("Create Order Error:", error);

      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Unable to place order",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <Header title="Checkout" showBack />

      <ScrollView
        className="flex-1 px-4 mt-4"
        contentContainerStyle={{ paddingBottom: 140 }} // ✅ prevents hidden content
      >
        {/* Address Section */}
        <Text className="text-lg font-bold text-primary mb-4">
          Shipping Address
        </Text>
        {selectedAddress ? (
          <View className="bg-white p-4 rounded-xl mb-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-bold">
                {selectedAddress.type}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text className="text-accent text-sm">Change</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-secondary leading-5">
              {selectedAddress.street}, {selectedAddress.city}
              {"\n"}
              {selectedAddress.state} {selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            className="bg-white p-6 rounded-xl mb-6 items-center justify-center border-dashed border-2 border-gray-100"
          >
            <Text className="text-primary font-bold">Add Address</Text>
          </TouchableOpacity>
        )}

        {/* Payment Section */}
        <Text className="text-lg font-bold text-primary mb-4">
          Payment Method
        </Text>

        {/* Cash on Delivery Option */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("cash")}
          className={`bg-white p-4 rounded-xl mb-4 shadow-sm flex-row items-center border-2 ${paymentMethod === "cash" ? "border-primary" : "border-transparent"}`}
        >
          <Ionicons name="cash-outline" size={24} color={COLORS.primary} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Cash on Delivery
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Pay when you receive the order
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>

        {/* Stripe Option */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("stripe")}
          className={`bg-white p-4 rounded-xl mb-6 shadow-sm flex-row items-center border-2 ${paymentMethod === "stripe" ? "border-primary" : "border-transparent"}`}
        >
          <Ionicons name="card-outline" size={24} color={COLORS.primary} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-bold text-primary">
              Pay with Card
            </Text>
            <Text className="text-secondary text-xs mt-1">
              Credit or Debit Card
            </Text>
          </View>
          {paymentMethod === "stripe" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      <View
        className="pt-4 px-4 bg-white border-t border-gray-100"
        style={{
          paddingBottom: insets.bottom + 12, // ✅ prevents overlap
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 12,
        }}
      >
        {/* Order Summary */}
        <Text className="text-lg font-bold text-primary mb-4">
          Order Summary
        </Text>

        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Subtotal</Text>
          <Text className="font-bold">${cartTotal.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-2">
          <Text className="text-secondary">Shipping</Text>
          <Text className="font-bold">${shipping.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-4">
          <Text className="text-secondary">Tax</Text>
          <Text className="font-bold">${tax.toFixed(2)}</Text>
        </View>

        <View className="flex-row justify-between mb-6">
          <Text className="text-xl font-bold text-primary">Total</Text>
          <Text className="text-xl font-bold text-primary">
            ${total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={loading}
          activeOpacity={0.9}
          className={`p-4 rounded-xl items-center ${
            loading ? "bg-gray-400" : "bg-primary"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Place Order</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal: */}
      <Modal visible={successModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-3xl p-8 items-center w-[80%]">
            <LottieView
              source={require("@/assets/animations/order-success.json")}
              autoPlay
              loop={false}
              style={{ width: 150, height: 150 }}
            />

            <Text className="text-xl font-bold text-primary mt-2">
              Order Placed!
            </Text>

            <Text className="text-secondary text-center mt-2">
              Your order was placed successfully.
            </Text>
          </View>
        </View>
      </Modal>

      {/* PAYMENT MODAL */}
      {/* <Modal
        visible={showGateway}
        onDismiss={() => setShowGateway(false)}
        onRequestClose={() => setShowGateway(false)}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-lg font-bold">Payment</Text>
            <TouchableOpacity onPress={() => setShowGateway(false)}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <webview
            source={{ uri: checkoutUrl }}
            onNavigationStateChange={onNavigationStateChange}
            startInLoadingState={true}
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color={COLORS.primary}
                className="absolute top-1/2 left-1/2"
              />
            )}
          />
        </SafeAreaView>
      </Modal> */}
    </SafeAreaView>
  );
}

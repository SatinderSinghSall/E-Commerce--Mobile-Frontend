import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, getStatusColor } from "@/assets/constants";
import { useAuth } from "@clerk/clerk-expo";
import api from "@/assets/constants/api";

export default function AdminDashboard() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const fetchStats = async () => {
    try {
      const token = await getToken();

      const { data } = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.log("Admin Stats Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-surface">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="max-w-5xl w-full self-center">
        {/* HEADER */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-primary">
            Admin Dashboard
          </Text>
          <Text className="text-secondary text-sm mt-1">
            Monitor store performance and recent activity
          </Text>
        </View>

        {/* OVERVIEW */}
        <View className="mb-8">
          <Text className="text-primary font-bold text-xl mb-4">Overview</Text>

          <View className="flex-row flex-wrap justify-between">
            <StatCard
              label="Revenue"
              value={`₹${stats.totalRevenue.toFixed(2)}`}
              icon="cash-outline"
              color="#22c55e"
            />

            <StatCard
              label="Orders"
              value={stats.totalOrders.toString()}
              icon="receipt-outline"
              color="#3b82f6"
            />

            <StatCard
              label="Products"
              value={stats.totalProducts.toString()}
              icon="cube-outline"
              color="#f59e0b"
            />

            <StatCard
              label="Users"
              value={stats.totalUsers.toString()}
              icon="people-outline"
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* RECENT ORDERS */}
        <View className="mb-6">
          <Text className="text-primary font-bold text-xl mb-4">
            Recent Orders
          </Text>

          {stats.recentOrders.length === 0 ? (
            <View className="bg-white p-10 rounded-2xl border border-gray-100 items-center">
              <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />

              <Text className="text-primary font-semibold mt-3">
                No Recent Orders
              </Text>

              <Text className="text-secondary text-center text-sm mt-1">
                Orders from customers will appear here once purchases are made.
              </Text>
            </View>
          ) : (
            stats.recentOrders.map((order: any) => (
              <TouchableOpacity
                key={order._id}
                onPress={() => router.push(`/admin/orders/${order._id}`)}
                className="bg-white p-5 rounded-2xl border border-gray-100 mb-3"
              >
                {/* ORDER HEADER */}
                <View className="flex-row justify-between items-center mb-3">
                  <View>
                    <Text className="font-semibold text-primary text-sm">
                      Order #{order._id.slice(-6)}
                    </Text>

                    <Text className="text-secondary text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <View
                    className={`px-3 py-1.5 rounded-full ${getStatusColor(order.orderStatus)}`}
                  >
                    <Text className="text-[10px] font-bold uppercase">
                      {order.orderStatus}
                    </Text>
                  </View>
                </View>

                {/* ITEMS */}
                <View className="pb-2">
                  {order.items.map((item: any) => (
                    <Text
                      key={item._id}
                      className="text-secondary text-xs mt-1"
                    >
                      {item.name} × {item.quantity}
                    </Text>
                  ))}
                </View>

                <View className="h-[1px] bg-gray-100 mb-3" />

                {/* CUSTOMER + TOTAL */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-2">
                      <Text className="text-primary font-bold text-xs">
                        {(order.user?.name || "?").charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <Text className="text-secondary text-sm">
                      {order.user?.name || "Unknown User"}
                    </Text>
                  </View>

                  <Text className="text-primary font-bold text-lg">
                    ₹{order.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

/* STAT CARD COMPONENT */

const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
}) => (
  <View className="bg-white p-5 rounded-2xl border border-gray-100 w-[48%] mb-4 flex-row items-center">
    <View
      className="w-12 h-12 rounded-xl items-center justify-center mr-3"
      style={{ backgroundColor: `${color}20` }}
    >
      <Ionicons name={icon} size={22} color={color} />
    </View>

    <View>
      <Text className="text-lg font-bold text-primary">{value}</Text>

      <Text className="text-secondary text-xs uppercase tracking-wide">
        {label}
      </Text>
    </View>
  </View>
);

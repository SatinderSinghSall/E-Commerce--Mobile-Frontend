import { View, ActivityIndicator } from "react-native";

export default function LoadingOverlay() {
  return (
    <View className="absolute inset-0 bg-black/30 items-center justify-center z-50">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

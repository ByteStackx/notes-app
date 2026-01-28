import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { AuthProvider } from "../context/AuthContext";

function BackButton() {
  const router = useRouter();
  return (
    <Pressable onPress={() => router.replace("/home")} style={{ padding: 8 }}>
      <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
    </Pressable>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => <BackButton />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="add-note"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => <BackButton />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="edit-note"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => <BackButton />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="view-notes"
          options={{
            headerShown: true,
            headerTitle: "",
            headerLeft: () => <BackButton />,
            headerBackVisible: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

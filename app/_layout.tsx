import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../services/auth-context";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useEffect } from "react";

function RootLayoutContent() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // 로그인된 사용자는 커뮤니티로 이동
        router.replace("/community");
      } else {
        // 로그인되지 않은 사용자는 로그인 화면으로 이동
        router.replace("/login");
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007aff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          title: "로그인",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "회원가입",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="community"
        options={{
          title: "커뮤니티",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          title: "게시글 상세",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="write"
        options={{
          title: "게시글 작성",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

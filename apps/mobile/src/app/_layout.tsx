import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { UserRole } from "@food-delivery-app/types";
import { ActivityIndicator } from "react-native";

const queryClient = new QueryClient();

function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <ActivityIndicator size="large" color="#ff6b35" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="health" />

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.CUSTOMER}>
        <Stack.Screen name="(customer)" />
      </Stack.Protected>

      <Stack.Protected
        guard={!!user && user.role === UserRole.RESTAURANT_OWNER}
      >
        <Stack.Screen name="(owner)" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && user.role === UserRole.DRIVER}>
        <Stack.Screen name="(driver)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <AnimatedSplashOverlay />
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}

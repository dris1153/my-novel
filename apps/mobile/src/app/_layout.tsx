import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Literata_400Regular, Literata_600SemiBold } from '@expo-google-fonts/literata';
import { SourceSerif4_400Regular, SourceSerif4_500Medium } from '@expo-google-fonts/source-serif-4';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MissingEnv } from '@/components/missing-env';
import { Colors } from '@/constants/theme';
import { hasSupabaseConfig, missingEnvKeys } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  // Web lấy font qua @import trong global.css nên không cần chờ useFonts.
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SourceSerif4_400Regular,
    SourceSerif4_500Medium,
    Literata_400Regular,
    Literata_600SemiBold,
  });

  const ready = fontsLoaded || Platform.OS === 'web';

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  if (!hasSupabaseConfig) return <MissingEnv keys={missingEnvKeys} />;

  return (
    // Bắt buộc: useSafeAreaInsets() ném lỗi nếu thiếu provider này, và các màn
    // hình đều gọi nó -> mất provider là cả app trắng màn / crash trên Android.
    <SafeAreaProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="tim-kiem" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

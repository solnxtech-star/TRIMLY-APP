import { useFonts } from 'expo-font';
import * as Roboto from '@expo-google-fonts/roboto';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': Roboto.Roboto_400Regular,
    'Roboto-Medium': Roboto.Roboto_500Medium,
    'Roboto-Bold': Roboto.Roboto_700Bold,
  });

  return { fontsLoaded };
}
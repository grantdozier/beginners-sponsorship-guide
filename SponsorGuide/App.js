import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, GreatVibes_400Regular } from '@expo-google-fonts/great-vibes';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

import HomeScreen from './src/screens/HomeScreen';
import PassagesScreen from './src/screens/PassagesScreen';
import PrefaceScreen from './src/screens/PrefaceScreen';
import ProblemSolutionScreen from './src/screens/ProblemSolutionScreen';
import StepsOneToThreeScreen from './src/screens/StepsOneToThreeScreen';
import Step4OverviewScreen from './src/screens/Step4OverviewScreen';
import ResentmentInventoryScreen from './src/screens/ResentmentInventoryScreen';
import FearInventoryScreen from './src/screens/FearInventoryScreen';
import SexInventoryScreen from './src/screens/SexInventoryScreen';
import CharacterDefectsScreen from './src/screens/CharacterDefectsScreen';
import TableOfContentsScreen from './src/screens/TableOfContentsScreen';
import GenericStepScreen from './src/screens/GenericStepScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { AuthProvider, useAuth } from './src/api/AuthContext';

const Stack = createNativeStackNavigator();

const ORANGE = '#E8751F';
const CREAM = '#FAF1DE';

export default function App() {
  const [fontsLoaded] = useFonts({
    GreatVibes_400Regular,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: CREAM, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { user, loading, needsOnboarding } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: CREAM, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  if (needsOnboarding || !user) {
    return <OnboardingScreen />;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: CREAM },
            headerTintColor: '#3A2418',
            headerTitle: '',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: CREAM },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Passages" component={PassagesScreen} />
          <Stack.Screen name="Preface" component={PrefaceScreen} />
          <Stack.Screen name="ProblemSolution" component={ProblemSolutionScreen} />
          <Stack.Screen name="StepsOneToThree" component={StepsOneToThreeScreen} />
          <Stack.Screen name="Step4Overview" component={Step4OverviewScreen} />
          <Stack.Screen name="ResentmentInventory" component={ResentmentInventoryScreen} />
          <Stack.Screen name="FearInventory" component={FearInventoryScreen} />
          <Stack.Screen name="SexInventory" component={SexInventoryScreen} />
          <Stack.Screen
            name="Steps567"
            component={GenericStepScreen}
            initialParams={{ stepIndex: 4 }}
          />
          <Stack.Screen
            name="Steps89"
            component={GenericStepScreen}
            initialParams={{ stepIndex: 6 }}
          />
          <Stack.Screen
            name="Step10"
            component={GenericStepScreen}
            initialParams={{ stepIndex: 7 }}
          />
          <Stack.Screen
            name="Step11"
            component={GenericStepScreen}
            initialParams={{ stepIndex: 8 }}
          />
          <Stack.Screen
            name="Step12"
            component={GenericStepScreen}
            initialParams={{ stepIndex: 9 }}
          />
          <Stack.Screen name="CharacterDefects" component={CharacterDefectsScreen} />
          <Stack.Screen name="TableOfContents" component={TableOfContentsScreen} />
          <Stack.Screen
            name="Step"
            component={GenericStepScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

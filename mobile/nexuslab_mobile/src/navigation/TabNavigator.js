import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screen/HomeScreen';
import CreateScreen from '../screen/CreateScreen';
import GalleryScreen from '../screen/GalleryScreen';
import CommunityScreen from '../screen/CommunityScreen';
import { Ionicons } from '@expo/vector-icons'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GenerateSceneScreen from '../screen/GenerateSceneScreen';
import Scene1Screen from '../screen/scenes/generative/Scene1Screen';
import Scene2Screen from '../screen/scenes/generative/Scene2Screen';
import SceneD1Screen from '../screen/scenes/data/SceneD1Screen';
import SceneD2Screen from '../screen/scenes/data/SceneD2Screen';
import DataSceneScreen from '../screen/DataSceneScreen';
import { colors } from '../utils/colors'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const CreateStack = createNativeStackNavigator();

const getTabBarStyle = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  const hideOnScreens = ['Scene1', 'Scene2', 'SceneD1', 'SceneD2'];
  const baseStyle = {
    backgroundColor: colors.purple_dark,
    borderTopWidth: 0,
  };
  
  return hideOnScreens.includes(routeName) 
    ? { ...baseStyle, display: 'none' } 
    : baseStyle;
};

const CreateStackScreen = () => (
  <CreateStack.Navigator>
    <CreateStack.Screen 
      name="CreateMain" 
      component={CreateScreen} 
      options={{
        headerShown: false,
        //headerTransparent: false,
        // presentation: 'modal',
        // headerTitle: 'Generative Scenes',
        // headerBackTitle: 'Back',
        // headerStyle: {
        //   backgroundColor: 'rgba(0, 0, 0, 0.7)',
        // },
        // headerTitleStyle: { // Text
        //   color: colors.lightest,
        //   fontSize: 18, 
        // },
        // headerTintColor: colors.lightest, // Icon
      }}
    />
    <CreateStack.Screen
        name="GenerateScene"
        component={GenerateSceneScreen} 
        options={{
          headerTransparent: true,
          presentation: 'modal',
          headerTitle: 'Generative Scenes',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          },
          headerTitleStyle: { // Text
            color: colors.lightest,
            fontSize: 18, 
          },
          headerTintColor: colors.lightest, // Icon
        }}
      />
      <CreateStack.Screen
        name="DataScene"
        component={DataSceneScreen} 
        options={{
          headerTransparent: true,
          presentation: 'modal',
          headerTitle: 'Data Art Scenes',
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          },
          headerTitleStyle: { // Text
            color: colors.lightest,
            fontSize: 18, 
          },
          headerTintColor: colors.lightest, // Icon
        }}
      />
      <CreateStack.Screen
        name="Scene1"
        component={Scene1Screen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <CreateStack.Screen
        name="Scene2"
        component={Scene2Screen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <CreateStack.Screen
        name="SceneD1"
        component={SceneD1Screen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <CreateStack.Screen
        name="SceneD2"
        component={SceneD2Screen}
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
  </CreateStack.Navigator>
);

const TabNavigator = ( ) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.purple_dark, // Utilisez la couleur de votre choix
          borderTopWidth: 0, // Supprime la bordure supérieure si nécessaire
        },
        tabBarActiveTintColor: colors.lightest, // Couleur de l'icône et du texte actifs
        tabBarInactiveTintColor: colors.primary, // Couleur de l'icône et du texte inactifs
      }}
    >
        <Tab.Screen 
            name="Home"
            component={HomeScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Accueil',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" color={color} size={size} />
                )
            }}
        />

        <Tab.Screen 
          name="Create"
          component={CreateStackScreen}
          options={({ route }) => ({
            headerShown: false,
            tabBarLabel: 'Create',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
            tabBarStyle: getTabBarStyle(route)
          })}
        />
        <Tab.Screen 
            name="Gallery"
            component={GalleryScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Gallery',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="images" color={color} size={size} />
                )
            }}
        />
        <Tab.Screen 
            name="Community"
            component={CommunityScreen}
            options={{
                headerShown: false,
                tabBarLabel: 'Community',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="people" color={color} size={size} />
                )
            }}
        />

    </Tab.Navigator>
  );
};

export default TabNavigator;
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Product } from '../screens/Product';
import { Home } from '../screens/Home';

const { Navigator, Screen } = createNativeStackNavigator();

export function UserStackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false}} >
        <Screen name="home" component={Home} />
        <Screen name="product" component={Product} />
    </Navigator>
  );
}
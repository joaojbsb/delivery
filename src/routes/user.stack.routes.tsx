import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Product } from '../screens/Product';
import { Home } from '../screens/Home';
import { Order } from '../screens/Order';

import { UserTabRoutes} from './user.tab.routes';
import { useAuth } from '../hooks/auth';

const { Navigator, Screen, Group } = createNativeStackNavigator();

export function UserStackRoutes() {
  const { user } = useAuth();
  return (
    <Navigator screenOptions={{ headerShown: false}} >
      {
        user ?. isAdmin ? (
          <Group>
            <Screen name="home" component={Home} />
            <Screen name="product" component={Product} />
          </Group>

        ) : (
          <Group>
            <Screen name="UserTabRoutes" component={UserTabRoutes} />
            <Screen name="order" component={Order} />
          </Group>
        )
      }

    </Navigator>
  );
}
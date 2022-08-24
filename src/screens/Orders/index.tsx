import React from 'react';
import { OrderCard } from '../../components/OrderCard';
import { FlatList } from 'react-native';
import { ItemSeparator } from '../../components/ItemSeparator';

import {
  Container, Header, Title
} from './styles';

export function Orders() {
  return (
    <Container>
        <Header>
            <Title>Pedidos Feitos</Title>
        </Header>

        <FlatList 
          data={['1', '2', '3', '4']}
          keyExtractor={item => item}
          renderItem={({ item, index })=> (
            <OrderCard index={index} />
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
          ItemSeparatorComponent={()=> <ItemSeparator />}
        />

    </Container>
  );
}
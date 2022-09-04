import React, {useEffect, useState } from 'react';
import { OrderCard, OrderProps } from '../../components/OrderCard';
import { FlatList, Alert } from 'react-native';
import { ItemSeparator } from '../../components/ItemSeparator';
import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../hooks/auth';



import {
  Container, Header, Title
} from './styles';

export function Orders() {

  const {user} = useAuth();
  const [ orders, setOrders ] = useState<OrderProps[]>([]);

  function handlePizzaDelivery(id:string){
    Alert.alert('Pedido', 'Confirmar que a pizza foi entregue',[
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress:()=>{
          firestore().collection('orders').doc(id).update({
            status: 'Entregue'
          });
        }
      }
    ]);
  };

  useEffect(()=> {
    const subscribe = firestore()
    .collection('orders')
    .where('waiter_id', '==', user?.id)
    .onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }) as OrderProps[];
      setOrders(data);
    });

    return () => subscribe();
  }, []);

  return (
    <Container>
        <Header>
            <Title>Pedidos Feitos</Title>
        </Header>

        <FlatList 
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item, index })=> (
            <OrderCard 
              index={index} 
              data={item}
              disabled={item.status === 'Entregue'} 
              onPress={()=> handlePizzaDelivery(item.id)}
            />
          )}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 125 }}
          ItemSeparatorComponent={()=> <ItemSeparator />}
        />

    </Container>
  );
}
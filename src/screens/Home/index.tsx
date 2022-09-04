import React, { useEffect, useState, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import happyEmoji from '../../assets/happy.png';
import { useAuth } from '../../hooks/auth';
import { Search } from '../../components/Search';
import { Alert, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components/native';
import firestore from '@react-native-firebase/firestore';

import {
  Container, Header, Greeting, GreetingEmoji, GreetingText, MenuHeader, MenuItemNumber, Title, NewProductButton
} from './styles';

import { ProductCard, ProductProps } from '../../components/ProductCard';

export function Home() {
  const { COLORS } = useTheme(); 

  const [ pizzas, setPizzas ] = useState<ProductProps[]>([]);
  const [search, setSearch] = useState('');

  const navigation = useNavigation();
  const { signOut, user } = useAuth();
  
  //função para buscar as pizzas cadastradas
  function fetchPizzas(value: string){
    const formattedValue = value.toLocaleLowerCase().trim(); //pegar o que foi digitado e transformar para minúsculo

    firestore()
    .collection('pizzas')
    .orderBy('name_insensitive')
    .startAt(formattedValue)
    .endAt(`${formattedValue}\uf8ff`)
    .get()
    .then(response => {
      const data = response.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data(),
        }
      }) as ProductProps[];

      setPizzas(data);      
    })
    .catch(()=> Alert.alert('Consulta', 'Não foi possível realizar a consulta..'));
  };
  //função para fazer a consulta
  function handleSearch(){
    fetchPizzas(search)
  };
  //função para limpar o campo da consulta
  function handleSearchClear(){
    setSearch('');
    fetchPizzas('');
  };

  function handleOpen(id: string) {
    const route = user?.isAdmin ? 'product' : 'order';
    navigation.navigate(route, {id});
  };

  function handleAdd() {
    navigation.navigate('product', {});
  }

  useFocusEffect(
    useCallback(() => {
    fetchPizzas('');
  },[]));

  return (
    <Container>
        <Header>
            <Greeting>
                <GreetingEmoji source={happyEmoji} />

                <GreetingText>
                    { user?.isAdmin ? `Olá, ${user.name}` : `Olá, ${user?.name}`}
                </GreetingText>
            </Greeting>

            <TouchableOpacity>
                <MaterialIcons name="logout" color={ COLORS.TITLE} size={24} onPress={signOut} />
            </TouchableOpacity>
        </Header>

        <Search 
          onChangeText={setSearch}
          value={search}
          onSearch={handleSearch} 
          onClear={handleSearchClear} 
        />

        <MenuHeader>
          <Title>Cardápio</Title>
          <MenuItemNumber>{pizzas.length} pizzas</MenuItemNumber>
        </MenuHeader>

        <FlatList 
          data={pizzas}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ProductCard 
              data={item} 
              onPress={() => handleOpen(item.id)}
            />)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 125,
            marginHorizontal: 24
          }}
        />

          {
            user?.isAdmin &&
           <NewProductButton 
              title='Cadastrar Pizza'
              type="secondary"
              onPress={handleAdd}
            />
          }

    </Container>
  );
}
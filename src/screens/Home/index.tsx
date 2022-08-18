import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import happyEmoji from '../../assets/happy.png';
import { Search } from '../../components/Search';
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';

import {
  Container, Header, Greeting, GreetingEmoji, GreetingText
} from './styles';

export function Home() {
  const { COLORS } = useTheme();  

  return (
    <Container>
        <Header>
            <Greeting>
                <GreetingEmoji source={happyEmoji} />

                <GreetingText>
                    Olá, Admin
                </GreetingText>
            </Greeting>

            <TouchableOpacity>
                <MaterialIcons name="logout" color={ COLORS.TITLE} size={24} />
            </TouchableOpacity>
        </Header>

        <Search onSearch={()=>{}} onClear={()=>{}} />
    </Container>
  );
}
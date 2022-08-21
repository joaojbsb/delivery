import React from 'react';
import { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';

import {
  Container, Input, Button, InputArea, ButtonClear
} from './styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = TextInputProps & {
    onSearch: ()=> void; //para fazer a busca
    onClear: ()=> void; //Para limpar o campo
};


export function Search({onSearch, onClear, ...rest}: Props) {
        const {COLORS} = useTheme();
  return (
    <Container>
        <InputArea>
            <Input placeholder='pesquisar...' {...rest} />

            <ButtonClear onPress={onClear} >
                <Feather name='x' size={16} color='black' />
            </ButtonClear>
        </InputArea>

        <Button onPress={onSearch} >
            <Feather name='search' size={16} color={COLORS.TITLE} />
        </Button>
    </Container>
  );
}
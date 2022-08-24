import React, {useState} from 'react';
import { Platform } from 'react-native';
import { ButtonBack } from '../../components/ButtonBack';
import { RadioButton } from '../../components/RadioButton';
import { Input } from '../../components/Input';
import { PIZZA_TYPES } from '../../utils/pizzaTypes';
import { Button } from '../../components/Button';


import {
  Container, Header, Photo, Sizes, Form, Title, Label, InputGroup, FormRow, Price, ContentScrool
} from './styles';

export function Order() {
  const [size, setSize] = useState('');

  return (
    <Container>
      <ContentScrool>
        <Header>
            <ButtonBack 
                onPress={()=>{}}
                style={{marginBottom: 108}}
            />
        </Header>

        <Photo source={{uri: 'https://github.com/joaojbsb.png'}} />

        <Form>
          <Title>Nome da Pizza</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {
            PIZZA_TYPES.map(item => (
              <RadioButton
                key={item.id}
                title={item.name}
                onPress={() => setSize(item.id)}
                selected={size === item.id}
              />
            ))
            }
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType='numeric' />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>
              <Input keyboardType='numeric' />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ 00,00</Price>

          <Button title='Confirmar Pedido' />

        </Form>

      </ContentScrool>
    </Container>
  );
}
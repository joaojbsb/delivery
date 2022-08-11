import { Button } from '../../components/Button';
import React, {useState} from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import brandImg from '../../assets/brand.png';

import {
  Container, Content, Title, Brand, ForgotPasswordButton, ForgotPasswordLabel
} from './styles';

export function Signin() {

  const { signIn, isLoggin, forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignIn(){
    signIn(email, password);
  };

  function handleForgotPawword(){
    forgotPassword(email);
  };

  return (
    <Container>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Content>
          <Brand source={brandImg} />
          <Title>Login</Title>

          <Input 
              placeholder='E-mail'
              type='secondary'
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={setEmail}
          />

          <Input 
              placeholder='Senha'
              type='secondary'
              secureTextEntry
              onChangeText={setPassword}
          />

          <ForgotPasswordButton onPress={handleForgotPawword}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button 
            title="Entrar"
            type='secondary'
            onPress={handleSignIn}
            isLoading={isLoggin}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
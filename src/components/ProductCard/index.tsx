import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useTheme } from 'styled-components';

import { Feather } from '@expo/vector-icons';

import {
  Container, Content, Image, Details, Name, Description, Line, Identification
} from './styles';

export type ProductProps = {
    id:string;
    photo_url: string;
    name: string;
    description: string;
};

type Props = RectButtonProps & {
    data: ProductProps;
};



export function ProductCard({data, ...rest}: Props) {

  const {COLORS} = useTheme();

  return (
    <Container>
        <Content { ...rest}>
            <Image source={{ uri: data.photo_url}} />

            <Details>
                <Identification>
                    <Name>{data.name}</Name>
                    <Feather name="chevron-right" size={18} color={COLORS.SHAPE} />
                </Identification>
                <Description>
                    {data.description}
                </Description>
            </Details>
        </Content>
        <Line/>
    </Container>
  );
}
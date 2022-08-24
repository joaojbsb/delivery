import React from 'react';

type Props = {
    title: string;
    color: string;
    notifications?: string | undefined
}

import {
  Container, Title, Notifcation, Quantity
} from './styles';

export function BottomMenu({title, color, notifications}: Props) {
  const noNotifications = notifications === '0';  

  return (
    <Container>
        <Title color={color} > {title} </Title>

        {
            notifications && (
                <Notifcation noNotifications={noNotifications} >
                    <Quantity noNotifications={noNotifications} >
                        {notifications}
                    </Quantity>
                </Notifcation>
            )
        }

    </Container>
  );
}
import {
  Avatar,
  Body1,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
} from '@fluentui/react-components';
import styles from './MobileCard.module.scss';

import React, { FC, ReactElement } from 'react';

interface IMobileCard {
  actions?: ReactElement;
  headerActions?: ReactElement;
  description?: ReactElement;
  header?: string;
  mainContent?: ReactElement | string;
  onClick?: () => void;
  horizontal?: boolean;
  img?: ReactElement;
}

export const MobileCard: FC<IMobileCard> = ({
  actions,
  description,
  header,
  headerActions,
  mainContent,
  horizontal,
  img,
  onClick,
}) => {
  return (
    <Card
      appearance="subtle"
      className={styles.card_wrapper}
      orientation={horizontal ? 'horizontal' : 'vertical'}
    >
      <CardHeader
        image={
          img !== undefined ? img : <Avatar color="colorful" name={header} />
        }
        header={
          <Body1>
            <b>{header}</b>
          </Body1>
        }
        onClick={onClick}
        description={description !== undefined ? description : ''}
        action={headerActions}
      />
      <Caption1>{mainContent}</Caption1>
      <CardFooter>{actions}</CardFooter>
    </Card>
  );
};

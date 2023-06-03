import {
  Avatar,
  Body1,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
} from '@fluentui/react-components';

import React, { FC, ReactElement } from 'react';
import styles from './MobileCard.module.scss';

interface IMobileCard {
  actions?: ReactElement;
  headerActions?: ReactElement;
  description?: ReactElement;
  header?: string;
  mainContent?: ReactElement | string;
  onClick?: () => void;
}

export const MobileCard: FC<IMobileCard> = ({
  actions,
  description,
  header,
  headerActions,
  mainContent,
  onClick,
}) => {
  return (
    <Card appearance="outline">
      <CardHeader
        image={<Avatar color="colorful" name={header} />}
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

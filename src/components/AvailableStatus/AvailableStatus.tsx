import { PresenceBadge } from '@fluentui/react-components';
import React, { FC } from 'react';

interface IAvailableStatus {
  isLocked: boolean;
}

export const AvailableStatus: FC<IAvailableStatus> = ({ isLocked: state }) => {
  return (
    <PresenceBadge status={state ? 'blocked' : 'available'} size="large" />
  );
};

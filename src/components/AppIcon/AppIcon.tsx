import React, { FC } from 'react';
import Icon from '../../assets/icons/logo192.png';

interface IAppIcon {
  size?: number;
}

export const AppIcon: FC<IAppIcon> = ({ size = 32 }) => {
  return (
    <img src={Icon} alt="App icon" style={{ width: size, height: size }} />
  );
};

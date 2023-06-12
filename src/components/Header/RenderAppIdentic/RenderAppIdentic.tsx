import { Subtitle2 } from '@fluentui/react-components';
import React, { FC } from 'react';
import { AppIcon } from '../../index';
import useIsMobile from './../../../hooks/useIsMobile';
import styles from './RenderAppIdentic.module.scss';

const RenderAppIdentic: FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={styles.wrapper}>
      <AppIcon />
      {!isMobile && <Subtitle2 className={styles.name}>WorkReport</Subtitle2>}
    </div>
  );
};

export default RenderAppIdentic;

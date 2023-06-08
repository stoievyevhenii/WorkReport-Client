import { FC, ReactElement } from 'react';
import { useMediaQuery } from 'react-responsive';

interface IAdaptiveLayout {
  mobileView: ReactElement;
  defaultView: ReactElement;
}

export const AdaptiveLayout: FC<IAdaptiveLayout> = ({
  mobileView,
  defaultView,
}) => {
  const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

  if (isMobile) {
    return mobileView;
  } else {
    return defaultView;
  }
};

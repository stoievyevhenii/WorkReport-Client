import { useEffect, useState } from 'react';
import { getWorkers } from '../store/api';

export const useTokenIsValid = () => {
  const [isValid, setIsValid] = useState(false);

  const _fetchWorkers = async () => {
    await getWorkers()
      .then(() => {
        setIsValid(true);
      })
      .catch(() => {
        localStorage.clear();
      });
  };

  useEffect(() => {
    const getData = async () => {
      await _fetchWorkers();
    };

    getData();
  }, []);

  return isValid;
};

import {
  Button,
  Caption1,
  Field,
  Input,
  Spinner,
  Subtitle1,
} from '@fluentui/react-components';
import { Alert } from '@fluentui/react-components/unstable';
import { DismissCircleRegular } from '@fluentui/react-icons';
import React, { FC, useEffect, useState } from 'react';
import { AppIcon } from '../../components';
import { auth, userTypes } from '../../routes/api';
import { axiosConfig } from '../../store/api/axios.config';
import styles from './Login.module.scss';
export const Login: FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [isCheckCredentials, setCheckCredentials] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  function AuthUser(): void {
    setCheckCredentials(true);
    setOpen(false);
    axiosConfig
      .post(auth(), {
        password: password,
        login: login,
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          localStorage.setItem('token', response.data.values[0].token);
          localStorage.setItem('role', response.data.values[0].role);
          localStorage.setItem('name', response.data.values[0].userName);
          window.location.reload();
        } else {
          setOpen(true);
          setErrorMessage('Неверные данные авторизации');
        }
      })
      .catch((error) => {
        setOpen(true);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setCheckCredentials(false);
      });
  }

  function userIsAuth() {
    const token = localStorage.getItem('token');
    if (token !== null) {
      axiosConfig
        .get(userTypes())
        .then(() => window.location.reload())
        .catch((error) => {
          console.log(error);
          localStorage.clear();
          window.location.reload();
        });
    }
  }

  useEffect(() => {
    userIsAuth();
  }, []);

  return (
    <div className={styles.login_container}>
      <div className={styles.login_wrapper}>
        <div className={styles.identic_block}>
          <AppIcon size={96} />
        </div>
        <div className={styles.card}>
          <div className={styles.header}>
            <Subtitle1>С возвращением!</Subtitle1>
            <Caption1 className={styles.subtitle}>
              Введите данные для авторизации
            </Caption1>
          </div>
          <Field label="Логин" required>
            <Input onChange={(e) => setLogin(e.target.value)} />
          </Field>
          <Field label="Пароль" required>
            <Input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </Field>
          <Button appearance="primary" onClick={() => AuthUser()}>
            Войти
          </Button>
        </div>
        {isOpen && (
          <Alert
            intent="error"
            action={{
              icon: <DismissCircleRegular aria-label="dismiss message" />,
              onClick: () => setOpen(false),
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {isCheckCredentials && (
          <Spinner size="medium" label="Прорерка данных" />
        )}
      </div>
    </div>
  );
};

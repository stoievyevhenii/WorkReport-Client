import { Button, Field, Input } from '@fluentui/react-components'
import React, { FC, useState } from 'react'
import { auth } from '../../routes/api'
import { axiosConfig } from '../../store/api/axios.config'
import styles from "./Login.module.scss"

interface ILogin { }

export const Login: FC<ILogin> = () => {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    function AuthUser() {
        axiosConfig.post(auth(), {
            password: password,
            login: login
        }).then((response) => {
            if (response.data.statusCode === 200) {
                sessionStorage.setItem("token", response.data.values[0].token)
                sessionStorage.setItem("role", response.data.values[0].role)
                window.location.reload();
                console.log("Авторизация успешна")
            } else {
                console.log("Неверные данные авторизации")
            }
        }).catch((error) => {
            console.log(error.message)
        })
    }

    return (
        <div className={styles.login_container}>
            <div className={styles.login_wrapper}>
                <div className={styles.card}>
                    <h2>Авторизация</h2>
                    <Field label="Логин" required>
                        <Input onChange={(e) => setLogin(e.target.value)} />
                    </Field>
                    <Field label="Пароль" required>
                        <Input onChange={(e) => setPassword(e.target.value)} type='password' />
                    </Field>
                    <Button appearance='primary' onClick={() => AuthUser()}>Войти</Button>
                </div>
            </div>
        </div>
    )
}

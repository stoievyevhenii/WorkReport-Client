import { Button } from "@fluentui/react-components";
import { FC } from 'react';
import styles from "./Header.module.scss";

interface IHeader { }

function LogOut() {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("role")
    window.location.reload();
}

export const Header: FC<IHeader> = () => {
    return (
        <div className={styles.header}>
            <Button onClick={() => LogOut()}>Выйти</Button>
        </div>
    )
}
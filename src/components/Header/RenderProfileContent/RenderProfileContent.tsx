import {
  Avatar,
  Button,
  Caption1,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Subtitle2,
  Title3,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { FC } from 'react';
import styles from './RenderProfileContent.module.scss';

export const RenderProfileContent: FC = () => {
  const [open, setOpen] = React.useState(false);

  function LogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  }

  const name: string =
    localStorage.getItem('name') !== null
      ? String(localStorage.getItem('name'))
      : 'User';

  const role: string =
    localStorage.getItem('role') !== null
      ? String(localStorage.getItem('role'))
      : 'User';

  return (
    <>
      <div className={styles.profile_trigger} onClick={() => setOpen(true)}>
        <Subtitle2 className={styles.trigger_text}>{name}</Subtitle2>
        <Avatar
          aria-label="Guest"
          className={styles.avatar_icon}
          color="colorful"
          name={name}
        />
      </div>

      <Dialog open={open} onOpenChange={(event, data) => setOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              Профиль
            </DialogTitle>
            <DialogContent>
              <Card appearance="outline">
                <CardHeader
                  image={<Avatar aria-label="Guest" name={name} size={48} />}
                  header={<Title3>{name}</Title3>}
                  description={<Caption1>{role}</Caption1>}
                />
              </Card>
            </DialogContent>
            <DialogActions fluid>
              <Button appearance="primary" onClick={() => LogOut()}>
                Выйти
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

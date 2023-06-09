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
  Title3,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import React, { FC } from 'react';

export const RenderProfileContent: FC = () => {
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
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Avatar aria-label="Guest" />
      </DialogTrigger>
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
  );
};

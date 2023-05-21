import { Body1, Caption1, Card, CardFooter, CardHeader } from '@fluentui/react-components';

import React, { FC } from 'react';
import styles from "./MobileCard.module.scss";

interface IMobileCard {
    actions?: any;
    description?: any;
    header?: string;
    mainContent?: any;
    onClick?: any;
}

export const MobileCard: FC<IMobileCard> = ({ actions, description, header, mainContent, onClick }) => {
    return (
        <Card appearance='outline'>
            <CardHeader
                header={
                    <Body1>
                        <b>{header}</b>
                    </Body1>
                }
                onClick={onClick}
                description={description}
            />
            <Caption1>{mainContent}</Caption1>
            <CardFooter>
                {actions}
            </CardFooter>
        </Card>
    )
}

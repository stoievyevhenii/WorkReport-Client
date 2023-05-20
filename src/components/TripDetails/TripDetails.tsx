import { FC } from 'react';
import { Trip } from '../../global';

import { Caption1, Card, CardHeader, Input, SelectTabData, SelectTabEvent, Tab, TabList, TabValue, Text, Textarea, makeStyles } from '@fluentui/react-components';
import moment from 'moment';
import React from 'react';
import { Field } from '../index';
import styles from "./TripDetails.module.scss";

interface ITripDetails {
    item: Trip | undefined;
}

const useStyles = makeStyles({
    root: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        rowGap: "20px",
        height: "500px"
    }
});

export const TripDetails: FC<ITripDetails> = ({ item }) => {
    const componentStyles = useStyles();

    const [selectedValue, setSelectedValue] =
        React.useState<TabValue>("totalinfo");

    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        setSelectedValue(data.value);
    };

    const TotalInfo = React.memo(() => (
        <div className={styles.panel} role="tabpanel" aria-labelledby="Arrivals">
            <Card className={styles.card} appearance="outline">
                <Field
                    label='Заказчик'
                    input={<Input readOnly value={item?.customer.name} className={styles.input} />}
                />
                <Field
                    label='Начало'
                    input={<Input className={styles.input} readOnly value={(moment(item?.startDate)).format('DD-MMM-YYYY')} />}
                />
                <Field
                    label='Конец'
                    input={<Input className={styles.input} readOnly value={(moment(item?.endDate)).format('DD-MMM-YYYY')} />}
                />
                <div className={`${styles.field} ${styles.field_max}`}>
                    <div className={`${styles.label} ${styles.label_top}`}>Описание</div>
                    <div className={`${styles.field} ${styles.field_max}`}>
                        <Textarea readOnly resize="vertical" className={`${styles.input} ${styles.input_max}`} value={item?.description} />
                    </div>
                </div>
            </Card>
        </div>
    ));

    const Workers = React.memo(() => {
        return (
            <div className={styles.panel} role="tabpanel" aria-labelledby="workers">
                {item?.workersTrip.map(({ worker, spentDays }) => (
                    <Card className={styles.card} appearance="outline">
                        <CardHeader
                            header={<Text weight="semibold">{worker.name} {worker.lastName}</Text>}
                            description={<Caption1 className={styles.caption}>Работал {spentDays} {spentDays === 1 && "день"} {spentDays > 1 && spentDays < 5 && "дня"} {spentDays >= 5 && "дней"}
                            </Caption1>} />
                    </Card>
                ))}
            </div>
        );
    });

    const Materials = React.memo(() => (
        <div className={styles.panel} role="tabpanel" aria-labelledby="Conditions">
            {
                item?.usedMaterials.map(({ material, usedCount }) => (
                    <Card className={styles.card} appearance="outline">
                        <CardHeader
                            header={<Text weight="semibold">{material.name}, {material.description}</Text>}
                            description={
                                <Caption1 className={styles.caption}>Использовано: {usedCount}</Caption1>
                            }
                        />
                    </Card>
                ))
            }
        </div>
    ));

    return (
        <div className={componentStyles.root}>
            <TabList className={styles.tablist} selectedValue={selectedValue} onTabSelect={onTabSelect}>
                <Tab id="Arrivals" value="totalinfo">
                    Общее
                </Tab>
                <Tab id="Workers" value="workers">
                    Работники
                </Tab>
                <Tab id="Materials" value="materials">
                    Материалы
                </Tab>
            </TabList>
            <div className={styles.panels}>
                {selectedValue === "totalinfo" && <TotalInfo />}
                {selectedValue === "workers" && <Workers />}
                {selectedValue === "materials" && <Materials />}
            </div>
        </div>
    );
}

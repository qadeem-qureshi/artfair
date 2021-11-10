import React from 'react';
import {
  Box, BoxProps, makeStyles, Tab, Tabs, useMediaQuery,
} from '@material-ui/core';

import clsx from 'clsx';
import Chat from './Chat';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  chat: {
    alignSelf: 'flex-end',
    overflowY: 'auto',
    flex: 1,
  },
  wrappedChat: {
    alignSelf: 'auto',
  },
  item: {
    flex: 1,
    minWidth: '1px',
  },
});

export type GameTabProps = BoxProps;

const GameTab: React.FC<GameTabProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');

  const tabs = [
    { name: 'Chat', component: <Chat className={clsx(classes.chat, shouldWrap && classes.wrappedChat)} /> },
    { name: 'Prompts', component: 'Implement me' },
    { name: 'Artists', component: 'Implement me' },
  ];

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Tabs value={value} onChange={(event, newValue) => handleChange(newValue)}>
        {tabs.map((tab, index) => (
          <Tab className={classes.item} label={tab.name} value={index} />
        ))}
      </Tabs>
      {tabs[value].component}
    </Box>
  );
};

export default GameTab;

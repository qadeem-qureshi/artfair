import React, { useState } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ChatRounded from '@material-ui/icons/ChatRounded';
import GroupRounded from '@material-ui/icons/GroupRounded';
import InfoRounded from '@material-ui/icons/InfoRounded';
import Chat from './Chat';
import Rules from './Rules';
import Artists from './Artists';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `0.1rem solid ${theme.palette.divider}`,
  },
  tab: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '0.15rem solid transparent',
    marginBottom: '-0.12rem',
  },
  active: {
    borderBottomColor: theme.palette.primary.main,
  },
  item: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
  },
  hidden: {
    display: 'none',
  },
}));

const TAB_ITEMS = [
  { label: 'Chat', icon: ChatRounded, component: Chat },
  { label: 'Artists', icon: GroupRounded, component: Artists },
  { label: 'Rules', icon: InfoRounded, component: Rules },
];

export type GameTabsProps = BoxProps;

const GameTabs: React.FC<GameTabsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => () => {
    setTabIndex(index);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.tabs}>
        {TAB_ITEMS.map((tabItem, index) => (
          <Box
            className={clsx(classes.tab, index === tabIndex && classes.active)}
            key={tabItem.label}
            onClick={handleTabChange(index)}
          >
            <tabItem.icon color="action" />
          </Box>
        ))}
      </Box>
      {TAB_ITEMS.map((tabItem, index) => (
        <tabItem.component
          className={clsx(classes.item, index !== tabIndex && classes.hidden)}
          key={tabItem.label}
        />
      ))}
    </Box>
  );
};

export default GameTabs;

import React, { useState } from 'react';
import {
  Box, BoxProps, ButtonBase, makeStyles,
} from '@material-ui/core';
import ChatRounded from '@material-ui/icons/ChatRounded';
import GroupRounded from '@material-ui/icons/GroupRounded';
import InfoRounded from '@material-ui/icons/InfoRounded';
import clsx from 'clsx';
import Chat from './Chat';
import ArtistList from './ArtistList';
import Rules from './Rules';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `0.2rem solid ${theme.palette.divider}`,
  },
  tab: {
    flex: 1,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '0.2rem solid transparent',
    marginBottom: '-0.2rem',
  },
  active: {
    borderBottomColor: theme.palette.primary.main,
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    flex: 1,
    minHeight: '0',
  },
  content: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
  },
  hidden: {
    display: 'none',
  },
}));

interface TabItem {
  label: string;
  icon: React.ElementType;
  content: React.ElementType;
}

const TAB_ITEMS: TabItem[] = [
  { label: 'Artists', icon: GroupRounded, content: ArtistList },
  { label: 'Chat', icon: ChatRounded, content: Chat },
  { label: 'Rules', icon: InfoRounded, content: Rules },
];

export type RoomTabsProps = BoxProps;

const RoomTabs: React.FC<RoomTabsProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const changeTab = (index: number) => () => {
    setTabIndex(index);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.tabs}>
        {TAB_ITEMS.map((item, index) => (
          <ButtonBase
            className={clsx(classes.tab, index === tabIndex && classes.active)}
            key={item.label}
            onClick={changeTab(index)}
          >
            <item.icon color="action" />
          </ButtonBase>
        ))}
      </Box>
      {TAB_ITEMS.map((item, index) => (
        <Box className={clsx(classes.contentWrapper, index !== tabIndex && classes.hidden)} key={item.label}>
          <item.content className={classes.content} />
        </Box>
      ))}
    </Box>
  );
};

export default RoomTabs;

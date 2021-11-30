import React, { useState } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

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
    borderBottom: '0.2rem solid #eeeeee',
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
    padding: '1rem',
    overflowY: 'auto',
  },
  hidden: {
    display: 'none',
  },
}));

export interface TabItem {
  label: string;
  icon: React.ElementType;
  content: React.ElementType;
}

export interface GameTabsProps extends BoxProps {
  items: TabItem[];
}

const GameTabs: React.FC<GameTabsProps> = ({ className, items, ...rest }) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: number) => () => {
    setTabIndex(index);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.tabs}>
        {items.map((item, index) => (
          <Box
            className={clsx(classes.tab, index === tabIndex && classes.active)}
            key={item.label}
            onClick={handleTabChange(index)}
          >
            <item.icon color="action" />
          </Box>
        ))}
      </Box>
      {items.map((item, index) => (
        <Box
          className={clsx(classes.contentWrapper, index !== tabIndex && classes.hidden)}
          key={item.label}
        >
          <item.content className={classes.content} />
        </Box>
      ))}
    </Box>
  );
};

export default GameTabs;

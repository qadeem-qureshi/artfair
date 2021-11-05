import React from 'react';
import {
  Box, BoxProps, Button, makeStyles,
} from '@material-ui/core';

import clsx from 'clsx';
import socket from '../services/socket';
import ColorPalette from './ColorPalette';
import ThicknessSlider from './ThicknessSlider';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  colorSelection: {
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    flex: 0.3,
  },
  colorPalette: {
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    flex: 2,
  },
  thicknessSlider: {
    flex: 1,
  },
  deleteButton: {
    flex: 0.03,
  },
}));

export type ToolbarProps = BoxProps;

const Toolbar: React.FC<ToolbarProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useAppContext();

  const clearButton = () => {
    dispatch({ type: 'set-clear', clear: true });
    socket.emit('request_clear');
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box
        className={classes.colorSelection}
        key={state.color}
        bgcolor={state.color}
      />
      <ColorPalette className={classes.colorPalette} />
      <ThicknessSlider className={classes.thicknessSlider} />
      <Button variant="contained" className={classes.deleteButton} color="primary" onClick={clearButton}>
        Clear
      </Button>
    </Box>
  );
};

export default Toolbar;

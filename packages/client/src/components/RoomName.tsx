import React, { useState } from 'react';
import {
  Box,
  BoxProps,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import CheckRounded from '@material-ui/icons/CheckRounded';
import FileCopyRounded from '@material-ui/icons/FileCopyRounded';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1.5rem',
  },
  name: {
    fontWeight: 'bold',
  },
});

export type RoomNameProps = BoxProps;

const RoomName: React.FC<RoomNameProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useRoomContext();
  const [copied, setCopied] = useState(false);

  const copyRoom = () => {
    navigator.clipboard.writeText(state.room.name);
    setCopied(true);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Typography noWrap variant="h2" className={classes.name}>{state.room.name}</Typography>
      <IconButton size="medium" onClick={copyRoom}>
        {copied ? <CheckRounded /> : <FileCopyRounded />}
      </IconButton>
    </Box>
  );
};

export default RoomName;

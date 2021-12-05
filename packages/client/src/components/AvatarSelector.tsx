import React from 'react';
import {
  Avatar,
  Box,
  BoxProps,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import ArrowBackIosRounded from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRounded from '@material-ui/icons/ArrowForwardIosRounded';
import { AVATARS } from '../util/avatar';
import { modulo } from '../util/math';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '4rem',
    height: '4rem',
    margin: '1rem',
  },
});

export type AvatarSelectorProps = BoxProps;

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { state, dispatch } = useAppContext();

  const selectNextAvatar = () => {
    dispatch({
      type: 'set-avatar-index',
      index: modulo(state.avatarIndex + 1, AVATARS.length),
    });
  };

  const selectPreviousAvatar = () => {
    dispatch({
      type: 'set-avatar-index',
      index: modulo(state.avatarIndex - 1, AVATARS.length),
    });
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <IconButton onClick={selectPreviousAvatar}>
        <ArrowBackIosRounded />
      </IconButton>
      <Avatar
        className={classes.preview}
        src={AVATARS[state.avatarIndex]}
        variant="square"
      />
      <IconButton onClick={selectNextAvatar}>
        <ArrowForwardIosRounded />
      </IconButton>
    </Box>
  );
};

export default AvatarSelector;

import React from 'react';
import {
  Box, BoxProps, IconButton, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import ArrowBackIosRounded from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRounded from '@material-ui/icons/ArrowForwardIosRounded';
import { AVATARS } from '../util/avatar';
import { modulo } from '../util/math';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '1.5rem',
  },
  carousel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    padding: '0 1rem',
    flex: 1,
  },
  avatar: {
    width: '100%',
  },
  name: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export interface AvatarSelectorProps extends BoxProps {
  avatarIndex: number;
  onAvatarSelect: (index: number) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  className, avatarIndex, onAvatarSelect, ...rest
}) => {
  const classes = useStyles();

  const selectNextAvatar = () => {
    onAvatarSelect(modulo(avatarIndex + 1, AVATARS.length));
  };

  const selectPreviousAvatar = () => {
    onAvatarSelect(modulo(avatarIndex - 1, AVATARS.length));
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.carousel}>
        <IconButton onClick={selectPreviousAvatar}>
          <ArrowBackIosRounded />
        </IconButton>
        <Box className={classes.avatarContainer}>
          <img className={classes.avatar} src={AVATARS[avatarIndex].src} alt="avatar" />
        </Box>
        <IconButton onClick={selectNextAvatar}>
          <ArrowForwardIosRounded />
        </IconButton>
      </Box>
      <Typography className={classes.name} variant="h6">{AVATARS[avatarIndex].name}</Typography>
    </Box>
  );
};

export default AvatarSelector;

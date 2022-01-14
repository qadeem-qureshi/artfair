import React from 'react';
import {
  Avatar,
  Box,
  BoxProps,
  makeStyles,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { AVATARS } from '../util/avatar';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
  },
  name: {
    textAlign: 'center',
  },
});

export interface ArtistProfileProps extends BoxProps {
  name: string;
  avatarIndex: number;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({
  className,
  name,
  avatarIndex,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Avatar src={AVATARS[avatarIndex]} variant="square" />
      <Typography variant="subtitle1" className={classes.name}>
        {name}
      </Typography>
    </Box>
  );
};

export default ArtistProfile;

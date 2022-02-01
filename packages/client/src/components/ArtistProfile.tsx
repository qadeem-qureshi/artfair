import React from 'react';
import {
  Avatar, Badge, Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import StarsRounded from '@material-ui/icons/StarsRounded';
import { AVATARS } from '../util/avatar';
import { useAppContext } from './AppContextProvider';
import ArtistActionMenuButton from './ArtistActionMenuButton';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '1rem',
  },
  name: {
    flex: 1,
  },
  badgeIcon: {
    fontSize: '1.2rem',
  },
  menuButton: {
    width: '2.5rem',
    height: '2.5rem',
  },
});

export interface ArtistProfileProps extends BoxProps {
  name: string;
  avatarIndex: number;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({
  className, name, avatarIndex, ...rest
}) => {
  const classes = useStyles();
  const { state } = useAppContext();

  const clientIsHost = state.artist.name === state.room.hostname;
  const isHostProfile = name === state.room.hostname;

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Badge
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        invisible={!isHostProfile}
        overlap="rectangular"
        badgeContent={<StarsRounded className={classes.badgeIcon} color="primary" />}
      >
        <Avatar src={AVATARS[avatarIndex].src} variant="square" />
      </Badge>
      <Typography noWrap variant="subtitle1" className={classes.name}>
        {name}
      </Typography>
      {clientIsHost && (
        <ArtistActionMenuButton className={classes.menuButton} artistName={name} disabled={isHostProfile} />
      )}
    </Box>
  );
};

export default ArtistProfile;

import React from 'react';
import {
  Avatar, Badge, Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import StarsRounded from '@material-ui/icons/StarsRounded';
import { Artist } from '@artfair/common';
import { AVATARS } from '../util/avatar';
import { useRoomContext } from './RoomContextProvider';
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
  artist: Artist;
}

const ArtistProfile: React.FC<ArtistProfileProps> = ({ className, artist, ...rest }) => {
  const classes = useStyles();
  const { state } = useRoomContext();

  const clientIsHost = state.artist.name === state.room.hostname;
  const isHostProfile = artist.name === state.room.hostname;

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
        <Avatar src={AVATARS[artist.avatarIndex].src} variant="square" />
      </Badge>
      <Typography noWrap variant="subtitle1" className={classes.name}>
        {artist.name}
      </Typography>
      {clientIsHost && (
        <ArtistActionMenuButton className={classes.menuButton} artist={artist} disabled={isHostProfile} />
      )}
    </Box>
  );
};

export default ArtistProfile;

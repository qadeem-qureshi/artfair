import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';
import ArtistProfile from './ArtistProfile';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  artist: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export type VerticalArtistProps = BoxProps;

const VerticalArtistList: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.room.members.map((artist) => (
        <ArtistProfile
          className={classes.artist}
          name={artist.name}
          avatarIndex={artist.avatarIndex}
          key={artist.name}
        />
      ))}
    </Box>
  );
};

export default VerticalArtistList;

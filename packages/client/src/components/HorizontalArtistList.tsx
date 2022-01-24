import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ArtistProfile from './ArtistProfile';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  },
});

export type HorizontalArtistListProps = BoxProps;

const HorizontalArtistList: React.FC<HorizontalArtistListProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.room.members.map((artist) => (
        <ArtistProfile name={artist.name} avatarIndex={artist.avatarIndex} key={artist.name} />
      ))}
    </Box>
  );
};

export default HorizontalArtistList;

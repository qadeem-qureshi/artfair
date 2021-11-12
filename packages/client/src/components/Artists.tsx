import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';
import ArtistProfile from './ArtistProfile';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  artist: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export type ArtistsProps = BoxProps;

const Artists: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.players.map((player) => (
        <ArtistProfile name={player} key={player} className={classes.artist} />
      ))}
    </Box>
  );
};

export default Artists;

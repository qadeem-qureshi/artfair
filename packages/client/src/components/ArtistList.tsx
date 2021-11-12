import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';
import ArtistProfile from './ArtistProfile';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  },
});

export type ArtistListProps = BoxProps;

const ArtistList: React.FC<ArtistListProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.players.map((player) => (
        <ArtistProfile name={player} key={player} />
      ))}
    </Box>
  );
};

export default ArtistList;

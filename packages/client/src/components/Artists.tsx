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

export type ArtistsProps = BoxProps;

const Artists: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useAppContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.roomMembers.map((member) => (
        <ArtistProfile
          className={classes.artist}
          name={member.name}
          avatarIndex={member.avatarIndex}
          key={member.name}
        />
      ))}
    </Box>
  );
};

export default Artists;

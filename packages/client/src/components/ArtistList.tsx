import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ArtistProfile from './ArtistProfile';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
});

export type ArtistListProps = BoxProps;

const ArtistList: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useRoomContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.room.members.map((member) => (
        <ArtistProfile artist={member} key={member.name} />
      ))}
    </Box>
  );
};

export default ArtistList;

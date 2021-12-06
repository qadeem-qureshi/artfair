import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useRoomContext } from './RoomContextProvider';
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
  const { state } = useRoomContext();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.roomMembers.map((member) => (
        <ArtistProfile name={member.name} avatarIndex={member.avatarIndex} key={member.name} />
      ))}
    </Box>
  );
};

export default ArtistList;

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, BoxProps, Button, makeStyles, Paper, TextField, Typography, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import { JoinRoomData, User } from '@artfair/common';
import socket from '../services/socket';
import AvatarSelector from './AvatarSelector';
import Logo from '../assets/logo.svg';
import ContentDivider from './ContentDivider';
import { useAppContext } from './AppContextProvider';

const saveSessionInfo = (user: User) => sessionStorage.setItem('user', JSON.stringify(user));
const getSessionInfo = () => {
  const serializedData = sessionStorage.getItem('user');
  return serializedData ? (JSON.parse(serializedData) as User) : null;
};

const LOGO_SIZE = 'clamp(6rem, 10rem, 10vh)';
const HALF_CONTENT_SIZE = 'clamp(12rem, 16rem, 40vw)';

const useStyles = makeStyles({
  root: {
    display: 'grid',
    placeItems: 'center',
    gridTemplateRows: `${LOGO_SIZE} 1fr ${LOGO_SIZE}`,
    padding: '1.5rem',
    gap: '3rem',
  },
  logo: {
    height: '100%',
  },
  main: {
    display: 'grid',
    rowGap: '2rem',
    columnGap: '4rem',
    padding: '4rem',
    placeItems: 'center',
    gridTemplateColumns: `${HALF_CONTENT_SIZE} 1fr ${HALF_CONTENT_SIZE}`,
  },
  instructionText: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  avatarText: {
    gridArea: '1 / 1 / 2 / 2',
  },
  avatarSelector: {
    gridArea: '2 / 1 / 3 / 2',
    justifySelf: 'stretch',
  },
  divider: {
    gridArea: '1 / 2 / 3 / 3',
    alignSelf: 'stretch',
  },
  inputText: {
    gridArea: '1 / 3 / 2 / 4',
  },
  inputStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifySelf: 'stretch',
    gridArea: '2 / 3 / 3 / 4',
  },
});

const useVerticalOverrideStyles = makeStyles({
  main: {
    padding: '2.5rem',
    gridTemplateColumns: `${HALF_CONTENT_SIZE}`,
  },
  avatarSelector: {
    gridArea: '1 / 1 / 2 / 2',
  },
  inputStack: {
    gridArea: '2 / 1 / 3 / 2',
  },
});

const useCompactOverrideStyles = makeStyles({
  root: {
    display: 'grid',
    placeItems: 'center',
    gridTemplateRows: '1fr',
    padding: '1.5rem',
  },
});

export type HomeProps = BoxProps;

const Home: React.FC<HomeProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const verticalOverrideClasses = useVerticalOverrideStyles();
  const compactOverrideStyles = useCompactOverrideStyles();
  const [selectedAvatarIndex, setSelectedAvatarIndex] = useState(0);
  const [requestedUsername, setRequestedUsername] = useState('');
  const [requestedRoomname, setRequestedRoomname] = useState('');
  const [requestedUsernameError, setRequestedUsernameError] = useState('');
  const [requestedRoomnameError, setRequestedRoomnameError] = useState('');
  const isVertical = useMediaQuery('(max-width: 60rem)');
  const isCompact = useMediaQuery('(max-height: 50rem)');
  const { dispatch } = useAppContext();

  useEffect(() => {
    const user: User | null = getSessionInfo();
    if (!user) return;
    setSelectedAvatarIndex(user.avatarIndex);
    setRequestedUsername(user.name);
    setRequestedRoomname(user.roomname);
  }, []);

  const handleAvatarIndexChange = (index: number) => {
    setSelectedAvatarIndex(index);
  };

  const handleUsernameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedUsernameError('');
    setRequestedUsername(event.target.value.trimLeft());
  };

  const handleRoomInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestedRoomnameError('');
    setRequestedRoomname(event.target.value.trimLeft());
  };

  const handleCreateRoomAttempt = () => {
    const user: User = {
      name: requestedUsername,
      roomname: requestedRoomname,
      avatarIndex: selectedAvatarIndex,
    };
    socket.emit('create_room_attempt', user);
  };

  const handleJoinRoomAttempt = () => {
    const user: User = {
      name: requestedUsername,
      roomname: requestedRoomname,
      avatarIndex: selectedAvatarIndex,
    };
    socket.emit('join_room_attempt', user);
  };

  const handleTakenRoomname = useCallback(() => {
    setRequestedRoomnameError('This room already exists.');
  }, []);

  const handleNonexistentRoom = useCallback(() => {
    setRequestedRoomnameError('This room does not exist.');
  }, []);

  const handleTakenUsername = useCallback(() => {
    setRequestedUsernameError('This username is taken.');
  }, []);

  const handleRoomJoined = useCallback(
    (joinRoomData: JoinRoomData) => {
      const user: User = {
        name: joinRoomData.artist.name,
        roomname: joinRoomData.room.name,
        avatarIndex: joinRoomData.artist.avatarIndex,
      };
      saveSessionInfo(user);
      dispatch({ type: 'join-room', data: joinRoomData });
    },
    [dispatch],
  );

  useEffect(() => {
    socket.on('room_taken', handleTakenRoomname);
    socket.on('room_does_not_exist', handleNonexistentRoom);
    socket.on('username_taken', handleTakenUsername);
    socket.on('room_joined', handleRoomJoined);

    return () => {
      socket.off('room_taken', handleTakenRoomname);
      socket.off('room_does_not_exist', handleNonexistentRoom);
      socket.off('username_taken', handleTakenUsername);
      socket.off('room_joined', handleRoomJoined);
    };
  }, [handleTakenRoomname, handleNonexistentRoom, handleTakenUsername, handleRoomJoined]);

  const textFieldsAreEmpty = requestedUsername.length === 0 || requestedRoomname.length === 0;

  return (
    <Box className={clsx(classes.root, className, isCompact && compactOverrideStyles.root)} {...rest}>
      {!isCompact && <img className={classes.logo} src={Logo} alt="logo" />}
      <Paper className={clsx(classes.main, isVertical && verticalOverrideClasses.main)}>
        <AvatarSelector
          className={clsx(classes.avatarSelector, isVertical && verticalOverrideClasses.avatarSelector)}
          avatarIndex={selectedAvatarIndex}
          onAvatarSelect={handleAvatarIndexChange}
        />
        {!isVertical && (
          <>
            <Typography
              className={clsx(classes.instructionText, classes.avatarText)}
              color="textSecondary"
              variant="overline"
            >
              Choose your Avatar
            </Typography>
            <ContentDivider className={classes.divider} orientation="vertical">
              <Typography className={classes.instructionText} color="textSecondary" variant="overline">
                and
              </Typography>
            </ContentDivider>
            <Typography
              className={clsx(classes.instructionText, classes.inputText)}
              color="textSecondary"
              variant="overline"
            >
              Join your Team
            </Typography>
          </>
        )}
        <Box className={clsx(classes.inputStack, isVertical && verticalOverrideClasses.inputStack)}>
          <TextField
            placeholder="Name"
            variant="outlined"
            color="primary"
            value={requestedUsername}
            onChange={handleUsernameInputChange}
            spellCheck={false}
            error={requestedUsernameError.length !== 0}
            helperText={requestedUsernameError}
          />
          <TextField
            placeholder="Room"
            color="primary"
            variant="outlined"
            value={requestedRoomname}
            onChange={handleRoomInputChange}
            spellCheck={false}
            error={requestedRoomnameError.length !== 0}
            helperText={requestedRoomnameError}
          />
          <Button
            onClick={handleCreateRoomAttempt}
            disabled={textFieldsAreEmpty}
            variant="contained"
            color="primary"
            size="large"
          >
            Create Room
          </Button>
          <Button
            onClick={handleJoinRoomAttempt}
            disabled={textFieldsAreEmpty}
            variant="contained"
            color="secondary"
            size="large"
          >
            Join Room
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;

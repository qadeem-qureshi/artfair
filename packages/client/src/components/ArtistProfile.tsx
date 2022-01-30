import React, { useRef, useState } from 'react';
import {
  Avatar, Badge, Box, BoxProps, IconButton, makeStyles, Menu, MenuItem, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import MoreVertRounded from '@material-ui/icons/MoreVertRounded';
import StarsRounded from '@material-ui/icons/StarsRounded';
import socket from '../services/socket';
import { AVATARS } from '../util/avatar';
import { useAppContext } from './AppContextProvider';

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
  menuIcon: {
    fontSize: '1.5rem',
  },
  menuItem: {
    gap: '1rem',
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
  const { state, dispatch } = useAppContext();
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const openMenu = () => {
    setMenuIsOpen(true);
  };

  const closeMenu = () => {
    setMenuIsOpen(false);
  };

  const promoteArtist = () => {
    dispatch({ type: 'set-host', hostname: name });
    socket.emit('promote_host', name);
  };

  const handlePromoteButtonClick = () => {
    promoteArtist();
    closeMenu();
  };

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
        <>
          <IconButton className={classes.menuButton} ref={iconButtonRef} onClick={openMenu} disabled={isHostProfile}>
            <MoreVertRounded className={classes.menuIcon} />
          </IconButton>
          <Menu
            open={menuIsOpen}
            anchorEl={iconButtonRef.current}
            getContentAnchorEl={null}
            onClose={closeMenu}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
          >
            <MenuItem className={classes.menuItem} onClick={handlePromoteButtonClick}>
              <StarsRounded color="primary" />
              <Typography>Promote</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
};

export default ArtistProfile;

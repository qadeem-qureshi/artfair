import React, { useRef, useState } from 'react';
import {
  IconButton, IconButtonProps, makeStyles, Menu, MenuItem, Typography,
} from '@material-ui/core';
import MoreVertRounded from '@material-ui/icons/MoreVertRounded';
import StarsRounded from '@material-ui/icons/StarsRounded';
import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';
import { Artist } from '@artfair/common';
import socket from '../services/socket';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  menuIcon: {
    fontSize: '1.5rem',
  },
  menuItem: {
    gap: '1rem',
  },
});

export interface ArtistActionMenuButtonProps extends IconButtonProps {
  artist: Artist;
}

const ArtistActionMenuButton: React.FC<ArtistActionMenuButtonProps> = ({ artist, ...rest }) => {
  const classes = useStyles();
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { state } = useRoomContext();
  const artistCanBePromoted = state.room.stage === artist.stage;

  const openMenu = () => {
    setMenuIsOpen(true);
  };

  const closeMenu = () => {
    setMenuIsOpen(false);
  };

  const promoteArtist = () => {
    socket.emit('promote_host', artist.name);
  };

  const handlePromoteButtonClick = () => {
    promoteArtist();
    closeMenu();
  };

  const kickArtist = () => {
    socket.emit('kick_artist', artist.name);
  };

  const handleKickArtistButtonClick = () => {
    kickArtist();
    closeMenu();
  };

  return (
    <>
      <IconButton ref={iconButtonRef} onClick={openMenu} {...rest}>
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
        {artistCanBePromoted && (
          <MenuItem className={classes.menuItem} onClick={handlePromoteButtonClick}>
            <StarsRounded color="primary" />
            <Typography>Promote</Typography>
          </MenuItem>
        )}
        <MenuItem className={classes.menuItem} onClick={handleKickArtistButtonClick}>
          <ExitToAppRounded color="error" />
          <Typography>Kick</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ArtistActionMenuButton;

import React, { useRef, useState } from 'react';
import {
  IconButton, IconButtonProps, makeStyles, Menu, MenuItem, Typography,
} from '@material-ui/core';
import MoreVertRounded from '@material-ui/icons/MoreVertRounded';
import StarsRounded from '@material-ui/icons/StarsRounded';
import ExitToAppRounded from '@material-ui/icons/ExitToAppRounded';
import socket from '../services/socket';

const useStyles = makeStyles({
  menuIcon: {
    fontSize: '1.5rem',
  },
  menuItem: {
    gap: '1rem',
  },
});

export interface ArtistActionMenuButtonProps extends IconButtonProps {
  artistName: string;
}

const ArtistActionMenuButton: React.FC<ArtistActionMenuButtonProps> = ({ artistName, ...rest }) => {
  const classes = useStyles();
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const openMenu = () => {
    setMenuIsOpen(true);
  };

  const closeMenu = () => {
    setMenuIsOpen(false);
  };

  const promoteArtist = () => {
    socket.emit('promote_host', artistName);
  };

  const handlePromoteButtonClick = () => {
    promoteArtist();
    closeMenu();
  };

  const kickArtist = () => {
    socket.emit('kick', artistName);
  };

  const handleKickButtonClick = () => {
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
        <MenuItem className={classes.menuItem} onClick={handlePromoteButtonClick}>
          <StarsRounded color="primary" />
          <Typography>Promote</Typography>
        </MenuItem>
        <MenuItem className={classes.menuItem} onClick={handleKickButtonClick}>
          <ExitToAppRounded color="error" />
          <Typography>Kick</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ArtistActionMenuButton;

import React, { useState } from 'react';
import { IconButton, IconButtonProps, makeStyles } from '@material-ui/core';
import PaletteRounded from '@material-ui/icons/PaletteRounded';
import ColorPicker from './ColorPicker';
import CanvasPopover from './CanvasPopover';

const useStyles = makeStyles({
  popoverPaper: {
    padding: '1.5rem',
  },
});

export type ColorPickerButtonProps = IconButtonProps;

const ColorPickerButton: React.FC<ColorPickerButtonProps> = (props) => {
  const classes = useStyles();
  const [popoverIsOpen, setPopoverIsOpen] = useState(false);

  const openPopover = () => {
    setPopoverIsOpen(true);
  };

  const closePopover = () => {
    setPopoverIsOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={openPopover} {...props}>
        <PaletteRounded />
      </IconButton>
      <CanvasPopover
        open={popoverIsOpen}
        onClose={closePopover}
        onPointerUp={closePopover}
        PaperProps={{ className: classes.popoverPaper }}
      >
        <ColorPicker />
      </CanvasPopover>
    </>
  );
};

export default ColorPickerButton;

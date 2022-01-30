import React, { useState } from 'react';
import { IconButton, IconButtonProps, makeStyles } from '@material-ui/core';
import LineWeightRounded from '@material-ui/icons/LineWeightRounded';
import CanvasPopover from './CanvasPopover';
import ThicknessSlider from './ThicknessSlider';

const useStyles = makeStyles({
  slider: {
    width: '15rem',
  },
  popoverPaper: {
    padding: '1.5rem',
  },
});

export type StrokeThicknessButtonProps = IconButtonProps;

const StrokeThicknessButton: React.FC<StrokeThicknessButtonProps> = (props) => {
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
        <LineWeightRounded />
      </IconButton>
      <CanvasPopover
        open={popoverIsOpen}
        onClose={closePopover}
        onPointerUp={closePopover}
        PaperProps={{ className: classes.popoverPaper }}
      >
        <ThicknessSlider className={classes.slider} />
      </CanvasPopover>
    </>
  );
};

export default StrokeThicknessButton;

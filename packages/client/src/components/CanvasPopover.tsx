import React from 'react';
import { makeStyles, Popover, PopoverProps } from '@material-ui/core';
import clsx from 'clsx';
import { useCanvasContext } from './CanvasContextProvider';

const useStyles = makeStyles({
  paper: {
    background: 'none',
    boxShadow: 'none',
  },
});

export type CanvasPopoverProps = PopoverProps;

const CanvasPopover: React.FC<CanvasPopoverProps> = ({ onPointerUp, PaperProps, ...rest }) => {
  const classes = useStyles();
  const { state } = useCanvasContext();
  return (
    <Popover
      anchorEl={state.canvasElement}
      PaperProps={{
        onPointerUp,
        ...PaperProps,
        className: clsx(classes.paper, PaperProps?.className),
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...rest}
    />
  );
};

export default CanvasPopover;

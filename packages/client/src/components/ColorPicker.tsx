import React from 'react';
import {
  Box, BoxProps, makeStyles, Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import { Color } from '@artfair/common';
import { PALETTE } from '../util/palette';
import { useCanvasContext } from './CanvasContextProvider';

const PREVIEW_SIZE = '3rem';
const PALETTE_SQUARE_SIZE = `calc(${PREVIEW_SIZE} / 2)`;
const SQUARES_PER_ROW = Math.ceil(PALETTE.length / 2);

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  },
  preview: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
  },
  palette: {
    display: 'grid',
    gridTemplateColumns: `repeat(${SQUARES_PER_ROW}, 1fr)`,
    overflow: 'hidden',
  },
  square: {
    width: PALETTE_SQUARE_SIZE,
    height: PALETTE_SQUARE_SIZE,
  },
});

export type ColorPickerProps = BoxProps;

const ColorPicker: React.FC<ColorPickerProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useCanvasContext();

  const colorSelector = (color: Color) => () => dispatch({ type: 'set-stroke-color', color });

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Paper className={classes.preview} style={{ backgroundColor: state.strokeColor }} />
      <Paper className={classes.palette}>
        {PALETTE.map((color) => (
          <Box className={classes.square} key={color} bgcolor={color} onClick={colorSelector(color)} />
        ))}
      </Paper>
    </Box>
  );
};

export default ColorPicker;

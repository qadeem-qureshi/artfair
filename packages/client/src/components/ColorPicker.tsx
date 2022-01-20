import React from 'react';
import {
  Box, BoxProps, makeStyles, Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import { PALETTES } from '../util/palette';
import { useCanvasContext } from './CanvasContextProvider';

const NUM_ROWS = 2;
const PREVIEW_SIZE = 'min(5.5vw, 6vh)';
const COLOR_ITEM_SIZE = `calc(${PREVIEW_SIZE} / ${NUM_ROWS})`;

const PALETTE = PALETTES.WINTER;

export const DEFAULT_COLOR = PALETTE[0];

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
    gridTemplateColumns: `repeat(${Math.ceil(PALETTE.length / NUM_ROWS)}, ${COLOR_ITEM_SIZE})`,
    gridTemplateRows: `repeat(${NUM_ROWS}, ${COLOR_ITEM_SIZE})`,
    justifyItems: 'stretch',
    overflow: 'hidden',
  },
});

export type ColorPickerProps = BoxProps;

const ColorPicker: React.FC<ColorPickerProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useCanvasContext();

  const colorSelector = (color: string) => () => dispatch({ type: 'set-stroke-color', color });

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Paper className={classes.preview} style={{ backgroundColor: state.strokeColor }} />
      <Paper className={classes.palette}>
        {PALETTE.map((color) => (
          <Box key={color} bgcolor={color} onClick={colorSelector(color)} />
        ))}
      </Paper>
    </Box>
  );
};

export default ColorPicker;

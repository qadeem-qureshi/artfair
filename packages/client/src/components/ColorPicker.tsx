import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';

const COLORS = [
  // color pallette used in game
  '#1e272e', // Black
  '#28543c', // Forrest Green
  '#b33939', // Maroon Red
  '#fa4c4c', // Bright Red
  '#997b4e', // Dark Brown
  '#98b9f8', // Baby Blue
  '#cda173', // Light Brown
  '#ffa781', // Orange
  '#fac824', // Yellow
  '#cdd873', // Green Yellow
  '#caefef', // Teal Blue
  '#f5f6fa', // White
  // '#141414', // Black
  // '#fffffa', // White
];

const NUM_ROWS = 2;
const PREVIEW_SIZE = 'min(5.5vw, 6vh)';
const COLOR_ITEM_SIZE = `calc(${PREVIEW_SIZE} / ${NUM_ROWS})`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
  },
  preview: {
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
  },
  palette: {
    display: 'grid',
    gridTemplateColumns: `repeat(${Math.ceil(COLORS.length / NUM_ROWS)}, ${COLOR_ITEM_SIZE})`,
    gridTemplateRows: `repeat(${NUM_ROWS}, ${COLOR_ITEM_SIZE})`,
    justifyItems: 'stretch',
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
}));

export type ColorPickerProps = BoxProps;

const ColorPicker: React.FC<ColorPickerProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useAppContext();

  const colorSelector = (color: string) => () => dispatch({ type: 'set-color', color });

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.preview} bgcolor={state.color} />
      <Box className={classes.palette}>
        {COLORS.map((color) => (
          <Box key={color} bgcolor={color} onClick={colorSelector(color)} />
        ))}
      </Box>
    </Box>
  );
};

export default ColorPicker;

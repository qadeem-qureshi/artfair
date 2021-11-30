import React from 'react';
import {
  Box, BoxProps, makeStyles, Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';

const COLORS = [
  '#b33939',
  '#f53b57',
  '#ffa801',
  '#ffdd59',
  '#05c46b',
  '#0be881',
  '#0984e3',
  '#74b9ff',
  '#6c5ce7',
  '#a29bfe',
  '#1e272e',
  '#f5f6fa',
];

const NUM_ROWS = 2;
const PREVIEW_SIZE = 'min(5.5vw, 6vh)';
const COLOR_ITEM_SIZE = `calc(${PREVIEW_SIZE} / ${NUM_ROWS})`;

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
    gridTemplateColumns: `repeat(${Math.ceil(COLORS.length / NUM_ROWS)}, ${COLOR_ITEM_SIZE})`,
    gridTemplateRows: `repeat(${NUM_ROWS}, ${COLOR_ITEM_SIZE})`,
    justifyItems: 'stretch',
    overflow: 'hidden',
  },
});

export type ColorPickerProps = BoxProps;

const ColorPicker: React.FC<ColorPickerProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useAppContext();

  const colorSelector = (color: string) => () => dispatch({ type: 'set-color', color });

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Paper className={classes.preview} style={{ backgroundColor: state.color }} />
      <Paper className={classes.palette}>
        {COLORS.map((color) => (
          <Box key={color} bgcolor={color} onClick={colorSelector(color)} />
        ))}
      </Paper>
    </Box>
  );
};

export default ColorPicker;

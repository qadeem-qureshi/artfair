import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
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
const PREVIEW_SIZE = '3rem';
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

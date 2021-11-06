import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  item: {
    flex: 1,
  },
});

const COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
  'white',
  'black',
];

export type ColorPaletteProps = BoxProps;

const ColorPalette: React.FC<ColorPaletteProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { dispatch } = useAppContext();

  const colorSelector = (color: string) => () => dispatch({ type: 'set-color', color });

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {COLORS.map((color) => (
        <Box
          key={color}
          className={classes.item}
          bgcolor={color}
          onClick={colorSelector(color)}
        />
      ))}
    </Box>
  );
};

export default ColorPalette;

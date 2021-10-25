import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alightContent: 'space-around',
  },
  item: {
    flex: 1,
  },
});

const STROKE_RADIUS = [
  3, 6, 9, 12, 15, 18,
];

export type StrokeSizeProps = BoxProps;

const StrokeSize: React.FC<StrokeSizeProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { dispatch } = useAppContext();

  const strokeSelector = (stroke: number) => () => dispatch({ type: 'select-stroke', stroke });

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {STROKE_RADIUS.map((stroke) => (
        <Box
          key={stroke}
          className={classes.item}
          border={stroke}
          borderRight={stroke}
          borderBottom={stroke}
          borderTop={stroke}
          marginRight={3}
          marginLeft={3}
          borderRadius={100}
          sizeWidth={STROKE_RADIUS}
          onClick={strokeSelector(stroke)}
        />
      ))}
    </Box>
  );
};

export default StrokeSize;

import React from 'react';
import {
  Box, BoxProps, makeStyles, Slider,
} from '@material-ui/core';
import clsx from 'clsx';
import { useAppContext } from './AppContextProvider';

const useStyles = makeStyles({
  root: {

  },
  track:
  {
    background: 'black',
  },
  thumb:
  {
    background: 'black',
  },
});

export type StrokeSizeProps = BoxProps;

const StrokeSize: React.FC<StrokeSizeProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { dispatch } = useAppContext();

  const strokeSelector = (stroke: number) => {
    dispatch({ type: 'select-stroke', stroke });
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Slider
        classes={
          {
            track: classes.track,
            thumb: classes.thumb,
          }
        }
        defaultValue={3}
        min={1}
        max={18}
        step={3}
        onChange={(event, value) => strokeSelector(value as number)}
      />
    </Box>
  );
};

export default StrokeSize;

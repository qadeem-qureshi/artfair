import React from 'react';
import { makeStyles, Slider, SliderProps } from '@material-ui/core';
import clsx from 'clsx';
import { useCanvasContext } from './CanvasContextProvider';

const useStyles = makeStyles({
  root: {},
});

const MIN_THICKNESS = 3;
const MAX_THICKNESS = 100;

export const DEFAULT_THICKNESS = 20;

export type ThicknessSliderProps = SliderProps;

const ThicknessSlider: React.FC<ThicknessSliderProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { dispatch } = useCanvasContext();

  const handleSliderChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: number | number[],
  ) => {
    dispatch({ type: 'set-stroke-thickness', thickness: value as number });
  };

  return (
    <Slider
      className={clsx(classes.root, className)}
      defaultValue={DEFAULT_THICKNESS}
      min={MIN_THICKNESS}
      max={MAX_THICKNESS}
      onChangeCommitted={handleSliderChange}
      {...rest}
    />
  );
};

export default ThicknessSlider;

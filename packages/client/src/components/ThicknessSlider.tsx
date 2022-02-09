import React, { useState } from 'react';
import { Slider, SliderProps } from '@material-ui/core';
import { useCanvasContext } from './CanvasContextProvider';
import { MAX_STROKE_THICKNESS, MIN_STROKE_THICKNESS } from '../util/stroke';

export type ThicknessSliderProps = SliderProps;

const ThicknessSlider: React.FC<ThicknessSliderProps> = (props) => {
  const { state, dispatch } = useCanvasContext();
  const [value, setValue] = useState(state.strokeThickness);

  const handleSliderChangeCommitted = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    newValue: number | number[],
  ) => {
    dispatch({ type: 'set-stroke-thickness', thickness: newValue as number });
  };

  const handleSliderChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    newValue: number | number[],
  ) => {
    setValue(newValue as number);
  };

  return (
    <Slider
      value={value}
      min={MIN_STROKE_THICKNESS}
      max={MAX_STROKE_THICKNESS}
      onChange={handleSliderChange}
      onChangeCommitted={handleSliderChangeCommitted}
      {...props}
    />
  );
};

export default ThicknessSlider;

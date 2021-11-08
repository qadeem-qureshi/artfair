import { IconButton, IconButtonProps } from '@material-ui/core';
import BrushRounded from '@material-ui/icons/BrushRounded';
import React from 'react';
import { useAppContext } from './AppContextProvider';

export type EraserButtonProps = IconButtonProps;

const EraserButton: React.FC<EraserButtonProps> = (props) => {
  const { dispatch } = useAppContext();

  const handleClick = () => {
    dispatch({ type: 'select-color', color: 'white' });
  };

  return (
    <IconButton onClick={handleClick} color="primary" {...props}>
      <BrushRounded />
    </IconButton>
  );
};

export default EraserButton;

import { IconButton, IconButtonProps } from '@material-ui/core';
import SaveAltRounded from '@material-ui/icons/SaveAltRounded';
import React, { useRef } from 'react';
import { useCanvasContext } from './CanvasContextProvider';

export type ExportButtonProps = IconButtonProps;

const ExportButton: React.FC<ExportButtonProps> = (props) => {
  const { state } = useCanvasContext();
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const handleClick = () => {
    if (!anchorRef.current || !state.canvasElement) return;
    anchorRef.current.setAttribute('href', state.canvasElement.toDataURL('image/png'));
    anchorRef.current.click();
  };

  /* eslint-disable jsx-a11y/anchor-has-content */
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <IconButton onClick={handleClick} color="primary" {...props}>
      <SaveAltRounded />
      <a download="painting.png" hidden ref={anchorRef} />
    </IconButton>
  );
};

export default ExportButton;

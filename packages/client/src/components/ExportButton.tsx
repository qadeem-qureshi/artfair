import { IconButton, IconButtonProps } from '@material-ui/core';
import SaveAltRounded from '@material-ui/icons/SaveAltRounded';
import React, { useRef } from 'react';
import { useAppContext } from './AppContextProvider';

export type ExportButtonProps = IconButtonProps;

const ExportButton: React.FC<ExportButtonProps> = (props) => {
  const { state } = useAppContext();
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const handleClick = () => {
    if (!state.context) return;
    if (!anchorRef.current) return;
    anchorRef.current.setAttribute('href', state.context.canvas.toDataURL('image/png'));
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

import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ClearButton from './ClearButton';
import ExportButton from './ExportButton';
import EraserButton from './EraserButton';
import ColorPickerButton from './ColorPaletteButton';
import StrokeThicknessButton from './StrokeThicknessButton';
import ColorPicker from './ColorPicker';
import ThicknessSlider from './ThicknessSlider';

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
  },
  thicknessSlider: {
    flex: 1,
    minWidth: '2rem',
    maxWidth: '15rem',
    margin: '0 1rem',
  },
});

export interface ToolbarProps extends BoxProps {
  compact?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ className, compact, ...rest }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {compact ? (
        <>
          <ColorPickerButton />
          <StrokeThicknessButton />
        </>
      ) : (
        <>
          <ColorPicker />
          <ThicknessSlider className={classes.thicknessSlider} />
        </>
      )}
      <EraserButton />
      <ClearButton />
      <ExportButton />
    </Box>
  );
};

export default Toolbar;

import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';

import clsx from 'clsx';
import ColorPicker from './ColorPicker';
import ThicknessSlider from './ThicknessSlider';
import ClearButton from './ClearButton';
import ExportButton from './ExportButton';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  colorPicker: {
    flex: 1,
  },
  thicknessSlider: {
    flex: 1,
  },
});

export type ToolbarProps = BoxProps;

const Toolbar: React.FC<ToolbarProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <ColorPicker className={classes.colorPicker} />
      <ThicknessSlider className={classes.thicknessSlider} />
      <ClearButton />
      <ExportButton />
    </Box>
  );
};

export default Toolbar;

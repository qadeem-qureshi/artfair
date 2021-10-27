import React from 'react';
import {
  Box, BoxProps, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import ColorPalette from './ColorPalette';
import ThicknessSlider from './ThicknessSlider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  colorPalette: {
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    flex: 2,
  },
  thicknessSlider: {
    flex: 1,
  },
}));

export type ToolbarProps = BoxProps;

const Toolbar: React.FC<ToolbarProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <ColorPalette className={classes.colorPalette} />
      <ThicknessSlider className={classes.thicknessSlider} />
    </Box>
  );
};

export default Toolbar;

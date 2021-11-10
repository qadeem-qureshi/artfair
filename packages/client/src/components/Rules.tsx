import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
  },
});

export type RulesProps = BoxProps;

const Rules: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Typography>Rules</Typography>
    </Box>
  );
};

export default Rules;

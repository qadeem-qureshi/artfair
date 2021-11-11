import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '1rem',
  },
});

export type RulesProps = BoxProps;

const Rules: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Typography variant="h5" color="textPrimary">
        Welcome to ArtFair!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Here you will find some rules concerning the current activity.
      </Typography>
    </Box>
  );
};

export default Rules;

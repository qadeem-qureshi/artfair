import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    overflow: 'auto',
  },
});

export type DiscussionProps = BoxProps;

const Discussion: React.FC<DiscussionProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      Discussion questions go here!
    </Box>
  );
};

export default Discussion;

import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  },
});

export interface ActivityCardProps extends BoxProps {
  name: string;
  description: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  className,
  name,
  description,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Typography variant="h3">{name}</Typography>
      <Typography variant="subtitle2">{description}</Typography>
    </Box>
  );
};

export default ActivityCard;

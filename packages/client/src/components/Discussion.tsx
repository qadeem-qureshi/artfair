import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { QUESTIONS } from '../util/discussion';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    overflow: 'auto',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.75rem',
  },
  number: {
    fontWeight: 'bold',
  },
});

export type DiscussionProps = BoxProps;

const Discussion: React.FC<DiscussionProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {QUESTIONS.map((question, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={index} className={classes.listItem}>
          <Typography className={classes.number} color="textPrimary">
            {`${index + 1}.`}
          </Typography>
          <Typography color="textSecondary">{question}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Discussion;

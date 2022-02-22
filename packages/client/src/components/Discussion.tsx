import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
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
      <Typography variant="h6">
        1. What was the greatest challenge you had as a group?
      </Typography>
      <Typography variant="h6">
        2. What did you learn about your team in that activity?
      </Typography>
      <Typography variant="h6">
        3. What did you learn about yourself as a team player?
      </Typography>
      <Typography variant="h6">
        4. What is one skill you have that you feel really benefited the group?
      </Typography>
      <Typography variant="h6">
        5. How did your team communicate?
      </Typography>
      <Typography variant="h6">
        6. What tactics or processes did you use to complete the task?
      </Typography>
      <Typography variant="h6">
        7. How did the team handle conflict?
      </Typography>
      <Typography variant="h6">
        8. In terms of working as a team, what would you do differently next time?
      </Typography>
      <Typography variant="h6">
        9. What surprised you the most?
      </Typography>
      <Typography variant="h6">
        10. What lessons can you learn from this challenge?
      </Typography>
    </Box>
  );
};

export default Discussion;

import React, { useEffect, useState } from 'react';
import {
  Box, BoxProps, IconButton, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { Activity } from '@artfair/common';
import ArrowBackIosRounded from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRounded from '@material-ui/icons/ArrowForwardIosRounded';
import { ACTIVITIES, ACTIVITY_INFORMATION_RECORD, DEFAULT_ACTIVITY } from '../util/activity';
import { modulo } from '../util/math';
import ActivityCarouselItem from './ActivityCarouselItem';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  arrowContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: '0 1.5rem 0 1.5rem',
    overflowY: 'auto',
    minHeight: 0,
  },
});

export interface ActivityCarouselProps extends BoxProps {
  onActivityChange: (activity: Activity) => void;
}

const ActivityCarousel: React.FC<ActivityCarouselProps> = ({ className, onActivityChange, ...rest }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(() => ACTIVITIES.indexOf(DEFAULT_ACTIVITY));

  const selectNextActivity = () => {
    setIndex((previousIndex) => modulo(previousIndex + 1, ACTIVITIES.length));
  };

  const selectPreviousActivity = () => {
    setIndex((previousIndex) => modulo(previousIndex - 1, ACTIVITIES.length));
  };

  useEffect(() => {
    onActivityChange(ACTIVITIES[index]);
  }, [index, onActivityChange]);

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.arrowContainer}>
        <IconButton onClick={selectPreviousActivity}>
          <ArrowBackIosRounded />
        </IconButton>
      </Box>
      <ActivityCarouselItem
        className={classes.content}
        activityInformation={ACTIVITY_INFORMATION_RECORD[ACTIVITIES[index]]}
      />
      <Box className={classes.arrowContainer}>
        <IconButton onClick={selectNextActivity}>
          <ArrowForwardIosRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ActivityCarousel;

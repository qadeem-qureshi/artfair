import React from 'react';
import {
  Box, BoxProps, IconButton, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import ArrowBackIosRounded from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRounded from '@material-ui/icons/ArrowForwardIosRounded';
import FiberManualRecordRounded from '@material-ui/icons/FiberManualRecordRounded';
import { ACTIVITIES } from '@artfair/common';
import ActivityInformationPanel from './ActivityInformationPanel';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
    padding: '1rem',
  },
  dots: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  dot: {
    fontSize: '0.5rem',
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '2rem',
  },
});

export type ActivityCarouselProps = BoxProps;

const ActivityCarousel: React.FC<ActivityCarouselProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state, dispatch } = useRoomContext();

  const selectNextActivity = () => {
    dispatch({ type: 'next-activity' });
  };

  const selectPreviousActivity = () => {
    dispatch({ type: 'previous-activity' });
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <ActivityInformationPanel className={classes.content} />
      <Box className={classes.navigation}>
        <IconButton onClick={selectPreviousActivity}>
          <ArrowBackIosRounded />
        </IconButton>
        <Box className={classes.dots}>
          {ACTIVITIES.map((activity, index) => (
            <FiberManualRecordRounded
              key={activity}
              className={classes.dot}
              color={index === ACTIVITIES.indexOf(state.room.activity) ? 'primary' : 'disabled'}
            />
          ))}
        </Box>
        <IconButton onClick={selectNextActivity}>
          <ArrowForwardIosRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ActivityCarousel;

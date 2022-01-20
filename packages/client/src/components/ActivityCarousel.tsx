import React from 'react';
import {
  Box, BoxProps, IconButton, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import { Activity } from '@artfair/common';
import ArrowBackIosRounded from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRounded from '@material-ui/icons/ArrowForwardIosRounded';
import { modulo } from '../util/math';
import SampleActivityImage from '../assets/activity.png';
import ActivityCarouselItem from './ActivityCarouselItem';
import { useRoomContext } from './RoomContextProvider';

const ACTIVITIES: Activity[] = [
  'art-collab',
  'con-artist',
  'canvas-swap',
  'art-dealer',
  'art-critic',
];

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
    display: 'flex',
    flexDirection: 'column',
    padding: '0 1rem 0 1rem',
    overflowY: 'auto',
    minHeight: 0,
  },
});

export type ActivityCarouselProps = BoxProps;

const ActivityCarousel: React.FC<ActivityCarouselProps> = ({
  className,
  ...rest
}) => {
  const classes = useStyles();
  const { state, dispatch } = useRoomContext();

  const selectNextActivity = () => {
    const nextActivity = ACTIVITIES[
      modulo(ACTIVITIES.indexOf(state.activity) + 1, ACTIVITIES.length)
    ];
    dispatch({ type: 'set-activity', activity: nextActivity });
  };

  const selectPreviousActivity = () => {
    const previousActivity = ACTIVITIES[
      modulo(ACTIVITIES.indexOf(state.activity) - 1, ACTIVITIES.length)
    ];
    dispatch({ type: 'set-activity', activity: previousActivity });
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={classes.arrowContainer}>
        <IconButton onClick={selectPreviousActivity}>
          <ArrowBackIosRounded />
        </IconButton>
      </Box>
      <Box className={classes.content}>
        <ActivityCarouselItem
          imageSource={SampleActivityImage}
          name="Art Collab"
          description="Everyone contributes to a shared canvas."
          activity="art-collab"
        />
        <ActivityCarouselItem
          imageSource={SampleActivityImage}
          name="Con Artist"
          description="All but one artist are given a prompt to draw. Artists take turns to draw a single, connected stroke. After three rounds, the artists must attempt to vote out the con artist."
          activity="con-artist"
        />
        <ActivityCarouselItem
          imageSource={SampleActivityImage}
          name="Canvas Swap"
          description="Canvases rotate between the artists."
          activity="canvas-swap"
        />
        <ActivityCarouselItem
          imageSource={SampleActivityImage}
          name="Art Dealer"
          description="Each artist is given a problem and must draw their solution to that problem. After some time, each artist is presented with the work of another and must give a 'sales pitch' of the solution to the other artists."
          activity="art-dealer"
        />
        <ActivityCarouselItem
          imageSource={SampleActivityImage}
          name="Art Critic"
          description="One artist is given a prompt to draw and the others compete to guess the prompt."
          activity="art-critic"
        />
      </Box>
      <Box className={classes.arrowContainer}>
        <IconButton onClick={selectNextActivity}>
          <ArrowForwardIosRounded />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ActivityCarousel;

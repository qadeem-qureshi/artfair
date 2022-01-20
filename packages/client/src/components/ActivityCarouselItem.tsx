import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { Activity } from '@artfair/common';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  name: {
    padding: '0.5rem 0 0.5rem 0',
    fontWeight: 'bold',
  },
});

export interface ActivityCarouselItemProps extends BoxProps {
  name: string;
  description: string;
  activity: Activity;
  imageSource: string;
}

const ActivityCarouselItem: React.FC<ActivityCarouselItemProps> = ({
  className,
  name,
  description,
  activity,
  imageSource,
  ...rest
}) => {
  const classes = useStyles();
  const { state } = useRoomContext();

  // Only render if this activity is selected
  if (state.activity !== activity) {
    return null;
  }

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <img src={imageSource} alt="Sample Activity" className={classes.image} />
      <Box className={classes.info}>
        <Typography variant="h3" color="textPrimary" className={classes.name}>
          {name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default ActivityCarouselItem;

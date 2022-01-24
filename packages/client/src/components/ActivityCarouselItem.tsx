import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { ActivityInformation } from '../util/activity';

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
  activityInformation: ActivityInformation;
}

const ActivityCarouselItem: React.FC<ActivityCarouselItemProps> = ({
  className,
  activityInformation,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <img src={activityInformation.imageSource} alt={activityInformation.name} className={classes.image} />
      <Box className={classes.info}>
        <Typography variant="h3" color="textPrimary" className={classes.name}>
          {activityInformation.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {activityInformation.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default ActivityCarouselItem;

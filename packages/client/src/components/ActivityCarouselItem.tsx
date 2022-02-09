import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography, Chip,
} from '@material-ui/core';
import clsx from 'clsx';
import { ActivityInformation } from '../util/activity';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  name: {
    fontWeight: 'bold',
  },
  chipContainer: {
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '1rem',
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
      <Typography variant="h3" color="textPrimary" className={classes.name}>
        {activityInformation.name}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {activityInformation.description}
      </Typography>
      <Box className={classes.chipContainer}>
        <Chip label={`${activityInformation.minArtistCount}+ Artists`} />
        <Chip label={activityInformation.modeType} />
        <Chip label={activityInformation.conceptCovered} />
      </Box>
    </Box>
  );
};

export default ActivityCarouselItem;

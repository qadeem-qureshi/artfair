import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography, Chip,
} from '@material-ui/core';
import clsx from 'clsx';
import { ACTIVITY_INFORMATION_RECORD } from '../util/activity';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  image: {
    width: '85%',
    height: 'auto',
    alignSelf: 'center',
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

export type ActivityInformationPanelProps = BoxProps;

const ActivityInformationPanel: React.FC<ActivityInformationPanelProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useRoomContext();
  const {
    imageSource, name, description, minArtistCount, modeType, conceptCovered,
  } = ACTIVITY_INFORMATION_RECORD[state.room.activity];

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <img src={imageSource} alt={name} className={classes.image} />
      <Typography variant="h3" color="textPrimary" className={classes.name}>
        {name}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {description}
      </Typography>
      <Box className={classes.chipContainer}>
        <Chip label={`${minArtistCount}+ Artists`} />
        <Chip label={modeType} />
        <Chip label={conceptCovered} />
      </Box>
    </Box>
  );
};

export default ActivityInformationPanel;

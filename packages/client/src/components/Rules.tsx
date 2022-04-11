import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { ACTIVITY_INFORMATION_RECORD } from '../util/activity';
import { useRoomContext } from './RoomContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '1rem',
  },
  header: {
    fontWeight: 'bold',
  },
  instructions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  instruction: {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.75rem',
  },
  number: {
    fontWeight: 'normal',
  },
});

export type RulesProps = BoxProps;

const Rules: React.FC<BoxProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { state } = useRoomContext();
  const { name, instructions } = ACTIVITY_INFORMATION_RECORD[state.room.activity];
  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {state.artist.stage === 'lobby' ? (
        <>
          <Typography className={classes.header} variant="h5" color="textPrimary">
            Welcome to ArtFair!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            ArtFair is an online collaborative drawing experience centered around the idea of a shared canvas where team
            members may work together to create pieces of art. ArtFair facilitates team building through several fun
            activites that focus on various interpersonal skills, discussion questions that spark reflective
            conversation, and tangible artifacts that serve as lasting memories of the experience.
          </Typography>
        </>
      ) : (
        <>
          <Typography className={classes.header} variant="h5" color="textPrimary">
            {name}
          </Typography>
          <Box className={classes.instructions}>
            {instructions.map((instruction, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={index} className={classes.instruction}>
                <Typography className={classes.number} color="textPrimary">
                  {`${index + 1}.`}
                </Typography>
                <Typography color="textSecondary">{instruction}</Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Rules;

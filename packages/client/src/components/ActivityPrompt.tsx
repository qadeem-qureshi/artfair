import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useRoomContext } from './RoomContextProvider';
import { ACTIVITY_INFORMATION_RECORD } from '../util/activity';

const useStyles = makeStyles({
  paper: {
    padding: '1.5rem',
  },
  title: {
    padding: '0',
  },
  content: {
    padding: '1rem 0',
  },
  actions: {
    padding: '0',
    gap: '1rem',
  },
  prompt: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '2rem 0',
  },
});

export type ActivityPromptProps = Omit<DialogProps, 'open'>;

const ActivityPrompt: React.FC<ActivityPromptProps> = (props) => {
  const classes = useStyles();
  const [dialogIsOpen, setDialogIsOpen] = useState(true);
  const { state } = useRoomContext();
  const { name, introduction } = ACTIVITY_INFORMATION_RECORD[state.room.activity];

  const closeDialog = () => {
    setDialogIsOpen(false);
  };

  return (
    <Dialog open={dialogIsOpen} PaperProps={{ className: classes.paper, elevation: 1 }} {...props}>
      <DialogTitle className={classes.title}>{`Welcome to the ${name} activity!`}</DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText>
          {introduction}
        </DialogContentText>
        {state.artist.prompt && <Typography className={classes.prompt} variant="h6">{state.artist.prompt}</Typography>}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button variant="contained" color="primary" onClick={closeDialog}>
          Get Started
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityPrompt;

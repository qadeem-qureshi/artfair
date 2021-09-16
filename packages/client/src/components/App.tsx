import React from 'react';
import { Box, makeStyles, Paper } from '@material-ui/core';
import Chat from './Chat';

const useStyles = makeStyles({
  root: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chat: {
    height: '40vh',
    width: '20rem',
  },
});

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Paper elevation={2}>
        <Chat className={classes.chat} />
      </Paper>
    </Box>
  );
};

export default App;

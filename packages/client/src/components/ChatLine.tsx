import React from 'react';
import {
  Box, BoxProps, makeStyles, Typography,
} from '@material-ui/core';
import { ChatMessage } from '@artfair/common';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    overflowWrap: 'break-word',
  },
  sender: {
    display: 'inline',
    fontWeight: 'bold',
    marginRight: '0.3rem',
  },
  content: {
    display: 'inline',
  },
  announcement: {
    opacity: 0.8,
    fontWeight: 'lighter',
    fontStyle: 'italic',
  },
});

export interface ChatLineProps extends BoxProps {
  message: ChatMessage
}

const ChatLine: React.FC<ChatLineProps> = ({ message, className, ...rest }) => {
  const classes = useStyles();

  const isAnnouncement = message.sender.length === 0;

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      {isAnnouncement ? (
        <Typography className={classes.announcement}>
          {message.content}
        </Typography>
      ) : (
        <>
          <Typography className={classes.sender}>
            {message.sender}
            :
          </Typography>
          <Typography className={classes.content}>
            {message.content}
          </Typography>
        </>
      )}

    </Box>
  );
};

export default ChatLine;

import React, { useState } from 'react';
import {
  Box, BoxProps, Button, makeStyles, TextField,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  input: {
    flexGrow: 1,
    marginRight: '1rem',
  },
});

export interface ChatInputProps extends BoxProps {
  onSend: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, className, ...rest }) => {
  const classes = useStyles();

  const [input, setInput] = useState('');

  const send = () => {
    onSend(input.trim());
    setInput('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (input.trim() && event.key === 'Enter') { send(); }
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <TextField
        className={classes.input}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="type a message..."
        variant="outlined"
        color="primary"
        size="small"
        spellCheck={false}
      />
      <Button
        onClick={send}
        disabled={input.trim().length === 0}
        variant="contained"
        color="primary"
        size="small"
      >
        Send
      </Button>
    </Box>
  );
};

export default ChatInput;

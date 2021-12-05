import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

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
  },
});

export interface ConfirmationDialogProps extends DialogProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  ...rest
}) => {
  const classes = useStyles();

  return (
    <Dialog PaperProps={{ className: classes.paper, elevation: 1 }} {...rest}>
      <DialogTitle className={classes.title}>{title}</DialogTitle>
      <DialogContent className={classes.content}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

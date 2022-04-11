import React from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalRoot: {
    flexDirection: 'row',
  },
  verticalRoot: {
    flexDirection: 'column',
  },
  divider: {
    flex: 1,
  },
  horizontalDivider: {
    borderBottom: `0.2rem solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  verticalDivider: {
    borderRight: `0.2rem solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

export interface ContentDividerProps extends BoxProps {
  orientation: 'horizontal' | 'vertical';
}

const ContentDivider: React.FC<ContentDividerProps> = ({
  className, orientation, children, ...rest
}) => {
  const classes = useStyles();
  return (
    <Box
      className={clsx(
        classes.root,
        orientation === 'horizontal' ? classes.horizontalRoot : classes.verticalRoot,
        className,
      )}
      {...rest}
    >
      <Box
        className={clsx(
          classes.divider,
          orientation === 'horizontal' ? classes.horizontalDivider : classes.verticalDivider,
        )}
      />
      {children}
      <Box
        className={clsx(
          classes.divider,
          orientation === 'horizontal' ? classes.horizontalDivider : classes.verticalDivider,
        )}
      />
    </Box>
  );
};

export default ContentDivider;

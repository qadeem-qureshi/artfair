import React from 'react';
import {
  makeStyles, BoxProps, styled, ButtonBase, Typography,
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(({
  root:
  {
    width: '49%',
    height: '49%',
    opacity: 0.85,
  },
  media:
  {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
    height: '100%',
    width: '100%',
  },
  content:
  {
    position: 'absolute',
    bottom: 0,
  },
}));

const GameButton = styled(ButtonBase)({
  position: 'relative',
  '&:hover, &.Mui-focusVisible': {
    opacity: 1,
  },
  '&.Mui-disabled':
  {
    opacity: 0.5,
    color: '#454545',
  },
});

export interface GameCardProps extends BoxProps {
  name: string;
  image: string;
  disable: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  name, image, className, disable,
}) => {
  const classes = useStyles();

  return (
    <GameButton className={clsx(classes.root, className)} disabled={!disable}>
      <img className={classes.media} src={image} alt={name} />
      <Typography
        align="center"
        variant="h3"
        className={classes.content}
      >
        {name}
      </Typography>
    </GameButton>
  );
};

export default GameCard;

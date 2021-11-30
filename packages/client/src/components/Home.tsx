import React from 'react';
import {
  Box, makeStyles, BoxProps, Paper, useMediaQuery,
} from '@material-ui/core';
import clsx from 'clsx';
import Logo from '../assets/logo.svg';
import Yeti from '../assets/yeti.svg';
import Tree from '../assets/tree.svg';
import Login from './Login';

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: '1rem',
  },
  login: {
    width: '20rem',
    padding: '2rem',
  },
  logo: {
    width: 'min(20rem, 15vh)',
  },
  logoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  art: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    width: 'min(20vw, 40vh)',
  },
  hidden: {
    display: 'none',
  },
  spacer: {
    flex: 1,
  },
});

export type HomeProps = BoxProps;

const Home: React.FC<HomeProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const shouldWrap = useMediaQuery('(max-aspect-ratio: 1/1)');

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <Box className={clsx(classes.art, shouldWrap && classes.hidden)}>
        <img className={classes.character} src={Yeti} alt="yeti" />
      </Box>
      <Box className={classes.content}>
        <Box className={classes.logoContainer}>
          <img className={classes.logo} src={Logo} alt="logo" />
        </Box>
        <Login className={classes.login} component={Paper} />
        <Box className={classes.spacer} />
      </Box>
      <Box className={clsx(classes.art, shouldWrap && classes.hidden)}>
        <img className={classes.character} src={Tree} alt="tree" />
      </Box>
    </Box>
  );
};

export default Home;

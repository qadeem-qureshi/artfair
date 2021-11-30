import React from 'react';
import {
  Box,
  makeStyles,
  BoxProps,
  Paper,
} from '@material-ui/core';
import clsx from 'clsx';
import Logo from '../assets/logo.svg';
import Yeti from '../assets/yeti.svg';
import Tree from '../assets/tree.svg';
import Login from './Login';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    alignItems: 'center',
    gap: '1rem',
  },
  login: {
    width: '20rem',
    padding: '2rem',
  },
});

export type HomeProps = BoxProps;

const Home: React.FC<HomeProps> = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <img src={Yeti} alt="Yeti" />
      <Box className={classes.main}>
        <img src={Logo} alt="Logo" />
        <Login className={classes.login} component={Paper} />
      </Box>
      <img src={Tree} alt="Tree" />
    </Box>
  );
};

export default Home;

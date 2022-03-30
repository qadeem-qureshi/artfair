import Acorn from '../assets/acorn.svg';
import Berry from '../assets/berry.svg';
import Chipbag from '../assets/chipbag.svg';
import Flor from '../assets/flor.svg';
import JeanRalphio from '../assets/jean-ralphio.svg';
import Rufus from '../assets/rufus.svg';
import Sunnie from '../assets/sunnie.svg';

export interface Avatar {
  name: string;
  src: string;
}

export const AVATARS: Avatar[] = [
  {
    name: 'Acorn',
    src: Acorn,
  },
  {
    name: 'Berry',
    src: Berry,
  },
  {
    name: 'Chipbag',
    src: Chipbag,
  },
  {
    name: 'Flor',
    src: Flor,
  },
  {
    name: 'Jean Ralphio',
    src: JeanRalphio,
  },
  {
    name: 'Rufus',
    src: Rufus,
  },
  {
    name: 'Sunnie',
    src: Sunnie,
  },
];

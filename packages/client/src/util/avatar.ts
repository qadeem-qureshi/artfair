import Hamster from '../assets/hamster.svg';
import Yeti from '../assets/yeti.svg';
import Tree from '../assets/tree.svg';
import Fish from '../assets/fish.svg';

export interface Avatar {
  name: string;
  src: string;
}

export const AVATARS: Avatar[] = [
  {
    name: 'Gus',
    src: Hamster,
  },
  {
    name: 'Alfredo',
    src: Yeti,
  },
  {
    name: 'Tree',
    src: Tree,
  },
  {
    name: 'Fish',
    src: Fish,
  },
];

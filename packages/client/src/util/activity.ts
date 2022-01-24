import { Activity } from '@artfair/common';
import SampleActivityImage from '../assets/activity.png';

export const ACTIVITIES: Activity[] = ['art-collab', 'con-artist', 'canvas-swap', 'art-dealer', 'art-critic'];

export interface ActivityInformation {
  name: string;
  description: string;
  imageSource: string;
}

export const ACTIVITY_INFORMATION_RECORD: Record<Activity, ActivityInformation> = {
  'art-collab': {
    imageSource: SampleActivityImage,
    name: 'Art Collab',
    description: 'Everyone contributes to a shared canvas.',
  },
  'con-artist': {
    imageSource: SampleActivityImage,
    name: 'Con Artist',
    description:
      'All but one artist are given a prompt to draw. Artists take turns to draw a single, connected stroke. After three rounds, the artists must attempt to vote out the con artist.',
  },
  'canvas-swap': {
    imageSource: SampleActivityImage,
    name: 'Canvas Swap',
    description: 'Canvases rotate between the artists.',
  },
  'art-dealer': {
    imageSource: SampleActivityImage,
    name: 'Art Dealer',
    description:
      "Each artist is given a problem and must draw their solution to that problem. After some time, each artist is presented with the work of another and must give a 'sales pitch' of the solution to the other artists.",
  },
  'art-critic': {
    imageSource: SampleActivityImage,
    name: 'Art Critic',
    description: 'One artist is given a prompt to draw and the others compete to guess the prompt.',
  },
};

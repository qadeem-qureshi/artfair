import { Activity } from '@artfair/common';
import SampleActivityImage from '../assets/activity.jpg';

export const ACTIVITIES: Activity[] = ['free-draw', 'art-collab', 'con-artist', 'canvas-swap', 'art-dealer', 'art-critic'];

export interface ActivityInformation {
  name: string;
  description: string;
  imageSource: string;
  playerAmount: string;
  modeType: string;
  conceptCovered: string;
}

export const ACTIVITY_INFORMATION_RECORD: Record<Activity, ActivityInformation> = {
  'free-draw': {
    imageSource: SampleActivityImage,
    name: 'Free Draw',
    description: 'Artists can share a canvas to draw whatever they desire.',
    playerAmount: '1+ Players',
    modeType: 'Relaxing',
    conceptCovered: 'Creativity',
  },
  'art-collab': {
    imageSource: SampleActivityImage,
    name: 'Art Collab',
    description: 'Artists are given a prompt and must collaborate to complete the prompt on a shared canvas',
    playerAmount: '2+ Players',
    modeType: 'Relaxing',
    conceptCovered: 'Collaboration',
  },
  'con-artist': {
    imageSource: SampleActivityImage,
    name: 'Con Artist',
    description:
      'All but one artist are given a prompt to draw. Artists take turns to draw a single, connected stroke. After three rounds, the artists must attempt to vote out the con artist.',
    playerAmount: '4+ Players',
    modeType: 'Competitive',
    conceptCovered: 'Problem-solving',
  },
  'canvas-swap': {
    imageSource: SampleActivityImage,
    name: 'Canvas Swap',
    description: 'Artists each start off with an individual canvas. Then, the canvases rotate between the artists.',
    playerAmount: '2+ Players',
    modeType: 'Relaxing',
    conceptCovered: 'Teamwork',
  },
  'art-dealer': {
    imageSource: SampleActivityImage,
    name: 'Art Dealer',
    description:
      "Each artist is given a problem and must draw their solution to that problem. After some time, each artist is presented with the work of another and must give a 'sales pitch' of the solution to the other artists.",
    playerAmount: '3+ Players',
    modeType: 'Humourous',
    conceptCovered: 'Critical Thinking',
  },
  'art-critic': {
    imageSource: SampleActivityImage,
    name: 'Art Critic',
    description: 'One artist is given a prompt to draw and the others compete to guess the prompt.',
    playerAmount: '3+ Players',
    modeType: 'Competitive',
    conceptCovered: 'Critical Thinking',
  },
};

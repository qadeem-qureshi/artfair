import { Activity } from '@artfair/common';
import SampleActivityImage from '../assets/activity.jpg';

export interface ActivityInformation {
  name: string;
  description: string;
  imageSource: string;
  minArtistCount: number;
  modeType: string;
  conceptCovered: string;
  instructions: string[];
}

export const ACTIVITY_INFORMATION_RECORD: Record<Activity, ActivityInformation> = {
  'free-draw': {
    imageSource: SampleActivityImage,
    name: 'Free Draw',
    description:
      'Artists share a canvas and may draw whatever they desire. This is an opportunity for artists to showcase their talent and creativity.',
    minArtistCount: 1,
    modeType: 'Relaxing',
    conceptCovered: 'Creativity',
    instructions: ['There are no rules!', 'Enjoy drawing on the shared canvas with other artists or draw solo.'],
  },
  'art-collab': {
    imageSource: SampleActivityImage,
    name: 'Art Collab',
    description:
      "Artists are prompted with a scene to draw and must collaborate to complete it. Artists must work together and delegate tasks to efficiently create their masterpiece without stepping on each other's toes.",
    minArtistCount: 2,
    modeType: 'Relaxing',
    conceptCovered: 'Collaboration',
    instructions: [
      'The host will choose a scene for the artists to draw.',
      'All artists should pick a portion of the scene to draw (use the chat function to delegate or claim the parts to draw!).',
      'Everyone then works together to complete the scene and add any finishing touches.',
      'Finally, all artists can download the completed masterpiece to their own device.',
    ],
  },
  'con-artist': {
    imageSource: SampleActivityImage,
    name: 'Con Artist',
    description:
      'All but one artist are given a prompt to draw. Artists take turns to draw a single, connected stroke. After three rounds, the artists must attempt to vote out the con artist.',
    minArtistCount: 4,
    modeType: 'Competitive',
    conceptCovered: 'Problem-solving',
    instructions: [
      "Every artist except for the 'Con Artist' is told the prompt.",
      'Each round consists of everyone taking a turn to draw a single, connected stroke.',
      "Once three rounds have been completed, everyone votes for who they think the 'Con Artist' is.",
      "If the artists are able to vote out the 'Con Artist', they win!",
      "However, if the 'Con Artist' successfully fools everyone, the 'Con Artist' is the winner.",
    ],
  },
  'canvas-swap': {
    imageSource: SampleActivityImage,
    name: 'Canvas Swap',
    description:
      "Artists each start off with an individual canvas to draw whatever they like. After some time, the canvases rotate so that each artist may continue the other's work.",
    minArtistCount: 2,
    modeType: 'Relaxing',
    conceptCovered: 'Teamwork',
    instructions: [
      'Every artist begins with their own individual canvas.',
      "After 2 minutes, the canvases rotate and each artist is then meant to continue the other artists' work.",
    ],
  },
  'art-dealer': {
    imageSource: SampleActivityImage,
    name: 'Art Dealer',
    description:
      "Each artist is given a problem and must draw their solution to that problem. After some time, each artist is presented with the work of another and must give a 'sales pitch' of the solution to the other artists.",
    minArtistCount: 3,
    modeType: 'Humorous',
    conceptCovered: 'Critical Thinking',
    instructions: [
      'Every artist begins by drawing a solution to a problem.',
      'After 5 minutes, every artist is then presented with the work of another artist.',
      "Without knowing what the problem each artist was trying to solve, each artist must make a 'sales pitch' to the other artists.",
      'In the end, the artist and art dealer with the most amount of votes wins!',
    ],
  },
};

import { Activity } from '@artfair/common';
import ActivityImage from '../assets/activity.webp';

export interface ActivityInformation {
  name: string;
  description: string;
  imageSource: string;
  minArtistCount: number;
  modeType: string;
  conceptCovered: string;
  instructions: string[];
  introduction: string;
}

export const ACTIVITY_INFORMATION_RECORD: Record<
  Activity,
  ActivityInformation
> = {
  'free-draw': {
    imageSource: ActivityImage,
    name: 'Free Draw',
    description:
      'Artists share a canvas and may draw whatever they desire. This is an opportunity for artists to showcase their talent and creativity.',
    minArtistCount: 1,
    modeType: 'Relaxing',
    conceptCovered: 'Creativity',
    instructions: [
      'There are no rules!',
      'Enjoy drawing on the shared canvas with other artists or draw solo.',
    ],
    introduction:
      'Get ready to share a canvas with your fellow artists and draw whatever you like. There are no rules for this activity, so let your creativity shine!',
  },
  'art-collab': {
    imageSource: ActivityImage,
    name: 'Art Collab',
    description:
      "Artists are prompted with a scene to draw and must collaborate to complete it. Artists must work together and delegate tasks to efficiently create their masterpiece without stepping on each other's toes.",
    minArtistCount: 2,
    modeType: 'Relaxing',
    conceptCovered: 'Collaboration',
    instructions: [
      'Artists receive a prompt of something to draw.',
      'Artists must work together to complete the drawing efficiently.',
    ],
    introduction:
      'You must work with your fellow artists to complete a drawing based on the following prompt. Everyone shares the same canvas, so plan carefully!',
  },
  'con-artist': {
    imageSource: ActivityImage,
    name: 'Con Artist',
    description:
      'All but one artist are given a prompt to draw. Those who know the prompt must add to the drawing while the con artist attempts to fit in. After some time, everyone tries to vote out the con artist. If the majority agree on the correct identity of the con artist, they win. Otherwise, the con artist is the winner!',
    minArtistCount: 4,
    modeType: 'Competitive',
    conceptCovered: 'Problem-solving',
    instructions: [
      'Every artist except for the con artist is told the prompt.',
      'Artists must work together to complete the drawing while being careful not to reveal the prompt.',
      'After 5 minutes, if the majority of artists correctly vote on the identity of the con artist, they win!',
      'If the identity of the con artist remains unkown, they win!',
    ],
    introduction:
      'One of your rank is chosen as a con artist who is not given a prompt. The con artist must avoid suspicion by contributing to the drawing like everyone else. After 5 minutes, artists will attempt to vote out the con artist.',
  },
  'canvas-swap': {
    imageSource: ActivityImage,
    name: 'Canvas Swap',
    description:
      "Artists each start off with an individual canvas to draw whatever they like. Every few minutes, the canvases rotate so that each artist may continue the other's work.",
    minArtistCount: 2,
    modeType: 'Relaxing',
    conceptCovered: 'Teamwork',
    instructions: [
      'Every artist begins with their own individual canvas.',
      "Every 2 minutes, the canvases rotate and each artist is then meant to continue the other artists' work.",
      'The activity concludes once the drawings have completed a full cycle.',
    ],
    introduction:
      'In this activity, you begin with your own canvas and may draw whatever you like. However, every 2 minutes, you swap canvases with another artist and must continue their work.',
  },
  'art-dealer': {
    imageSource: ActivityImage,
    name: 'Art Dealer',
    description:
      "Artists are given a problem statement and must draw their solution to that problem. After some time, each artist is assigned the work of another and must give a 'sales pitch' of the solution to the other artists.",
    minArtistCount: 3,
    modeType: 'Humorous',
    conceptCovered: 'Critical Thinking',
    instructions: [
      'Every artist begins by drawing a solution to a problem.',
      'After 5 minutes, every artist is assigned the work of another artist.',
      "Each artist must make a 'sales pitch' to the other artists.",
      'In the end, the artist and art dealer with the most amount of votes wins!',
    ],
    introduction:
      "You must draw a solution to the following problem. After 5 minutes, you will be assigned the work of another artist and must give a 'sales pitch' of the idea to the other artists. Be creative!",
  },
};

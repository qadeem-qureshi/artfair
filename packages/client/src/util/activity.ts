import { Activity } from '@artfair/common';
import SampleActivityImage from '../assets/activity.jpg';

export const ACTIVITIES: Activity[] = ['free-draw', 'art-collab', 'con-artist', 'canvas-swap', 'art-dealer'];

export const DEFAULT_ACTIVITY: Activity = 'free-draw';

export interface ActivityInformation {
  name: string;
  description: string;
  imageSource: string;
  minArtistCount: number;
  modeType: string;
  conceptCovered: string;
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
  },
  'art-collab': {
    imageSource: SampleActivityImage,
    name: 'Art Collab',
    description:
      "Artists are prompted with a scene to draw and must collaborate to complete it. Artists must work together and delegate tasks to efficiently create their masterpiece without stepping on each other's toes.",
    minArtistCount: 2,
    modeType: 'Relaxing',
    conceptCovered: 'Collaboration',
  },
  'con-artist': {
    imageSource: SampleActivityImage,
    name: 'Con Artist',
    description:
      'All but one artist are given a prompt to draw. Artists take turns to draw a single, connected stroke. After three rounds, the artists must attempt to vote out the con artist.',
    minArtistCount: 4,
    modeType: 'Competitive',
    conceptCovered: 'Problem-solving',
  },
  'canvas-swap': {
    imageSource: SampleActivityImage,
    name: 'Canvas Swap',
    description:
      "Artists each start off with an individual canvas to draw whatever they like. After some time, the canvases rotate so that each artist may continue the other's work.",
    minArtistCount: 2,
    modeType: 'Relaxing',
    conceptCovered: 'Teamwork',
  },
  'art-dealer': {
    imageSource: SampleActivityImage,
    name: 'Art Dealer',
    description:
      "Each artist is given a problem and must draw their solution to that problem. After some time, each artist is presented with the work of another and must give a 'sales pitch' of the solution to the other artists.",
    minArtistCount: 3,
    modeType: 'Humorous',
    conceptCovered: 'Critical Thinking',
  },
};

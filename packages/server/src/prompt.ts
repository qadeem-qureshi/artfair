import { Activity } from '@artfair/common';

export const THINGS = [
  'A busy city street',
  'A messy classroom',
  'A petting zoo',
  'Our solar system',
  'An abandoned castle',
  'A large dinosaur',
  'A remote waterfall',
  'A giant sea monster',
  'A floating island',
  'A pirate ship',
  'A quaint cottage',
  'A cozy coffee shop',
  'A desert oasis',
  'An underwater cavern',
  'A bear\'s den',
  'A sinking ship',
  'A public park',
  'A time machine',
];

export const PROBLEMS = [
  'A way to cross a river',
  'A way to catch a raccoon',
  'A way to stay dry in rain',
  'A way to wake up on time',
  'A way to dry clothes quickly',
  'A way to mow a lawn',
  'A way to generate electricity',
  'A way to travel quickly',
  'A way to get to space',
  'A way to walk on water',
];

export const CON_ARTIST_PROMPT = 'YOU ARE THE CON ARTIST';

export const getRandomPrompt = (activity: Activity): string | undefined => {
  switch (activity) {
    case 'art-collab':
    case 'con-artist':
      return THINGS[Math.floor(Math.random() * THINGS.length)];
    case 'art-dealer':
      return PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    default:
      return undefined;
  }
};

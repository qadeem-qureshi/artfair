import React, { createContext, useContext, useReducer } from 'react';
import { PALETTES } from '../util/palette';

interface CanvasData {
  strokeColor: string;
  strokeThickness: number;
  canvasElement?: HTMLCanvasElement,
}

const DEFAULT_CANVAS_DATA: CanvasData = {
  strokeColor: PALETTES.WINTER[0],
  strokeThickness: 10,
};

type CanvasAction =
  | { type: 'set-stroke-color'; color: string }
  | { type: 'set-stroke-thickness'; thickness: number }
  | { type: 'set-canvas-element'; canvasElement: HTMLCanvasElement };

const CanvasReducer = (state: CanvasData, action: CanvasAction): CanvasData => {
  switch (action.type) {
    case 'set-stroke-color':
      return {
        ...state,
        strokeColor: action.color,
      };
    case 'set-stroke-thickness':
      return {
        ...state,
        strokeThickness: action.thickness,
      };
    case 'set-canvas-element':
      return {
        ...state,
        canvasElement: action.canvasElement,
      };
    default:
      throw new Error('Invalid action.');
  }
};

interface CanvasContextData {
  state: CanvasData;
  dispatch: React.Dispatch<CanvasAction>;
}

const CanvasContext = createContext<CanvasContextData | null>(null);

export const useCanvasContext = (): CanvasContextData => {
  const context = useContext(CanvasContext);
  if (context == null) throw new Error('Canvas context has not been initialized.');
  return context;
};

const CanvasContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(CanvasReducer, DEFAULT_CANVAS_DATA);
  return <CanvasContext.Provider value={{ state, dispatch }}>{children}</CanvasContext.Provider>;
};

export default CanvasContextProvider;

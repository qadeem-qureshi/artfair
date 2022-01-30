import { Color } from '@artfair/common';
import React, { createContext, useContext, useReducer } from 'react';
import { DEFAULT_STROKE_COLOR, DEFAULT_STROKE_THICKNESS } from '../util/stroke';

interface CanvasData {
  strokeColor: Color;
  strokeThickness: number;
  canvasElement?: HTMLCanvasElement,
}

const DEFAULT_CANVAS_DATA: CanvasData = {
  strokeColor: DEFAULT_STROKE_COLOR,
  strokeThickness: DEFAULT_STROKE_THICKNESS,
};

type CanvasAction =
  | { type: 'set-stroke-color'; color: Color }
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

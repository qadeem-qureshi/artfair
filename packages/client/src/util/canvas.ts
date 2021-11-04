import React from 'react';
import { Point } from '@artfair/common';

export const getCanvasPoint = (clientPoint: Point, canvasElement: HTMLCanvasElement): Point => {
  const rect = canvasElement.getBoundingClientRect();

  const scale = {
    x: canvasElement.width / rect.width,
    y: canvasElement.height / rect.height,
  };

  const canvasPoint = {
    x: (clientPoint.x - rect.left) * scale.x,
    y: (clientPoint.y - rect.top) * scale.y,
  };

  return canvasPoint;
};

export const getDistance = (a: Point, b: Point): number => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);

export const getClientPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point => ({ x: event.clientX, y: event.clientY });

export const areEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

import React from 'react';
import { Point, Segment, Stroke } from '@artfair/common';

export const getCanvasPoint = (
  clientPoint: Point,
  canvasElement: HTMLCanvasElement,
): Point => {
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

export const getClientPoint = (
  event: React.PointerEvent<HTMLCanvasElement>,
): Point => ({ x: event.clientX, y: event.clientY });

export const areEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const drawLine = (
  segment: Segment,
  color: string,
  thickness: number,
  context: CanvasRenderingContext2D,
): void => {
  context.beginPath();
  context.moveTo(segment.start.x, segment.start.y);
  context.lineTo(segment.end.x, segment.end.y);
  context.strokeStyle = color;
  context.lineWidth = thickness;
  context.stroke();
};

const drawCircle = (
  segment: Segment,
  color: string,
  thickness: number,
  context: CanvasRenderingContext2D,
): void => {
  context.beginPath();
  context.ellipse(
    segment.start.x,
    segment.start.y,
    thickness / 2,
    thickness / 2,
    0,
    0,
    Math.PI * 2,
  );
  context.fillStyle = color;
  context.fill();
};

export const drawStroke = (
  stroke: Stroke,
  context: CanvasRenderingContext2D,
): void => {
  stroke.segments.forEach((segment) => {
    if (areEqual(segment.start, segment.end)) {
      drawCircle(segment, stroke.color, stroke.thickness, context);
    } else {
      drawLine(segment, stroke.color, stroke.thickness, context);
    }
  });
};

export const clear = (context: CanvasRenderingContext2D): void => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const fill = (
  context: CanvasRenderingContext2D,
  color: string,
): void => {
  context.fillStyle = color;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
};

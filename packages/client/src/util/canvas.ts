import React from 'react';
import { Point } from '@artfair/common';
import { CurveSegment } from './interpolation';

export const getCanvasPoint = (
  event: React.PointerEvent<HTMLCanvasElement>,
  canvasElement: HTMLCanvasElement,
): Point => {
  const clientPoint: Point = {
    x: event.clientX,
    y: event.clientY,
  };

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

export const clear = (context: CanvasRenderingContext2D): void => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
};

export const fill = (context: CanvasRenderingContext2D, color: string): void => {
  context.save();
  context.fillStyle = color;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
};

export const drawCurveSegments = (
  context: CanvasRenderingContext2D,
  segments: CurveSegment[],
  color: string,
  thickness: number,
): void => {
  context.save();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = thickness;
  segments.forEach(({
    start, firstControl, secondControl, end,
  }) => {
    context.beginPath();
    if (!end) {
      context.ellipse(start.x, start.y, thickness / 2, thickness / 2, 0, 0, Math.PI * 2);
      context.fill();
    } else {
      context.moveTo(start.x, start.y);
      if (!firstControl && !secondControl) context.lineTo(end.x, end.y);
      else if (!firstControl && secondControl) {
        context.quadraticCurveTo(secondControl.x, secondControl.y, end.x, end.y);
      } else if (firstControl && !secondControl) {
        context.quadraticCurveTo(firstControl.x, firstControl.y, end.x, end.y);
      } else if (firstControl && secondControl) {
        context.bezierCurveTo(
          firstControl.x,
          firstControl.y,
          secondControl.x,
          secondControl.y,
          end.x,
          end.y,
        );
      }
      context.stroke();
    }
  });
  context.restore();
};

export const drawControls = (
  context: CanvasRenderingContext2D,
  segments: CurveSegment[],
  color: string,
  thickness: number,
): void => {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = thickness;
  segments.forEach(({
    start, firstControl, secondControl, end,
  }) => {
    context.beginPath();

    if (firstControl) {
      context.moveTo(start.x, start.y);
      context.lineTo(firstControl.x, firstControl.y);
    }

    if (secondControl && end) {
      context.moveTo(end.x, end.y);
      context.lineTo(secondControl.x, secondControl.y);
    }

    context.stroke();
  });
  context.restore();
};

export const drawPoints = (
  context: CanvasRenderingContext2D,
  segments: CurveSegment[],
  color: string,
  thickness: number,
): void => {
  context.save();
  context.fillStyle = color;
  segments.forEach(({ start }) => {
    context.beginPath();
    context.ellipse(start.x, start.y, thickness / 2, thickness / 2, 0, 0, Math.PI * 2);
    context.fill();
  });

  // Ensure final point is drawn
  if (segments.length) {
    const lastSegment = segments[segments.length - 1];
    if (lastSegment.end) {
      context.beginPath();
      context.ellipse(
        lastSegment.end.x,
        lastSegment.end.y,
        thickness / 2,
        thickness / 2,
        0,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }
  context.restore();
};

export const drawCursor = (
  context: CanvasRenderingContext2D,
  point: Point,
  color: string,
  thickness: number,
): void => {
  context.save();
  context.fillStyle = color;
  context.beginPath();
  context.ellipse(point.x, point.y, thickness / 2, thickness / 2, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
};

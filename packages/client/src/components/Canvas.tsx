import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { makeStyles } from '@material-ui/core';
import { Point, CanvasData } from '@team-2/common';
import clsx from 'clsx';
import socket from '../services/socket';
import {
  getCanvasPoint, getClientPoint, getDistance,
} from '../util/canvas';

const STROKE_RADIUS = 10;
const SEGMENT_SIZE = 5;

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
  },
});

export type CanvasProps = React.DetailedHTMLProps<React.CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;

const Canvas: React.FC<CanvasProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [lastPoint, setLastPoint] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    setContext(canvasElementRef.current?.getContext('2d'));
  }, []);

  useEffect(() => {
    if (!context) return;
    context.translate(0.5, 0.5);
    context.lineCap = 'round';
    context.lineWidth = STROKE_RADIUS * 2;
    context.strokeStyle = 'black';
    context.fillStyle = 'black';
  }, [context]);

  const beginStroke = useCallback((point: Point) => {
    if (!context) return;

    requestAnimationFrame(() => {
      context.ellipse(point.x, point.y, STROKE_RADIUS, STROKE_RADIUS, 0, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(point.x, point.y);
    });
  }, [context]);

  const extendStroke = useCallback((point: Point) => {
    if (!context) return;

    requestAnimationFrame(() => {
      context.lineTo(point.x, point.y);
      context.moveTo(point.x, point.y);
      context.stroke();
    });
  }, [context]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasElementRef.current) return;

    const currentPoint = getCanvasPoint(getClientPoint(event), canvasElementRef.current);
    setLastPoint(currentPoint);
    socket.emit('canvas_data', { startSegment: currentPoint, endSegment: currentPoint });
    beginStroke(currentPoint);
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return;

    handlePointerDown(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasElementRef.current || event.buttons !== 1) return;

    const currentPoint = getCanvasPoint(getClientPoint(event), canvasElementRef.current);
    const pointDelta = getDistance(lastPoint, currentPoint);

    if (pointDelta < SEGMENT_SIZE) return;
    socket.emit('canvas_data', { startSegment: lastPoint, endSegment: currentPoint });
    extendStroke(currentPoint);
    setLastPoint(currentPoint);
  };

  const handleRemoteData = useCallback((canvasData: CanvasData) => {
    if (!context) return;

    requestAnimationFrame(() => {
      beginStroke(canvasData.startSegment);
      if (canvasData.startSegment !== canvasData.endSegment) { extendStroke(canvasData.endSegment); }
    });
  }, [context, beginStroke, extendStroke]);

  useEffect(() => {
    socket.on('canvas_client_data', handleRemoteData);
  }, [handleRemoteData]);

  return (
    <canvas
      className={clsx(classes.root, className)}
      ref={canvasElementRef}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      {...rest}
    />
  );
};

export default Canvas;

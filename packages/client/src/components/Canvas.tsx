import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { makeStyles } from '@material-ui/core';
import { Dot, Point, StrokeSegment } from '@artfair/common';
import clsx from 'clsx';
import socket from '../services/socket';
import { getCanvasPoint, getClientPoint, getDistance } from '../util/canvas';
import { useAppContext } from './AppContextProvider';

const SEGMENT_SIZE = 5;

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
    backgroundColor: 'white',
  },
});

export type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const Canvas: React.FC<CanvasProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>();
  const [lastPoint, setLastPoint] = useState<Point>({ x: 0, y: 0 });
  const { state } = useAppContext();

  const drawSegment = useCallback(
    (segment: StrokeSegment) => {
      if (!context) return;

      requestAnimationFrame(() => {
        context.beginPath();
        context.moveTo(segment.start.x, segment.start.y);
        context.lineTo(segment.end.x, segment.end.y);
        context.strokeStyle = segment.color;
        context.lineWidth = segment.thickness;
        context.stroke();
      });
    },
    [context],
  );

  const drawDot = useCallback(
    (dot: Dot) => {
      if (!context) return;

      requestAnimationFrame(() => {
        context.beginPath();
        context.ellipse(
          dot.center.x,
          dot.center.y,
          dot.thickness / 2,
          dot.thickness / 2,
          0,
          0,
          Math.PI * 2,
        );
        context.fillStyle = dot.color;
        context.fill();
      });
    },
    [context],
  );

  const setupContext = useCallback(() => {
    if (!context) return;
    context.translate(0.5, 0.5);
    context.lineCap = 'round';
  }, [context]);

  useEffect(() => {
    setContext(canvasElementRef.current?.getContext('2d'));
  }, []);

  useEffect(() => {
    setupContext();
    socket.on('draw_segment', drawSegment);
    socket.on('draw_dot', drawDot);
  }, [setupContext, drawSegment, drawDot]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasElementRef.current) return;

    const currentPoint = getCanvasPoint(
      getClientPoint(event),
      canvasElementRef.current,
    );
    const dot: Dot = { center: currentPoint, color: state.color, thickness: state.thickness };
    drawDot(dot);
    socket.emit('draw_dot', dot);
    setLastPoint(currentPoint);
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return;

    handlePointerDown(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasElementRef.current || event.buttons !== 1) return;

    const currentPoint = getCanvasPoint(
      getClientPoint(event),
      canvasElementRef.current,
    );
    const pointDelta = getDistance(lastPoint, currentPoint);

    if (pointDelta < SEGMENT_SIZE) return;

    const segment: StrokeSegment = {
      start: lastPoint,
      end: currentPoint,
      color: state.color,
      thickness: state.thickness,
    };
    drawSegment(segment);
    socket.emit('draw_segment', segment);
    setLastPoint(currentPoint);
  };

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

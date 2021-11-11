import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { makeStyles } from '@material-ui/core';
import { Point, StrokeSegment } from '@artfair/common';
import clsx from 'clsx';
import socket from '../services/socket';
import {
  areEqual,
  getCanvasPoint,
  getClientPoint,
  getDistance,
} from '../util/canvas';
import { useAppContext } from './AppContextProvider';

const SEGMENT_SIZE = 5;
const TARGET_FRAMERATE = 60;

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
  const segmentsRef = useRef<StrokeSegment[]>([]);
  const [lastPoint, setLastPoint] = useState<Point>({ x: 0, y: 0 });
  const { state, dispatch } = useAppContext();

  const drawLine = useCallback(
    (segment: StrokeSegment) => {
      if (!state.context) return;
      state.context.beginPath();
      state.context.moveTo(segment.start.x, segment.start.y);
      state.context.lineTo(segment.end.x, segment.end.y);
      state.context.strokeStyle = segment.color;
      state.context.lineWidth = segment.thickness;
      state.context.stroke();
    },
    [state.context],
  );

  const drawCircle = useCallback(
    (segment: StrokeSegment) => {
      if (!state.context) return;
      state.context.beginPath();
      state.context.ellipse(
        segment.start.x,
        segment.start.y,
        segment.thickness / 2,
        segment.thickness / 2,
        0,
        0,
        Math.PI * 2,
      );
      state.context.fillStyle = segment.color;
      state.context.fill();
    },
    [state.context],
  );

  const clearCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      if (!state.context) return;
      state.context.fillStyle = 'white';
      state.context.fillRect(0, 0, state.context.canvas.width, state.context.canvas.height);
    });
  }, [state.context]);

  const updateCanvas = useCallback(() => {
    segmentsRef.current.forEach((segment) => {
      if (areEqual(segment.start, segment.end)) {
        drawCircle(segment);
      } else {
        drawLine(segment);
      }
    });
    segmentsRef.current = [];
  }, [drawCircle, drawLine]);

  const queueSegment = useCallback(
    (segment: StrokeSegment) => segmentsRef.current.push(segment),
    [],
  );

  useEffect(() => {
    const context = canvasElementRef.current?.getContext('2d');
    if (!context) return;
    dispatch({ type: 'set-context', context });
  }, [dispatch]);

  useEffect(() => {
    if (!state.context) return;
    state.context.lineCap = 'round';
    state.context.fillStyle = 'white';
    state.context.fillRect(0, 0, state.context.canvas.width, state.context.canvas.height);
    socket.on('draw_segment', queueSegment);
    socket.on('clear_canvas', clearCanvas);

    const timer = setInterval(
      () => requestAnimationFrame(updateCanvas),
      1000 / TARGET_FRAMERATE,
    );

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('draw_segment', queueSegment);
      socket.off('clear_canvas', clearCanvas);
      clearInterval(timer);
    };
  }, [queueSegment, clearCanvas, updateCanvas, state.context]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasElementRef.current) return;

    const currentPoint = getCanvasPoint(
      getClientPoint(event),
      canvasElementRef.current,
    );

    const segment: StrokeSegment = {
      start: currentPoint,
      end: currentPoint,
      color: state.color,
      thickness: state.thickness,
    };

    queueSegment(segment);
    socket.emit('draw_segment', segment);
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
    queueSegment(segment);
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

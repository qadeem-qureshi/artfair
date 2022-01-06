import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import {
  Point, StrokeBeginData, StrokeContinueData, StrokeEndData, Vector,
} from '@artfair/common';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { segmentize, simplify, split } from '../util/interpolation';
import { pointDistance } from '../util/math';
import socket from '../services/socket';
import {
  clear, drawCurveSegments, fill, getCanvasPoint, getClientPoint,
} from '../util/canvas';
import { useCanvasContext } from './CanvasContextProvider';

const MIN_SEGMENT_LENGTH = 2;
const MAX_SEGMENT_LENGTH = 12;
const TARGET_FRAMERATE = 60;
const SIMPLIFICATION_TOLERANCE = 2;
const SEGMENTS_UNTIL_SPLIT = 3;
const MAX_DYNAMIC_SEGMENTS_AFTER_SPLIT = 3;

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  paintingLayer: {
    zIndex: 0,
  },
  strokeLayer: {
    zIndex: 1,
  },
});

interface StrokeBuffer {
  color: string;
  thickness: number;
  points: Point[];
  tangent?: Vector;
  tension?: number;
  completed: boolean;
}

export interface CanvasProps extends BoxProps {
  resolution: number;
}

const Canvas: React.FC<CanvasProps> = ({ className, resolution, ...rest }) => {
  const classes = useStyles();

  // Canvas where strokes are rasterized
  const paintingCanvasElementRef = useRef<HTMLCanvasElement>(null);
  const [paintingContext, setPaintingContext] = useState<CanvasRenderingContext2D>();

  // Canvas where strokes are drawn during interpolation
  const strokeCanvasElementRef = useRef<HTMLCanvasElement>(null);
  const [strokeContext, setStrokeContext] = useState<CanvasRenderingContext2D>();

  // Map of strokes in progress
  const strokeBuffers = useRef<Map<string, StrokeBuffer>>(new Map<string, StrokeBuffer>());

  // Local stroke drawing data
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const { state, dispatch } = useCanvasContext();

  const clearCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      if (!paintingContext || !strokeContext) return;

      // Bottom canvas should be solid white
      fill(paintingContext, 'white');

      // Top canvas should be transparent
      clear(strokeContext);

      // Reset each buffer
      strokeBuffers.current.forEach((buffer) => {
        buffer.points = [];
        buffer.tangent = undefined;
        buffer.tension = undefined;
      });
    });
  }, [paintingContext, strokeContext]);

  const updateCanvas = useCallback(() => {
    if (!strokeContext || !paintingContext) return;

    // Clear top canvas because interpolation may change stroke
    clear(strokeContext);

    // Draw each stroke in progress
    strokeBuffers.current.forEach((buffer, strokeId) => {
      // Reduce noise in the raw stroke data
      const simplified = simplify(buffer.points, SIMPLIFICATION_TOLERANCE, MAX_SEGMENT_LENGTH);

      // Transform simplified points into cubic bezier segments to be drawn
      const segments = segmentize(simplified, buffer.tangent, buffer.tension);

      if (buffer.completed) {
        // Stroke is finished, so draw remaining segments to bottom canvas and delete the buffer
        drawCurveSegments(paintingContext, segments, buffer.color, buffer.thickness);
        strokeBuffers.current.delete(strokeId);
      } else if (segments.length > SEGMENTS_UNTIL_SPLIT) {
        // Stroke is long enough to be split into static and dynamic parts destined for the bottom and top canvases, respectively
        const {
          staticSegments, dynamicSegments, dynamicPoints, splitTangent, splitTension,
        } = split(segments, -MAX_DYNAMIC_SEGMENTS_AFTER_SPLIT);

        // Draw static segments on bottom canvas, because they are permanent
        drawCurveSegments(paintingContext, staticSegments, buffer.color, buffer.thickness);

        // Draw dynamic segments on top canvas, because they are subject to change
        drawCurveSegments(strokeContext, dynamicSegments, buffer.color, buffer.thickness);

        // Update the buffer
        buffer.points = dynamicPoints;
        buffer.tangent = splitTangent;
        buffer.tension = splitTension;
      } else {
        // Stroke is too short to be split, so all segments are considered dynamic and drawn to top canvas
        drawCurveSegments(strokeContext, segments, buffer.color, buffer.thickness);
      }
    });
  }, [paintingContext, strokeContext]);

  useEffect(() => {
    // Set canvas element
    const paintingCanvasElement = paintingCanvasElementRef.current;
    if (!paintingCanvasElement) return;

    // Store canvas so that toolbar may access it
    dispatch({
      type: 'set-canvas-element',
      canvasElement: paintingCanvasElement,
    });

    // Set up painting context
    const paintingCtx = paintingCanvasElement.getContext('2d');
    if (!paintingCtx) return;
    paintingCtx.lineCap = 'round';
    paintingCtx.lineJoin = 'round';
    fill(paintingCtx, 'white');
    setPaintingContext(paintingCtx);

    // Set stroke context
    const strokeCanvasElement = strokeCanvasElementRef.current;
    if (!strokeCanvasElement) return;
    const strokeCtx = strokeCanvasElement.getContext('2d');
    if (!strokeCtx) return;
    strokeCtx.lineCap = 'round';
    strokeCtx.lineJoin = 'round';
    setStrokeContext(strokeCtx);
  }, [dispatch]);

  // Create new stroke buffer
  const beginStroke = (strokeBeginData: StrokeBeginData) => {
    const buffer: StrokeBuffer = {
      color: strokeBeginData.strokeColor,
      thickness: strokeBeginData.strokeThickness,
      points: [strokeBeginData.point],
      completed: false,
    };
    strokeBuffers.current.set(strokeBeginData.strokeId, buffer);
  };

  // Add point to stroke
  const continueStroke = (strokeContinueData: StrokeContinueData) => {
    strokeBuffers.current.get(strokeContinueData.strokeId)?.points.push(strokeContinueData.point);
  };

  // Mark stroke buffer as completed
  const endStroke = (strokeEndData: StrokeEndData) => {
    const buffer = strokeBuffers.current.get(strokeEndData.strokeId);
    if (!buffer) return;
    buffer.points.push(strokeEndData.point);
    buffer.completed = true;
  };

  useEffect(() => {
    // Register event listeners
    socket.on('clear_canvas', clearCanvas);
    socket.on('begin_stroke', beginStroke);
    socket.on('continue_stroke', continueStroke);
    socket.on('end_stroke', endStroke);

    // Initialize render loop
    const timer = setInterval(() => requestAnimationFrame(updateCanvas), 1000 / TARGET_FRAMERATE);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('clear_canvas', clearCanvas);
      socket.off('begin_stroke', beginStroke);
      socket.off('continue_stroke', continueStroke);
      socket.off('end_stroke', endStroke);
      clearInterval(timer);
    };
  }, [clearCanvas, updateCanvas]);

  useEffect(() => {
    if (!state.canvasElement) return;
    state.canvasElement.addEventListener('clear', clearCanvas);
  }, [clearCanvas, state.canvasElement]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!strokeCanvasElementRef.current) return;
    const currentPoint = getCanvasPoint(getClientPoint(event), strokeCanvasElementRef.current);
    const strokeId = nanoid();
    const strokeBeginData: StrokeBeginData = {
      strokeId,
      strokeColor: state.strokeColor,
      strokeThickness: state.strokeThickness,
      point: currentPoint,
    };

    beginStroke(strokeBeginData);
    setCurrentStrokeId(strokeId);
    setLastPoint(currentPoint);

    socket.emit('begin_stroke', strokeBeginData);
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return;
    handlePointerDown(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!strokeCanvasElementRef.current || !lastPoint || event.buttons !== 1) return;
    const currentPoint = getCanvasPoint(getClientPoint(event), strokeCanvasElementRef.current);
    const pointDelta = pointDistance(lastPoint, currentPoint);
    if (pointDelta < MIN_SEGMENT_LENGTH) return;
    if (!currentStrokeId) return;
    const strokeContinueData: StrokeContinueData = {
      strokeId: currentStrokeId,
      point: currentPoint,
    };

    continueStroke(strokeContinueData);
    setLastPoint(currentPoint);

    socket.emit('continue_stroke', strokeContinueData);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!strokeCanvasElementRef.current || !lastPoint) return;
    const currentPoint = getCanvasPoint(getClientPoint(event), strokeCanvasElementRef.current);
    if (!currentStrokeId) return;
    const strokeEndData: StrokeEndData = {
      strokeId: currentStrokeId,
      point: currentPoint,
    };

    endStroke(strokeEndData);
    setCurrentStrokeId(null);
    setLastPoint(currentPoint);

    socket.emit('end_stroke', strokeEndData);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1) return;
    handlePointerUp(event);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <canvas
        className={clsx(classes.canvas, classes.paintingLayer)}
        ref={paintingCanvasElementRef}
        width={resolution}
        height={resolution}
      />
      <canvas
        className={clsx(classes.canvas, classes.strokeLayer)}
        ref={strokeCanvasElementRef}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
        width={resolution}
        height={resolution}
      />
    </Box>
  );
};

export default Canvas;

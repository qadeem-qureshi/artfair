import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import {
  Point,
  Stroke,
  StrokeBeginData,
  StrokeContinueData,
  StrokeEndData,
} from '@artfair/common';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import socket from '../services/socket';
import {
  clear,
  drawStroke,
  fill,
  getCanvasPoint,
  getClientPoint,
  getDistance,
} from '../util/canvas';
import { useCanvasContext } from './CanvasContextProvider';

const SEGMENT_SIZE = 5;
const TARGET_FRAMERATE = 60;

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

  const strokes = useRef<Map<string, Stroke>>(new Map<string, Stroke>());
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const { state, dispatch } = useCanvasContext();

  const clearCanvas = useCallback(() => {
    requestAnimationFrame(() => {
      if (!paintingContext || !strokeContext) return;
      fill(paintingContext, 'white');
      strokes.current.forEach((stroke) => {
        // eslint-disable-next-line no-param-reassign
        stroke.segments = [];
      });
    });
  }, [paintingContext, strokeContext]);

  const updateCanvas = useCallback(() => {
    if (!strokeContext) return;
    clear(strokeContext);
    strokes.current.forEach((stroke) => drawStroke(stroke, strokeContext));
  }, [strokeContext]);

  useEffect(() => {
    // Set canvas element
    const paintingCanvasElement = paintingCanvasElementRef.current;
    if (!paintingCanvasElement) return;
    dispatch({
      type: 'set-canvas-element',
      canvasElement: paintingCanvasElement,
    });

    // Set up painting context
    const paintingCtx = paintingCanvasElement.getContext('2d');
    if (!paintingCtx) return;
    paintingCtx.lineCap = 'round';
    fill(paintingCtx, 'white');
    setPaintingContext(paintingCtx);

    // Set stroke context
    const strokeCanvasElement = strokeCanvasElementRef.current;
    if (!strokeCanvasElement) return;
    const strokeCtx = strokeCanvasElement.getContext('2d');
    if (!strokeCtx) return;
    strokeCtx.lineCap = 'round';
    setStrokeContext(strokeCtx);
  }, [dispatch]);

  const beginStroke = (strokeBeginData: StrokeBeginData) => {
    const stroke: Stroke = {
      color: strokeBeginData.strokeColor,
      thickness: strokeBeginData.strokeThickness,
      segments: [strokeBeginData.segment],
    };
    strokes.current.set(strokeBeginData.strokeId, stroke);
  };

  const continueStroke = (strokeContinueData: StrokeContinueData) => {
    strokes.current
      .get(strokeContinueData.strokeId)
      ?.segments.push(strokeContinueData.segment);
  };

  const endStroke = useCallback(
    (strokeEndData: StrokeEndData) => {
      strokes.current
        .get(strokeEndData.strokeId)
        ?.segments.push(strokeEndData.segment);

      // Draw stroke to painting canvas before deleting it
      requestAnimationFrame(() => {
        if (!paintingContext) return;
        strokes.current.forEach((stroke) => drawStroke(stroke, paintingContext));
        strokes.current.delete(strokeEndData.strokeId);
      });
    },
    [paintingContext],
  );

  useEffect(() => {
    // Register event listeners
    socket.on('clear_canvas', clearCanvas);
    socket.on('begin_stroke', beginStroke);
    socket.on('continue_stroke', continueStroke);
    socket.on('end_stroke', endStroke);

    // Initialize render loop
    const timer = setInterval(
      () => requestAnimationFrame(updateCanvas),
      1000 / TARGET_FRAMERATE,
    );

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('clear_canvas', clearCanvas);
      socket.off('begin_stroke', beginStroke);
      socket.off('continue_stroke', continueStroke);
      socket.off('end_stroke', endStroke);
      clearInterval(timer);
    };
  }, [clearCanvas, endStroke, updateCanvas]);

  useEffect(() => {
    if (!state.canvasElement) return;
    state.canvasElement.addEventListener('clear', clearCanvas);
  }, [clearCanvas, state.canvasElement]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!strokeCanvasElementRef.current) return;

    const currentPoint = getCanvasPoint(
      getClientPoint(event),
      strokeCanvasElementRef.current,
    );

    const strokeId = nanoid();

    const strokeBeginData: StrokeBeginData = {
      strokeId,
      strokeColor: state.strokeColor,
      strokeThickness: state.strokeThickness,
      segment: { start: currentPoint, end: currentPoint },
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
    if (!strokeCanvasElementRef.current || !lastPoint || event.buttons !== 1) { return; }

    const currentPoint = getCanvasPoint(
      getClientPoint(event),
      strokeCanvasElementRef.current,
    );

    const pointDelta = getDistance(lastPoint, currentPoint);

    if (pointDelta < SEGMENT_SIZE) return;

    if (!currentStrokeId) return;

    const strokeContinueData: StrokeContinueData = {
      strokeId: currentStrokeId,
      segment: { start: lastPoint, end: currentPoint },
    };

    continueStroke(strokeContinueData);
    setLastPoint(currentPoint);

    socket.emit('continue_stroke', strokeContinueData);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!strokeCanvasElementRef.current || !lastPoint) return;

    const currentPoint = getCanvasPoint(
      getClientPoint(event),
      strokeCanvasElementRef.current,
    );

    if (!currentStrokeId) return;

    const strokeEndData: StrokeEndData = {
      strokeId: currentStrokeId,
      segment: { start: lastPoint, end: currentPoint },
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

import React, { useEffect, useRef } from 'react';
import { Box, BoxProps, makeStyles } from '@material-ui/core';
import {
  Color,
  Point,
  StrokeBeginData,
  StrokeContinueData,
  StrokeEndData,
  Vector,
} from '@artfair/common';
import clsx from 'clsx';
import { nanoid } from 'nanoid';
import { segmentize, simplify, split } from '../util/interpolation';
import { createPoint, pointDistance } from '../util/math';
import socket from '../services/socket';
import {
  clear,
  drawControls,
  drawCursor,
  drawCurveSegments,
  drawPoints,
  fill,
  getCanvasPoint,
} from '../util/canvas';
import { useCanvasContext } from './CanvasContextProvider';

const DEBUG_CONTROL_COLOR = '#4287f5';
const DEBUG_POINT_COLOR = '#42f56f';
const SHOW_DEBUG_GRAPHICS = false;
const MIN_SEGMENT_LENGTH = 2;
const MAX_SEGMENT_LENGTH = SHOW_DEBUG_GRAPHICS ? 200 : 12;
const SIMPLIFICATION_TOLERANCE = SHOW_DEBUG_GRAPHICS ? 30 : 2;
const SEGMENTS_UNTIL_SPLIT = 3;
const MAX_DYNAMIC_SEGMENTS_AFTER_SPLIT = 3;

const useStyles = makeStyles({
  root: {
    userSelect: 'none',
    touchAction: 'none',
    cursor: 'none',
    overflow: 'hidden',
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
  color: Color;
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
  const { state, dispatch } = useCanvasContext();

  /*
   * NOTE: We make extensive use of React references because we handle state changes by drawing to the canvas, not updating the DOM
   */

  // The static canvas is only cleared by user
  const staticCanvasElementRef = useRef<HTMLCanvasElement>(null);
  const staticCanvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  // The dynamic canvas is cleared every frame
  const dynamicCanvasElementRef = useRef<HTMLCanvasElement>(null);
  const dynamicCanvasContextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Map of strokes in progress
  const strokeBufferMapRef = useRef<Map<string, StrokeBuffer>>(
    new Map<string, StrokeBuffer>(),
  );

  // Local stroke drawing data
  const localStrokeIdRef = useRef<string | null>(null);
  const previousPointRef = useRef<Point | null>(null);

  // Cursor data
  const cursorPointRef = useRef<Point | null>(null);
  const cursorColorRef = useRef<string>(state.strokeColor);
  const cursorThicknessRef = useRef<number>(state.strokeThickness);

  const clearCanvas = () => {
    if (!staticCanvasContextRef.current || !dynamicCanvasContextRef.current) { return; }

    // Bottom canvas should be solid white
    fill(staticCanvasContextRef.current, 'white');

    // Top canvas should be transparent
    clear(dynamicCanvasContextRef.current);

    // Reset each buffer
    strokeBufferMapRef.current.forEach((buffer) => {
      buffer.points = [];
      buffer.tangent = undefined;
      buffer.tension = undefined;
    });
  };

  const updateCanvas = () => {
    if (!staticCanvasContextRef.current || !dynamicCanvasContextRef.current) { return; }

    // Clear top canvas because interpolation may change stroke
    clear(dynamicCanvasContextRef.current);

    // Draw each stroke in progress
    strokeBufferMapRef.current.forEach((buffer, strokeId) => {
      // Reduce noise in the raw stroke data
      const simplified = simplify(
        buffer.points,
        SIMPLIFICATION_TOLERANCE,
        MAX_SEGMENT_LENGTH,
      );

      // Transform simplified points into cubic bezier segments to be drawn
      const segments = segmentize(simplified, buffer.tangent, buffer.tension);

      if (buffer.completed) {
        // Stroke is finished, so draw remaining segments to bottom canvas and delete the buffer
        drawCurveSegments(
          staticCanvasContextRef.current!,
          segments,
          buffer.color,
          buffer.thickness,
        );
        strokeBufferMapRef.current.delete(strokeId);
      } else if (segments.length > SEGMENTS_UNTIL_SPLIT) {
        // Stroke is long enough to be split into static and dynamic parts destined for the bottom and top canvases, respectively
        const {
          staticSegments,
          dynamicSegments,
          dynamicPoints,
          splitTangent,
          splitTension,
        } = split(segments, -MAX_DYNAMIC_SEGMENTS_AFTER_SPLIT);

        // Draw static segments on bottom canvas, because they are permanent
        drawCurveSegments(
          staticCanvasContextRef.current!,
          staticSegments,
          buffer.color,
          buffer.thickness,
        );

        // Draw dynamic segments on top canvas, because they are subject to change
        drawCurveSegments(
          dynamicCanvasContextRef.current!,
          dynamicSegments,
          buffer.color,
          buffer.thickness,
        );

        if (SHOW_DEBUG_GRAPHICS) {
          drawControls(
            dynamicCanvasContextRef.current!,
            dynamicSegments,
            DEBUG_CONTROL_COLOR,
            buffer.thickness,
          );
          drawPoints(
            dynamicCanvasContextRef.current!,
            dynamicSegments,
            DEBUG_POINT_COLOR,
            buffer.thickness,
          );
        }

        // Update the buffer
        buffer.points = dynamicPoints;
        buffer.tangent = splitTangent;
        buffer.tension = splitTension;
      } else {
        // Stroke is too short to be split, so all segments are considered dynamic and drawn to top canvas
        drawCurveSegments(
          dynamicCanvasContextRef.current!,
          segments,
          buffer.color,
          buffer.thickness,
        );

        if (SHOW_DEBUG_GRAPHICS) {
          drawControls(
            dynamicCanvasContextRef.current!,
            segments,
            DEBUG_CONTROL_COLOR,
            buffer.thickness,
          );
          drawPoints(
            dynamicCanvasContextRef.current!,
            segments,
            DEBUG_POINT_COLOR,
            buffer.thickness,
          );
        }
      }
    });

    // Draw cursor to top canvas so its gets updated each frame
    if (cursorPointRef.current) {
      drawCursor(
        dynamicCanvasContextRef.current,
        cursorPointRef.current,
        cursorColorRef.current,
        cursorThicknessRef.current,
      );
    }
  };

  // Put static canvas element in context
  useEffect(() => {
    dispatch({
      type: 'set-canvas-element',
      canvasElement: staticCanvasElementRef.current!,
    });
  }, [dispatch]);

  // Update cursor color
  useEffect(() => {
    cursorColorRef.current = state.strokeColor;
  }, [state.strokeColor]);

  // Update cursor thickness
  useEffect(() => {
    cursorThicknessRef.current = state.strokeThickness;
  }, [state.strokeThickness]);

  // Set up static canvas context
  useEffect(() => {
    const context = staticCanvasElementRef.current!.getContext('2d')!;
    staticCanvasContextRef.current = context;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    fill(context, 'white');
  }, []);

  // Set up dynamic canvas context
  useEffect(() => {
    const context = dynamicCanvasElementRef.current!.getContext('2d')!;
    dynamicCanvasContextRef.current = context;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    clear(context);
  }, []);

  // Create new stroke buffer
  const beginStroke = (strokeBeginData: StrokeBeginData) => {
    const buffer: StrokeBuffer = {
      color: strokeBeginData.strokeColor,
      thickness: strokeBeginData.strokeThickness,
      points: [strokeBeginData.point],
      completed: false,
    };
    strokeBufferMapRef.current.set(strokeBeginData.strokeId, buffer);
  };

  // Add point to stroke
  const continueStroke = (strokeContinueData: StrokeContinueData) => {
    strokeBufferMapRef.current
      .get(strokeContinueData.strokeId)
      ?.points.push(strokeContinueData.point);
  };

  // Mark stroke buffer as completed
  const endStroke = (strokeEndData: StrokeEndData) => {
    const buffer = strokeBufferMapRef.current.get(strokeEndData.strokeId);
    if (buffer) {
      buffer.points.push(strokeEndData.point);
      buffer.completed = true;
    }
  };

  // Initialize render loop
  useEffect(() => {
    // Keep track of request ID so that it may be cancelled
    let requestId: number | null = null;

    // The browser will update at the appropriate rate
    const renderLoop = () => {
      updateCanvas();
      requestId = requestAnimationFrame(renderLoop);
    };

    // Start rendering
    requestId = requestAnimationFrame(renderLoop);

    // Cancel the last request when the component unmounts
    return () => {
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, []);

  useEffect(() => {
    // Register event listeners
    const canvasElement = staticCanvasElementRef.current!;
    canvasElement.addEventListener('clear', clearCanvas);
    socket.on('clear_canvas', clearCanvas);
    socket.on('begin_stroke', beginStroke);
    socket.on('continue_stroke', continueStroke);
    socket.on('end_stroke', endStroke);

    // Remove event listeners
    return () => {
      canvasElement.removeEventListener('clear', clearCanvas);
      socket.off('clear_canvas', clearCanvas);
      socket.off('begin_stroke', beginStroke);
      socket.off('continue_stroke', continueStroke);
      socket.off('end_stroke', endStroke);
    };
  }, []);

  useEffect(() => {
    if (!state.canvasElement) return;
    state.canvasElement.addEventListener('clear', clearCanvas);
  }, [state.canvasElement]);

  const getCurrentPoint = (clientX: number, clientY: number) => {
    const clientPoint = createPoint(clientX, clientY);
    const currentPoint = getCanvasPoint(
      clientPoint,
      dynamicCanvasElementRef.current!,
    );
    return currentPoint;
  };

  const handleBrushDown = (point: Point) => {
    const strokeId = nanoid();
    const strokeBeginData: StrokeBeginData = {
      strokeId,
      strokeColor: state.strokeColor,
      strokeThickness: state.strokeThickness,
      point,
    };
    beginStroke(strokeBeginData);
    localStrokeIdRef.current = strokeId;
    previousPointRef.current = point;
    socket.emit('begin_stroke', strokeBeginData);
  };

  const handleBrushMove = (point: Point) => {
    if (localStrokeIdRef.current) {
      if (previousPointRef.current) {
        const pointDelta = pointDistance(previousPointRef.current, point);
        if (pointDelta >= MIN_SEGMENT_LENGTH) {
          const strokeContinueData: StrokeContinueData = {
            strokeId: localStrokeIdRef.current,
            point,
          };
          continueStroke(strokeContinueData);
          previousPointRef.current = point;
          socket.emit('continue_stroke', strokeContinueData);
        }
      }
    }
  };

  const handleBrushUp = (point: Point) => {
    if (localStrokeIdRef.current) {
      const strokeEndData: StrokeEndData = {
        strokeId: localStrokeIdRef.current,
        point,
      };
      endStroke(strokeEndData);
      localStrokeIdRef.current = null;
      previousPointRef.current = null;
      socket.emit('end_stroke', strokeEndData);
    }
  };

  const handleCursorDown = (point: Point) => {
    cursorPointRef.current = point;
  };

  const handleCursorMove = (point: Point) => {
    if (!localStrokeIdRef.current) {
      cursorPointRef.current = point;
    }
  };

  const handleCursorUp = () => {
    cursorPointRef.current = null;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    handleCursorUp();
    handleBrushDown(getCurrentPoint(event.clientX, event.clientY));
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLCanvasElement>) => {
    handleCursorDown(getCurrentPoint(event.clientX, event.clientY));
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const currentPoint = getCurrentPoint(event.clientX, event.clientY);
    handleCursorMove(currentPoint);
    handleBrushMove(currentPoint);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const currentPoint = getCurrentPoint(event.clientX, event.clientY);
    handleBrushUp(currentPoint);
    handleCursorDown(currentPoint);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLCanvasElement>) => {
    handleBrushUp(getCurrentPoint(event.clientX, event.clientY));
    handleCursorUp();
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ) => {
    const currentPoint = getCurrentPoint(event.clientX, event.clientY);
    handleBrushUp(currentPoint);
    handleCursorDown(currentPoint);
  };

  return (
    <Box className={clsx(classes.root, className)} {...rest}>
      <canvas
        className={clsx(classes.canvas, classes.paintingLayer)}
        ref={staticCanvasElementRef}
        width={resolution}
        height={resolution}
      />
      <canvas
        className={clsx(classes.canvas, classes.strokeLayer)}
        ref={dynamicCanvasElementRef}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
        onContextMenu={handleContextMenu}
        width={resolution}
        height={resolution}
      />
    </Box>
  );
};

export default Canvas;

import { Point, Vector } from '@artfair/common';
import {
  pointDistance,
  dot,
  pointDifference,
  pointVectorSum,
  scale,
  normalize,
  pointVectorDifference,
  pointsAreEqual,
} from './math';

export interface CurveSegment {
  start: Point;
  firstControl?: Point;
  secondControl?: Point;
  end?: Point;
}

export interface SplitResult {
  staticSegments: CurveSegment[];
  dynamicSegments: CurveSegment[];
  dynamicPoints: Point[];
  splitTangent?: Vector;
  splitTension?: number;
}

// Return minimum distance between a point and given segment (start -> end)
const distanceToSegment = (point: Point, start: Point, end: Point): number => {
  const segmentVector = pointDifference(end, start);
  const vectorToPoint = pointDifference(point, start);
  const squaredLength = dot(segmentVector, segmentVector);
  const parameter = Math.max(0, Math.min(1, dot(vectorToPoint, segmentVector) / squaredLength));
  const projection = pointVectorSum(start, scale(segmentVector, parameter));
  return pointDistance(point, projection);
};

// Return whether three points are close enough to being considered colinear
const areNearlyColinear = (p: Point, q: Point, r: Point, tolerance: number): boolean => distanceToSegment(q, p, r) < tolerance;

// Return a value between 0 and 1 representing the tension in a flexible rod when bent at the angle formed by three points
const getTensionAtJoint = (p: Point, q: Point, r: Point): number => {
  const u = normalize(pointDifference(p, q));
  const v = normalize(pointDifference(r, q));

  // The dot product of two normalized vectors is equivalent to the cosine of the angle between them, so we map cosine from the range [-1, 1] to the range [0, 1]
  return (dot(u, v) + 1) / 2;
};

// Return the points that make up a series of curve segments
const getPointsFromSegments = (segments: CurveSegment[]): Point[] => {
  const points: Point[] = [];
  segments.forEach((segment, index) => {
    points.push(segment.start);

    // Make sure to include final endpoint
    if (index === segments.length - 1) {
      const lastSegment = segments[segments.length - 1];
      if (lastSegment.end) {
        points.push(lastSegment.end);
      }
    }
  });
  return points;
};

// Reduce the given path of points to a similar one with fewer points
export const simplify = (points: Point[], tolerance: number, maxSeparation: number): Point[] => {
  const simplified: Point[] = [];
  let anchor;
  for (let n = 0; n < points.length; n += 1) {
    const current = points[n];
    const next = points[n + 1];
    if (
      !anchor
      || ((!next || !areNearlyColinear(anchor, current, next, tolerance))
        && !pointsAreEqual(anchor, current))
      || pointDistance(anchor, current) > maxSeparation
    ) {
      anchor = current;
      simplified.push(current);
    }
  }
  return simplified;
};

// Construct cubic bezier curve segments out of the given points
export const segmentize = (
  points: Point[],
  startingTangent?: Vector,
  startingTension?: number,
): CurveSegment[] => {
  // If there is only one point, just return a dot
  if (points.length === 1) return [{ start: points[0] }];

  // Initialize starting tangent and tension, if they are given
  let tangent = startingTangent;
  let tension = startingTension || 0;
  const segments: CurveSegment[] = [];

  /*
   * To make a smooth, continous cubic bezier spline, we must ensure that the second control point of one segment and
   * the first control point of the next segment are colinear with their shared point. To do so, we compute the tangent
   * at each point as the normalized vector between the next point and the previous first control point. We use the
   * first control point rather than the starting point of the first segment to prevent the curve from jumping while
   * drawing. The distance between a point and its surrounding control points is based off one-third the length of the
   * corresponding segment and the tension at that point, which is determined using the angle formed by that point and
   * its neighbors. A segment with only the starting point represents a dot, a segment with a starting and ending point
   * but no control points represents a line, a segment with a starting, ending, only one control point represent a
   * quadratic bezier curve, and a segment with starting, ending, and both control points represents a cubic bezier curve.
   */
  for (let n = 0; n < points.length - 1; n += 1) {
    const p0 = points[n];
    const p1 = points[n + 1];
    const p2 = points[n + 2];
    const d = pointDistance(p1, p0);
    const c0 = tangent && pointVectorSum(p0, scale(tangent, (d / 3) * (1 - tension)));
    tension = p2 ? getTensionAtJoint(p0, p1, p2) : tension;
    tangent = p2 ? normalize(pointDifference(p2, c0 || p0)) : tangent;
    const c1 = p2 && tangent && pointVectorDifference(p1, scale(tangent, (d / 3) * (1 - tension)));
    segments.push({
      start: p0,
      firstControl: c0,
      secondControl: c1,
      end: p1,
    });
  }
  return segments;
};

// Divide segments into static and dynamic parts for optimized rendering.
export const split = (segments: CurveSegment[], index: number): SplitResult => {
  const staticSegments = segments.slice(0, index);
  const dynamicSegments = segments.slice(index);

  // All static-only points may be discarded
  const dynamicPoints = getPointsFromSegments(dynamicSegments);

  // Compute the tangent vector and tension at the split point so that future segments may connect smoothly
  let splitTangent;
  let splitTension;
  if (dynamicSegments.length) {
    // Determine the tangent vector if it exists
    const dynamicSegment = dynamicSegments[0];
    if (dynamicSegment.firstControl) {
      splitTangent = normalize(pointDifference(dynamicSegment.firstControl, dynamicSegment.start));
    }
    // Determine the tension at the split point if it exists
    if (staticSegments.length) {
      const staticSegment = staticSegments[staticSegments.length - 1];
      if (dynamicSegment.end) {
        splitTension = getTensionAtJoint(
          staticSegment.start,
          dynamicSegment.start,
          dynamicSegment.end,
        );
      }
    }
  }

  return {
    staticSegments,
    dynamicSegments,
    dynamicPoints,
    splitTangent,
    splitTension,
  };
};

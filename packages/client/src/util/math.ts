import { Point, Vector } from '@artfair/common';

// Adjust modulo to return correct value for negative inputs
export const modulo = (m: number, n: number): number => ((m % n) + n) % n;

export const createPoint = (x: number, y: number): Point => ({ x, y });

export const createVector = (x: number, y: number): Vector => ({ x, y });

export const pointDistance = (p: Point, q: Point): number => Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2);

export const pointsAreEqual = (p: Point, q: Point): boolean => p.x === q.x && p.y === q.y;

export const vectorsAreEqual = (v: Point, w: Point): boolean => v.x === w.x && v.y === w.y;

export const isZeroPoint = (p: Point): boolean => p.x === 0 && p.y === 0;

export const isZeroVector = (v: Vector): boolean => v.x === 0 && v.y === 0;

export const midpoint = (p: Point, q: Point): Point => createPoint((p.x + q.x) / 2, (p.y + q.y) / 2);

export const dot = (v: Vector, w: Vector): number => v.x * w.x + v.y * w.y;

export const length = (v: Vector): number => Math.sqrt(dot(v, v));

export const scale = (v: Vector, scalar: number): Vector => createVector(v.x * scalar, v.y * scalar);

export const normalize = (v: Vector): Vector => (isZeroVector(v) ? createVector(0, 0) : scale(v, 1 / length(v)));

export const pointDifference = (p: Point, q: Point): Vector => createVector(p.x - q.x, p.y - q.y);

export const vectorDifference = (v: Vector, w: Vector): Vector => createVector(v.x - w.x, v.y - w.y);

export const pointVectorDifference = (p: Point, w: Vector): Point => createPoint(p.x - w.x, p.y - w.y);

export const vectorSum = (v: Vector, w: Vector): Vector => createVector(v.x + w.x, v.y + w.y);

export const pointVectorSum = (p: Point, w: Vector): Point => createPoint(p.x + w.x, p.y + w.y);

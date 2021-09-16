import React from 'react';

export type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
>;

const Canvas: React.FC<CanvasProps> = (props) => <canvas {...props} />;

export default Canvas;

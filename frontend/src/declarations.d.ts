declare module '*.css';
declare module '*.svg';
declare module 'react-simple-maps';
declare module "d3-scale";

declare module '*.svg?react' {
  import * as React from 'react';

  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  export default ReactComponent;
}
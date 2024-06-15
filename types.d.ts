declare module "react-shimmer-effects";

declare module "react-media-capture";

declare module "@aws-sdk/client-s3";

declare module "@aws-sdk/client-rekognition";

declare module "@aws-sdk/client-cognito-identity";

declare module "@aws-sdk/credential-provider-cognito-identity";

declare module 'quagga';

declare module 'crypto-js';

declare module "fast-speedtest-api";

declare module "speed-test";

declare module "ml5";

declare module "pixelmatch";

declare module "pngjs";

declare module "p5" {
  export = p5;

  class p5 {
    setup: () => void;
    draw: () => void;
    mousePressed: () => void;
    frameCount: number;
    constructor(sketch: (p: p5) => void, node?: HTMLElement | string);
    createCanvas(width: number, height: number): p5.Renderer;
    createCapture(type: string): p5.Element;
    VIDEO: string;
    image(
      img: p5.Image,
      x: number,
      y: number,
      width?: number,
      height?: number
    ): void;
    get(x?: number, y?: number, w?: number, h?: number): p5.Image;
    noFill(): void;
    stroke(r: number, g: number, b: number): void;
    rect(x: number, y: number, w: number, h: number): void;
  }

  namespace p5 {
    interface Image {
      canvas: any;
      loadPixels(): void;
      pixels: number[];
      width: number;
      height: number;
    }
    interface Renderer {
      elt: HTMLCanvasElement;
      parent(arg0: HTMLDivElement): Renderer | null;
    }
    interface Element {
      size(width: number, height: number): void;
      hide(): void;
      elt: HTMLVideoElement;
    }
  }
}

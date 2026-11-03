declare module 'dom-to-image-more' {
  export interface Options {
    quality?: number;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    [key: string]: any;
  }

  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
  export function downloadJpeg(node: HTMLElement, options?: Options): void;
  export function downloadPng(node: HTMLElement, options?: Options): void;
}

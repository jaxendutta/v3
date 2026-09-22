declare module "gifuct-js" {
    export interface ParsedFrame {
        dims: { top: number; left: number; width: number; height: number };
        patch: Uint8ClampedArray;
        delay: number;
        disposalType: number;
        transparentIndex?: number;
    }
    export interface ParsedGif {
        lsd: { width: number; height: number };
        frames: ParsedFrame[];
    }
    export function parseGIF(buffer: ArrayBuffer | ArrayBufferView): ParsedGif;
    export function decompressFrames(gif: ParsedGif, buildImagePatches: boolean): ParsedFrame[];
}

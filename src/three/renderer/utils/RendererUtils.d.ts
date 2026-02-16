import { WebGLRenderer, Renderer } from 'three';

/**
 * Check if the given renderer is a WebGPU renderer.
 *
 * @param renderer - The renderer to check
 * @returns True if the renderer is a WebGPU renderer
 */
export function isWebGPURenderer( renderer: WebGLRenderer | Renderer | null | undefined ): boolean;

/**
 * Get the maximum 3D texture size supported by the renderer.
 *
 * @param renderer - The renderer to query
 * @returns The maximum 3D texture size
 */
export function getMax3DTextureSize( renderer: WebGLRenderer | Renderer | null | undefined ): number;

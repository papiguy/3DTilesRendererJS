import { WebGLRenderer, Renderer, Texture, RenderTarget } from 'three';

export interface TextureReadUtilityInterface {
	target: RenderTarget | null;
	dispose(): void;
	readDataAsync( renderer: WebGLRenderer | Renderer, texture: Texture ): Promise<Uint8Array>;
}

/**
 * Get or create a TextureReadUtility for the given renderer.
 * Uses WeakMap caching to ensure one utility per renderer.
 *
 * @param renderer - The renderer to get the utility for (WebGLRenderer or WebGPURenderer)
 * @returns The TextureReadUtility instance for the renderer
 */
export function getTextureReadUtility(
	renderer: WebGLRenderer | Renderer
): TextureReadUtilityInterface;

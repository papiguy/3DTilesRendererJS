import { Material, WebGLRenderer, Renderer, IUniform } from 'three';

export interface FadeParams {
	fadeIn: IUniform<number>;
	fadeOut: IUniform<number>;
	fadeTexture: IUniform<any>;
}

/**
 * Factory function to create fade-wrapped materials that work with both
 * WebGL and WebGPU renderers.
 *
 * @param material - The material to wrap with fade support
 * @param renderer - The renderer being used (WebGLRenderer or WebGPURenderer)
 * @param previousOnBeforeCompile - Optional previous onBeforeCompile callback to chain
 * @returns The fade parameters object with fadeIn, fadeOut, and fadeTexture uniforms
 */
export function createFadeMaterial(
	material: Material,
	renderer: WebGLRenderer | Renderer | null | undefined,
	previousOnBeforeCompile?: ( ( shader: any ) => void ) | null
): FadeParams;

/**
 * Check if a material has already been wrapped with fade support.
 *
 * @param material - The material to check
 * @returns True if the material has fade support
 */
export function hasFadeSupport( material: Material ): boolean;

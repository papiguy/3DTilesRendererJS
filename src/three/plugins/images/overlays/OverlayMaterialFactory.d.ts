import { Material, WebGLRenderer, Renderer, IUniform } from 'three';

export interface OverlayParams {
	layerMaps: IUniform<any[]>;
	layerInfo: IUniform<any[]>;
}

/**
 * Factory function to create overlay-wrapped materials that work with both
 * WebGL and WebGPU renderers.
 *
 * @param material - The material to wrap with overlay support
 * @param renderer - The renderer being used (WebGLRenderer or WebGPURenderer)
 * @param previousOnBeforeCompile - Optional previous onBeforeCompile callback to chain
 * @returns The overlay parameters object with layerMaps and layerInfo uniforms
 */
export function createOverlayMaterial(
	material: Material,
	renderer: WebGLRenderer | Renderer | null | undefined,
	previousOnBeforeCompile?: ( ( shader: any ) => void ) | null
): OverlayParams;

/**
 * Check if a material has already been wrapped with overlay support.
 *
 * @param material - The material to check
 * @returns True if the material has overlay support
 */
export function hasOverlaySupport( material: Material ): boolean;

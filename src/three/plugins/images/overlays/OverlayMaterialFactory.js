import { wrapOverlaysMaterial } from './wrapOverlaysMaterial.js';

/**
 * Factory function to create overlay-wrapped materials that work with both
 * WebGL and WebGPU renderers.
 *
 * @param {import('three').Material} material - The material to wrap with overlay support
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer - The renderer being used
 * @param {Function} [previousOnBeforeCompile] - Optional previous onBeforeCompile callback to chain
 * @returns {Object} The overlay parameters object with layerMaps and layerInfo uniforms
 */
export function createOverlayMaterial( material, renderer, previousOnBeforeCompile = null ) {

	// Keep a single stable shader transform path for both backends.
	// The WebGPU-specific WGSL string patching is fragile with generated shader layouts.
	void renderer;
	return wrapOverlaysMaterial( material, previousOnBeforeCompile );

}

/**
 * Check if a material has already been wrapped with overlay support.
 *
 * @param {import('three').Material} material - The material to check
 * @returns {boolean} True if the material has overlay support
 */
export function hasOverlaySupport( material ) {

	return Object.getOwnPropertySymbols( material ).some( sym => {

		const desc = sym.description;
		return desc === 'OVERLAY_PARAMS' || desc === 'OVERLAY_PARAMS_WEBGPU';

	} );

}

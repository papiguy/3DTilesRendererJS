import { wrapFadeMaterial } from './wrapFadeMaterial.js';

/**
 * Factory function to create fade-wrapped materials that work with both
 * WebGL and WebGPU renderers.
 *
 * @param {import('three').Material} material - The material to wrap with fade support
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer - The renderer being used
 * @param {Function} [previousOnBeforeCompile] - Optional previous onBeforeCompile callback to chain
 * @returns {Object} The fade parameters object with fadeIn, fadeOut, and fadeTexture uniforms
 */
export function createFadeMaterial( material, renderer, previousOnBeforeCompile = null ) {

	// Keep a single stable shader transform path for both backends.
	// The WebGPU-specific string-based WGSL patching is not reliable across Three.js shader output.
	void renderer;
	return wrapFadeMaterial( material, previousOnBeforeCompile );

}

/**
 * Check if a material has already been wrapped with fade support.
 *
 * @param {import('three').Material} material - The material to check
 * @returns {boolean} True if the material has fade support
 */
export function hasFadeSupport( material ) {

	return Object.getOwnPropertySymbols( material ).some( sym => {

		const desc = sym.description;
		return desc === 'FADE_PARAMS' || desc === 'FADE_PARAMS_WEBGPU';

	} );

}

import { isWebGPURenderer } from '../../../../renderer/utils/RendererUtils.js';
import { TextureReadUtility as TextureReadUtilityWebGL } from './TextureReadUtility.js';
import { createTextureReadUtilityWebGPU } from './TextureReadUtility.webgpu.js';

/**
 * Factory for creating TextureReadUtility instances that work with both
 * WebGL and WebGPU renderers.
 *
 * For WebGL: Uses the lazy-initialized singleton from TextureReadUtility.js
 * For WebGPU: Creates a new instance per renderer since WebGPU requires
 *             the renderer to be passed in for proper GPU resource management
 */

// Cache for WebGPU texture read utilities keyed by renderer
const _webgpuUtilityCache = new WeakMap();

/**
 * Get or create a TextureReadUtility for the given renderer.
 *
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer - The renderer
 * @returns {Object} A TextureReadUtility instance compatible with the renderer
 */
export function getTextureReadUtility( renderer ) {

	if ( ! renderer ) {

		// Fallback to WebGL singleton when no renderer provided
		return TextureReadUtilityWebGL;

	}

	if ( isWebGPURenderer( renderer ) ) {

		// Check cache first
		if ( _webgpuUtilityCache.has( renderer ) ) {

			return _webgpuUtilityCache.get( renderer );

		}

		// Create new WebGPU utility and cache it
		const utility = createTextureReadUtilityWebGPU( renderer );
		_webgpuUtilityCache.set( renderer, utility );
		return utility;

	}

	// WebGL uses the lazy-initialized singleton
	return TextureReadUtilityWebGL;

}

/**
 * Dispose of a cached WebGPU TextureReadUtility.
 *
 * @param {import('three/webgpu').WebGPURenderer} renderer - The WebGPU renderer
 */
export function disposeTextureReadUtility( renderer ) {

	if ( _webgpuUtilityCache.has( renderer ) ) {

		const utility = _webgpuUtilityCache.get( renderer );
		if ( utility.dispose ) {

			utility.dispose();

		}

		_webgpuUtilityCache.delete( renderer );

	}

}

// Re-export the WebGL singleton for backward compatibility
export { TextureReadUtilityWebGL as TextureReadUtility };

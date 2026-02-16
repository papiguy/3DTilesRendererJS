/**
 * Utility functions for detecting renderer type and querying capabilities.
 * Supports both WebGLRenderer and WebGPURenderer from Three.js.
 */

/**
 * Check if the given renderer is a WebGPU renderer.
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer
 * @returns {boolean}
 */
export function isWebGPURenderer( renderer ) {

	return renderer?.isWebGPURenderer === true;

}

/**
 * Check if the given renderer is a WebGL renderer.
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer
 * @returns {boolean}
 */
export function isWebGLRenderer( renderer ) {

	return renderer?.isWebGLRenderer === true;

}

/**
 * Get the maximum number of array texture layers supported by the renderer.
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer
 * @returns {number}
 */
export function getMaxArrayTextureLayers( renderer ) {

	if ( ! renderer ) {

		return 2048;

	}

	if ( isWebGPURenderer( renderer ) ) {

		// WebGPU: Access device limits
		// The limit is available after the device is initialized
		return renderer.backend?.device?.limits?.maxTextureArrayLayers ?? 2048;

	}

	// WebGL: Query GL context parameter
	const gl = renderer.getContext();
	return gl.getParameter( gl.MAX_3D_TEXTURE_SIZE );

}

/**
 * Get the maximum texture dimension supported by the renderer.
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer
 * @returns {number}
 */
export function getMaxTextureSize( renderer ) {

	if ( ! renderer ) {

		return 8192;

	}

	if ( isWebGPURenderer( renderer ) ) {

		return renderer.backend?.device?.limits?.maxTextureDimension2D ?? 8192;

	}

	const gl = renderer.getContext();
	return gl.getParameter( gl.MAX_TEXTURE_SIZE );

}

/**
 * Get the maximum 3D texture dimension supported by the renderer.
 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer
 * @returns {number}
 */
export function getMax3DTextureSize( renderer ) {

	if ( ! renderer ) {

		return 2048;

	}

	if ( isWebGPURenderer( renderer ) ) {

		return renderer.backend?.device?.limits?.maxTextureDimension3D ?? 2048;

	}

	const gl = renderer.getContext();
	return gl.getParameter( gl.MAX_3D_TEXTURE_SIZE );

}

/**
 * Renderer capabilities object for unified access to renderer limits.
 */
export class RendererCapabilities {

	/**
	 * @param {import('three').WebGLRenderer | import('three/webgpu').WebGPURenderer} renderer
	 */
	constructor( renderer ) {

		this.renderer = renderer;
		this.isWebGPU = isWebGPURenderer( renderer );
		this.isWebGL = isWebGLRenderer( renderer );

	}

	get maxArrayTextureLayers() {

		return getMaxArrayTextureLayers( this.renderer );

	}

	get maxTextureSize() {

		return getMaxTextureSize( this.renderer );

	}

	get max3DTextureSize() {

		return getMax3DTextureSize( this.renderer );

	}

}

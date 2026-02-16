import { RenderTarget, Box2, Vector2, ShaderMaterial, CustomBlending, ZeroFactor, OneFactor } from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';

const _box = /* @__PURE__ */ new Box2();

/**
 * WebGPU implementation of TextureReadUtility.
 * Uses WebGPU-compatible render targets and async pixel reading.
 */
class _TextureReadUtilityWebGPU {

	constructor( renderer ) {

		this._renderer = renderer;
		this._target = new RenderTarget( 1, 1 );
		this._texTarget = new RenderTarget();

		// quad to render just a single pixel from the provided texture
		// For WebGPU, we use the same ShaderMaterial but the renderer
		// will compile it to WGSL internally
		this._quad = new FullScreenQuad( new ShaderMaterial( {

			blending: CustomBlending,
			blendDst: ZeroFactor,
			blendSrc: OneFactor,

			uniforms: {

				map: { value: null },
				pixel: { value: new Vector2() }

			},

			// GLSL vertex shader - Three.js WebGPU will transpile this
			vertexShader: /* glsl */`
				void main() {

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,

			// GLSL fragment shader - Three.js WebGPU will transpile this
			fragmentShader: /* glsl */`
				uniform sampler2D map;
				uniform ivec2 pixel;

				void main() {

					gl_FragColor = texelFetch( map, pixel, 0 );

				}
			`,

		} ) );

	}

	// increases the width of the target render target to support more data
	increaseSizeTo( width ) {

		this._target.setSize( Math.max( this._target.width, width ), 1 );

	}

	// read data from the rendered texture asynchronously
	async readDataAsync( buffer ) {

		const { _renderer, _target } = this;

		// WebGPU renderer uses the same API but handles it internally
		// with GPU buffer staging
		return _renderer.readRenderTargetPixelsAsync( _target, 0, 0, buffer.length / 4, 1, buffer );

	}

	// read data from the rendered texture
	readData( buffer ) {

		const { _renderer, _target } = this;

		// Note: Synchronous read is less efficient in WebGPU
		// Consider using readDataAsync when possible
		_renderer.readRenderTargetPixels( _target, 0, 0, buffer.length / 4, 1, buffer );

	}

	// render a single pixel from the source at the destination point on the render target
	// takes the texture, pixel to read from, and pixel to render in to
	renderPixelToTarget( texture, pixel, dstPixel ) {

		const { _renderer, _target } = this;

		// copies the pixel directly to the target buffer
		_box.min.copy( pixel );
		_box.max.copy( pixel );
		_box.max.x += 1;
		_box.max.y += 1;

		// WebGPU renderer handles these operations internally
		if ( _renderer.initRenderTarget ) {

			_renderer.initRenderTarget( _target );

		}

		_renderer.copyTextureToTexture( texture, _target.texture, _box, dstPixel, 0 );

	}

	dispose() {

		this._target.dispose();
		this._texTarget.dispose();
		this._quad.material.dispose();
		this._quad.dispose();

	}

}

/**
 * Create a TextureReadUtility for WebGPU renderer.
 * Unlike the WebGL version, this requires an external renderer.
 *
 * @param {import('three/webgpu').WebGPURenderer} renderer - The WebGPU renderer
 * @returns {_TextureReadUtilityWebGPU} The texture read utility instance
 */
export function createTextureReadUtilityWebGPU( renderer ) {

	return new _TextureReadUtilityWebGPU( renderer );

}

// Export the class for direct instantiation if needed
export { _TextureReadUtilityWebGPU as TextureReadUtilityWebGPU };

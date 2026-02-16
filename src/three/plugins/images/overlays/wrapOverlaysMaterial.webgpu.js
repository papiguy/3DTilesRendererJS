import {
	overlayLayerInfoStructWGSL,
	generateFragmentUniformsWGSL,
	getCompositingCodeWGSL,
} from './shaders/overlays.wgsl.js';

/**
 * WebGPU implementation of overlay material wrapping.
 * Uses WGSL shaders and WebGPU-compatible material modifications.
 */

const OVERLAY_PARAMS = Symbol( 'OVERLAY_PARAMS_WEBGPU' );

export function wrapOverlaysMaterialWebGPU( material, previousOnBeforeCompile ) {

	// if the material has already been wrapped then return the params
	if ( material[ OVERLAY_PARAMS ] ) {

		return material[ OVERLAY_PARAMS ];

	}

	const params = {
		layerMaps: { value: [] },
		layerInfo: { value: [] },
	};

	material[ OVERLAY_PARAMS ] = params;

	material.defines = {
		...( material.defines || {} ),
		LAYER_COUNT: 0,
	};

	// Custom program cache key for shader recompilation
	const originalCacheKey = material.customProgramCacheKey?.bind( material );
	material.customProgramCacheKey = () => {

		const baseKey = originalCacheKey ? originalCacheKey() : '';
		return `${ baseKey }_overlay_${ material.defines.LAYER_COUNT }`;

	};

	material.onBeforeCompile = ( shader, renderer ) => {

		if ( previousOnBeforeCompile ) {

			previousOnBeforeCompile( shader, renderer );

		}

		shader.uniforms = {
			...shader.uniforms,
			...params,
		};

		const isWGSL = shader.vertexShader?.includes( '@vertex' ) ||
			renderer?.isWebGPURenderer === true;

		if ( isWGSL ) {

			applyWGSLShaderModifications( shader, material.defines.LAYER_COUNT );

		} else {

			applyGLSLShaderModifications( shader );

		}

	};

	return params;

}

function applyWGSLShaderModifications( shader, layerCount ) {

	if ( layerCount === 0 ) return;

	// For WebGPU, inject the WGSL-specific code
	const compositingCode = getCompositingCodeWGSL( layerCount );
	const uniformsCode = generateFragmentUniformsWGSL( layerCount );

	// Inject struct definition and uniforms
	if ( shader.fragmentShader ) {

		shader.fragmentShader = shader.fragmentShader.replace(
			/@fragment/,
			`${ overlayLayerInfoStructWGSL }\n${ uniformsCode }\n${ compositingCode }\n@fragment`
		);

		// Inject compositing call before final output
		shader.fragmentShader = shader.fragmentShader.replace(
			/return\s+output;/,
			/* wgsl */`
				output.color = applyOverlays(output.color, input);
				return output;
			`
		);

	}

}

function applyGLSLShaderModifications( shader ) {

	// Fallback to standard GLSL modifications (same as wrapOverlaysMaterial.js)
	shader.vertexShader = shader
		.vertexShader
		.replace( /void main\(\s*\)\s*{/, value => /* glsl */`

			#pragma unroll_loop_start
				for ( int i = 0; i < 10; i ++ ) {

					#if UNROLLED_LOOP_INDEX < LAYER_COUNT

						attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
						varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

					#endif


				}
			#pragma unroll_loop_end

			${ value }

			#pragma unroll_loop_start
				for ( int i = 0; i < 10; i ++ ) {

					#if UNROLLED_LOOP_INDEX < LAYER_COUNT

						v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

					#endif

				}
			#pragma unroll_loop_end

		` );

	shader.fragmentShader = shader
		.fragmentShader
		.replace( /void main\(/, value => /* glsl */`

			#if LAYER_COUNT != 0
				struct LayerInfo {
					vec3 color;
					float opacity;

					int alphaMask;
					int alphaInvert;
				};

				uniform sampler2D layerMaps[ LAYER_COUNT ];
				uniform LayerInfo layerInfo[ LAYER_COUNT ];
			#endif

			#pragma unroll_loop_start
				for ( int i = 0; i < 10; i ++ ) {

					#if UNROLLED_LOOP_INDEX < LAYER_COUNT

						varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

					#endif

				}
			#pragma unroll_loop_end

			${ value }

		` )
		.replace( /#include <color_fragment>/, value => /* glsl */`

			${ value }

			#if LAYER_COUNT != 0
			{
				vec4 tint;
				vec3 layerUV;
				float layerOpacity;
				float wOpacity;
				float wDelta;
				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							layerUV = v_layer_uv_UNROLLED_LOOP_INDEX;
							tint = texture( layerMaps[ i ], layerUV.xy );

							// discard texture outside 0, 1 on w - offset the stepped value by an epsilon to avoid cases
							// where wDelta is near 0 (eg a flat surface) at the w boundary, resulting in artifacts on some
							// hardware.
							wDelta = max( fwidth( layerUV.z ), 1e-7 );
							wOpacity =
								smoothstep( - wDelta, 0.0, layerUV.z ) *
								smoothstep( 1.0 + wDelta, 1.0, layerUV.z );

							// apply tint & opacity
							tint.rgb *= layerInfo[ i ].color;
							tint.rgba *= layerInfo[ i ].opacity * wOpacity;

							// invert the alpha
							if ( layerInfo[ i ].alphaInvert > 0 ) {

								tint.a = 1.0 - tint.a;

							}

							// apply the alpha across all existing layers if alpha mask is true
							if ( layerInfo[ i ].alphaMask > 0 ) {

								diffuseColor.a *= tint.a;

							} else {

								tint.rgb *= tint.a;
								diffuseColor = tint + diffuseColor * ( 1.0 - tint.a );

							}

						#endif

					}
				#pragma unroll_loop_end
			}
			#endif
		` );

}

/**
 * GLSL shader code for overlay materials (WebGL).
 * Used by wrapOverlaysMaterial.js for onBeforeCompile shader injection.
 *
 * The overlay system uses #pragma unroll_loop to generate code for
 * a variable number of layers (up to 10).
 */

// Maximum number of layers supported
export const MAX_LAYERS = 10;

// Vertex shader: attribute and varying declarations with unroll loop
export const overlayVertexAttributesGLSL = /* glsl */`
#pragma unroll_loop_start
	for ( int i = 0; i < 10; i ++ ) {

		#if UNROLLED_LOOP_INDEX < LAYER_COUNT

			attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
			varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

		#endif


	}
#pragma unroll_loop_end
`;

// Vertex shader: main function content to pass through UVs
export const overlayVertexMainGLSL = /* glsl */`
#pragma unroll_loop_start
	for ( int i = 0; i < 10; i ++ ) {

		#if UNROLLED_LOOP_INDEX < LAYER_COUNT

			v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

		#endif

	}
#pragma unroll_loop_end
`;

// Fragment shader: struct and uniform declarations
export const overlayFragmentUniformsGLSL = /* glsl */`
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
`;

// Fragment shader: layer compositing logic
export const overlayFragmentCompositingGLSL = /* glsl */`
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
`;

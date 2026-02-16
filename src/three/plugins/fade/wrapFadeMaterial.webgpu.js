import {
	fadeFunctionsWGSL,
	fadeDiscardWGSL,
	fadeBatchedDiscardWGSL,
	fadeVertexMainWGSL,
} from './shaders/fade.wgsl.js';

/**
 * WebGPU implementation of fade material wrapping.
 * Uses WGSL shaders and WebGPU-compatible material modifications.
 *
 * Note: Three.js WebGPU uses NodeMaterial system which requires a different approach
 * than onBeforeCompile. This implementation uses the customProgramCacheKey and
 * onBeforeCompile pattern that works with WebGPURenderer when using standard materials.
 */

const FADE_PARAMS = Symbol( 'FADE_PARAMS_WEBGPU' );

export function wrapFadeMaterialWebGPU( material, previousOnBeforeCompile ) {

	// if the material has already been wrapped then return the params
	if ( material[ FADE_PARAMS ] ) {

		return material[ FADE_PARAMS ];

	}

	const params = {
		fadeIn: { value: 0 },
		fadeOut: { value: 0 },
		fadeTexture: { value: null },
	};

	material[ FADE_PARAMS ] = params;

	material.defines = {
		...( material.defines || {} ),
		FEATURE_FADE: 0,
	};

	// For WebGPU, we need to use a custom program cache key to ensure
	// the shader is recompiled when defines change
	const originalCacheKey = material.customProgramCacheKey?.bind( material );
	material.customProgramCacheKey = () => {

		const baseKey = originalCacheKey ? originalCacheKey() : '';
		return `${ baseKey }_fade_${ material.defines.FEATURE_FADE }`;

	};

	// WebGPU uses the same onBeforeCompile hook but with WGSL shaders
	// when the renderer detects WebGPU mode
	material.onBeforeCompile = ( shader, renderer ) => {

		if ( previousOnBeforeCompile ) {

			previousOnBeforeCompile( shader, renderer );

		}

		shader.uniforms = {
			...shader.uniforms,
			...params,
		};

		// Check if we're in WebGPU mode by checking shader language
		const isWGSL = shader.vertexShader?.includes( '@vertex' ) ||
			renderer?.isWebGPURenderer === true;

		if ( isWGSL ) {

			// WGSL shader modifications
			applyWGSLShaderModifications( shader );

		} else {

			// Fallback to GLSL modifications (standard WebGL path)
			applyGLSLShaderModifications( shader );

		}

	};

	return params;

}

function applyWGSLShaderModifications( shader ) {

	// For WebGPU with NodeMaterial, shader injection works differently.
	// The shader code is generated from nodes, so we inject our functions
	// and logic into the appropriate locations.

	// Add fade functions to fragment shader
	if ( shader.fragmentShader ) {

		// Inject dithering functions before main
		shader.fragmentShader = shader.fragmentShader.replace(
			/@fragment/,
			`${ fadeFunctionsWGSL }\n${ fadeDiscardWGSL }\n${ fadeBatchedDiscardWGSL }\n@fragment`
		);

		// Inject discard logic before final output
		shader.fragmentShader = shader.fragmentShader.replace(
			/return\s+output;/,
			/* wgsl */`
				#if FEATURE_FADE
				#ifdef USE_BATCHING_FRAG
				if (applyBatchedFadeDiscard(input.position, fadeTexture, input.vBatchId)) {
					discard;
				}
				#else
				if (applyFadeDiscard(input.position, fadeParams.fadeIn, fadeParams.fadeOut)) {
					discard;
				}
				#endif
				#endif
				return output;
			`
		);

	}

	// Add batch ID computation to vertex shader
	if ( shader.vertexShader ) {

		shader.vertexShader = shader.vertexShader.replace(
			/return\s+output;/,
			`${ fadeVertexMainWGSL }\nreturn output;`
		);

	}

}

function applyGLSLShaderModifications( shader ) {

	// Standard GLSL modifications (same as original wrapFadeMaterial.js)
	shader.vertexShader = shader.vertexShader
		.replace(
			/void\s+main\(\)\s+{/,
			value => /* glsl */`
				#ifdef USE_BATCHING_FRAG

				varying float vBatchId;

				#endif

				${ value }

					#ifdef USE_BATCHING_FRAG

					// add 0.5 to the value to avoid floating error that may cause flickering
					vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

					#endif
			`
		);

	shader.fragmentShader = shader.fragmentShader
		.replace( /void main\(/, value => /* glsl */`
			#if FEATURE_FADE

			// adapted from https://www.shadertoy.com/view/Mlt3z8
			float bayerDither2x2( vec2 v ) {

				return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

			}

			float bayerDither4x4( vec2 v ) {

				vec2 P1 = mod( v, 2.0 );
				vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
				return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

			}

			// the USE_BATCHING define is not available in fragment shaders
			#ifdef USE_BATCHING_FRAG

			// functions for reading the fade state of a given batch id
			uniform sampler2D fadeTexture;
			varying float vBatchId;
			vec2 getFadeValues( const in float i ) {

				int size = textureSize( fadeTexture, 0 ).x;
				int j = int( i );
				int x = j % size;
				int y = j / size;
				return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

			}

			#else

			uniform float fadeIn;
			uniform float fadeOut;

			#endif

			#endif

			${ value }
		` )
		.replace( /#include <dithering_fragment>/, value => /* glsl */`

			${ value }

			#if FEATURE_FADE

			#ifdef USE_BATCHING_FRAG

			vec2 fadeValues = getFadeValues( vBatchId );
			float fadeIn = fadeValues.r;
			float fadeOut = fadeValues.g;

			#endif

			float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
			float bayerBins = 16.0;
			float dither = ( 0.5 + bayerValue ) / bayerBins;
			if ( dither >= fadeIn ) {

				discard;

			}

			if ( dither < fadeOut ) {

				discard;

			}

			#endif

		` );

}

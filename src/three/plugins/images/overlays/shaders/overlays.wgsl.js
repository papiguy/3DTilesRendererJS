/**
 * WGSL shader code for overlay materials (WebGPU).
 * Used by wrapOverlaysMaterial.webgpu.js for WebGPU shader generation.
 *
 * Unlike GLSL, WGSL doesn't have #pragma unroll_loop, so we generate
 * explicit code for each layer count configuration.
 */

// Maximum number of layers supported
export const MAX_LAYERS = 10;

// Generate vertex struct members for layer UVs
export function generateVertexStructMembersWGSL( layerCount ) {

	let code = '';
	for ( let i = 0; i < layerCount; i ++ ) {

		code += `	@location(${ 10 + i }) layer_uv_${ i }: vec3<f32>,\n`;

	}

	return code;

}

// Generate vertex shader output assignments
export function generateVertexOutputWGSL( layerCount ) {

	let code = '';
	for ( let i = 0; i < layerCount; i ++ ) {

		code += `	output.layer_uv_${ i } = input.layer_uv_${ i };\n`;

	}

	return code;

}

// Fragment shader: LayerInfo struct definition
export const overlayLayerInfoStructWGSL = /* wgsl */`
struct LayerInfo {
	color: vec3<f32>,
	opacity: f32,
	alphaMask: i32,
	alphaInvert: i32,
	_padding: vec2<f32>, // Ensure 16-byte alignment
}
`;

// Generate fragment shader uniform bindings
export function generateFragmentUniformsWGSL( layerCount, bindingOffset = 20 ) {

	if ( layerCount === 0 ) return '';

	let code = `
@group(0) @binding(${ bindingOffset }) var<uniform> layerInfo: array<LayerInfo, ${ layerCount }>;
`;

	for ( let i = 0; i < layerCount; i ++ ) {

		code += `@group(0) @binding(${ bindingOffset + 1 + i * 2 }) var layerMap_${ i }: texture_2d<f32>;\n`;
		code += `@group(0) @binding(${ bindingOffset + 2 + i * 2 }) var layerSampler_${ i }: sampler;\n`;

	}

	return code;

}

// Generate fragment shader varying inputs
export function generateFragmentVaryingsWGSL( layerCount ) {

	let code = '';
	for ( let i = 0; i < layerCount; i ++ ) {

		code += `	@location(${ 10 + i }) layer_uv_${ i }: vec3<f32>,\n`;

	}

	return code;

}

// Generate the compositing function for a specific layer count
export function generateCompositingFunctionWGSL( layerCount ) {

	if ( layerCount === 0 ) {

		return /* wgsl */`
fn applyOverlays(diffuseColor: vec4<f32>, input: FragmentInput) -> vec4<f32> {
	return diffuseColor;
}
`;

	}

	let code = /* wgsl */`
fn applyOverlays(diffuseColor: vec4<f32>, input: FragmentInput) -> vec4<f32> {
	var result = diffuseColor;
	var tint: vec4<f32>;
	var layerUV: vec3<f32>;
	var wDelta: f32;
	var wOpacity: f32;

`;

	for ( let i = 0; i < layerCount; i ++ ) {

		code += /* wgsl */`
	// Layer ${ i }
	layerUV = input.layer_uv_${ i };
	tint = textureSample(layerMap_${ i }, layerSampler_${ i }, layerUV.xy);

	// discard texture outside 0, 1 on w - offset the stepped value by an epsilon
	wDelta = max(fwidth(layerUV.z), 1e-7);
	wOpacity = smoothstep(-wDelta, 0.0, layerUV.z) * smoothstep(1.0 + wDelta, 1.0, layerUV.z);

	// apply tint & opacity
	tint = vec4<f32>(tint.rgb * layerInfo[${ i }].color, tint.a);
	tint = tint * layerInfo[${ i }].opacity * wOpacity;

	// invert the alpha
	if (layerInfo[${ i }].alphaInvert > 0) {
		tint = vec4<f32>(tint.rgb, 1.0 - tint.a);
	}

	// apply the alpha across all existing layers if alpha mask is true
	if (layerInfo[${ i }].alphaMask > 0) {
		result = vec4<f32>(result.rgb, result.a * tint.a);
	} else {
		tint = vec4<f32>(tint.rgb * tint.a, tint.a);
		result = tint + result * (1.0 - tint.a);
	}

`;

	}

	code += `
	return result;
}
`;

	return code;

}

// Pre-generated compositing code for common layer counts (optimization)
export const preGeneratedCompositing = {
	0: generateCompositingFunctionWGSL( 0 ),
	1: generateCompositingFunctionWGSL( 1 ),
	2: generateCompositingFunctionWGSL( 2 ),
	3: generateCompositingFunctionWGSL( 3 ),
	4: generateCompositingFunctionWGSL( 4 ),
};

// Get compositing code for a layer count, using pre-generated if available
export function getCompositingCodeWGSL( layerCount ) {

	if ( layerCount in preGeneratedCompositing ) {

		return preGeneratedCompositing[ layerCount ];

	}

	return generateCompositingFunctionWGSL( layerCount );

}

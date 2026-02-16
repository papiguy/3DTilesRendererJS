/**
 * WGSL shader code for fade material (WebGPU).
 * Used by wrapFadeMaterial.webgpu.js for WebGPU shader injection.
 */

// Vertex shader struct additions for batched fade support
export const fadeVertexStructWGSL = /* wgsl */`
	@location(10) vBatchId: f32,
`;

// Vertex shader code for computing batch ID
export const fadeVertexMainWGSL = /* wgsl */`
	// add 0.5 to the value to avoid floating error that may cause flickering
	output.vBatchId = f32(instance_index) + 0.5;
`;

// Fragment shader uniform declarations for non-batched mode
export const fadeUniformsWGSL = /* wgsl */`
struct FadeUniforms {
	fadeIn: f32,
	fadeOut: f32,
}
@group(0) @binding(10) var<uniform> fadeParams: FadeUniforms;
`;

// Fragment shader uniform declarations for batched mode
export const fadeBatchedUniformsWGSL = /* wgsl */`
@group(0) @binding(11) var fadeTexture: texture_2d<f32>;
@group(0) @binding(12) var fadeSampler: sampler;
`;

// Bayer dithering functions in WGSL
export const fadeFunctionsWGSL = /* wgsl */`
// adapted from https://www.shadertoy.com/view/Mlt3z8
fn bayerDither2x2(v: vec2<f32>) -> f32 {
	return (3.0 * v.y + 2.0 * v.x) % 4.0;
}

fn bayerDither4x4(v: vec2<f32>) -> f32 {
	let P1 = v % 2.0;
	let P2 = floor(0.5 * (v % 4.0));
	return 4.0 * bayerDither2x2(P1) + bayerDither2x2(P2);
}

fn getFadeValues(fadeTexture: texture_2d<f32>, batchId: f32) -> vec2<f32> {
	let size = i32(textureDimensions(fadeTexture).x);
	let j = i32(batchId);
	let x = j % size;
	let y = j / size;
	return textureLoad(fadeTexture, vec2<i32>(x, y), 0).rg;
}
`;

// Fragment shader discard logic for non-batched mode
export const fadeDiscardWGSL = /* wgsl */`
fn applyFadeDiscard(fragCoord: vec4<f32>, fadeIn: f32, fadeOut: f32) -> bool {
	let bayerValue = bayerDither4x4(floor(fragCoord.xy % 4.0));
	let bayerBins = 16.0;
	let dither = (0.5 + bayerValue) / bayerBins;

	if (dither >= fadeIn) {
		return true; // Should discard
	}

	if (dither < fadeOut) {
		return true; // Should discard
	}

	return false; // Should not discard
}
`;

// Fragment shader discard logic for batched mode
export const fadeBatchedDiscardWGSL = /* wgsl */`
fn applyBatchedFadeDiscard(
	fragCoord: vec4<f32>,
	fadeTexture: texture_2d<f32>,
	batchId: f32
) -> bool {
	let fadeValues = getFadeValues(fadeTexture, batchId);
	let fadeIn = fadeValues.r;
	let fadeOut = fadeValues.g;
	return applyFadeDiscard(fragCoord, fadeIn, fadeOut);
}
`;

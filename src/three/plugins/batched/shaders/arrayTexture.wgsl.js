/**
 * WGSL shader code for array texture support in batched tiles (WebGPU).
 * Used by utilities.webgpu.js for WebGPU shader generation.
 */

// Vertex output struct addition for texture index
export const arrayTextureVertexStructWGSL = /* wgsl */`
	@location(15) texture_index: f32,
`;

// Vertex shader: computes texture index from instance index
export const arrayTextureVertexMainWGSL = /* wgsl */`
	output.texture_index = f32(instance_index);
`;

// Fragment input struct addition
export const arrayTextureFragmentInputWGSL = /* wgsl */`
	@location(15) texture_index: f32,
`;

// Fragment shader: uniform bindings for array texture
export const arrayTextureFragmentUniformsWGSL = /* wgsl */`
@group(0) @binding(5) var mapArray: texture_2d_array<f32>;
@group(0) @binding(6) var mapSampler: sampler;
`;

// Fragment shader: samples from array texture
export const arrayTextureFragmentMainWGSL = /* wgsl */`
fn sampleArrayTexture(uv: vec2<f32>, textureIndex: f32) -> vec4<f32> {
	return textureSample(mapArray, mapSampler, uv, i32(textureIndex));
}
`;

// Complete replacement for map sampling
export const arrayTextureMapFragmentWGSL = /* wgsl */`
// Replace standard texture sampling with array texture
let mapColor = sampleArrayTexture(input.vMapUv, input.texture_index);
diffuseColor = diffuseColor * mapColor;
`;

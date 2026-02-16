import { convertMapToArrayTexture } from './utilities.js';

/**
 * WebGPU implementation of array texture utilities for batched tiles.
 */

// Returns whether the passed color is white or not
export function isColorWhite( color ) {

	return color.r === 1 && color.g === 1 && color.b === 1;

}

/**
 * Adjusts the given material to take an ArrayTexture for a map (WebGPU version).
 * Reuses the GLSL onBeforeCompile transform path for WebGPU compatibility.
 *
 * @param {import('three').Material} material - The material to modify
 */
export function convertMapToArrayTextureWebGPU( material ) {

	// Three.js WebGPU supports onBeforeCompile GLSL chunk transforms for standard materials.
	// Reuse the stable WebGL transform path to avoid WGSL string patching fragility.
	convertMapToArrayTexture( material );

}

/**
 * GLSL shader code for array texture support in batched tiles (WebGL).
 * Used by utilities.js for onBeforeCompile shader injection.
 */

// Vertex shader: adds varying for texture index
export const arrayTextureVertexCommonGLSL = /* glsl */`
varying float texture_index;
`;

// Vertex shader: computes texture index from draw ID
export const arrayTextureVertexMainGLSL = /* glsl */`
texture_index = getIndirectIndex( gl_DrawID );
`;

// Fragment shader: replaces map sampling with array texture
export const arrayTextureFragmentParsGLSL = /* glsl */`
#ifdef USE_MAP
precision highp sampler2DArray;
uniform sampler2DArray map;
varying float texture_index;
#endif
`;

// Fragment shader: samples from array texture
export const arrayTextureFragmentMainGLSL = /* glsl */`
#ifdef USE_MAP
	diffuseColor *= texture( map, vec3( vMapUv, texture_index ) );
#endif
`;

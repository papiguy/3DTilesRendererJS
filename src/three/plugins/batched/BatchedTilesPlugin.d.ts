import { Material, WebGLRenderer, Renderer } from 'three';

export class BatchedTilesPlugin {

	constructor( options? : {
		instanceCount?: number,
		vertexCount?: number,
		indexCount?: number,
		expandPercent?: number,
		maxInstanceCount?: number,
		discardOriginalContent?: boolean,
		textureSize?: number | null,

		material?: Material | null,
		/** Renderer instance - supports both WebGLRenderer and WebGPURenderer */
		renderer?: WebGLRenderer | Renderer | null,
	} );

}

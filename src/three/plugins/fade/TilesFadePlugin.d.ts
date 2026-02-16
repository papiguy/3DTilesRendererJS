import { WebGLRenderer, Renderer } from 'three';

export class TilesFadePlugin {

	constructor( options?: {
		maximumFadeOutTiles?: number,
		fadeRootTiles?: boolean,
		fadeDuration?: number,
		/** Renderer instance - supports both WebGLRenderer and WebGPURenderer */
		renderer?: WebGLRenderer | Renderer | null,
	} );

}

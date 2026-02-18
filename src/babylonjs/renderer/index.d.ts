import { TilesRendererBase } from '../../core/renderer/index.js';
import { Scene, TransformNode } from '@babylonjs/core';

export class TilesRenderer extends TilesRendererBase {

	group: TransformNode;
	constructor( url: string, scene: Scene );

}

import { TilesRendererBase } from '../renderer/index.js';

export class CesiumIonAuthPlugin {

	constructor( options : {
		apiToken: string,
		assetId?: string | null,
		autoRefreshToken?: boolean,
		assetTypeHandler?: ( type: string, tiles: TilesRendererBase, asset: object ) => void,
	} );

}

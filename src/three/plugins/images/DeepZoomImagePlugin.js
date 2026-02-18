import { ImageFormatPlugin, TILE_LEVEL, TILE_X, TILE_Y } from './ImageFormatPlugin.js';
import { DeepZoomImageSource } from './sources/DeepZoomImageSource.js';

// Support for Deep Zoom Image format
// https://openseadragon.github.io/

// https://learn.microsoft.com/en-us/previous-versions/windows/silverlight/dotnet-windows-silverlight/cc645077(v=vs.95)
export class DeepZoomImagePlugin extends ImageFormatPlugin {

	constructor( options = {} ) {

		const { url, ...rest } = options;
		super( rest );

		this.name = 'DZI_TILES_PLUGIN';
		this.imageSource = new DeepZoomImageSource( { url, ...rest } );

	}

	async parseToMesh( ...args ) {

		const mesh = await super.parseToMesh( ...args );
		if ( ! mesh ) {

			return null;

		}

		// Deep zoom tiles are coplanar and overlap at seams. Keep deterministic blending order.
		mesh.material.depthWrite = false;

		const tile = args[ 1 ];
		const tx = tile[ TILE_X ];
		const ty = tile[ TILE_Y ];
		const level = tile[ TILE_LEVEL ];
		const { tileCountX, tileCountY } = this.tiling.getLevel( level );
		const invY = 1 / Math.max( 1, tileCountY );
		const invXY = 1 / Math.max( 1, tileCountX * tileCountY );
		mesh.renderOrder = level + ty * invY + tx * invXY;

		return mesh;

	}

}

import { B3DMLoader } from '3d-tiles-renderer';
import {
	Scene,
	Group,
	PerspectiveCamera,
	Box3,
	Vector2,
	Raycaster,
	Color,
	MeshBasicMaterial,
	Float32BufferAttribute,
} from 'three';
import { createRenderer } from '../createRenderer.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let camera, controls, scene, renderer, offsetGroup;
let raycaster, mouse;
let model;
let infoEl;
const HIGHLIGHT_COLOR = new Color( 0xFFC107 );

init().then( animate );

function convertToUnlitBatchMaterial( material, hasBatchIdAttribute ) {

	const map = material.map || material.emissiveMap || null;
	const basic = new MeshBasicMaterial( {
		map,
		// If a texture map is present use white so texture colors are preserved.
		color: map ? new Color( 0xffffff ) : ( material.color ? material.color.clone() : new Color( 0xffffff ) ),
		transparent: material.transparent,
		opacity: material.opacity,
		side: material.side,
		alphaTest: material.alphaTest,
		wireframe: material.wireframe,
		vertexColors: hasBatchIdAttribute,
	} );

	return basic;

}

function updateMeshBatchHighlight( mesh, hoveredBatchid ) {

	const batchidAttr = mesh.geometry.getAttribute( '_batchid' );
	if ( ! batchidAttr ) {

		return;

	}

	let colorAttr = mesh.geometry.getAttribute( 'color' );
	if ( ! mesh.userData._baseVertexColor || ! colorAttr || colorAttr.count !== batchidAttr.count || ! colorAttr.isFloat32BufferAttribute ) {

		const baseColors = new Float32Array( batchidAttr.count * 3 );
		if ( colorAttr && colorAttr.count === batchidAttr.count ) {

			for ( let i = 0, l = colorAttr.count; i < l; i ++ ) {

				baseColors[ i * 3 + 0 ] = colorAttr.getX( i );
				baseColors[ i * 3 + 1 ] = colorAttr.getY( i );
				baseColors[ i * 3 + 2 ] = colorAttr.getZ( i );

			}

		} else {

			baseColors.fill( 1 );

		}

		mesh.userData._baseVertexColor = baseColors;
		colorAttr = new Float32BufferAttribute( baseColors.slice(), 3 );
		mesh.geometry.setAttribute( 'color', colorAttr );

	}

	const baseColors = mesh.userData._baseVertexColor;
	const colors = colorAttr.array;
	for ( let i = 0, l = batchidAttr.count; i < l; i ++ ) {

		const isHighlighted = hoveredBatchid !== - 1 && batchidAttr.getX( i ) === hoveredBatchid;
		const color = isHighlighted ? HIGHLIGHT_COLOR : null;
		const br = baseColors[ i * 3 + 0 ];
		const bg = baseColors[ i * 3 + 1 ];
		const bb = baseColors[ i * 3 + 2 ];
		colors[ i * 3 + 0 ] = color ? br * 0.65 + color.r * 0.35 : br;
		colors[ i * 3 + 1 ] = color ? bg * 0.65 + color.g * 0.35 : bg;
		colors[ i * 3 + 2 ] = color ? bb * 0.65 + color.b * 0.35 : bb;

	}

	colorAttr.needsUpdate = true;

}

async function init() {

	infoEl = document.getElementById( 'hover-info' );

	scene = new Scene();

	// primary camera view
	renderer = await createRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x151c1f );

	document.body.appendChild( renderer.domElement );

	camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 4000 );
	camera.position.set( 400, 400, 400 );

	// controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = false;
	controls.minDistance = 1;
	controls.maxDistance = 2000;

	offsetGroup = new Group();
	scene.add( offsetGroup );

	new B3DMLoader()
		.loadAsync( 'https://raw.githubusercontent.com/CesiumGS/cesium/main/Apps/SampleData/Cesium3DTiles/Hierarchy/BatchTableHierarchy/tile.b3dm' )
		.then( res => {

			console.log( res );
			model = res.scene;
			offsetGroup.add( model );

			const box = new Box3();
			box.setFromObject( model );
			box.getCenter( offsetGroup.position ).multiplyScalar( - 1 );


			// reassign the material to use the batchid highlight variant.
			// in practice this should copy over any needed uniforms from the
			// original material.
			model.traverse( c => {

				if ( c.isMesh ) {

					const hasBatchIdAttribute = Boolean( c.geometry.getAttribute( '_batchid' ) );
					if ( Array.isArray( c.material ) ) {

						c.material = c.material.map( m => convertToUnlitBatchMaterial( m, hasBatchIdAttribute ) );

					} else {

						c.material = convertToUnlitBatchMaterial( c.material, hasBatchIdAttribute );

					}

					// Initialize the vertex color attribute immediately so it exists
					// before the first render. WebGPU requires all attributes declared
					// by the material to be present on the geometry; deferring creation
					// until the first mousemove causes a pipeline validation error.
					if ( hasBatchIdAttribute ) {

						updateMeshBatchHighlight( c, - 1 );

					}

				}

			} );

		} );

	raycaster = new Raycaster();
	mouse = new Vector2();

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
	renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );

}

function onMouseMove( e ) {

	const bounds = this.getBoundingClientRect();
	mouse.x = e.clientX - bounds.x;
	mouse.y = e.clientY - bounds.y;
	mouse.x = ( mouse.x / bounds.width ) * 2 - 1;
	mouse.y = - ( mouse.y / bounds.height ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	// Get the batch table data
	const intersects = raycaster.intersectObject( scene );
	let hoveredBatchid = - 1;
	if ( intersects.length > 0 ) {

		const { face, object } = intersects[ 0 ];
		const batchidAttr = object.geometry.getAttribute( '_batchid' );

		if ( batchidAttr ) {

			// Traverse the parents to find the batch table.
			let batchTableObject = object;
			while ( ! batchTableObject.batchTable ) {

				batchTableObject = batchTableObject.parent;

			}

			// Log the batch data
			const batchTable = batchTableObject.batchTable;
			hoveredBatchid = batchidAttr.getX( face.a );

			const batchData = batchTable.getDataFromId( hoveredBatchid );
			const hierarchyData = batchData[ '3DTILES_batch_table_hierarchy' ];

			const batchTableKeys = batchTable.getKeys();
			infoEl.innerText = `${ '_batchid'.padEnd( 15 ) }: ${ hoveredBatchid }\n`;
			for ( const key of batchTableKeys ) {

				infoEl.innerText += `${ key.padEnd( 15 ) }: ${ batchData[ key ] }\n`;

			}

			for ( const className in hierarchyData ) {

				for ( const instance in hierarchyData[ className ] ) {

					infoEl.innerText += `${ instance.padEnd( 15 ) }: ${ hierarchyData[ className ][ instance ] }\n`;

				}

			}

		}

	} else {

		infoEl.innerText = '';

	}

	if ( model ) {

		model.traverse( c => {

			if ( c.isMesh ) {

				updateMeshBatchHighlight( c, hoveredBatchid );

			}

		} );

	}

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.updateProjectionMatrix();

}

function animate() {

	requestAnimationFrame( animate );

	render();

}

function render() {

	renderer.render( scene, camera );

}

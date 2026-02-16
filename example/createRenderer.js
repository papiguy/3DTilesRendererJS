import { WebGLRenderer } from 'three';

export async function createRenderer( options = {}, { forceWebGL = false } = {} ) {

	const params = new URLSearchParams( window.location.search );
	if ( ! forceWebGL && params.has( 'webgpu' ) ) {

		// Import the renderer implementation directly so we do not load a second
		// top-level Three.js entry module.
		const { default: WebGPURenderer } = await import( 'three/src/renderers/webgpu/WebGPURenderer.js' );
		const renderer = new WebGPURenderer( options );
		await renderer.init();

		// Patch the renderer's node library to use light class identities from the
		// pre-bundled 'three' package. The StandardNodeLibrary registers lights using
		// classes imported from source paths (three/src/…). Bundlers may pre-bundle
		// the 'three' entry separately, producing different class references for the
		// same lights, which breaks the WeakMap lookup in LightsNode.
		const [
			three,
			{ default: DirectionalLightNode },
			{ default: AmbientLightNode },
			{ default: PointLightNode },
			{ default: SpotLightNode },
			{ default: HemisphereLightNode },
			{ default: RectAreaLightNode },
			{ default: LightProbeNode },
		] = await Promise.all( [
			import( 'three' ),
			import( 'three/src/nodes/lighting/DirectionalLightNode.js' ),
			import( 'three/src/nodes/lighting/AmbientLightNode.js' ),
			import( 'three/src/nodes/lighting/PointLightNode.js' ),
			import( 'three/src/nodes/lighting/SpotLightNode.js' ),
			import( 'three/src/nodes/lighting/HemisphereLightNode.js' ),
			import( 'three/src/nodes/lighting/RectAreaLightNode.js' ),
			import( 'three/src/nodes/lighting/LightProbeNode.js' ),
		] );

		const lib = renderer.library;
		lib.addLight( DirectionalLightNode, three.DirectionalLight );
		lib.addLight( AmbientLightNode, three.AmbientLight );
		lib.addLight( PointLightNode, three.PointLight );
		lib.addLight( SpotLightNode, three.SpotLight );
		lib.addLight( HemisphereLightNode, three.HemisphereLight );
		lib.addLight( RectAreaLightNode, three.RectAreaLight );
		lib.addLight( LightProbeNode, three.LightProbe );

		return renderer;

	}

	return new WebGLRenderer( options );

}

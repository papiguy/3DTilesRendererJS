import{M as P,u as U,a2 as O,a4 as w,e as V,n as S,o as T,Q as y}from"./three.module-BqIILyXW.js";function C(n){return(n==null?void 0:n.isWebGPURenderer)===!0}function Y(n){var t,i,a;if(C(n))return((a=(i=(t=n.backend)==null?void 0:t.device)==null?void 0:i.limits)==null?void 0:a.maxTextureDimension3D)??2048;const e=n.getContext();return e.getParameter(e.MAX_3D_TEXTURE_SIZE)}const{clamp:_}=P;class G{constructor(){this.duration=250,this.fadeCount=0,this._lastTick=-1,this._fadeState=new Map,this.onFadeComplete=null,this.onFadeStart=null,this.onFadeSetComplete=null,this.onFadeSetStart=null}deleteObject(e){e&&this.completeFade(e)}guaranteeState(e){const t=this._fadeState;if(t.has(e))return!1;const i={fadeInTarget:0,fadeOutTarget:0,fadeIn:0,fadeOut:0};return t.set(e,i),!0}completeFade(e){const t=this._fadeState;if(!t.has(e))return;const i=t.get(e).fadeOutTarget===0;t.delete(e),this.fadeCount--,this.onFadeComplete&&this.onFadeComplete(e,i),this.fadeCount===0&&this.onFadeSetComplete&&this.onFadeSetComplete()}completeAllFades(){this._fadeState.forEach((e,t)=>{this.completeFade(t)})}forEachObject(e){this._fadeState.forEach((t,i)=>{e(i,t)})}fadeIn(e){const t=this.guaranteeState(e),i=this._fadeState.get(e);i.fadeInTarget=1,i.fadeOutTarget=0,i.fadeOut=0,t&&(this.fadeCount++,this.fadeCount===1&&this.onFadeSetStart&&this.onFadeSetStart(),this.onFadeStart&&this.onFadeStart(e))}fadeOut(e){const t=this.guaranteeState(e),i=this._fadeState.get(e);i.fadeOutTarget=1,t&&(i.fadeInTarget=1,i.fadeIn=1,this.fadeCount++,this.fadeCount===1&&this.onFadeSetStart&&this.onFadeSetStart(),this.onFadeStart&&this.onFadeStart(e))}isFading(e){return this._fadeState.has(e)}isFadingOut(e){const t=this._fadeState.get(e);return t&&t.fadeOutTarget===1}update(){const e=window.performance.now();this._lastTick===-1&&(this._lastTick=e);const t=_((e-this._lastTick)/this.duration,0,1);this._lastTick=e,this._fadeState.forEach((a,s)=>{const{fadeOutTarget:r,fadeInTarget:f}=a;let{fadeOut:o,fadeIn:h}=a;const d=Math.sign(f-h);h=_(h+d*t,0,1);const l=Math.sign(r-o);o=_(o+l*t,0,1),a.fadeIn=h,a.fadeOut=o,((o===1||o===0)&&(h===1||h===0)||o>=h)&&this.completeFade(s)})}}const p=Symbol("FADE_PARAMS");function L(n,e){if(n[p])return n[p];const t={fadeIn:{value:0},fadeOut:{value:0},fadeTexture:{value:null}};return n[p]=t,n.defines={...n.defines||{},FEATURE_FADE:0},n.onBeforeCompile=i=>{e&&e(i),i.uniforms={...i.uniforms,...t},i.vertexShader=i.vertexShader.replace(/void\s+main\(\)\s+{/,a=>`
					#ifdef USE_BATCHING_FRAG

					varying float vBatchId;

					#endif

					${a}

						#ifdef USE_BATCHING_FRAG

						// add 0.5 to the value to avoid floating error that may cause flickering
						vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

						#endif
				`),i.fragmentShader=i.fragmentShader.replace(/void main\(/,a=>`
				#if FEATURE_FADE

				// adapted from https://www.shadertoy.com/view/Mlt3z8
				float bayerDither2x2( vec2 v ) {

					return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

				}

				float bayerDither4x4( vec2 v ) {

					vec2 P1 = mod( v, 2.0 );
					vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
					return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

				}

				// the USE_BATCHING define is not available in fragment shaders
				#ifdef USE_BATCHING_FRAG

				// functions for reading the fade state of a given batch id
				uniform sampler2D fadeTexture;
				varying float vBatchId;
				vec2 getFadeValues( const in float i ) {

					int size = textureSize( fadeTexture, 0 ).x;
					int j = int( i );
					int x = j % size;
					int y = j / size;
					return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

				}

				#else

				uniform float fadeIn;
				uniform float fadeOut;

				#endif

				#endif

				${a}
			`).replace(/#include <dithering_fragment>/,a=>`

				${a}

				#if FEATURE_FADE

				#ifdef USE_BATCHING_FRAG

				vec2 fadeValues = getFadeValues( vBatchId );
				float fadeIn = fadeValues.r;
				float fadeOut = fadeValues.g;

				#endif

				float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
				float bayerBins = 16.0;
				float dither = ( 0.5 + bayerValue ) / bayerBins;
				if ( dither >= fadeIn ) {

					discard;

				}

				if ( dither < fadeOut ) {

					discard;

				}

				#endif

			`)},t}const R=`
	// add 0.5 to the value to avoid floating error that may cause flickering
	output.vBatchId = f32(instance_index) + 0.5;
`,N=`
// adapted from https://www.shadertoy.com/view/Mlt3z8
fn bayerDither2x2(v: vec2<f32>) -> f32 {
	return (3.0 * v.y + 2.0 * v.x) % 4.0;
}

fn bayerDither4x4(v: vec2<f32>) -> f32 {
	let P1 = v % 2.0;
	let P2 = floor(0.5 * (v % 4.0));
	return 4.0 * bayerDither2x2(P1) + bayerDither2x2(P2);
}

fn getFadeValues(fadeTexture: texture_2d<f32>, batchId: f32) -> vec2<f32> {
	let size = i32(textureDimensions(fadeTexture).x);
	let j = i32(batchId);
	let x = j % size;
	let y = j / size;
	return textureLoad(fadeTexture, vec2<i32>(x, y), 0).rg;
}
`,z=`
fn applyFadeDiscard(fragCoord: vec4<f32>, fadeIn: f32, fadeOut: f32) -> bool {
	let bayerValue = bayerDither4x4(floor(fragCoord.xy % 4.0));
	let bayerBins = 16.0;
	let dither = (0.5 + bayerValue) / bayerBins;

	if (dither >= fadeIn) {
		return true; // Should discard
	}

	if (dither < fadeOut) {
		return true; // Should discard
	}

	return false; // Should not discard
}
`,H=`
fn applyBatchedFadeDiscard(
	fragCoord: vec4<f32>,
	fadeTexture: texture_2d<f32>,
	batchId: f32
) -> bool {
	let fadeValues = getFadeValues(fadeTexture, batchId);
	let fadeIn = fadeValues.r;
	let fadeOut = fadeValues.g;
	return applyFadeDiscard(fragCoord, fadeIn, fadeOut);
}
`,v=Symbol("FADE_PARAMS_WEBGPU");function W(n,e){var a;if(n[v])return n[v];const t={fadeIn:{value:0},fadeOut:{value:0},fadeTexture:{value:null}};n[v]=t,n.defines={...n.defines||{},FEATURE_FADE:0};const i=(a=n.customProgramCacheKey)==null?void 0:a.bind(n);return n.customProgramCacheKey=()=>`${i?i():""}_fade_${n.defines.FEATURE_FADE}`,n.onBeforeCompile=(s,r)=>{var o;e&&e(s,r),s.uniforms={...s.uniforms,...t},((o=s.vertexShader)==null?void 0:o.includes("@vertex"))||(r==null?void 0:r.isWebGPURenderer)===!0?$(s):j(s)},t}function $(n){n.fragmentShader&&(n.fragmentShader=n.fragmentShader.replace(/@fragment/,`${N}
${z}
${H}
@fragment`),n.fragmentShader=n.fragmentShader.replace(/return\s+output;/,`
				#if FEATURE_FADE
				#ifdef USE_BATCHING_FRAG
				if (applyBatchedFadeDiscard(input.position, fadeTexture, input.vBatchId)) {
					discard;
				}
				#else
				if (applyFadeDiscard(input.position, fadeParams.fadeIn, fadeParams.fadeOut)) {
					discard;
				}
				#endif
				#endif
				return output;
			`)),n.vertexShader&&(n.vertexShader=n.vertexShader.replace(/return\s+output;/,`${R}
return output;`))}function j(n){n.vertexShader=n.vertexShader.replace(/void\s+main\(\)\s+{/,e=>`
				#ifdef USE_BATCHING_FRAG

				varying float vBatchId;

				#endif

				${e}

					#ifdef USE_BATCHING_FRAG

					// add 0.5 to the value to avoid floating error that may cause flickering
					vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

					#endif
			`),n.fragmentShader=n.fragmentShader.replace(/void main\(/,e=>`
			#if FEATURE_FADE

			// adapted from https://www.shadertoy.com/view/Mlt3z8
			float bayerDither2x2( vec2 v ) {

				return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

			}

			float bayerDither4x4( vec2 v ) {

				vec2 P1 = mod( v, 2.0 );
				vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
				return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

			}

			// the USE_BATCHING define is not available in fragment shaders
			#ifdef USE_BATCHING_FRAG

			// functions for reading the fade state of a given batch id
			uniform sampler2D fadeTexture;
			varying float vBatchId;
			vec2 getFadeValues( const in float i ) {

				int size = textureSize( fadeTexture, 0 ).x;
				int j = int( i );
				int x = j % size;
				int y = j / size;
				return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

			}

			#else

			uniform float fadeIn;
			uniform float fadeOut;

			#endif

			#endif

			${e}
		`).replace(/#include <dithering_fragment>/,e=>`

			${e}

			#if FEATURE_FADE

			#ifdef USE_BATCHING_FRAG

			vec2 fadeValues = getFadeValues( vBatchId );
			float fadeIn = fadeValues.r;
			float fadeOut = fadeValues.g;

			#endif

			float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
			float bayerBins = 16.0;
			float dither = ( 0.5 + bayerValue ) / bayerBins;
			if ( dither >= fadeIn ) {

				discard;

			}

			if ( dither < fadeOut ) {

				discard;

			}

			#endif

		`)}function D(n,e,t=null){return C(e)?W(n,t):L(n,t)}class k{constructor(e=null){this._fadeParams=new WeakMap,this.fading=0,this.renderer=e}setFade(e,t,i){if(!e)return;const a=this._fadeParams;e.traverse(s=>{const r=s.material;if(r&&a.has(r)){const f=a.get(r);f.fadeIn.value=t,f.fadeOut.value=i;const d=+(!(t===0||t===1)||!(i===0||i===1));r.defines.FEATURE_FADE!==d&&(this.fading+=d===1?1:-1,r.defines.FEATURE_FADE=d,r.needsUpdate=!0)}})}prepareScene(e){e.traverse(t=>{t.material&&this.prepareMaterial(t.material)})}deleteScene(e){if(!e)return;this.setFade(e,1,0);const t=this._fadeParams;e.traverse(i=>{const a=i.material;a&&t.delete(a)})}prepareMaterial(e){const t=this._fadeParams;t.has(e)||t.set(e,D(e,this.renderer,e.onBeforeCompile))}}class q{constructor(e,t=new U){this.other=e,this.material=t,this.visible=!0,this.parent=null,this._instanceInfo=[],this._visibilityChanged=!0;const i=new Proxy(this,{get(a,s){if(s in a)return a[s];{const r=e[s];return r instanceof Function?(...f)=>(a.syncInstances(),r.call(i,...f)):e[s]}},set(a,s,r){return s in a?a[s]=r:e[s]=r,!0},deleteProperty(a,s){return s in a?delete a[s]:delete e[s]}});return i}syncInstances(){const e=this._instanceInfo,t=this.other._instanceInfo;for(;t.length>e.length;){const i=e.length;e.push(new Proxy({visible:!1},{get(a,s){return s in a?a[s]:t[i][s]},set(a,s,r){return s in a?a[s]=r:t[i][s]=r,!0}}))}}}class K extends q{constructor(e,t,i=null){super(e,t);const a=D(t,i,t.onBeforeCompile);t.defines.FEATURE_FADE=1,t.defines.USE_BATCHING_FRAG=1,t.needsUpdate=!0,this.fadeTexture=null,this._fadeParams=a,this.renderer=i}setFadeAt(e,t,i){this._initFadeTexture(),this.fadeTexture.setValueAt(e,t*255,i*255)}_initFadeTexture(){let e=Math.sqrt(this._maxInstanceCount);e=Math.ceil(e);const t=e*e*2,i=this.fadeTexture;if(!i||i.image.data.length!==t){const a=new Uint8Array(t),s=new Q(a,e,e,O,w);if(i){i.dispose();const r=i.image.data,f=this.fadeTexture.image.data,o=Math.min(r.length,f.length);f.set(new r.constructor(r.buffer,0,o))}this.fadeTexture=s,this._fadeParams.fadeTexture.value=s,s.needsUpdate=!0}}dispose(){this.fadeTexture&&this.fadeTexture.dispose()}}class Q extends V{setValueAt(e,...t){const{data:i,width:a,height:s}=this.image,r=Math.floor(i.length/(a*s));let f=!1;for(let o=0;o<r;o++){const h=e*r+o,d=i[h],l=t[o]||0;d!==l&&(i[h]=l,f=!0)}f&&(this.needsUpdate=!0)}}const M=Symbol("HAS_POPPED_IN"),x=new T,E=new T,A=new y,b=new y,I=new T;function X(){const n=this._fadeManager,e=this.tiles;this._fadingBefore=n.fadeCount,this._displayActiveTiles=e.displayActiveTiles,e.displayActiveTiles=!0}function Z(){const n=this._fadeManager,e=this._fadeMaterialManager,t=this._displayActiveTiles,i=this._fadingBefore,a=this._prevCameraTransforms,{tiles:s,maximumFadeOutTiles:r,batchedMesh:f}=this,{cameras:o}=s;s.displayActiveTiles=t,n.update();const h=n.fadeCount;if(i!==0&&h!==0&&(s.dispatchEvent({type:"fade-change"}),s.dispatchEvent({type:"needs-render"})),t||s.visibleTiles.forEach(d=>{const l=d.engineData.scene;l&&(l.visible=d.traversal.inFrustum),this.forEachBatchIds(d,(c,u,g)=>{u.setVisibleAt(c,d.traversal.inFrustum),g.batchedMesh.setVisibleAt(c,d.traversal.inFrustum)})}),r<this._fadingOutCount){let d=!0;o.forEach(l=>{if(!a.has(l))return;const c=l.matrixWorld,u=a.get(l);c.decompose(E,b,I),u.decompose(x,A,I);const g=b.angleTo(A),m=E.distanceTo(x);d=d&&(g>.25||m>.1)}),d&&n.completeAllFades()}if(o.forEach(d=>{a.get(d).copy(d.matrixWorld)}),n.forEachObject((d,{fadeIn:l,fadeOut:c})=>{const u=d.engineData.scene,g=n.isFadingOut(d);s.markTileUsed(d),u&&(e.setFade(u,l,c),g&&(u.visible=!0)),this.forEachBatchIds(d,(m,F,B)=>{F.setFadeAt(m,l,c),F.setVisibleAt(m,!0),B.batchedMesh.setVisibleAt(m,!1)})}),f){const d=s.getPluginByName("BATCHED_TILES_PLUGIN").batchedMesh.material;f.material.map=d.map}}class ee{get fadeDuration(){return this._fadeManager.duration}set fadeDuration(e){this._fadeManager.duration=Number(e)}get fadingTiles(){return this._fadeManager.fadeCount}constructor(e){e={maximumFadeOutTiles:50,fadeRootTiles:!1,fadeDuration:250,renderer:null,...e},this.name="FADE_TILES_PLUGIN",this.priority=-2,this.tiles=null,this.batchedMesh=null,this.renderer=e.renderer,this._quickFadeTiles=new Set,this._fadeManager=new G,this._fadeMaterialManager=new k(e.renderer),this._prevCameraTransforms=null,this._fadingOutCount=0,this.maximumFadeOutTiles=e.maximumFadeOutTiles,this.fadeRootTiles=e.fadeRootTiles,this.fadeDuration=e.fadeDuration}init(e){this._onLoadModel=({scene:a})=>{this._fadeMaterialManager.prepareScene(a)},this._onDisposeModel=({tile:a,scene:s})=>{this.tiles.visibleTiles.has(a)&&this._quickFadeTiles.add(a.parent),this._fadeManager.deleteObject(a),this._fadeMaterialManager.deleteScene(s)},this._onAddCamera=({camera:a})=>{this._prevCameraTransforms.set(a,new S)},this._onDeleteCamera=({camera:a})=>{this._prevCameraTransforms.delete(a)},this._onTileVisibilityChange=({tile:a,visible:s})=>{const r=a.engineData.scene;r&&(r.visible=!0),this.forEachBatchIds(a,(f,o,h)=>{o.setFadeAt(f,0,0),o.setVisibleAt(f,!1),h.batchedMesh.setVisibleAt(f,!1)})},this._onUpdateBefore=()=>{X.call(this)},this._onUpdateAfter=()=>{Z.call(this)},e.addEventListener("load-model",this._onLoadModel),e.addEventListener("dispose-model",this._onDisposeModel),e.addEventListener("add-camera",this._onAddCamera),e.addEventListener("delete-camera",this._onDeleteCamera),e.addEventListener("update-before",this._onUpdateBefore),e.addEventListener("update-after",this._onUpdateAfter),e.addEventListener("tile-visibility-change",this._onTileVisibilityChange);const t=this._fadeManager;t.onFadeSetStart=()=>{e.dispatchEvent({type:"fade-start"}),e.dispatchEvent({type:"needs-render"})},t.onFadeSetComplete=()=>{e.dispatchEvent({type:"fade-end"}),e.dispatchEvent({type:"needs-render"})},t.onFadeComplete=(a,s)=>{this._fadeMaterialManager.setFade(a.engineData.scene,0,0),this.forEachBatchIds(a,(r,f,o)=>{f.setFadeAt(r,0,0),f.setVisibleAt(r,!1),o.batchedMesh.setVisibleAt(r,s)}),s||(e.invokeOnePlugin(r=>r!==this&&r.setTileVisible&&r.setTileVisible(a,!1)),this._fadingOutCount--)};const i=new Map;e.cameras.forEach(a=>{i.set(a,new S)}),e.forEachLoadedModel((a,s)=>{this._onLoadModel({scene:a})}),this.tiles=e,this._fadeManager=t,this._prevCameraTransforms=i}initBatchedMesh(){var t;const e=(t=this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"))==null?void 0:t.batchedMesh;if(e){if(this.batchedMesh===null){this._onBatchedMeshDispose=()=>{this.batchedMesh.dispose(),this.batchedMesh.removeFromParent(),this.batchedMesh=null,e.removeEventListener("dispose",this._onBatchedMeshDispose)};const i=e.material.clone();i.onBeforeCompile=e.material.onBeforeCompile,this.batchedMesh=new K(e,i,this.renderer),this.tiles.group.add(this.batchedMesh)}}else this.batchedMesh!==null&&(this._onBatchedMeshDispose(),this._onBatchedMeshDispose=null)}setTileVisible(e,t){const i=this._fadeManager,a=i.isFading(e);if(i.isFadingOut(e)&&this._fadingOutCount--,t?e.internal.depthFromRenderedParent===1?((e[M]||this.fadeRootTiles)&&this._fadeManager.fadeIn(e),e[M]=!0):this._fadeManager.fadeIn(e):(this._fadingOutCount++,i.fadeOut(e)),this._quickFadeTiles.has(e)&&(this._fadeManager.completeFade(e),this._quickFadeTiles.delete(e)),a)return!0;const s=this._fadeManager.isFading(e);return!!(!t&&s)}dispose(){const e=this.tiles;this._fadeManager.completeAllFades(),this.batchedMesh!==null&&this._onBatchedMeshDispose(),e.removeEventListener("load-model",this._onLoadModel),e.removeEventListener("dispose-model",this._onDisposeModel),e.removeEventListener("add-camera",this._onAddCamera),e.removeEventListener("delete-camera",this._onDeleteCamera),e.removeEventListener("update-before",this._onUpdateBefore),e.removeEventListener("update-after",this._onUpdateAfter),e.removeEventListener("tile-visibility-change",this._onTileVisibilityChange),e.forEachLoadedModel((t,i)=>{this._fadeManager.deleteObject(i),t&&(t.visible=!0)})}forEachBatchIds(e,t){if(this.initBatchedMesh(),this.batchedMesh){const i=this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"),a=i.getTileBatchIds(e);a&&a.forEach(s=>{t(s,this.batchedMesh,i)})}}}export{ee as T,Y as g,C as i};
//# sourceMappingURL=TilesFadePlugin-Dh31ei08.js.map

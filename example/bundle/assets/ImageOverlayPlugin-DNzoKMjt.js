import{n as $,M as x,o as O,aJ as W,Y as Q,B as H,ar as ee,ap as te,C as ie}from"./three.module-BqIILyXW.js";import{P as ne,a as ae}from"./TilesRendererBase-CFsQu8zV.js";import{C as re}from"./CesiumIonAuth-ByA9ya_o.js";import{X as G,T as se}from"./TMSImageSource-Dm2vW2I8.js";import{i as oe}from"./TilesFadePlugin-Dh31ei08.js";import{G as le}from"./GeometryClipper-B8z2iZLD.js";import{g as ce}from"./TilesRenderer-Dl5zoJuD.js";import{D as ue,P as he}from"./TiledImageSource-DnrUwRJ4.js";import{W as fe}from"./I3DMLoader-B8RXOBoC.js";class pe extends G{constructor(e={}){const{subdomains:t=["t0"],...i}=e;super(i),this.subdomains=t,this.subDomainIndex=0}getUrl(e,t,i){return this.url.replace(/{\s*subdomain\s*}/gi,this._getSubdomain()).replace(/{\s*quadkey\s*}/gi,this._tileToQuadKey(e,t,i))}_tileToQuadKey(e,t,i){let n="";for(let r=i;r>0;r--){let a=0;const s=1<<r-1;(e&s)!==0&&(a+=1),(t&s)!==0&&(a+=2),n+=a.toString()}return n}_getSubdomain(){return this.subDomainIndex=(this.subDomainIndex+1)%this.subdomains.length,this.subdomains[this.subDomainIndex]}}function A(h,e,t,i){let[n,r,a,s]=h;r+=1e-8,n+=1e-8,s-=1e-8,a-=1e-8;const o=Math.max(Math.min(e,t.maxLevel),t.minLevel),[l,c,u,f]=t.getTilesInRange(n,r,a,s,o,!0);for(let m=l;m<=u;m++)for(let p=c;p<=f;p++)i(m,p,o)}function me(h,e,t){const i=new O,n={},r=[],a=h.getAttribute("position");h.computeBoundingBox(),h.boundingBox.getCenter(i).applyMatrix4(e),t.getPositionToCartographic(i,n);const s=n.lat,o=n.lon;let l=1/0,c=1/0,u=1/0,f=-1/0,m=-1/0,p=-1/0;for(let g=0;g<a.count;g++)i.fromBufferAttribute(a,g).applyMatrix4(e),t.getPositionToCartographic(i,n),Math.abs(Math.abs(n.lat)-Math.PI/2)<1e-5&&(n.lon=o),Math.abs(o-n.lon)>Math.PI&&(n.lon+=Math.sign(o-n.lon)*Math.PI*2),Math.abs(s-n.lat)>Math.PI&&(n.lat+=Math.sign(s-n.lat)*Math.PI*2),r.push(n.lon,n.lat,n.height),l=Math.min(l,n.lat),f=Math.max(f,n.lat),c=Math.min(c,n.lon),m=Math.max(m,n.lon),u=Math.min(u,n.height),p=Math.max(p,n.height);const d=[c,l,m,f],_=[...d,u,p];return{uv:r,range:d,region:_}}function z(h,e,t=null,i=null){let n=1/0,r=1/0,a=1/0,s=-1/0,o=-1/0,l=-1/0;const c=[],u=new $;h.forEach(m=>{u.copy(m.matrixWorld),t&&u.premultiply(t);const{uv:p,region:d}=me(m.geometry,u,e);c.push(p),n=Math.min(n,d[1]),s=Math.max(s,d[3]),r=Math.min(r,d[0]),o=Math.max(o,d[2]),a=Math.min(a,d[4]),l=Math.max(l,d[5])});let f=[r,n,o,s];if(i!==null){f=i.clampToBounds([r,n,o,s]);const[m,p,d,_]=i.toNormalizedRange(f);c.forEach(g=>{for(let E=0,T=g.length;E<T;E+=3){const y=g[E+0],L=g[E+1],I=g[E+2],[v,S]=i.toNormalizedPoint(y,L);g[E+0]=x.mapLinear(v,m,d,0,1),g[E+1]=x.mapLinear(S,p,_,0,1),g[E+2]=x.mapLinear(I,a,l,0,1)}})}return{uvs:c,range:f,region:[r,n,o,s,a,l]}}function de(h,e){const t=new O,i=[],n=h.getAttribute("position");let r=1/0,a=1/0,s=1/0,o=-1/0,l=-1/0,c=-1/0;for(let f=0;f<n.count;f++)t.fromBufferAttribute(n,f).applyMatrix4(e),i.push(t.x,t.y,t.z),r=Math.min(r,t.x),o=Math.max(o,t.x),a=Math.min(a,t.y),l=Math.max(l,t.y),s=Math.min(s,t.z),c=Math.max(c,t.z);return{uv:i,range:[r,a,o,l],heightRange:[s,c]}}function ge(h,e){let t=1/0,i=1/0,n=1/0,r=-1/0,a=-1/0,s=-1/0;const o=[],l=new $;return h.forEach(c=>{l.copy(c.matrixWorld),e&&l.premultiply(e);const{uv:u,range:f,heightRange:m}=de(c.geometry,l);o.push(u),t=Math.min(t,f[0]),r=Math.max(r,f[2]),i=Math.min(i,f[1]),a=Math.max(a,f[3]),n=Math.min(n,m[0]),s=Math.max(s,m[1])}),o.forEach(c=>{for(let u=0,f=c.length;u<f;u+=3){const m=c[u+0],p=c[u+1];c[u+0]=x.mapLinear(m,t,r,0,1),c[u+1]=x.mapLinear(p,i,a,0,1)}}),{uvs:o,range:[t,i,r,a],heightRange:[n,s]}}const N=Symbol("OVERLAY_PARAMS");function ye(h,e){if(h[N])return h[N];const t={layerMaps:{value:[]},layerInfo:{value:[]}};return h[N]=t,h.defines={...h.defines||{},LAYER_COUNT:0},h.onBeforeCompile=i=>{e&&e(i),i.uniforms={...i.uniforms,...t},i.vertexShader=i.vertexShader.replace(/void main\(\s*\)\s*{/,n=>`

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif


					}
				#pragma unroll_loop_end

				${n}

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

			`),i.fragmentShader=i.fragmentShader.replace(/void main\(/,n=>`

				#if LAYER_COUNT != 0
					struct LayerInfo {
						vec3 color;
						float opacity;

						int alphaMask;
						int alphaInvert;
					};

					uniform sampler2D layerMaps[ LAYER_COUNT ];
					uniform LayerInfo layerInfo[ LAYER_COUNT ];
				#endif

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

				${n}

			`).replace(/#include <color_fragment>/,n=>`

				${n}

				#if LAYER_COUNT != 0
				{
					vec4 tint;
					vec3 layerUV;
					float layerOpacity;
					float wOpacity;
					float wDelta;
					#pragma unroll_loop_start
						for ( int i = 0; i < 10; i ++ ) {

							#if UNROLLED_LOOP_INDEX < LAYER_COUNT

								layerUV = v_layer_uv_UNROLLED_LOOP_INDEX;
								tint = texture( layerMaps[ i ], layerUV.xy );

								// discard texture outside 0, 1 on w - offset the stepped value by an epsilon to avoid cases
								// where wDelta is near 0 (eg a flat surface) at the w boundary, resulting in artifacts on some
								// hardware.
								wDelta = max( fwidth( layerUV.z ), 1e-7 );
								wOpacity =
									smoothstep( - wDelta, 0.0, layerUV.z ) *
									smoothstep( 1.0 + wDelta, 1.0, layerUV.z );

								// apply tint & opacity
								tint.rgb *= layerInfo[ i ].color;
								tint.rgba *= layerInfo[ i ].opacity * wOpacity;

								// invert the alpha
								if ( layerInfo[ i ].alphaInvert > 0 ) {

									tint.a = 1.0 - tint.a;

								}

								// apply the alpha across all existing layers if alpha mask is true
								if ( layerInfo[ i ].alphaMask > 0 ) {

									diffuseColor.a *= tint.a;

								} else {

									tint.rgb *= tint.a;
									diffuseColor = tint + diffuseColor * ( 1.0 - tint.a );

								}

							#endif

						}
					#pragma unroll_loop_end
				}
				#endif
			`)},t}const _e=`
struct LayerInfo {
	color: vec3<f32>,
	opacity: f32,
	alphaMask: i32,
	alphaInvert: i32,
	_padding: vec2<f32>, // Ensure 16-byte alignment
}
`;function Le(h,e=20){if(h===0)return"";let t=`
@group(0) @binding(${e}) var<uniform> layerInfo: array<LayerInfo, ${h}>;
`;for(let i=0;i<h;i++)t+=`@group(0) @binding(${e+1+i*2}) var layerMap_${i}: texture_2d<f32>;
`,t+=`@group(0) @binding(${e+2+i*2}) var layerSampler_${i}: sampler;
`;return t}function C(h){if(h===0)return`
fn applyOverlays(diffuseColor: vec4<f32>, input: FragmentInput) -> vec4<f32> {
	return diffuseColor;
}
`;let e=`
fn applyOverlays(diffuseColor: vec4<f32>, input: FragmentInput) -> vec4<f32> {
	var result = diffuseColor;
	var tint: vec4<f32>;
	var layerUV: vec3<f32>;
	var wDelta: f32;
	var wOpacity: f32;

`;for(let t=0;t<h;t++)e+=`
	// Layer ${t}
	layerUV = input.layer_uv_${t};
	tint = textureSample(layerMap_${t}, layerSampler_${t}, layerUV.xy);

	// discard texture outside 0, 1 on w - offset the stepped value by an epsilon
	wDelta = max(fwidth(layerUV.z), 1e-7);
	wOpacity = smoothstep(-wDelta, 0.0, layerUV.z) * smoothstep(1.0 + wDelta, 1.0, layerUV.z);

	// apply tint & opacity
	tint = vec4<f32>(tint.rgb * layerInfo[${t}].color, tint.a);
	tint = tint * layerInfo[${t}].opacity * wOpacity;

	// invert the alpha
	if (layerInfo[${t}].alphaInvert > 0) {
		tint = vec4<f32>(tint.rgb, 1.0 - tint.a);
	}

	// apply the alpha across all existing layers if alpha mask is true
	if (layerInfo[${t}].alphaMask > 0) {
		result = vec4<f32>(result.rgb, result.a * tint.a);
	} else {
		tint = vec4<f32>(tint.rgb * tint.a, tint.a);
		result = tint + result * (1.0 - tint.a);
	}

`;return e+=`
	return result;
}
`,e}const F={0:C(0),1:C(1),2:C(2),3:C(3),4:C(4)};function Ie(h){return h in F?F[h]:C(h)}const k=Symbol("OVERLAY_PARAMS_WEBGPU");function ve(h,e){var n;if(h[k])return h[k];const t={layerMaps:{value:[]},layerInfo:{value:[]}};h[k]=t,h.defines={...h.defines||{},LAYER_COUNT:0};const i=(n=h.customProgramCacheKey)==null?void 0:n.bind(h);return h.customProgramCacheKey=()=>`${i?i():""}_overlay_${h.defines.LAYER_COUNT}`,h.onBeforeCompile=(r,a)=>{var o;e&&e(r,a),r.uniforms={...r.uniforms,...t},((o=r.vertexShader)==null?void 0:o.includes("@vertex"))||(a==null?void 0:a.isWebGPURenderer)===!0?Se(r,h.defines.LAYER_COUNT):xe(r)},t}function Se(h,e){if(e===0)return;const t=Ie(e),i=Le(e);h.fragmentShader&&(h.fragmentShader=h.fragmentShader.replace(/@fragment/,`${_e}
${i}
${t}
@fragment`),h.fragmentShader=h.fragmentShader.replace(/return\s+output;/,`
				output.color = applyOverlays(output.color, input);
				return output;
			`))}function xe(h){h.vertexShader=h.vertexShader.replace(/void main\(\s*\)\s*{/,e=>`

			#pragma unroll_loop_start
				for ( int i = 0; i < 10; i ++ ) {

					#if UNROLLED_LOOP_INDEX < LAYER_COUNT

						attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
						varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

					#endif


				}
			#pragma unroll_loop_end

			${e}

			#pragma unroll_loop_start
				for ( int i = 0; i < 10; i ++ ) {

					#if UNROLLED_LOOP_INDEX < LAYER_COUNT

						v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

					#endif

				}
			#pragma unroll_loop_end

		`),h.fragmentShader=h.fragmentShader.replace(/void main\(/,e=>`

			#if LAYER_COUNT != 0
				struct LayerInfo {
					vec3 color;
					float opacity;

					int alphaMask;
					int alphaInvert;
				};

				uniform sampler2D layerMaps[ LAYER_COUNT ];
				uniform LayerInfo layerInfo[ LAYER_COUNT ];
			#endif

			#pragma unroll_loop_start
				for ( int i = 0; i < 10; i ++ ) {

					#if UNROLLED_LOOP_INDEX < LAYER_COUNT

						varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

					#endif

				}
			#pragma unroll_loop_end

			${e}

		`).replace(/#include <color_fragment>/,e=>`

			${e}

			#if LAYER_COUNT != 0
			{
				vec4 tint;
				vec3 layerUV;
				float layerOpacity;
				float wOpacity;
				float wDelta;
				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							layerUV = v_layer_uv_UNROLLED_LOOP_INDEX;
							tint = texture( layerMaps[ i ], layerUV.xy );

							// discard texture outside 0, 1 on w - offset the stepped value by an epsilon to avoid cases
							// where wDelta is near 0 (eg a flat surface) at the w boundary, resulting in artifacts on some
							// hardware.
							wDelta = max( fwidth( layerUV.z ), 1e-7 );
							wOpacity =
								smoothstep( - wDelta, 0.0, layerUV.z ) *
								smoothstep( 1.0 + wDelta, 1.0, layerUV.z );

							// apply tint & opacity
							tint.rgb *= layerInfo[ i ].color;
							tint.rgba *= layerInfo[ i ].opacity * wOpacity;

							// invert the alpha
							if ( layerInfo[ i ].alphaInvert > 0 ) {

								tint.a = 1.0 - tint.a;

							}

							// apply the alpha across all existing layers if alpha mask is true
							if ( layerInfo[ i ].alphaMask > 0 ) {

								diffuseColor.a *= tint.a;

							} else {

								tint.rgb *= tint.a;
								diffuseColor = tint + diffuseColor * ( 1.0 - tint.a );

							}

						#endif

					}
				#pragma unroll_loop_end
			}
			#endif
		`)}function Ee(h,e,t=null){return oe(e)?ve(h,t):ye(h,t)}class J{constructor(){this.canvas=null,this.context=null,this.range=[0,0,1,1]}setTarget(e,t){this.canvas=e.image,this.context=e.image.getContext("2d"),this.range=[...t]}draw(e,t){const{canvas:i,range:n,context:r}=this,{width:a,height:s}=i,{image:o}=e,l=Math.round(x.mapLinear(t[0],n[0],n[2],0,a)),c=Math.round(x.mapLinear(t[1],n[1],n[3],0,s)),u=Math.round(x.mapLinear(t[2],n[0],n[2],0,a)),f=Math.round(x.mapLinear(t[3],n[1],n[3],0,s)),m=u-l,p=f-c;o instanceof ImageBitmap?(r.save(),r.translate(l,s-c),r.scale(1,-1),r.drawImage(o,0,0,m,p),r.restore()):r.drawImage(o,l,s-c,m,-p)}clear(){const{context:e,canvas:t}=this;e.clearRect(0,0,t.width,t.height)}}class K extends ue{hasContent(...e){return!0}}class Te extends K{constructor(e){super(),this.tiledImageSource=e,this.tileComposer=new J,this.resolution=256}hasContent(e,t,i,n,r){const a=this.tiledImageSource.tiling;let s=0;return A([e,t,i,n],r,a,()=>{s++}),s!==0}async fetchItem([e,t,i,n,r],a){const s=[e,t,i,n],o=this.tiledImageSource,l=this.tileComposer,c=o.tiling,u=document.createElement("canvas");u.width=this.resolution,u.height=this.resolution;const f=new W(u);return f.colorSpace=Q,f.generateMipmaps=!1,f.tokens=[...s,r],await this._markImages(s,r,!1),l.setTarget(f,s),l.clear(16777215,0),A(s,r,c,(m,p,d)=>{const _=c.getTileBounds(m,p,d,!0,!1),g=o.get(m,p,d);l.draw(g,_)}),f}disposeItem(e){e.dispose();const[t,i,n,r,a]=e.tokens;this._markImages([t,i,n,r],a,!0)}dispose(){super.dispose(),this.tiledImageSource.dispose()}_markImages(e,t,i=!1){const n=this.tiledImageSource,r=n.tiling,a=[];A(e,t,r,(o,l,c)=>{i?n.release(o,l,c):a.push(n.lock(o,l,c))});const s=a.filter(o=>o instanceof Promise);return s.length!==0?Promise.all(s):null}}const V=new O,P=new O;function Me(h,e,t){h.getCartographicToPosition(e,t,0,V),h.getCartographicToPosition(e+.01,t,0,P);const n=V.distanceTo(P);return h.getCartographicToPosition(e,t+.01,0,P),V.distanceTo(P)/n}class Oe extends K{constructor({geojson:e=null,url:t=null,resolution:i=256,pointRadius:n=6,strokeStyle:r="white",strokeWidth:a=2,fillStyle:s="rgba( 255, 255, 255, 0.5 )",...o}={}){super(o),this.geojson=e,this.url=t,this.resolution=i,this.pointRadius=n,this.strokeStyle=r,this.strokeWidth=a,this.fillStyle=s,this.features=null,this.featureBounds=new Map,this.contentBounds=null,this.projection=new he,this.fetchData=(...l)=>fetch(...l)}async init(){const{geojson:e,url:t}=this;if(!e&&t){const i=await this.fetchData(t);this.geojson=await i.json()}this._updateCache(!0)}hasContent(e,t,i,n){const r=[e,t,i,n].map(a=>a*Math.RAD2DEG);return this._boundsIntersectBounds(r,this.contentBounds)}async fetchItem(e,t){const i=document.createElement("canvas"),n=new W(i);return n.colorSpace=Q,n.generateMipmaps=!1,this._drawToCanvas(i,e),n.needsUpdate=!0,n}disposeItem(e){e.dispose()}redraw(){this._updateCache(!0),this.forEachItem((e,t)=>{this._drawToCanvas(e.image,t),e.needsUpdate=!0})}_updateCache(e=!1){const{geojson:t,featureBounds:i}=this;if(!t||this.features&&!e)return;i.clear();let n=1/0,r=1/0,a=-1/0,s=-1/0;this.features=this._featuresFromGeoJSON(t),this.features.forEach(o=>{const l=this._getFeatureBounds(o);i.set(o,l);const[c,u,f,m]=l;n=Math.min(n,c),r=Math.min(r,u),a=Math.max(a,f),s=Math.max(s,m)}),this.contentBounds=[n,r,a,s]}_drawToCanvas(e,t){this._updateCache();const[i,n,r,a]=t,{projection:s,resolution:o,features:l}=this;e.width=o,e.height=o;const c=s.convertNormalizedToLongitude(i),u=s.convertNormalizedToLatitude(n),f=s.convertNormalizedToLongitude(r),m=s.convertNormalizedToLatitude(a),p=[c*x.RAD2DEG,u*x.RAD2DEG,f*x.RAD2DEG,m*x.RAD2DEG],d=e.getContext("2d");for(let _=0;_<l.length;_++){const g=l[_];this._featureIntersectsTile(g,p)&&this._drawFeatureOnCanvas(d,g,p,e.width,e.height)}}_featureIntersectsTile(e,t){const i=this.featureBounds.get(e);return i?this._boundsIntersectBounds(i,t):!1}_boundsIntersectBounds(e,t){const[i,n,r,a]=e,[s,o,l,c]=t;return!(r<s||i>l||a<o||n>c)}_getFeatureBounds(e){const{geometry:t}=e;if(!t)return null;const{type:i,coordinates:n}=t;let r=1/0,a=1/0,s=-1/0,o=-1/0;const l=(c,u)=>{r=Math.min(r,c),s=Math.max(s,c),a=Math.min(a,u),o=Math.max(o,u)};return i==="Point"?l(n[0],n[1]):i==="MultiPoint"||i==="LineString"?n.forEach(c=>l(c[0],c[1])):i==="MultiLineString"||i==="Polygon"?n.forEach(c=>c.forEach(u=>l(u[0],u[1]))):i==="MultiPolygon"&&n.forEach(c=>c.forEach(u=>u.forEach(f=>l(f[0],f[1])))),[r,a,s,o]}_featuresFromGeoJSON(e){const t=e.type,i=new Set(["Point","MultiPoint","LineString","MultiLineString","Polygon","MultiPolygon"]);return t==="FeatureCollection"?e.features:t==="Feature"?[e]:t==="GeometryCollection"?e.geometries.map(n=>({type:"Feature",geometry:n,properties:{}})):i.has(t)?[{type:"Feature",geometry:e,properties:{}}]:[]}_drawFeatureOnCanvas(e,t,i,n,r){const{geometry:a=null,properties:s={}}=t;if(!a)return;const[o,l,c,u]=i,f=s.strokeStyle||this.strokeStyle,m=s.fillStyle||this.fillStyle,p=s.pointRadius||this.pointRadius,d=s.strokeWidth||this.strokeWidth;e.save(),e.strokeStyle=f,e.fillStyle=m,e.lineWidth=d;const _=new Array(2),g=(y,L,I=_)=>{const v=x.mapLinear(y,o,c,0,n),S=r-x.mapLinear(L,l,u,0,r);return I[0]=Math.round(v),I[1]=Math.round(S),I},E=(y,L)=>{const I=L*x.DEG2RAD,v=y*x.DEG2RAD,S=(u-l)/r;return(c-o)/n/S*Me(fe,I,v)},T=a.type;if(T==="Point"){const[y,L]=a.coordinates,[I,v]=g(y,L),S=E(y,L);e.beginPath(),e.ellipse(I,v,p/S,p,0,0,Math.PI*2),e.fill(),e.stroke()}else T==="MultiPoint"?a.coordinates.forEach(([y,L])=>{const[I,v]=g(y,L),S=E(y,L);e.beginPath(),e.ellipse(I,v,p/S,p,0,0,Math.PI*2),e.fill(),e.stroke()}):T==="LineString"?(e.beginPath(),a.coordinates.forEach(([y,L],I)=>{const[v,S]=g(y,L);I===0?e.moveTo(v,S):e.lineTo(v,S)}),e.stroke()):T==="MultiLineString"?(e.beginPath(),a.coordinates.forEach(y=>{y.forEach(([L,I],v)=>{const[S,b]=g(L,I);v===0?e.moveTo(S,b):e.lineTo(S,b)})}),e.stroke()):T==="Polygon"?(e.beginPath(),a.coordinates.forEach((y,L)=>{y.forEach(([I,v],S)=>{const[b,w]=g(I,v);S===0?e.moveTo(b,w):e.lineTo(b,w)}),e.closePath()}),e.fill("evenodd"),e.stroke()):T==="MultiPolygon"&&a.coordinates.forEach(y=>{e.beginPath(),y.forEach((L,I)=>{L.forEach(([v,S],b)=>{const[w,X]=g(v,S);b===0?e.moveTo(w,X):e.lineTo(w,X)}),e.closePath()}),e.fill("evenodd"),e.stroke()});e.restore()}}const R=new $,D=new O,Y=new O,B=new O,M=new O,be=new H,j=Symbol("SPLIT_TILE_DATA"),U=Symbol("SPLIT_HASH");class Ve{get enableTileSplitting(){return this._enableTileSplitting}set enableTileSplitting(e){this._enableTileSplitting!==e&&(this._enableTileSplitting=e,this._markNeedsUpdate())}constructor(e={}){const{overlays:t=[],resolution:i=256,enableTileSplitting:n=!0,renderer:r=null}=e;this.name="IMAGE_OVERLAY_PLUGIN",this.priority=-15,this.resolution=i,this._enableTileSplitting=n,this.renderer=r,this.overlays=[],this.needsUpdate=!1,this.tiles=null,this.tileComposer=null,this.tileControllers=new Map,this.overlayInfo=new Map,this.meshParams=new WeakMap,this.pendingTiles=new Map,this.processedTiles=new Set,this.processQueue=null,this._onUpdateAfter=null,this._onTileDownloadStart=null,this._virtualChildResetId=0,this._bytesUsed=new WeakMap,t.forEach(a=>{this.addOverlay(a)})}init(e){const t=new J,i=new ne;i.maxJobs=10,i.priorityCallback=(n,r)=>{const a=n.tile,s=r.tile,o=e.visibleTiles.has(a),l=e.visibleTiles.has(s);return o!==l?o?1:-1:e.downloadQueue.priorityCallback(a,s)},this.tiles=e,this.tileComposer=t,this.processQueue=i,e.forEachLoadedModel((n,r)=>{this._processTileModel(n,r,!0)}),this._onUpdateAfter=async()=>{let n=!1;if(this.overlayInfo.forEach((r,a)=>{if(!!a.frame!=!!r.frame||a.frame&&r.frame&&!r.frame.equals(a.frame)){const s=r.order;this.deleteOverlay(a),this.addOverlay(a,s),n=!0}}),n){const r=i.maxJobs;let a=0;i.items.forEach(s=>{e.visibleTiles.has(s.tile)&&a++}),i.maxJobs=a+i.currJobs,i.tryRunJobs(),i.maxJobs=r,this.needsUpdate=!0}if(this.needsUpdate){this.needsUpdate=!1;const{overlays:r,overlayInfo:a}=this;r.sort((s,o)=>a.get(s).order-a.get(o).order),this.processedTiles.forEach(s=>{this._updateLayers(s)}),this.resetVirtualChildren(!this.enableTileSplitting),e.recalculateBytesUsed(),e.dispatchEvent({type:"needs-rerender"})}},this._onTileDownloadStart=({tile:n,url:r})=>{!/\.json$/i.test(r)&&!/\.subtree/i.test(r)&&(this.processedTiles.add(n),this._initTileOverlayInfo(n))},e.addEventListener("update-after",this._onUpdateAfter),e.addEventListener("tile-download-start",this._onTileDownloadStart),this.overlays.forEach(n=>{this._initOverlay(n)})}disposeTile(e){const{overlayInfo:t,tileControllers:i,processQueue:n,pendingTiles:r,processedTiles:a}=this;a.delete(e),i.has(e)&&(i.get(e).abort(),i.delete(e),r.delete(e)),t.forEach((({tileInfo:s},o)=>{if(s.has(e)){const{meshInfo:l,range:c}=s.get(e);c!==null&&o.releaseTexture(c,e),s.delete(e),l.clear()}})),n.removeByFilter(s=>s.tile===e)}calculateBytesUsed(e){const{overlayInfo:t}=this,i=this._bytesUsed;let n=null;return t.forEach(({tileInfo:r},a)=>{if(r.has(e)){const{target:s}=r.get(e);n=n||0,n+=ce(s)}}),n!==null?(i.set(e,n),n):i.has(e)?i.get(e):0}processTileModel(e,t){return this._processTileModel(e,t)}async _processTileModel(e,t,i=!1){const{tileControllers:n,processedTiles:r,pendingTiles:a}=this;n.set(t,new AbortController),i||a.set(t,e),r.add(t),this._wrapMaterials(e),this._initTileOverlayInfo(t),await this._initTileSceneOverlayInfo(e,t),this.expandVirtualChildren(e,t),this._updateLayers(t),a.delete(t)}dispose(){const{tiles:e}=this;[...this.overlays].forEach(i=>{this.deleteOverlay(i)}),this.processedTiles.forEach(i=>{this._updateLayers(i),this.disposeTile(i),delete i[U]}),e.removeEventListener("update-after",this._onUpdateAfter),this.resetVirtualChildren(!0)}getAttributions(e){this.overlays.forEach(t=>{t.opacity>0&&t.getAttributions(e)})}parseToMesh(e,t,i,n){if(i==="image_overlay_tile_split")return t[j]}async resetVirtualChildren(e=!1){this._virtualChildResetId++;const t=this._virtualChildResetId;if(await Promise.all(this.overlays.map(a=>a.whenReady())),t!==this._virtualChildResetId)return;const{tiles:i}=this,n=new Set;this.processedTiles.forEach(a=>{U in a&&n.add(a)}),n.forEach(a=>{if(a.parent===null)return;const s=a.engineData.scene.clone();if(s.updateMatrixWorld(),e||a[U]!==this._getSplitVectors(s,a).hash){const o=r(a);o.sort((l,c)=>(c.internal.depth||0)-(l.internal.depth||0)),o.forEach(l=>{i.processNodeQueue.remove(l),i.lruCache.remove(l),l.parent=null}),a.children.length=0}}),e||i.forEachLoadedModel((a,s)=>{this.expandVirtualChildren(a,s)});function r(a,s=[]){return a.children.forEach(o=>{s.push(o),r(o,s)}),s}}_getSplitVectors(e,t,i=Y){const{tiles:n,overlayInfo:r}=this,a=new H;a.setFromObject(e),a.getCenter(i);const s=[],o=[];r.forEach(({tileInfo:c},u)=>{const f=c.get(t);if(f&&f.target&&u.shouldSplit(f.range,t)){u.frame?M.set(0,0,1).transformDirection(u.frame):(n.ellipsoid.getPositionToNormal(i,M),M.length()<1e-6&&M.set(1,0,0));const m=`${M.x.toFixed(3)},${M.y.toFixed(3)},${M.z.toFixed(3)}_`;o.includes(m)||o.push(m);const p=D.set(0,0,1);Math.abs(M.dot(p))>1-1e-4&&p.set(1,0,0);const d=new O().crossVectors(M,p).normalize(),_=new O().crossVectors(M,d).normalize();s.push(d,_)}});const l=[];for(;s.length!==0;){const c=s.pop().clone(),u=c.clone();for(let f=0;f<s.length;f++){const m=s[f],p=c.dot(m);Math.abs(p)>Math.cos(Math.PI/8)&&(u.addScaledVector(m,Math.sign(p)),c.copy(u).normalize(),s.splice(f,1),f--)}l.push(u.normalize())}return{directions:l,hash:o.join("")}}async expandVirtualChildren(e,t){if(t.children.length!==0||this.enableTileSplitting===!1)return;const i=e.clone();i.updateMatrixWorld();const{directions:n,hash:r}=this._getSplitVectors(i,t,Y);if(t[U]=r,n.length===0)return;const a=new le;a.attributeList=o=>!/^layer_uv_\d+/.test(o),n.map(o=>{a.addSplitOperation((l,c,u,f,m,p)=>(ee.getInterpolatedAttribute(l.attributes.position,c,u,f,m,D),D.applyMatrix4(p).sub(Y).dot(o)))});const s=[];a.forEachSplitPermutation(()=>{const o=a.clipObject(i);o.matrix.premultiply(t.engineData.transformInverse).decompose(o.position,o.quaternion,o.scale);const l=[];if(o.traverse(u=>{if(u.isMesh){const f=u.material.clone();u.material=f;for(const m in f){const p=f[m];if(p&&p.isTexture&&p.source.data instanceof ImageBitmap){const d=document.createElement("canvas");d.width=p.image.width,d.height=p.image.height;const _=d.getContext("2d");_.scale(1,-1),_.drawImage(p.source.data,0,0,d.width,-d.height);const g=new W(d);g.mapping=p.mapping,g.wrapS=p.wrapS,g.wrapT=p.wrapT,g.minFilter=p.minFilter,g.magFilter=p.magFilter,g.format=p.format,g.type=p.type,g.anisotropy=p.anisotropy,g.colorSpace=p.colorSpace,g.generateMipmaps=p.generateMipmaps,f[m]=g}}l.push(u)}}),l.length===0)return;const c={};if(t.boundingVolume.region&&(c.region=z(l,this.tiles.ellipsoid).region),t.boundingVolume.box||t.boundingVolume.sphere){be.setFromObject(o,!0).getCenter(B);let u=0;o.traverse(f=>{const m=f.geometry;if(m){const p=m.attributes.position;for(let d=0,_=p.count;d<_;d++){const g=D.fromBufferAttribute(p,d).applyMatrix4(f.matrixWorld).distanceToSquared(B);u=Math.max(u,g)}}}),c.sphere=[...B,Math.sqrt(u)]}s.push({refine:"REPLACE",geometricError:t.geometricError*.5,boundingVolume:c,content:{uri:"./child.image_overlay_tile_split"},children:[],[j]:o})}),t.refine="REPLACE",t.children.push(...s)}fetchData(e,t){if(/image_overlay_tile_split/.test(e))return new ArrayBuffer}addOverlay(e,t=null){const{tiles:i,overlays:n,overlayInfo:r}=this;t===null&&(t=n.reduce((s,o)=>Math.max(s,o.order+1),0));const a=new AbortController;n.push(e),r.set(e,{order:t,uniforms:{},tileInfo:new Map,controller:a,frame:e.frame?e.frame.clone():null}),i!==null&&this._initOverlay(e)}setOverlayOrder(e,t){this.overlays.indexOf(e)!==-1&&(this.overlayInfo.get(e).order=t,this._markNeedsUpdate())}deleteOverlay(e){const{overlays:t,overlayInfo:i,processQueue:n,processedTiles:r}=this,a=t.indexOf(e);if(a!==-1){const{tileInfo:s,controller:o}=i.get(e);r.forEach(l=>{if(!s.has(l))return;const{meshInfo:c,range:u}=s.get(l);u!==null&&e.releaseTexture(u,l),s.delete(l),c.clear()}),s.clear(),i.delete(e),o.abort(),n.removeByFilter(l=>l.overlay===e),t.splice(a,1),r.forEach(l=>{this._updateLayers(l)}),this._markNeedsUpdate()}}_initOverlay(e){const{tiles:t}=this;e.isInitialized||(e.init(),e.whenReady().then(()=>{e.setResolution(this.resolution);const r=e.fetch.bind(e);e.fetch=(...a)=>t.downloadQueue.add({priority:-performance.now()},()=>r(...a))}));const i=[],n=async(r,a)=>{this._initTileOverlayInfo(a,e);const s=this._initTileSceneOverlayInfo(r,a,e);i.push(s),await s,this._updateLayers(a)};t.forEachLoadedModel((r,a)=>{n(r,a)}),this.pendingTiles.forEach((r,a)=>{n(r,a)}),Promise.all(i).then(()=>{this._markNeedsUpdate()})}_wrapMaterials(e){e.traverse(t=>{if(t.material){const i=Ee(t.material,this.renderer,t.material.onBeforeCompile);this.meshParams.set(t,i)}})}_initTileOverlayInfo(e,t=this.overlays){if(Array.isArray(t)){t.forEach(r=>this._initTileOverlayInfo(e,r));return}const{overlayInfo:i}=this;if(i.get(t).tileInfo.has(e))return;const n={range:null,target:null,meshInfo:new Map};if(i.get(t).tileInfo.set(e,n),t.isReady&&!t.isPlanarProjection){if(e.boundingVolume.region){const[r,a,s,o]=e.boundingVolume.region,l=t.projection.toNormalizedRange([r,a,s,o]);n.range=l,t.lockTexture(l,e)}}}async _initTileSceneOverlayInfo(e,t,i=this.overlays){if(Array.isArray(i))return Promise.all(i.map(y=>this._initTileSceneOverlayInfo(e,t,y)));const{tiles:n,overlayInfo:r,tileControllers:a,processQueue:s}=this,{ellipsoid:o}=n,{controller:l,tileInfo:c}=r.get(i),u=a.get(t);if(i.isReady||await i.whenReady(),l.signal.aborted||u.signal.aborted)return;const f=[];e.updateMatrixWorld(),e.traverse(y=>{y.isMesh&&f.push(y)});const{aspectRatio:m,projection:p}=i,d=c.get(t);let _,g,E;if(i.isPlanarProjection){R.makeScale(1/m,1,1).multiply(i.frame),e.parent!==null&&R.multiply(n.group.matrixWorldInverse);let y;({range:_,uvs:g,heightRange:y}=ge(f,R)),E=!(y[0]>1||y[1]<0)}else R.identity(),e.parent!==null&&R.copy(n.group.matrixWorldInverse),{range:_,uvs:g}=z(f,o,R,p),_=p.toNormalizedRange(_),E=!0;d.range===null?(d.range=_,i.lockTexture(_,t)):_=d.range;let T=null;E&&i.hasContent(_,t)&&(T=await s.add({tile:t,overlay:i},async()=>{if(l.signal.aborted||u.signal.aborted)return null;const y=await i.getTexture(_,t);return l.signal.aborted||u.signal.aborted?null:y}).catch(y=>{if(!(y instanceof ae))throw y})),d.target=T,f.forEach((y,L)=>{const I=new Float32Array(g[L]),v=new te(I,3);d.meshInfo.set(y,{attribute:v})})}_updateLayers(e){const{overlayInfo:t,overlays:i,tileControllers:n}=this,r=n.get(e);this.tiles.recalculateBytesUsed(e),!(!r||r.signal.aborted)&&i.forEach((a,s)=>{const{tileInfo:o}=t.get(a),{meshInfo:l,target:c}=o.get(e);l.forEach(({attribute:u},f)=>{const{geometry:m,material:p}=f,d=this.meshParams.get(f),_=`layer_uv_${s}`;m.getAttribute(_)!==u&&(m.setAttribute(_,u),m.dispose()),d.layerMaps.length=i.length,d.layerInfo.length=i.length,d.layerMaps.value[s]=c!==null?c:null,d.layerInfo.value[s]=a,p.defines[`LAYER_${s}_EXISTS`]=+(c!==null),p.defines[`LAYER_${s}_ALPHA_INVERT`]=Number(a.alphaInvert),p.defines[`LAYER_${s}_ALPHA_MASK`]=Number(a.alphaMask),p.defines.LAYER_COUNT=i.length,p.needsUpdate=!0})})}_markNeedsUpdate(){this.needsUpdate===!1&&(this.needsUpdate=!0,this.tiles!==null&&this.tiles.dispatchEvent({type:"needs-update"}))}}class q{get isPlanarProjection(){return!!this.frame}constructor(e={}){const{opacity:t=1,color:i=16777215,frame:n=null,preprocessURL:r=null,alphaMask:a=!1,alphaInvert:s=!1}=e;this.preprocessURL=r,this.opacity=t,this.color=new ie(i),this.frame=n!==null?n.clone():null,this.alphaMask=a,this.alphaInvert=s,this._whenReady=null,this.isReady=!1,this.isInitialized=!1}init(){this.isInitialized=!0,this._whenReady=this._init().then(()=>this.isReady=!0)}whenReady(){return this._whenReady}_init(){}fetch(e,t={}){return this.preprocessURL&&(e=this.preprocessURL(e)),fetch(e,t)}getAttributions(e){}hasContent(e,t){return!1}async getTexture(e,t){return null}async lockTexture(e,t){return null}releaseTexture(e,t){}setResolution(e){}shouldSplit(e,t){return!1}}class Z extends q{get tiling(){return this.imageSource.tiling}get projection(){return this.tiling.projection}get aspectRatio(){return this.tiling&&this.isReady?this.tiling.aspectRatio:1}get fetchOptions(){return this.imageSource.fetchOptions}set fetchOptions(e){this.imageSource.fetchOptions=e}constructor(e={}){const{imageSource:t=null,...i}=e;super(i),this.imageSource=t,this.regionImageSource=null}_init(){return this._initImageSource().then(()=>{this.imageSource.fetchData=(...e)=>this.fetch(...e),this.regionImageSource=new Te(this.imageSource)})}_initImageSource(){return this.imageSource.init()}calculateLevel(e,t){if(this.isPlanarProjection){const[i,n,r,a]=e,s=r-i,o=a-n;let l=0;const c=this.regionImageSource.resolution,u=this.tiling.maxLevel;for(;l<u;l++){const f=c/s,m=c/o,{pixelWidth:p,pixelHeight:d}=this.tiling.getLevel(l);if(p>=f||d>=m)break}return l}else return t.internal.depthFromRenderedParent-1}hasContent(e,t){return this.regionImageSource.hasContent(...e,this.calculateLevel(e,t))}getTexture(e,t){return this.regionImageSource.get(...e,this.calculateLevel(e,t))}lockTexture(e,t){return this.regionImageSource.lock(...e,this.calculateLevel(e,t))}releaseTexture(e,t){this.regionImageSource.release(...e,this.calculateLevel(e,t))}setResolution(e){this.regionImageSource.resolution=e}shouldSplit(e,t){return this.tiling.maxLevel>this.calculateLevel(e,t)}}class Ye extends Z{constructor(e={}){super(e),this.imageSource=new G(e)}}class Be extends q{get projection(){return this.imageSource.projection}get aspectRatio(){return 2}get pointRadius(){return this.imageSource.pointRadius}set pointRadius(e){this.imageSource.pointRadius=e}get strokeStyle(){return this.imageSource.strokeStyle}set strokeStyle(e){this.imageSource.strokeStyle=e}get strokeWidth(){return this.imageSource.strokeWidth}set strokeWidth(e){this.imageSource.strokeWidth=e}get fillStyle(){return this.imageSource.fillStyle}set fillStyle(e){this.imageSource.fillStyle=e}get geojson(){return this.imageSource.geojson}set geojson(e){this.imageSource.geojson=e}constructor(e={}){super(e),this.imageSource=new Oe(e)}_init(){return this.imageSource.init()}hasContent(e){return this.imageSource.hasContent(...e)}getTexture(e){return this.imageSource.get(...e)}lockTexture(e){return this.imageSource.lock(...e)}releaseTexture(e){this.imageSource.release(...e)}setResolution(e){this.imageSource.resolution=e}shouldSplit(e,t){return!0}redraw(){this.imageSource.redraw()}}class $e extends Z{constructor(e={}){super(e);const{apiToken:t,autoRefreshToken:i,assetId:n}=e;this.options=e,this.assetId=n,this.auth=new re({apiToken:t,autoRefreshToken:i}),this.auth.authURL=`https://api.cesium.com/v1/assets/${n}/endpoint`,this._attributions=[],this.externalType=!1}_initImageSource(){return this.auth.refreshToken().then(async e=>{if(this._attributions=e.attributions.map(t=>({value:t.html,type:"html",collapsible:t.collapsible})),e.type!=="IMAGERY")throw new Error("CesiumIonOverlay: Only IMAGERY is supported as overlay type.");switch(this.externalType=!!e.externalType,e.externalType){case"GOOGLE_2D_MAPS":{const{url:t,session:i,key:n,tileWidth:r}=e.options,a=`${t}/v1/2dtiles/{z}/{x}/{y}?session=${i}&key=${n}`;this.imageSource=new G({...this.options,url:a,tileDimension:r,levels:22});break}case"BING":{const{url:t,mapStyle:i,key:n}=e.options,r=`${t}/REST/v1/Imagery/Metadata/${i}?incl=ImageryProviders&key=${n}&uriScheme=https`,s=(await fetch(r).then(o=>o.json())).resourceSets[0].resources[0];this.imageSource=new pe({...this.options,url:s.imageUrl,subdomains:s.imageUrlSubdomains,tileDimension:s.tileWidth,levels:s.zoomMax});break}default:this.imageSource=new se({...this.options,url:e.url})}return this.imageSource.fetchData=(...t)=>this.fetch(...t),this.imageSource.init()})}fetch(...e){return this.externalType?super.fetch(...e):this.auth.fetch(...e)}getAttributions(e){e.push(...this._attributions)}}export{$e as C,Be as G,Ve as I,Ye as X};
//# sourceMappingURL=ImageOverlayPlugin-DNzoKMjt.js.map

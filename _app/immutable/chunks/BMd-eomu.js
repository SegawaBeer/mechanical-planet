import{U as Dt,l as co,N as It,m as fn,d as He,F as br,n as yt,V as we,o as lo,p as et,w as qe,q as vt,r as Ki,s as bi,W as qi,t as Bt,u as tt,L as en,v as jt,x as Ut,y as Rt,z as dn,E as Et,I as fo,J as Rn,K as un,i as Mt,O as hn,X as Fi,f as Tn,B as Kn,Y as sn,Z as Yi,_ as uo,$ as $e,a0 as po,a as ut,a1 as ho,a2 as ti,a3 as Gt,a4 as cn,a5 as pn,a6 as Cn,a7 as tn,a8 as kn,a9 as mo,aa as go,ab as wn,ac as mt,ad as Vn,ae as Kt,af as Wt,ag as qn,ah as Xt,ai as on,aj as zn,ak as _o,al as bo,am as _n,an as vo,ao as xo,ap as So,aq as Eo,ar as Mo,as as To,at as Ao,au as Ro,av as Co,aw as wo,ax as Po,ay as Lo,az as Do,aA as Uo,aB as Io,aC as vr,aD as Wn,aE as On,aF as Sn,aG as xr,aH as Ht,aI as yo,aJ as No,aK as Oi,aL as Fo,aM as Gi,aN as Oo,aO as Go,aP as Ho,P as Bo,aQ as Ge,aR as ko,aS as Vo,aT as Gn,g as zo,aU as En,aV as Vt,aW as Sr,aX as Wo,aY as Er,aZ as Mr,a_ as Tr,a$ as Xn,b0 as Ar,b1 as Rr,b2 as Cr,b3 as wr,b4 as Xo,b5 as jo,b6 as Ko,b7 as qo,b8 as Pr,b9 as Yo,ba as Qo,bb as Jo,bc as ni,bd as ii,be as ai,bf as ri,bg as Qi,bh as Ji,bi as Zi,bj as $i,bk as ea,bl as ta,bm as na,bn as ia,bo as aa,bp as ra,bq as oa,br as sa,bs as ca,bt as la,bu as fa,bv as da,bw as ua,bx as pa,by as ha,bz as ma,bA as ga,bB as _a,bC as ba,bD as va,bE as xa,bF as Sa,bG as Ea,bH as Ma,bI as Ta,bJ as Aa,bK as Ra,bL as Ca,bM as vi,bN as xi,bO as Si,bP as Ei,bQ as Mi,bR as Ti,bS as Ai,bT as Zo,bU as wa,bV as $o,bW as Hn,bX as es,bY as Pa,bZ as La,b_ as Da,b$ as Ri,c0 as Ci,c1 as Lr,c2 as ts,c3 as ns,c4 as is,c5 as Dr,c6 as Ua,c7 as Ur,c8 as Ir,c9 as yr,ca as Nr,cb as Fr,cc as Or,cd as Gr,ce as Hr,cf as Ia,cg as Br,ch as as,ci as rs,cj as os,ck as ya,cl as bt,cm as ss,cn as cs,co as ls,cp as fs,cq as ds,cr as us,cs as ps,ct as wi,cu as hs,cv as ms,cw as gs,cx as Pi,cy as kr,cz as _s,cA as An,cB as Vr,cC as Nt,cD as bs,cE as vs,D as xs,cF as Ss,Q as zr,cG as Es,cH as Wr,cI as Ms,cJ as Ts,cK as As,cL as Rs,cM as oi,cN as Cs,h as Yn,cO as ws,cP as Ps,cQ as Ls,cR as Ds,cS as Us,cT as Is,cU as dt,b as nn,cV as ys,cW as Ns,cX as Fs,cY as Os,cZ as Xr,c_ as Gs,c$ as Na,d0 as Fa,d1 as Oa,d2 as Hs,k as Li,d3 as Bs,d4 as Ga}from"./D5cwLixZ.js";import{b as ks}from"./BI3X8sHF.js";/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function jr(){let e=null,n=!1,t=null,i=null;function r(a,o){t(a,o),i=e.requestAnimationFrame(r)}return{start:function(){n!==!0&&t!==null&&(i=e.requestAnimationFrame(r),n=!0)},stop:function(){e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(a){t=a},setContext:function(a){e=a}}}function Vs(e){const n=new WeakMap;function t(s,c){const d=s.array,h=s.usage,u=d.byteLength,g=e.createBuffer();e.bindBuffer(c,g),e.bufferData(c,d,h),s.onUploadCallback();let v;if(d instanceof Float32Array)v=e.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)v=e.HALF_FLOAT;else if(d instanceof Uint16Array)s.isFloat16BufferAttribute?v=e.HALF_FLOAT:v=e.UNSIGNED_SHORT;else if(d instanceof Int16Array)v=e.SHORT;else if(d instanceof Uint32Array)v=e.UNSIGNED_INT;else if(d instanceof Int32Array)v=e.INT;else if(d instanceof Int8Array)v=e.BYTE;else if(d instanceof Uint8Array)v=e.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)v=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:g,type:v,bytesPerElement:d.BYTES_PER_ELEMENT,version:s.version,size:u}}function i(s,c,d){const h=c.array,u=c.updateRanges;if(e.bindBuffer(d,s),u.length===0)e.bufferSubData(d,0,h);else{u.sort((v,R)=>v.start-R.start);let g=0;for(let v=1;v<u.length;v++){const R=u[g],w=u[v];w.start<=R.start+R.count+1?R.count=Math.max(R.count,w.start+w.count-R.start):(++g,u[g]=w)}u.length=g+1;for(let v=0,R=u.length;v<R;v++){const w=u[v];e.bufferSubData(d,w.start*h.BYTES_PER_ELEMENT,h,w.start,w.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(s){return s.isInterleavedBufferAttribute&&(s=s.data),n.get(s)}function a(s){s.isInterleavedBufferAttribute&&(s=s.data);const c=n.get(s);c&&(e.deleteBuffer(c.buffer),n.delete(s))}function o(s,c){if(s.isInterleavedBufferAttribute&&(s=s.data),s.isGLBufferAttribute){const h=n.get(s);(!h||h.version<s.version)&&n.set(s,{buffer:s.buffer,type:s.type,bytesPerElement:s.elementSize,version:s.version});return}const d=n.get(s);if(d===void 0)n.set(s,t(s,c));else if(d.version<s.version){if(d.size!==s.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(d.buffer,s,c),d.version=s.version}}return{get:r,remove:a,update:o}}var zs=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ws=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xs=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,js=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ks=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qs=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ys=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qs=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Js=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Zs=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$s=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ec=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tc=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nc=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ic=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ac=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,oc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sc=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,cc=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,dc=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,uc=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,pc=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,hc=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mc=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,_c=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,bc=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vc="gl_FragColor = linearToOutputTexel( gl_FragColor );",xc=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Sc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Ec=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Mc=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tc=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ac=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rc=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cc=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wc=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pc=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Lc=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Dc=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Uc=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ic=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,yc=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Nc=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Fc=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Oc=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Gc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Hc=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Bc=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,kc=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Vc=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,zc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Wc=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xc=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,jc=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kc=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qc=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Jc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Zc=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$c=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,el=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tl=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nl=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,il=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,al=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rl=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ol=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sl=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,cl=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ll=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fl=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,dl=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ul=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hl=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ml=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,_l=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bl=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xl=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Sl=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,El=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ml=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tl=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Al=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rl=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Cl=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,wl=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pl=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ll=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Dl=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ul=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Il=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,yl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Nl=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Fl=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ol=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Gl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Hl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,kl=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zl=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xl=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kl=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ql=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Yl=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Ql=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Jl=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Zl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$l=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ef=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,af=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,of=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,cf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ff=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,df=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,hf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_f=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Sf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ef=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Pe={alphahash_fragment:zs,alphahash_pars_fragment:Ws,alphamap_fragment:Xs,alphamap_pars_fragment:js,alphatest_fragment:Ks,alphatest_pars_fragment:qs,aomap_fragment:Ys,aomap_pars_fragment:Qs,batching_pars_vertex:Js,batching_vertex:Zs,begin_vertex:$s,beginnormal_vertex:ec,bsdfs:tc,iridescence_fragment:nc,bumpmap_pars_fragment:ic,clipping_planes_fragment:ac,clipping_planes_pars_fragment:rc,clipping_planes_pars_vertex:oc,clipping_planes_vertex:sc,color_fragment:cc,color_pars_fragment:lc,color_pars_vertex:fc,color_vertex:dc,common:uc,cube_uv_reflection_fragment:pc,defaultnormal_vertex:hc,displacementmap_pars_vertex:mc,displacementmap_vertex:gc,emissivemap_fragment:_c,emissivemap_pars_fragment:bc,colorspace_fragment:vc,colorspace_pars_fragment:xc,envmap_fragment:Sc,envmap_common_pars_fragment:Ec,envmap_pars_fragment:Mc,envmap_pars_vertex:Tc,envmap_physical_pars_fragment:Nc,envmap_vertex:Ac,fog_vertex:Rc,fog_pars_vertex:Cc,fog_fragment:wc,fog_pars_fragment:Pc,gradientmap_pars_fragment:Lc,lightmap_pars_fragment:Dc,lights_lambert_fragment:Uc,lights_lambert_pars_fragment:Ic,lights_pars_begin:yc,lights_toon_fragment:Fc,lights_toon_pars_fragment:Oc,lights_phong_fragment:Gc,lights_phong_pars_fragment:Hc,lights_physical_fragment:Bc,lights_physical_pars_fragment:kc,lights_fragment_begin:Vc,lights_fragment_maps:zc,lights_fragment_end:Wc,logdepthbuf_fragment:Xc,logdepthbuf_pars_fragment:jc,logdepthbuf_pars_vertex:Kc,logdepthbuf_vertex:qc,map_fragment:Yc,map_pars_fragment:Qc,map_particle_fragment:Jc,map_particle_pars_fragment:Zc,metalnessmap_fragment:$c,metalnessmap_pars_fragment:el,morphinstance_vertex:tl,morphcolor_vertex:nl,morphnormal_vertex:il,morphtarget_pars_vertex:al,morphtarget_vertex:rl,normal_fragment_begin:ol,normal_fragment_maps:sl,normal_pars_fragment:cl,normal_pars_vertex:ll,normal_vertex:fl,normalmap_pars_fragment:dl,clearcoat_normal_fragment_begin:ul,clearcoat_normal_fragment_maps:pl,clearcoat_pars_fragment:hl,iridescence_pars_fragment:ml,opaque_fragment:gl,packing:_l,premultiplied_alpha_fragment:bl,project_vertex:vl,dithering_fragment:xl,dithering_pars_fragment:Sl,roughnessmap_fragment:El,roughnessmap_pars_fragment:Ml,shadowmap_pars_fragment:Tl,shadowmap_pars_vertex:Al,shadowmap_vertex:Rl,shadowmask_pars_fragment:Cl,skinbase_vertex:wl,skinning_pars_vertex:Pl,skinning_vertex:Ll,skinnormal_vertex:Dl,specularmap_fragment:Ul,specularmap_pars_fragment:Il,tonemapping_fragment:yl,tonemapping_pars_fragment:Nl,transmission_fragment:Fl,transmission_pars_fragment:Ol,uv_pars_fragment:Gl,uv_pars_vertex:Hl,uv_vertex:Bl,worldpos_vertex:kl,background_vert:Vl,background_frag:zl,backgroundCube_vert:Wl,backgroundCube_frag:Xl,cube_vert:jl,cube_frag:Kl,depth_vert:ql,depth_frag:Yl,distance_vert:Ql,distance_frag:Jl,equirect_vert:Zl,equirect_frag:$l,linedashed_vert:ef,linedashed_frag:tf,meshbasic_vert:nf,meshbasic_frag:af,meshlambert_vert:rf,meshlambert_frag:of,meshmatcap_vert:sf,meshmatcap_frag:cf,meshnormal_vert:lf,meshnormal_frag:ff,meshphong_vert:df,meshphong_frag:uf,meshphysical_vert:pf,meshphysical_frag:hf,meshtoon_vert:mf,meshtoon_frag:gf,points_vert:_f,points_frag:bf,shadow_vert:vf,shadow_frag:xf,sprite_vert:Sf,sprite_frag:Ef},re={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},Lt={basic:{uniforms:bt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.fog]),vertexShader:Pe.meshbasic_vert,fragmentShader:Pe.meshbasic_frag},lambert:{uniforms:bt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new He(0)}}]),vertexShader:Pe.meshlambert_vert,fragmentShader:Pe.meshlambert_frag},phong:{uniforms:bt([re.common,re.specularmap,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.fog,re.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30}}]),vertexShader:Pe.meshphong_vert,fragmentShader:Pe.meshphong_frag},standard:{uniforms:bt([re.common,re.envmap,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.roughnessmap,re.metalnessmap,re.fog,re.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Pe.meshphysical_vert,fragmentShader:Pe.meshphysical_frag},toon:{uniforms:bt([re.common,re.aomap,re.lightmap,re.emissivemap,re.bumpmap,re.normalmap,re.displacementmap,re.gradientmap,re.fog,re.lights,{emissive:{value:new He(0)}}]),vertexShader:Pe.meshtoon_vert,fragmentShader:Pe.meshtoon_frag},matcap:{uniforms:bt([re.common,re.bumpmap,re.normalmap,re.displacementmap,re.fog,{matcap:{value:null}}]),vertexShader:Pe.meshmatcap_vert,fragmentShader:Pe.meshmatcap_frag},points:{uniforms:bt([re.points,re.fog]),vertexShader:Pe.points_vert,fragmentShader:Pe.points_frag},dashed:{uniforms:bt([re.common,re.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Pe.linedashed_vert,fragmentShader:Pe.linedashed_frag},depth:{uniforms:bt([re.common,re.displacementmap]),vertexShader:Pe.depth_vert,fragmentShader:Pe.depth_frag},normal:{uniforms:bt([re.common,re.bumpmap,re.normalmap,re.displacementmap,{opacity:{value:1}}]),vertexShader:Pe.meshnormal_vert,fragmentShader:Pe.meshnormal_frag},sprite:{uniforms:bt([re.sprite,re.fog]),vertexShader:Pe.sprite_vert,fragmentShader:Pe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Pe.background_vert,fragmentShader:Pe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Pe.backgroundCube_vert,fragmentShader:Pe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Pe.cube_vert,fragmentShader:Pe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Pe.equirect_vert,fragmentShader:Pe.equirect_frag},distance:{uniforms:bt([re.common,re.displacementmap,{referencePosition:{value:new we},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Pe.distance_vert,fragmentShader:Pe.distance_frag},shadow:{uniforms:bt([re.lights,re.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:Pe.shadow_vert,fragmentShader:Pe.shadow_frag}};Lt.physical={uniforms:bt([Lt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Pe.meshphysical_vert,fragmentShader:Pe.meshphysical_frag};const Dn={r:0,b:0,g:0},Qt=new Ur,Mf=new yt;function Tf(e,n,t,i,r,a,o){const s=new He(0);let c=a===!0?0:1,d,h,u=null,g=0,v=null;function R(M){let S=M.isScene===!0?M.background:null;return S&&S.isTexture&&(S=(M.backgroundBlurriness>0?t:n).get(S)),S}function w(M){let S=!1;const T=R(M);T===null?l(s,c):T&&T.isColor&&(l(T,1),S=!0);const A=e.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(e.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function p(M,S){const T=R(S);T&&(T.isCubeTexture||T.mapping===qn)?(h===void 0&&(h=new Mt(new Kn(1,1,1),new Kt({name:"BackgroundCubeMaterial",uniforms:Ua(Lt.backgroundCube.uniforms),vertexShader:Lt.backgroundCube.vertexShader,fragmentShader:Lt.backgroundCube.fragmentShader,side:Rt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,I,z){this.matrixWorld.copyPosition(z.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),Qt.copy(S.backgroundRotation),Qt.x*=-1,Qt.y*=-1,Qt.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Qt.y*=-1,Qt.z*=-1),h.material.uniforms.envMap.value=T,h.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Mf.makeRotationFromEuler(Qt)),h.material.toneMapped=tt.getTransfer(T.colorSpace)!==$e,(u!==T||g!==T.version||v!==e.toneMapping)&&(h.material.needsUpdate=!0,u=T,g=T.version,v=e.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):T&&T.isTexture&&(d===void 0&&(d=new Mt(new wr(2,2),new Kt({name:"BackgroundMaterial",uniforms:Ua(Lt.background.uniforms),vertexShader:Lt.background.vertexShader,fragmentShader:Lt.background.fragmentShader,side:dn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(d)),d.material.uniforms.t2D.value=T,d.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,d.material.toneMapped=tt.getTransfer(T.colorSpace)!==$e,T.matrixAutoUpdate===!0&&T.updateMatrix(),d.material.uniforms.uvTransform.value.copy(T.matrix),(u!==T||g!==T.version||v!==e.toneMapping)&&(d.material.needsUpdate=!0,u=T,g=T.version,v=e.toneMapping),d.layers.enableAll(),M.unshift(d,d.geometry,d.material,0,0,null))}function l(M,S){M.getRGB(Dn,Dr(e)),i.buffers.color.setClear(Dn.r,Dn.g,Dn.b,S,o)}function E(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0)}return{getClearColor:function(){return s},setClearColor:function(M,S=1){s.set(M),c=S,l(s,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,l(s,c)},render:w,addToRenderList:p,dispose:E}}function Af(e,n){const t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},r=g(null);let a=r,o=!1;function s(b,L,H,G,X){let q=!1;const B=u(G,H,L);a!==B&&(a=B,d(a.object)),q=v(b,G,H,X),q&&R(b,G,H,X),X!==null&&n.update(X,e.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,S(b,L,H,G),X!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(X).buffer))}function c(){return e.createVertexArray()}function d(b){return e.bindVertexArray(b)}function h(b){return e.deleteVertexArray(b)}function u(b,L,H){const G=H.wireframe===!0;let X=i[b.id];X===void 0&&(X={},i[b.id]=X);let q=X[L.id];q===void 0&&(q={},X[L.id]=q);let B=q[G];return B===void 0&&(B=g(c()),q[G]=B),B}function g(b){const L=[],H=[],G=[];for(let X=0;X<t;X++)L[X]=0,H[X]=0,G[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:H,attributeDivisors:G,object:b,attributes:{},index:null}}function v(b,L,H,G){const X=a.attributes,q=L.attributes;let B=0;const V=H.getAttributes();for(const Z in V)if(V[Z].location>=0){const _e=X[Z];let xe=q[Z];if(xe===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(xe=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(xe=b.instanceColor)),_e===void 0||_e.attribute!==xe||xe&&_e.data!==xe.data)return!0;B++}return a.attributesNum!==B||a.index!==G}function R(b,L,H,G){const X={},q=L.attributes;let B=0;const V=H.getAttributes();for(const Z in V)if(V[Z].location>=0){let _e=q[Z];_e===void 0&&(Z==="instanceMatrix"&&b.instanceMatrix&&(_e=b.instanceMatrix),Z==="instanceColor"&&b.instanceColor&&(_e=b.instanceColor));const xe={};xe.attribute=_e,_e&&_e.data&&(xe.data=_e.data),X[Z]=xe,B++}a.attributes=X,a.attributesNum=B,a.index=G}function w(){const b=a.newAttributes;for(let L=0,H=b.length;L<H;L++)b[L]=0}function p(b){l(b,0)}function l(b,L){const H=a.newAttributes,G=a.enabledAttributes,X=a.attributeDivisors;H[b]=1,G[b]===0&&(e.enableVertexAttribArray(b),G[b]=1),X[b]!==L&&(e.vertexAttribDivisor(b,L),X[b]=L)}function E(){const b=a.newAttributes,L=a.enabledAttributes;for(let H=0,G=L.length;H<G;H++)L[H]!==b[H]&&(e.disableVertexAttribArray(H),L[H]=0)}function M(b,L,H,G,X,q,B){B===!0?e.vertexAttribIPointer(b,L,H,X,q):e.vertexAttribPointer(b,L,H,G,X,q)}function S(b,L,H,G){w();const X=G.attributes,q=H.getAttributes(),B=L.defaultAttributeValues;for(const V in q){const Z=q[V];if(Z.location>=0){let Se=X[V];if(Se===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(Se=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(Se=b.instanceColor)),Se!==void 0){const _e=Se.normalized,xe=Se.itemSize,Be=n.get(Se);if(Be===void 0)continue;const ye=Be.buffer,rt=Be.type,nt=Be.bytesPerElement,W=rt===e.INT||rt===e.UNSIGNED_INT||Se.gpuType===Pr;if(Se.isInterleavedBufferAttribute){const Y=Se.data,fe=Y.stride,Ce=Se.offset;if(Y.isInstancedInterleavedBuffer){for(let pe=0;pe<Z.locationSize;pe++)l(Z.location+pe,Y.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let pe=0;pe<Z.locationSize;pe++)p(Z.location+pe);e.bindBuffer(e.ARRAY_BUFFER,ye);for(let pe=0;pe<Z.locationSize;pe++)M(Z.location+pe,xe/Z.locationSize,rt,_e,fe*nt,(Ce+xe/Z.locationSize*pe)*nt,W)}else{if(Se.isInstancedBufferAttribute){for(let Y=0;Y<Z.locationSize;Y++)l(Z.location+Y,Se.meshPerAttribute);b.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Se.meshPerAttribute*Se.count)}else for(let Y=0;Y<Z.locationSize;Y++)p(Z.location+Y);e.bindBuffer(e.ARRAY_BUFFER,ye);for(let Y=0;Y<Z.locationSize;Y++)M(Z.location+Y,xe/Z.locationSize,rt,_e,xe*nt,xe/Z.locationSize*Y*nt,W)}}else if(B!==void 0){const _e=B[V];if(_e!==void 0)switch(_e.length){case 2:e.vertexAttrib2fv(Z.location,_e);break;case 3:e.vertexAttrib3fv(Z.location,_e);break;case 4:e.vertexAttrib4fv(Z.location,_e);break;default:e.vertexAttrib1fv(Z.location,_e)}}}}E()}function T(){z();for(const b in i){const L=i[b];for(const H in L){const G=L[H];for(const X in G)h(G[X].object),delete G[X];delete L[H]}delete i[b]}}function A(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const H in L){const G=L[H];for(const X in G)h(G[X].object),delete G[X];delete L[H]}delete i[b.id]}function I(b){for(const L in i){const H=i[L];if(H[b.id]===void 0)continue;const G=H[b.id];for(const X in G)h(G[X].object),delete G[X];delete H[b.id]}}function z(){_(),o=!0,a!==r&&(a=r,d(a.object))}function _(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:s,reset:z,resetDefaultState:_,dispose:T,releaseStatesOfGeometry:A,releaseStatesOfProgram:I,initAttributes:w,enableAttribute:p,disableUnusedAttributes:E}}function Rf(e,n,t){let i;function r(d){i=d}function a(d,h){e.drawArrays(i,d,h),t.update(h,i,1)}function o(d,h,u){u!==0&&(e.drawArraysInstanced(i,d,h,u),t.update(h,i,u))}function s(d,h,u){if(u===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,d,0,h,0,u);let v=0;for(let R=0;R<u;R++)v+=h[R];t.update(v,i,1)}function c(d,h,u,g){if(u===0)return;const v=n.get("WEBGL_multi_draw");if(v===null)for(let R=0;R<d.length;R++)o(d[R],h[R],g[R]);else{v.multiDrawArraysInstancedWEBGL(i,d,0,h,0,g,0,u);let R=0;for(let w=0;w<u;w++)R+=h[w]*g[w];t.update(R,i,1)}}this.setMode=r,this.render=a,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=c}function Cf(e,n,t,i){let r;function a(){if(r!==void 0)return r;if(n.has("EXT_texture_filter_anisotropic")===!0){const I=n.get("EXT_texture_filter_anisotropic");r=e.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(I){return!(I!==Gt&&i.convert(I)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(I){const z=I===jt&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(I!==Dt&&i.convert(I)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==Vt&&!z)}function c(I){if(I==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const h=c(d);h!==d&&(qe("WebGLRenderer:",d,"not supported, using",h,"instead."),d=h);const u=t.logarithmicDepthBuffer===!0,g=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),v=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),R=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=e.getParameter(e.MAX_TEXTURE_SIZE),p=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),l=e.getParameter(e.MAX_VERTEX_ATTRIBS),E=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),S=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),T=e.getParameter(e.MAX_SAMPLES),A=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:d,logarithmicDepthBuffer:u,reversedDepthBuffer:g,maxTextures:v,maxVertexTextures:R,maxTextureSize:w,maxCubemapSize:p,maxAttributes:l,maxVertexUniforms:E,maxVaryings:M,maxFragmentUniforms:S,maxSamples:T,samples:A}}function wf(e){const n=this;let t=null,i=0,r=!1,a=!1;const o=new Bo,s=new Ge,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,g){const v=u.length!==0||g||i!==0||r;return r=g,i=u.length,v},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,g){t=h(u,g,0)},this.setState=function(u,g,v){const R=u.clippingPlanes,w=u.clipIntersection,p=u.clipShadows,l=e.get(u);if(!r||R===null||R.length===0||a&&!p)a?h(null):d();else{const E=a?0:i,M=E*4;let S=l.clippingState||null;c.value=S,S=h(R,g,M,v);for(let T=0;T!==M;++T)S[T]=t[T];l.clippingState=S,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=E}};function d(){c.value!==t&&(c.value=t,c.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function h(u,g,v,R){const w=u!==null?u.length:0;let p=null;if(w!==0){if(p=c.value,R!==!0||p===null){const l=v+w*4,E=g.matrixWorldInverse;s.getNormalMatrix(E),(p===null||p.length<l)&&(p=new Float32Array(l));for(let M=0,S=v;M!==w;++M,S+=4)o.copy(u[M]).applyMatrix4(E,s),o.normal.toArray(p,S),p[S+3]=o.constant}c.value=p,c.needsUpdate=!0}return n.numPlanes=w,n.numIntersection=0,p}}function Pf(e){let n=new WeakMap;function t(o,s){return s===Ri?o.mapping=Rn:s===Ci&&(o.mapping=un),o}function i(o){if(o&&o.isTexture){const s=o.mapping;if(s===Ri||s===Ci)if(n.has(o)){const c=n.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const d=new Sr(c.height);return d.fromEquirectangularTexture(e,o),n.set(o,d),o.addEventListener("dispose",r),t(d.texture,o.mapping)}else return null}}return o}function r(o){const s=o.target;s.removeEventListener("dispose",r);const c=n.get(s);c!==void 0&&(n.delete(s),c.dispose())}function a(){n=new WeakMap}return{get:i,dispose:a}}const zt=4,Ha=[.125,.215,.35,.446,.526,.582],$t=20,Lf=256,bn=new Fi,Ba=new He;let si=null,ci=0,li=0,fi=!1;const Df=new we;class ka{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(n,t=0,i=.1,r=100,a={}){const{size:o=256,position:s=Df}=a;si=this._renderer.getRenderTarget(),ci=this._renderer.getActiveCubeFace(),li=this._renderer.getActiveMipmapLevel(),fi=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(n,i,r,c,s),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wa(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=za(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodMeshes.length;n++)this._lodMeshes[n].geometry.dispose()}_cleanup(n){this._renderer.setRenderTarget(si,ci,li),this._renderer.xr.enabled=fi,n.scissorTest=!1,rn(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===Rn||n.mapping===un?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),si=this._renderer.getRenderTarget(),ci=this._renderer.getActiveCubeFace(),li=this._renderer.getActiveMipmapLevel(),fi=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:mt,minFilter:mt,generateMipmaps:!1,type:jt,format:Gt,colorSpace:Et,depthBuffer:!1},r=Va(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Va(n,t,i);const{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Uf(a)),this._blurMaterial=yf(a,n,t),this._ggxMaterial=If(a,n,t)}return r}_compileMaterial(n){const t=new Mt(new hn,n);this._renderer.compile(t,bn)}_sceneToCubeUV(n,t,i,r,a){const c=new Tn(90,1,t,i),d=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,g=u.autoClear,v=u.toneMapping;u.getClearColor(Ba),u.toneMapping=It,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(r),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Mt(new Kn,new sn({name:"PMREM.Background",side:Rt,depthWrite:!1,depthTest:!1})));const w=this._backgroundBox,p=w.material;let l=!1;const E=n.background;E?E.isColor&&(p.color.copy(E),n.background=null,l=!0):(p.color.copy(Ba),l=!0);for(let M=0;M<6;M++){const S=M%3;S===0?(c.up.set(0,d[M],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x+h[M],a.y,a.z)):S===1?(c.up.set(0,0,d[M]),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y+h[M],a.z)):(c.up.set(0,d[M],0),c.position.set(a.x,a.y,a.z),c.lookAt(a.x,a.y,a.z+h[M]));const T=this._cubeSize;rn(r,S*T,M>2?T:0,T,T),u.setRenderTarget(r),l&&u.render(w,c),u.render(n,c)}u.toneMapping=v,u.autoClear=g,n.background=E}_textureToCubeUV(n,t){const i=this._renderer,r=n.mapping===Rn||n.mapping===un;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wa()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=za());const a=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=a;const s=a.uniforms;s.envMap.value=n;const c=this._cubeSize;rn(t,0,0,3*c,2*c),i.setRenderTarget(t),i.render(o,bn)}_applyPMREM(n){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodMeshes.length;for(let a=1;a<r;a++)this._applyGGXFilter(n,a-1,a);t.autoClear=i}_applyGGXFilter(n,t,i){const r=this._renderer,a=this._pingPongRenderTarget,o=this._ggxMaterial,s=this._lodMeshes[i];s.material=o;const c=o.uniforms,d=i/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(d*d-h*h),g=0+d*1.25,v=u*g,{_lodMax:R}=this,w=this._sizeLods[i],p=3*w*(i>R-zt?i-R+zt:0),l=4*(this._cubeSize-w);c.envMap.value=n.texture,c.roughness.value=v,c.mipInt.value=R-t,rn(a,p,l,3*w,2*w),r.setRenderTarget(a),r.render(s,bn),c.envMap.value=a.texture,c.roughness.value=0,c.mipInt.value=R-i,rn(n,p,l,3*w,2*w),r.setRenderTarget(n),r.render(s,bn)}_blur(n,t,i,r,a){const o=this._pingPongRenderTarget;this._halfBlur(n,o,t,i,r,"latitudinal",a),this._halfBlur(o,n,i,i,r,"longitudinal",a)}_halfBlur(n,t,i,r,a,o,s){const c=this._renderer,d=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&et("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[r];u.material=d;const g=d.uniforms,v=this._sizeLods[i]-1,R=isFinite(a)?Math.PI/(2*v):2*Math.PI/(2*$t-1),w=a/R,p=isFinite(a)?1+Math.floor(h*w):$t;p>$t&&qe(`sigmaRadians, ${a}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${$t}`);const l=[];let E=0;for(let I=0;I<$t;++I){const z=I/w,_=Math.exp(-z*z/2);l.push(_),I===0?E+=_:I<p&&(E+=2*_)}for(let I=0;I<l.length;I++)l[I]=l[I]/E;g.envMap.value=n.texture,g.samples.value=p,g.weights.value=l,g.latitudinal.value=o==="latitudinal",s&&(g.poleAxis.value=s);const{_lodMax:M}=this;g.dTheta.value=R,g.mipInt.value=M-i;const S=this._sizeLods[r],T=3*S*(r>M-zt?r-M+zt:0),A=4*(this._cubeSize-S);rn(t,T,A,3*S,2*S),c.setRenderTarget(t),c.render(u,bn)}}function Uf(e){const n=[],t=[],i=[];let r=e;const a=e-zt+1+Ha.length;for(let o=0;o<a;o++){const s=Math.pow(2,r);n.push(s);let c=1/s;o>e-zt?c=Ha[o-e+zt-1]:o===0&&(c=0),t.push(c);const d=1/(s-2),h=-d,u=1+d,g=[h,h,u,h,u,u,h,h,u,u,h,u],v=6,R=6,w=3,p=2,l=1,E=new Float32Array(w*R*v),M=new Float32Array(p*R*v),S=new Float32Array(l*R*v);for(let A=0;A<v;A++){const I=A%3*2/3-1,z=A>2?0:-1,_=[I,z,0,I+2/3,z,0,I+2/3,z+1,0,I,z,0,I+2/3,z+1,0,I,z+1,0];E.set(_,w*R*A),M.set(g,p*R*A);const b=[A,A,A,A,A,A];S.set(b,l*R*A)}const T=new hn;T.setAttribute("position",new Xt(E,w)),T.setAttribute("uv",new Xt(M,p)),T.setAttribute("faceIndex",new Xt(S,l)),i.push(new Mt(T,null)),r>zt&&r--}return{lodMeshes:i,sizeLods:n,sigmas:t}}function Va(e,n,t){const i=new Bt(e,n,t);return i.texture.mapping=qn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function rn(e,n,t,i,r){e.viewport.set(n,t,i,r),e.scissor.set(n,t,i,r)}function If(e,n,t){return new Kt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Lf,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Qn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function yf(e,n,t){const i=new Float32Array($t),r=new we(0,1,0);return new Kt({name:"SphericalGaussianBlur",defines:{n:$t,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Qn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function za(){return new Kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Qn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function Wa(){return new Kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Qn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wt,depthTest:!1,depthWrite:!1})}function Qn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Nf(e){let n=new WeakMap,t=null;function i(s){if(s&&s.isTexture){const c=s.mapping,d=c===Ri||c===Ci,h=c===Rn||c===un;if(d||h){let u=n.get(s);const g=u!==void 0?u.texture.pmremVersion:0;if(s.isRenderTargetTexture&&s.pmremVersion!==g)return t===null&&(t=new ka(e)),u=d?t.fromEquirectangular(s,u):t.fromCubemap(s,u),u.texture.pmremVersion=s.pmremVersion,n.set(s,u),u.texture;if(u!==void 0)return u.texture;{const v=s.image;return d&&v&&v.height>0||h&&v&&r(v)?(t===null&&(t=new ka(e)),u=d?t.fromEquirectangular(s):t.fromCubemap(s),u.texture.pmremVersion=s.pmremVersion,n.set(s,u),s.addEventListener("dispose",a),u.texture):null}}}return s}function r(s){let c=0;const d=6;for(let h=0;h<d;h++)s[h]!==void 0&&c++;return c===d}function a(s){const c=s.target;c.removeEventListener("dispose",a);const d=n.get(c);d!==void 0&&(n.delete(c),d.dispose())}function o(){n=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function Ff(e){const n={};function t(i){if(n[i]!==void 0)return n[i];const r=e.getExtension(i);return n[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&bi("WebGLRenderer: "+i+" extension not supported."),r}}}function Of(e,n,t,i){const r={},a=new WeakMap;function o(u){const g=u.target;g.index!==null&&n.remove(g.index);for(const R in g.attributes)n.remove(g.attributes[R]);g.removeEventListener("dispose",o),delete r[g.id];const v=a.get(g);v&&(n.remove(v),a.delete(g)),i.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,t.memory.geometries--}function s(u,g){return r[g.id]===!0||(g.addEventListener("dispose",o),r[g.id]=!0,t.memory.geometries++),g}function c(u){const g=u.attributes;for(const v in g)n.update(g[v],e.ARRAY_BUFFER)}function d(u){const g=[],v=u.index,R=u.attributes.position;let w=0;if(v!==null){const E=v.array;w=v.version;for(let M=0,S=E.length;M<S;M+=3){const T=E[M+0],A=E[M+1],I=E[M+2];g.push(T,A,A,I,I,T)}}else if(R!==void 0){const E=R.array;w=R.version;for(let M=0,S=E.length/3-1;M<S;M+=3){const T=M+0,A=M+1,I=M+2;g.push(T,A,A,I,I,T)}}else return;const p=new(os(g)?as:rs)(g,1);p.version=w;const l=a.get(u);l&&n.remove(l),a.set(u,p)}function h(u){const g=a.get(u);if(g){const v=u.index;v!==null&&g.version<v.version&&d(u)}else d(u);return a.get(u)}return{get:s,update:c,getWireframeAttribute:h}}function Gf(e,n,t){let i;function r(g){i=g}let a,o;function s(g){a=g.type,o=g.bytesPerElement}function c(g,v){e.drawElements(i,v,a,g*o),t.update(v,i,1)}function d(g,v,R){R!==0&&(e.drawElementsInstanced(i,v,a,g*o,R),t.update(v,i,R))}function h(g,v,R){if(R===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,v,0,a,g,0,R);let p=0;for(let l=0;l<R;l++)p+=v[l];t.update(p,i,1)}function u(g,v,R,w){if(R===0)return;const p=n.get("WEBGL_multi_draw");if(p===null)for(let l=0;l<g.length;l++)d(g[l]/o,v[l],w[l]);else{p.multiDrawElementsInstancedWEBGL(i,v,0,a,g,0,w,0,R);let l=0;for(let E=0;E<R;E++)l+=v[E]*w[E];t.update(l,i,1)}}this.setMode=r,this.setIndex=s,this.render=c,this.renderInstances=d,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Hf(e){const n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,o,s){switch(t.calls++,o){case e.TRIANGLES:t.triangles+=s*(a/3);break;case e.LINES:t.lines+=s*(a/2);break;case e.LINE_STRIP:t.lines+=s*(a-1);break;case e.LINE_LOOP:t.lines+=s*a;break;case e.POINTS:t.points+=s*a;break;default:et("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:r,update:i}}function Bf(e,n,t){const i=new WeakMap,r=new vt;function a(o,s,c){const d=o.morphTargetInfluences,h=s.morphAttributes.position||s.morphAttributes.normal||s.morphAttributes.color,u=h!==void 0?h.length:0;let g=i.get(s);if(g===void 0||g.count!==u){let _=function(){I.dispose(),i.delete(s),s.removeEventListener("dispose",_)};g!==void 0&&g.texture.dispose();const v=s.morphAttributes.position!==void 0,R=s.morphAttributes.normal!==void 0,w=s.morphAttributes.color!==void 0,p=s.morphAttributes.position||[],l=s.morphAttributes.normal||[],E=s.morphAttributes.color||[];let M=0;v===!0&&(M=1),R===!0&&(M=2),w===!0&&(M=3);let S=s.attributes.position.count*M,T=1;S>n.maxTextureSize&&(T=Math.ceil(S/n.maxTextureSize),S=n.maxTextureSize);const A=new Float32Array(S*T*4*u),I=new Lr(A,S,T,u);I.type=Vt,I.needsUpdate=!0;const z=M*4;for(let b=0;b<u;b++){const L=p[b],H=l[b],G=E[b],X=S*T*4*b;for(let q=0;q<L.count;q++){const B=q*z;v===!0&&(r.fromBufferAttribute(L,q),A[X+B+0]=r.x,A[X+B+1]=r.y,A[X+B+2]=r.z,A[X+B+3]=0),R===!0&&(r.fromBufferAttribute(H,q),A[X+B+4]=r.x,A[X+B+5]=r.y,A[X+B+6]=r.z,A[X+B+7]=0),w===!0&&(r.fromBufferAttribute(G,q),A[X+B+8]=r.x,A[X+B+9]=r.y,A[X+B+10]=r.z,A[X+B+11]=G.itemSize===4?r.w:1)}}g={count:u,texture:I,size:new ut(S,T)},i.set(s,g),s.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(e,"morphTexture",o.morphTexture,t);else{let v=0;for(let w=0;w<d.length;w++)v+=d[w];const R=s.morphTargetsRelative?1:1-v;c.getUniforms().setValue(e,"morphTargetBaseInfluence",R),c.getUniforms().setValue(e,"morphTargetInfluences",d)}c.getUniforms().setValue(e,"morphTargetsTexture",g.texture,t),c.getUniforms().setValue(e,"morphTargetsTextureSize",g.size)}return{update:a}}function kf(e,n,t,i){let r=new WeakMap;function a(c){const d=i.render.frame,h=c.geometry,u=n.get(c,h);if(r.get(u)!==d&&(n.update(u),r.set(u,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",s)===!1&&c.addEventListener("dispose",s),r.get(c)!==d&&(t.update(c.instanceMatrix,e.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,e.ARRAY_BUFFER),r.set(c,d))),c.isSkinnedMesh){const g=c.skeleton;r.get(g)!==d&&(g.update(),r.set(g,d))}return u}function o(){r=new WeakMap}function s(c){const d=c.target;d.removeEventListener("dispose",s),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:o}}const Vf={[Hr]:"LINEAR_TONE_MAPPING",[Gr]:"REINHARD_TONE_MAPPING",[Or]:"CINEON_TONE_MAPPING",[Fr]:"ACES_FILMIC_TONE_MAPPING",[Nr]:"AGX_TONE_MAPPING",[yr]:"NEUTRAL_TONE_MAPPING",[Ir]:"CUSTOM_TONE_MAPPING"};function zf(e,n,t,i,r){const a=new Bt(n,t,{type:e,depthBuffer:i,stencilBuffer:r}),o=new Bt(n,t,{type:jt,depthBuffer:!1,stencilBuffer:!1}),s=new hn;s.setAttribute("position",new Yi([-1,3,0,-1,-1,0,3,-1,0],3)),s.setAttribute("uv",new Yi([0,2,0,0,2,0],2));const c=new uo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Mt(s,c),h=new Fi(-1,1,1,-1,0,1);let u=null,g=null,v=!1,R,w=null,p=[],l=!1;this.setSize=function(E,M){a.setSize(E,M),o.setSize(E,M);for(let S=0;S<p.length;S++){const T=p[S];T.setSize&&T.setSize(E,M)}},this.setEffects=function(E){p=E,l=p.length>0&&p[0].isRenderPass===!0;const M=a.width,S=a.height;for(let T=0;T<p.length;T++){const A=p[T];A.setSize&&A.setSize(M,S)}},this.begin=function(E,M){if(v||E.toneMapping===It&&p.length===0)return!1;if(w=M,M!==null){const S=M.width,T=M.height;(a.width!==S||a.height!==T)&&this.setSize(S,T)}return l===!1&&E.setRenderTarget(a),R=E.toneMapping,E.toneMapping=It,!0},this.hasRenderPass=function(){return l},this.end=function(E,M){E.toneMapping=R,v=!0;let S=a,T=o;for(let A=0;A<p.length;A++){const I=p[A];if(I.enabled!==!1&&(I.render(E,T,S,M),I.needsSwap!==!1)){const z=S;S=T,T=z}}if(u!==E.outputColorSpace||g!==E.toneMapping){u=E.outputColorSpace,g=E.toneMapping,c.defines={},tt.getTransfer(u)===$e&&(c.defines.SRGB_TRANSFER="");const A=Vf[g];A&&(c.defines[A]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=S.texture,E.setRenderTarget(w),E.render(d,h),w=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o.dispose(),s.dispose(),c.dispose()}}const Kr=new wi,Di=new kn(1,1),qr=new Lr,Yr=new ls,Qr=new cs,Xa=[],ja=[],Ka=new Float32Array(16),qa=new Float32Array(9),Ya=new Float32Array(4);function mn(e,n,t){const i=e[0];if(i<=0||i>0)return e;const r=n*t;let a=Xa[r];if(a===void 0&&(a=new Float32Array(r),Xa[r]=a),n!==0){i.toArray(a,0);for(let o=1,s=0;o!==n;++o)s+=t,e[o].toArray(a,s)}return a}function ct(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function lt(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function Jn(e,n){let t=ja[n];t===void 0&&(t=new Int32Array(n),ja[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Wf(e,n){const t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function Xf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ct(t,n))return;e.uniform2fv(this.addr,n),lt(t,n)}}function jf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(ct(t,n))return;e.uniform3fv(this.addr,n),lt(t,n)}}function Kf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ct(t,n))return;e.uniform4fv(this.addr,n),lt(t,n)}}function qf(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ct(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),lt(t,n)}else{if(ct(t,i))return;Ya.set(i),e.uniformMatrix2fv(this.addr,!1,Ya),lt(t,i)}}function Yf(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ct(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),lt(t,n)}else{if(ct(t,i))return;qa.set(i),e.uniformMatrix3fv(this.addr,!1,qa),lt(t,i)}}function Qf(e,n){const t=this.cache,i=n.elements;if(i===void 0){if(ct(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),lt(t,n)}else{if(ct(t,i))return;Ka.set(i),e.uniformMatrix4fv(this.addr,!1,Ka),lt(t,i)}}function Jf(e,n){const t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function Zf(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ct(t,n))return;e.uniform2iv(this.addr,n),lt(t,n)}}function $f(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(ct(t,n))return;e.uniform3iv(this.addr,n),lt(t,n)}}function ed(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ct(t,n))return;e.uniform4iv(this.addr,n),lt(t,n)}}function td(e,n){const t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function nd(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(ct(t,n))return;e.uniform2uiv(this.addr,n),lt(t,n)}}function id(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(ct(t,n))return;e.uniform3uiv(this.addr,n),lt(t,n)}}function ad(e,n){const t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(ct(t,n))return;e.uniform4uiv(this.addr,n),lt(t,n)}}function rd(e,n,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r);let a;this.type===e.SAMPLER_2D_SHADOW?(Di.compareFunction=t.isReversedDepthBuffer()?Oi:Gi,a=Di):a=Kr,t.setTexture2D(n||a,r)}function od(e,n,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(n||Yr,r)}function sd(e,n,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(n||Qr,r)}function cd(e,n,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(e.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(n||qr,r)}function ld(e){switch(e){case 5126:return Wf;case 35664:return Xf;case 35665:return jf;case 35666:return Kf;case 35674:return qf;case 35675:return Yf;case 35676:return Qf;case 5124:case 35670:return Jf;case 35667:case 35671:return Zf;case 35668:case 35672:return $f;case 35669:case 35673:return ed;case 5125:return td;case 36294:return nd;case 36295:return id;case 36296:return ad;case 35678:case 36198:case 36298:case 36306:case 35682:return rd;case 35679:case 36299:case 36307:return od;case 35680:case 36300:case 36308:case 36293:return sd;case 36289:case 36303:case 36311:case 36292:return cd}}function fd(e,n){e.uniform1fv(this.addr,n)}function dd(e,n){const t=mn(n,this.size,2);e.uniform2fv(this.addr,t)}function ud(e,n){const t=mn(n,this.size,3);e.uniform3fv(this.addr,t)}function pd(e,n){const t=mn(n,this.size,4);e.uniform4fv(this.addr,t)}function hd(e,n){const t=mn(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function md(e,n){const t=mn(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function gd(e,n){const t=mn(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function _d(e,n){e.uniform1iv(this.addr,n)}function bd(e,n){e.uniform2iv(this.addr,n)}function vd(e,n){e.uniform3iv(this.addr,n)}function xd(e,n){e.uniform4iv(this.addr,n)}function Sd(e,n){e.uniform1uiv(this.addr,n)}function Ed(e,n){e.uniform2uiv(this.addr,n)}function Md(e,n){e.uniform3uiv(this.addr,n)}function Td(e,n){e.uniform4uiv(this.addr,n)}function Ad(e,n,t){const i=this.cache,r=n.length,a=Jn(t,r);ct(i,a)||(e.uniform1iv(this.addr,a),lt(i,a));let o;this.type===e.SAMPLER_2D_SHADOW?o=Di:o=Kr;for(let s=0;s!==r;++s)t.setTexture2D(n[s]||o,a[s])}function Rd(e,n,t){const i=this.cache,r=n.length,a=Jn(t,r);ct(i,a)||(e.uniform1iv(this.addr,a),lt(i,a));for(let o=0;o!==r;++o)t.setTexture3D(n[o]||Yr,a[o])}function Cd(e,n,t){const i=this.cache,r=n.length,a=Jn(t,r);ct(i,a)||(e.uniform1iv(this.addr,a),lt(i,a));for(let o=0;o!==r;++o)t.setTextureCube(n[o]||Qr,a[o])}function wd(e,n,t){const i=this.cache,r=n.length,a=Jn(t,r);ct(i,a)||(e.uniform1iv(this.addr,a),lt(i,a));for(let o=0;o!==r;++o)t.setTexture2DArray(n[o]||qr,a[o])}function Pd(e){switch(e){case 5126:return fd;case 35664:return dd;case 35665:return ud;case 35666:return pd;case 35674:return hd;case 35675:return md;case 35676:return gd;case 5124:case 35670:return _d;case 35667:case 35671:return bd;case 35668:case 35672:return vd;case 35669:case 35673:return xd;case 5125:return Sd;case 36294:return Ed;case 36295:return Md;case 36296:return Td;case 35678:case 36198:case 36298:case 36306:case 35682:return Ad;case 35679:case 36299:case 36307:return Rd;case 35680:case 36300:case 36308:case 36293:return Cd;case 36289:case 36303:case 36311:case 36292:return wd}}class Ld{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=ld(t.type)}}class Dd{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Pd(t.type)}}class Ud{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){const r=this.seq;for(let a=0,o=r.length;a!==o;++a){const s=r[a];s.setValue(n,t[s.id],i)}}}const di=/(\w+)(\])?(\[|\.)?/g;function Qa(e,n){e.seq.push(n),e.map[n.id]=n}function Id(e,n,t){const i=e.name,r=i.length;for(di.lastIndex=0;;){const a=di.exec(i),o=di.lastIndex;let s=a[1];const c=a[2]==="]",d=a[3];if(c&&(s=s|0),d===void 0||d==="["&&o+2===r){Qa(t,d===void 0?new Ld(s,e,n):new Dd(s,e,n));break}else{let u=t.map[s];u===void 0&&(u=new Ud(s),Qa(t,u)),t=u}}}class Bn{constructor(n,t){this.seq=[],this.map={};const i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const s=n.getActiveUniform(t,o),c=n.getUniformLocation(t,s.name);Id(s,c,this)}const r=[],a=[];for(const o of this.seq)o.type===n.SAMPLER_2D_SHADOW||o.type===n.SAMPLER_CUBE_SHADOW||o.type===n.SAMPLER_2D_ARRAY_SHADOW?r.push(o):a.push(o);r.length>0&&(this.seq=r.concat(a))}setValue(n,t,i,r){const a=this.map[t];a!==void 0&&a.setValue(n,i,r)}setOptional(n,t,i){const r=t[i];r!==void 0&&this.setValue(n,i,r)}static upload(n,t,i,r){for(let a=0,o=t.length;a!==o;++a){const s=t[a],c=i[s.id];c.needsUpdate!==!1&&s.setValue(n,c.value,r)}}static seqWithValue(n,t){const i=[];for(let r=0,a=n.length;r!==a;++r){const o=n[r];o.id in t&&i.push(o)}return i}}function Ja(e,n,t){const i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}const yd=37297;let Nd=0;function Fd(e,n){const t=e.split(`
`),i=[],r=Math.max(n-6,0),a=Math.min(n+6,t.length);for(let o=r;o<a;o++){const s=o+1;i.push(`${s===n?">":" "} ${s}: ${t[o]}`)}return i.join(`
`)}const Za=new Ge;function Od(e){tt._getMatrix(Za,tt.workingColorSpace,e);const n=`mat3( ${Za.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(e)){case Br:return[n,"LinearTransferOETF"];case $e:return[n,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function $a(e,n,t){const i=e.getShaderParameter(n,e.COMPILE_STATUS),a=(e.getShaderInfoLog(n)||"").trim();if(i&&a==="")return"";const o=/ERROR: 0:(\d+)/.exec(a);if(o){const s=parseInt(o[1]);return t.toUpperCase()+`

`+a+`

`+Fd(e.getShaderSource(n),s)}else return a}function Gd(e,n){const t=Od(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Hd={[Hr]:"Linear",[Gr]:"Reinhard",[Or]:"Cineon",[Fr]:"ACESFilmic",[Nr]:"AgX",[yr]:"Neutral",[Ir]:"Custom"};function Bd(e,n){const t=Hd[n];return t===void 0?(qe("WebGLProgram: Unsupported toneMapping:",n),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Un=new we;function kd(){tt.getLuminanceCoefficients(Un);const e=Un.x.toFixed(4),n=Un.y.toFixed(4),t=Un.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Vd(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mn).join(`
`)}function zd(e){const n=[];for(const t in e){const i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Wd(e,n){const t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const a=e.getActiveAttrib(n,r),o=a.name;let s=1;a.type===e.FLOAT_MAT2&&(s=2),a.type===e.FLOAT_MAT3&&(s=3),a.type===e.FLOAT_MAT4&&(s=4),t[o]={type:a.type,location:e.getAttribLocation(n,o),locationSize:s}}return t}function Mn(e){return e!==""}function er(e,n){const t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function tr(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}const Xd=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ui(e){return e.replace(Xd,Kd)}const jd=new Map;function Kd(e,n){let t=Pe[n];if(t===void 0){const i=jd.get(n);if(i!==void 0)t=Pe[i],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return Ui(t)}const qd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function nr(e){return e.replace(qd,Yd)}function Yd(e,n,t,i){let r="";for(let a=parseInt(n);a<parseInt(t);a++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return r}function ir(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}const Qd={[Gn]:"SHADOWMAP_TYPE_PCF",[En]:"SHADOWMAP_TYPE_VSM"};function Jd(e){return Qd[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Zd={[Rn]:"ENVMAP_TYPE_CUBE",[un]:"ENVMAP_TYPE_CUBE",[qn]:"ENVMAP_TYPE_CUBE_UV"};function $d(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":Zd[e.envMapMode]||"ENVMAP_TYPE_CUBE"}const eu={[un]:"ENVMAP_MODE_REFRACTION"};function tu(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":eu[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}const nu={[ps]:"ENVMAP_BLENDING_MULTIPLY",[us]:"ENVMAP_BLENDING_MIX",[ds]:"ENVMAP_BLENDING_ADD"};function iu(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":nu[e.combine]||"ENVMAP_BLENDING_NONE"}function au(e){const n=e.envMapCubeUVHeight;if(n===null)return null;const t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function ru(e,n,t,i){const r=e.getContext(),a=t.defines;let o=t.vertexShader,s=t.fragmentShader;const c=Jd(t),d=$d(t),h=tu(t),u=iu(t),g=au(t),v=Vd(t),R=zd(a),w=r.createProgram();let p,l,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,R].filter(Mn).join(`
`),p.length>0&&(p+=`
`),l=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,R].filter(Mn).join(`
`),l.length>0&&(l+=`
`)):(p=[ir(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,R,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mn).join(`
`),l=[ir(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,R,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==It?"#define TONE_MAPPING":"",t.toneMapping!==It?Pe.tonemapping_pars_fragment:"",t.toneMapping!==It?Bd("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Pe.colorspace_pars_fragment,Gd("linearToOutputTexel",t.outputColorSpace),kd(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Mn).join(`
`)),o=Ui(o),o=er(o,t),o=tr(o,t),s=Ui(s),s=er(s,t),s=tr(s,t),o=nr(o),s=nr(s),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=[v,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,l=["#define varying in",t.glslVersion===ya?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ya?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+l);const M=E+p+o,S=E+l+s,T=Ja(r,r.VERTEX_SHADER,M),A=Ja(r,r.FRAGMENT_SHADER,S);r.attachShader(w,T),r.attachShader(w,A),t.index0AttributeName!==void 0?r.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(w,0,"position"),r.linkProgram(w);function I(L){if(e.debug.checkShaderErrors){const H=r.getProgramInfoLog(w)||"",G=r.getShaderInfoLog(T)||"",X=r.getShaderInfoLog(A)||"",q=H.trim(),B=G.trim(),V=X.trim();let Z=!0,Se=!0;if(r.getProgramParameter(w,r.LINK_STATUS)===!1)if(Z=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(r,w,T,A);else{const _e=$a(r,T,"vertex"),xe=$a(r,A,"fragment");et("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(w,r.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+q+`
`+_e+`
`+xe)}else q!==""?qe("WebGLProgram: Program Info Log:",q):(B===""||V==="")&&(Se=!1);Se&&(L.diagnostics={runnable:Z,programLog:q,vertexShader:{log:B,prefix:p},fragmentShader:{log:V,prefix:l}})}r.deleteShader(T),r.deleteShader(A),z=new Bn(r,w),_=Wd(r,w)}let z;this.getUniforms=function(){return z===void 0&&I(this),z};let _;this.getAttributes=function(){return _===void 0&&I(this),_};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(w,yd)),b},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Nd++,this.cacheKey=n,this.usedTimes=1,this.program=w,this.vertexShader=T,this.fragmentShader=A,this}let ou=0;class su{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){const t=n.vertexShader,i=n.fragmentShader,r=this._getShaderStage(t),a=this._getShaderStage(i),o=this._getShaderCacheForMaterial(n);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(a)===!1&&(o.add(a),a.usedTimes++),this}remove(n){const t=this.materialCache.get(n);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){const t=this.materialCache;let i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){const t=this.shaderCache;let i=t.get(n);return i===void 0&&(i=new cu(n),t.set(n,i)),i}}class cu{constructor(n){this.id=ou++,this.code=n,this.usedTimes=0}}function lu(e,n,t,i,r,a,o){const s=new ss,c=new su,d=new Set,h=[],u=new Map,g=r.logarithmicDepthBuffer;let v=r.precision;const R={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(_){return d.add(_),_===0?"uv":`uv${_}`}function p(_,b,L,H,G){const X=H.fog,q=G.geometry,B=_.isMeshStandardMaterial?H.environment:null,V=(_.isMeshStandardMaterial?t:n).get(_.envMap||B),Z=V&&V.mapping===qn?V.image.height:null,Se=R[_.type];_.precision!==null&&(v=r.getMaxPrecision(_.precision),v!==_.precision&&qe("WebGLProgram.getParameters:",_.precision,"not supported, using",v,"instead."));const _e=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,xe=_e!==void 0?_e.length:0;let Be=0;q.morphAttributes.position!==void 0&&(Be=1),q.morphAttributes.normal!==void 0&&(Be=2),q.morphAttributes.color!==void 0&&(Be=3);let ye,rt,nt,W;if(Se){const ze=Lt[Se];ye=ze.vertexShader,rt=ze.fragmentShader}else ye=_.vertexShader,rt=_.fragmentShader,c.update(_),nt=c.getVertexShaderID(_),W=c.getFragmentShaderID(_);const Y=e.getRenderTarget(),fe=e.state.buffers.depth.getReversed(),Ce=G.isInstancedMesh===!0,pe=G.isBatchedMesh===!0,Fe=!!_.map,ft=!!_.matcap,Ne=!!V,Ve=!!_.aoMap,je=!!_.lightMap,Le=!!_.bumpMap,ot=!!_.normalMap,C=!!_.displacementMap,st=!!_.emissiveMap,ke=!!_.metalnessMap,Ye=!!_.roughnessMap,me=_.anisotropy>0,x=_.clearcoat>0,f=_.dispersion>0,D=_.iridescence>0,k=_.sheen>0,K=_.transmission>0,O=me&&!!_.anisotropyMap,be=x&&!!_.clearcoatMap,te=x&&!!_.clearcoatNormalMap,he=x&&!!_.clearcoatRoughnessMap,Ae=D&&!!_.iridescenceMap,J=D&&!!_.iridescenceThicknessMap,ie=k&&!!_.sheenColorMap,ue=k&&!!_.sheenRoughnessMap,ge=!!_.specularMap,ne=!!_.specularColorMap,De=!!_.specularIntensityMap,P=K&&!!_.transmissionMap,se=K&&!!_.thicknessMap,$=!!_.gradientMap,ce=!!_.alphaMap,Q=_.alphaTest>0,j=!!_.alphaHash,ee=!!_.extensions;let Re=It;_.toneMapped&&(Y===null||Y.isXRRenderTarget===!0)&&(Re=e.toneMapping);const Qe={shaderID:Se,shaderType:_.type,shaderName:_.name,vertexShader:ye,fragmentShader:rt,defines:_.defines,customVertexShaderID:nt,customFragmentShaderID:W,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:v,batching:pe,batchingColor:pe&&G._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&G.instanceColor!==null,instancingMorph:Ce&&G.morphTexture!==null,outputColorSpace:Y===null?e.outputColorSpace:Y.isXRRenderTarget===!0?Y.texture.colorSpace:Et,alphaToCoverage:!!_.alphaToCoverage,map:Fe,matcap:ft,envMap:Ne,envMapMode:Ne&&V.mapping,envMapCubeUVHeight:Z,aoMap:Ve,lightMap:je,bumpMap:Le,normalMap:ot,displacementMap:C,emissiveMap:st,normalMapObjectSpace:ot&&_.normalMapType===is,normalMapTangentSpace:ot&&_.normalMapType===ns,metalnessMap:ke,roughnessMap:Ye,anisotropy:me,anisotropyMap:O,clearcoat:x,clearcoatMap:be,clearcoatNormalMap:te,clearcoatRoughnessMap:he,dispersion:f,iridescence:D,iridescenceMap:Ae,iridescenceThicknessMap:J,sheen:k,sheenColorMap:ie,sheenRoughnessMap:ue,specularMap:ge,specularColorMap:ne,specularIntensityMap:De,transmission:K,transmissionMap:P,thicknessMap:se,gradientMap:$,opaque:_.transparent===!1&&_.blending===Hn&&_.alphaToCoverage===!1,alphaMap:ce,alphaTest:Q,alphaHash:j,combine:_.combine,mapUv:Fe&&w(_.map.channel),aoMapUv:Ve&&w(_.aoMap.channel),lightMapUv:je&&w(_.lightMap.channel),bumpMapUv:Le&&w(_.bumpMap.channel),normalMapUv:ot&&w(_.normalMap.channel),displacementMapUv:C&&w(_.displacementMap.channel),emissiveMapUv:st&&w(_.emissiveMap.channel),metalnessMapUv:ke&&w(_.metalnessMap.channel),roughnessMapUv:Ye&&w(_.roughnessMap.channel),anisotropyMapUv:O&&w(_.anisotropyMap.channel),clearcoatMapUv:be&&w(_.clearcoatMap.channel),clearcoatNormalMapUv:te&&w(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&w(_.clearcoatRoughnessMap.channel),iridescenceMapUv:Ae&&w(_.iridescenceMap.channel),iridescenceThicknessMapUv:J&&w(_.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&w(_.sheenColorMap.channel),sheenRoughnessMapUv:ue&&w(_.sheenRoughnessMap.channel),specularMapUv:ge&&w(_.specularMap.channel),specularColorMapUv:ne&&w(_.specularColorMap.channel),specularIntensityMapUv:De&&w(_.specularIntensityMap.channel),transmissionMapUv:P&&w(_.transmissionMap.channel),thicknessMapUv:se&&w(_.thicknessMap.channel),alphaMapUv:ce&&w(_.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(ot||me),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:G.isPoints===!0&&!!q.attributes.uv&&(Fe||ce),fog:!!X,useFog:_.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:g,reversedDepthBuffer:fe,skinning:G.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Be,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:e.shadowMap.enabled&&L.length>0,shadowMapType:e.shadowMap.type,toneMapping:Re,decodeVideoTexture:Fe&&_.map.isVideoTexture===!0&&tt.getTransfer(_.map.colorSpace)===$e,decodeVideoTextureEmissive:st&&_.emissiveMap.isVideoTexture===!0&&tt.getTransfer(_.emissiveMap.colorSpace)===$e,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ut,flipSided:_.side===Rt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:ee&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ee&&_.extensions.multiDraw===!0||pe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Qe.vertexUv1s=d.has(1),Qe.vertexUv2s=d.has(2),Qe.vertexUv3s=d.has(3),d.clear(),Qe}function l(_){const b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(const L in _.defines)b.push(L),b.push(_.defines[L]);return _.isRawShaderMaterial===!1&&(E(b,_),M(b,_),b.push(e.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function E(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function M(_,b){s.disableAll(),b.instancing&&s.enable(0),b.instancingColor&&s.enable(1),b.instancingMorph&&s.enable(2),b.matcap&&s.enable(3),b.envMap&&s.enable(4),b.normalMapObjectSpace&&s.enable(5),b.normalMapTangentSpace&&s.enable(6),b.clearcoat&&s.enable(7),b.iridescence&&s.enable(8),b.alphaTest&&s.enable(9),b.vertexColors&&s.enable(10),b.vertexAlphas&&s.enable(11),b.vertexUv1s&&s.enable(12),b.vertexUv2s&&s.enable(13),b.vertexUv3s&&s.enable(14),b.vertexTangents&&s.enable(15),b.anisotropy&&s.enable(16),b.alphaHash&&s.enable(17),b.batching&&s.enable(18),b.dispersion&&s.enable(19),b.batchingColor&&s.enable(20),b.gradientMap&&s.enable(21),_.push(s.mask),s.disableAll(),b.fog&&s.enable(0),b.useFog&&s.enable(1),b.flatShading&&s.enable(2),b.logarithmicDepthBuffer&&s.enable(3),b.reversedDepthBuffer&&s.enable(4),b.skinning&&s.enable(5),b.morphTargets&&s.enable(6),b.morphNormals&&s.enable(7),b.morphColors&&s.enable(8),b.premultipliedAlpha&&s.enable(9),b.shadowMapEnabled&&s.enable(10),b.doubleSided&&s.enable(11),b.flipSided&&s.enable(12),b.useDepthPacking&&s.enable(13),b.dithering&&s.enable(14),b.transmission&&s.enable(15),b.sheen&&s.enable(16),b.opaque&&s.enable(17),b.pointsUvs&&s.enable(18),b.decodeVideoTexture&&s.enable(19),b.decodeVideoTextureEmissive&&s.enable(20),b.alphaToCoverage&&s.enable(21),_.push(s.mask)}function S(_){const b=R[_.type];let L;if(b){const H=Lt[b];L=ts.clone(H.uniforms)}else L=_.uniforms;return L}function T(_,b){let L=u.get(b);return L!==void 0?++L.usedTimes:(L=new ru(e,b,_,a),h.push(L),u.set(b,L)),L}function A(_){if(--_.usedTimes===0){const b=h.indexOf(_);h[b]=h[h.length-1],h.pop(),u.delete(_.cacheKey),_.destroy()}}function I(_){c.remove(_)}function z(){c.dispose()}return{getParameters:p,getProgramCacheKey:l,getUniforms:S,acquireProgram:T,releaseProgram:A,releaseShaderCache:I,programs:h,dispose:z}}function fu(){let e=new WeakMap;function n(o){return e.has(o)}function t(o){let s=e.get(o);return s===void 0&&(s={},e.set(o,s)),s}function i(o){e.delete(o)}function r(o,s,c){e.get(o)[s]=c}function a(){e=new WeakMap}return{has:n,get:t,remove:i,update:r,dispose:a}}function du(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.z!==n.z?e.z-n.z:e.id-n.id}function ar(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function rr(){const e=[];let n=0;const t=[],i=[],r=[];function a(){n=0,t.length=0,i.length=0,r.length=0}function o(u,g,v,R,w,p){let l=e[n];return l===void 0?(l={id:u.id,object:u,geometry:g,material:v,groupOrder:R,renderOrder:u.renderOrder,z:w,group:p},e[n]=l):(l.id=u.id,l.object=u,l.geometry=g,l.material=v,l.groupOrder=R,l.renderOrder=u.renderOrder,l.z=w,l.group=p),n++,l}function s(u,g,v,R,w,p){const l=o(u,g,v,R,w,p);v.transmission>0?i.push(l):v.transparent===!0?r.push(l):t.push(l)}function c(u,g,v,R,w,p){const l=o(u,g,v,R,w,p);v.transmission>0?i.unshift(l):v.transparent===!0?r.unshift(l):t.unshift(l)}function d(u,g){t.length>1&&t.sort(u||du),i.length>1&&i.sort(g||ar),r.length>1&&r.sort(g||ar)}function h(){for(let u=n,g=e.length;u<g;u++){const v=e[u];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:t,transmissive:i,transparent:r,init:a,push:s,unshift:c,finish:h,sort:d}}function uu(){let e=new WeakMap;function n(i,r){const a=e.get(i);let o;return a===void 0?(o=new rr,e.set(i,[o])):r>=a.length?(o=new rr,a.push(o)):o=a[r],o}function t(){e=new WeakMap}return{get:n,dispose:t}}function pu(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={direction:new we,color:new He};break;case"SpotLight":t={position:new we,direction:new we,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new we,color:new He,distance:0,decay:0};break;case"HemisphereLight":t={direction:new we,skyColor:new He,groundColor:new He};break;case"RectAreaLight":t={color:new He,position:new we,halfWidth:new we,halfHeight:new we};break}return e[n.id]=t,t}}}function hu(){const e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}let mu=0;function gu(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function _u(e){const n=new pu,t=hu(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)i.probe.push(new we);const r=new we,a=new yt,o=new yt;function s(d){let h=0,u=0,g=0;for(let _=0;_<9;_++)i.probe[_].set(0,0,0);let v=0,R=0,w=0,p=0,l=0,E=0,M=0,S=0,T=0,A=0,I=0;d.sort(gu);for(let _=0,b=d.length;_<b;_++){const L=d[_],H=L.color,G=L.intensity,X=L.distance;let q=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===wn?q=L.shadow.map.texture:q=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=H.r*G,u+=H.g*G,g+=H.b*G;else if(L.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(L.sh.coefficients[B],G);I++}else if(L.isDirectionalLight){const B=n.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const V=L.shadow,Z=t.get(L);Z.shadowIntensity=V.intensity,Z.shadowBias=V.bias,Z.shadowNormalBias=V.normalBias,Z.shadowRadius=V.radius,Z.shadowMapSize=V.mapSize,i.directionalShadow[v]=Z,i.directionalShadowMap[v]=q,i.directionalShadowMatrix[v]=L.shadow.matrix,E++}i.directional[v]=B,v++}else if(L.isSpotLight){const B=n.get(L);B.position.setFromMatrixPosition(L.matrixWorld),B.color.copy(H).multiplyScalar(G),B.distance=X,B.coneCos=Math.cos(L.angle),B.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),B.decay=L.decay,i.spot[w]=B;const V=L.shadow;if(L.map&&(i.spotLightMap[T]=L.map,T++,V.updateMatrices(L),L.castShadow&&A++),i.spotLightMatrix[w]=V.matrix,L.castShadow){const Z=t.get(L);Z.shadowIntensity=V.intensity,Z.shadowBias=V.bias,Z.shadowNormalBias=V.normalBias,Z.shadowRadius=V.radius,Z.shadowMapSize=V.mapSize,i.spotShadow[w]=Z,i.spotShadowMap[w]=q,S++}w++}else if(L.isRectAreaLight){const B=n.get(L);B.color.copy(H).multiplyScalar(G),B.halfWidth.set(L.width*.5,0,0),B.halfHeight.set(0,L.height*.5,0),i.rectArea[p]=B,p++}else if(L.isPointLight){const B=n.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity),B.distance=L.distance,B.decay=L.decay,L.castShadow){const V=L.shadow,Z=t.get(L);Z.shadowIntensity=V.intensity,Z.shadowBias=V.bias,Z.shadowNormalBias=V.normalBias,Z.shadowRadius=V.radius,Z.shadowMapSize=V.mapSize,Z.shadowCameraNear=V.camera.near,Z.shadowCameraFar=V.camera.far,i.pointShadow[R]=Z,i.pointShadowMap[R]=q,i.pointShadowMatrix[R]=L.shadow.matrix,M++}i.point[R]=B,R++}else if(L.isHemisphereLight){const B=n.get(L);B.skyColor.copy(L.color).multiplyScalar(G),B.groundColor.copy(L.groundColor).multiplyScalar(G),i.hemi[l]=B,l++}}p>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=re.LTC_FLOAT_1,i.rectAreaLTC2=re.LTC_FLOAT_2):(i.rectAreaLTC1=re.LTC_HALF_1,i.rectAreaLTC2=re.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=g;const z=i.hash;(z.directionalLength!==v||z.pointLength!==R||z.spotLength!==w||z.rectAreaLength!==p||z.hemiLength!==l||z.numDirectionalShadows!==E||z.numPointShadows!==M||z.numSpotShadows!==S||z.numSpotMaps!==T||z.numLightProbes!==I)&&(i.directional.length=v,i.spot.length=w,i.rectArea.length=p,i.point.length=R,i.hemi.length=l,i.directionalShadow.length=E,i.directionalShadowMap.length=E,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=E,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=S+T-A,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=I,z.directionalLength=v,z.pointLength=R,z.spotLength=w,z.rectAreaLength=p,z.hemiLength=l,z.numDirectionalShadows=E,z.numPointShadows=M,z.numSpotShadows=S,z.numSpotMaps=T,z.numLightProbes=I,i.version=mu++)}function c(d,h){let u=0,g=0,v=0,R=0,w=0;const p=h.matrixWorldInverse;for(let l=0,E=d.length;l<E;l++){const M=d[l];if(M.isDirectionalLight){const S=i.directional[u];S.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),u++}else if(M.isSpotLight){const S=i.spot[v];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),v++}else if(M.isRectAreaLight){const S=i.rectArea[R];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),o.identity(),a.copy(M.matrixWorld),a.premultiply(p),o.extractRotation(a),S.halfWidth.set(M.width*.5,0,0),S.halfHeight.set(0,M.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),R++}else if(M.isPointLight){const S=i.point[g];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),g++}else if(M.isHemisphereLight){const S=i.hemi[w];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(p),w++}}}return{setup:s,setupView:c,state:i}}function or(e){const n=new _u(e),t=[],i=[];function r(h){d.camera=h,t.length=0,i.length=0}function a(h){t.push(h)}function o(h){i.push(h)}function s(){n.setup(t)}function c(h){n.setupView(t,h)}const d={lightsArray:t,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:r,state:d,setupLights:s,setupLightsView:c,pushLight:a,pushShadow:o}}function bu(e){let n=new WeakMap;function t(r,a=0){const o=n.get(r);let s;return o===void 0?(s=new or(e),n.set(r,[s])):a>=o.length?(s=new or(e),o.push(s)):s=o[a],s}function i(){n=new WeakMap}return{get:t,dispose:i}}const vu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Su=[new we(1,0,0),new we(-1,0,0),new we(0,1,0),new we(0,-1,0),new we(0,0,1),new we(0,0,-1)],Eu=[new we(0,-1,0),new we(0,-1,0),new we(0,0,1),new we(0,0,-1),new we(0,-1,0),new we(0,-1,0)],sr=new yt,vn=new we,ui=new we;function Mu(e,n,t){let i=new br;const r=new ut,a=new ut,o=new vt,s=new ko,c=new Vo,d={},h=t.maxTextureSize,u={[dn]:Rt,[Rt]:dn,[Ut]:Ut},g=new Kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:vu,fragmentShader:xu}),v=g.clone();v.defines.HORIZONTAL_PASS=1;const R=new hn;R.setAttribute("position",new Xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Mt(R,g),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gn;let l=this.type;this.render=function(A,I,z){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||A.length===0)return;A.type===zo&&(qe("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),A.type=Gn);const _=e.getRenderTarget(),b=e.getActiveCubeFace(),L=e.getActiveMipmapLevel(),H=e.state;H.setBlending(Wt),H.buffers.depth.getReversed()===!0?H.buffers.color.setClear(0,0,0,0):H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const G=l!==this.type;G&&I.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(q=>q.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,q=A.length;X<q;X++){const B=A[X],V=B.shadow;if(V===void 0){qe("WebGLShadowMap:",B,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;r.copy(V.mapSize);const Z=V.getFrameExtents();if(r.multiply(Z),a.copy(V.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(a.x=Math.floor(h/Z.x),r.x=a.x*Z.x,V.mapSize.x=a.x),r.y>h&&(a.y=Math.floor(h/Z.y),r.y=a.y*Z.y,V.mapSize.y=a.y)),V.map===null||G===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===En){if(B.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new Bt(r.x,r.y,{format:wn,type:jt,minFilter:mt,magFilter:mt,generateMipmaps:!1}),V.map.texture.name=B.name+".shadowMap",V.map.depthTexture=new kn(r.x,r.y,Vt),V.map.depthTexture.name=B.name+".shadowMapDepth",V.map.depthTexture.format=pn,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ht,V.map.depthTexture.magFilter=Ht}else{B.isPointLight?(V.map=new Sr(r.x),V.map.depthTexture=new Wo(r.x,tn)):(V.map=new Bt(r.x,r.y),V.map.depthTexture=new kn(r.x,r.y,tn)),V.map.depthTexture.name=B.name+".shadowMap",V.map.depthTexture.format=pn;const _e=e.state.buffers.depth.getReversed();this.type===Gn?(V.map.depthTexture.compareFunction=_e?Oi:Gi,V.map.depthTexture.minFilter=mt,V.map.depthTexture.magFilter=mt):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Ht,V.map.depthTexture.magFilter=Ht)}V.camera.updateProjectionMatrix()}const Se=V.map.isWebGLCubeRenderTarget?6:1;for(let _e=0;_e<Se;_e++){if(V.map.isWebGLCubeRenderTarget)e.setRenderTarget(V.map,_e),e.clear();else{_e===0&&(e.setRenderTarget(V.map),e.clear());const xe=V.getViewport(_e);o.set(a.x*xe.x,a.y*xe.y,a.x*xe.z,a.y*xe.w),H.viewport(o)}if(B.isPointLight){const xe=V.camera,Be=V.matrix,ye=B.distance||xe.far;ye!==xe.far&&(xe.far=ye,xe.updateProjectionMatrix()),vn.setFromMatrixPosition(B.matrixWorld),xe.position.copy(vn),ui.copy(xe.position),ui.add(Su[_e]),xe.up.copy(Eu[_e]),xe.lookAt(ui),xe.updateMatrixWorld(),Be.makeTranslation(-vn.x,-vn.y,-vn.z),sr.multiplyMatrices(xe.projectionMatrix,xe.matrixWorldInverse),V._frustum.setFromProjectionMatrix(sr,xe.coordinateSystem,xe.reversedDepth)}else V.updateMatrices(B);i=V.getFrustum(),S(I,z,V.camera,B,this.type)}V.isPointLightShadow!==!0&&this.type===En&&E(V,z),V.needsUpdate=!1}l=this.type,p.needsUpdate=!1,e.setRenderTarget(_,b,L)};function E(A,I){const z=n.update(w);g.defines.VSM_SAMPLES!==A.blurSamples&&(g.defines.VSM_SAMPLES=A.blurSamples,v.defines.VSM_SAMPLES=A.blurSamples,g.needsUpdate=!0,v.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Bt(r.x,r.y,{format:wn,type:jt})),g.uniforms.shadow_pass.value=A.map.depthTexture,g.uniforms.resolution.value=A.mapSize,g.uniforms.radius.value=A.radius,e.setRenderTarget(A.mapPass),e.clear(),e.renderBufferDirect(I,null,z,g,w,null),v.uniforms.shadow_pass.value=A.mapPass.texture,v.uniforms.resolution.value=A.mapSize,v.uniforms.radius.value=A.radius,e.setRenderTarget(A.map),e.clear(),e.renderBufferDirect(I,null,z,v,w,null)}function M(A,I,z,_){let b=null;const L=z.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(L!==void 0)b=L;else if(b=z.isPointLight===!0?c:s,e.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){const H=b.uuid,G=I.uuid;let X=d[H];X===void 0&&(X={},d[H]=X);let q=X[G];q===void 0&&(q=b.clone(),X[G]=q,I.addEventListener("dispose",T)),b=q}if(b.visible=I.visible,b.wireframe=I.wireframe,_===En?b.side=I.shadowSide!==null?I.shadowSide:I.side:b.side=I.shadowSide!==null?I.shadowSide:u[I.side],b.alphaMap=I.alphaMap,b.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,b.map=I.map,b.clipShadows=I.clipShadows,b.clippingPlanes=I.clippingPlanes,b.clipIntersection=I.clipIntersection,b.displacementMap=I.displacementMap,b.displacementScale=I.displacementScale,b.displacementBias=I.displacementBias,b.wireframeLinewidth=I.wireframeLinewidth,b.linewidth=I.linewidth,z.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const H=e.properties.get(b);H.light=z}return b}function S(A,I,z,_,b){if(A.visible===!1)return;if(A.layers.test(I.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===En)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,A.matrixWorld);const G=n.update(A),X=A.material;if(Array.isArray(X)){const q=G.groups;for(let B=0,V=q.length;B<V;B++){const Z=q[B],Se=X[Z.materialIndex];if(Se&&Se.visible){const _e=M(A,Se,_,b);A.onBeforeShadow(e,A,I,z,G,_e,Z),e.renderBufferDirect(z,null,G,_e,A,Z),A.onAfterShadow(e,A,I,z,G,_e,Z)}}}else if(X.visible){const q=M(A,X,_,b);A.onBeforeShadow(e,A,I,z,G,q,null),e.renderBufferDirect(z,null,G,q,A,null),A.onAfterShadow(e,A,I,z,G,q,null)}}const H=A.children;for(let G=0,X=H.length;G<X;G++)S(H[G],I,z,_,b)}function T(A){A.target.removeEventListener("dispose",T);for(const z in d){const _=d[z],b=A.target.uuid;b in _&&(_[b].dispose(),delete _[b])}}}const Tu={[Ai]:Ti,[Mi]:xi,[Ei]:vi,[zn]:Si,[Ti]:Ai,[xi]:Mi,[vi]:Ei,[Si]:zn};function Au(e,n){function t(){let P=!1;const se=new vt;let $=null;const ce=new vt(0,0,0,0);return{setMask:function(Q){$!==Q&&!P&&(e.colorMask(Q,Q,Q,Q),$=Q)},setLocked:function(Q){P=Q},setClear:function(Q,j,ee,Re,Qe){Qe===!0&&(Q*=Re,j*=Re,ee*=Re),se.set(Q,j,ee,Re),ce.equals(se)===!1&&(e.clearColor(Q,j,ee,Re),ce.copy(se))},reset:function(){P=!1,$=null,ce.set(-1,0,0,0)}}}function i(){let P=!1,se=!1,$=null,ce=null,Q=null;return{setReversed:function(j){if(se!==j){const ee=n.get("EXT_clip_control");j?ee.clipControlEXT(ee.LOWER_LEFT_EXT,ee.ZERO_TO_ONE_EXT):ee.clipControlEXT(ee.LOWER_LEFT_EXT,ee.NEGATIVE_ONE_TO_ONE_EXT),se=j;const Re=Q;Q=null,this.setClear(Re)}},getReversed:function(){return se},setTest:function(j){j?Y(e.DEPTH_TEST):fe(e.DEPTH_TEST)},setMask:function(j){$!==j&&!P&&(e.depthMask(j),$=j)},setFunc:function(j){if(se&&(j=Tu[j]),ce!==j){switch(j){case Ai:e.depthFunc(e.NEVER);break;case Ti:e.depthFunc(e.ALWAYS);break;case Mi:e.depthFunc(e.LESS);break;case zn:e.depthFunc(e.LEQUAL);break;case Ei:e.depthFunc(e.EQUAL);break;case Si:e.depthFunc(e.GEQUAL);break;case xi:e.depthFunc(e.GREATER);break;case vi:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}ce=j}},setLocked:function(j){P=j},setClear:function(j){Q!==j&&(se&&(j=1-j),e.clearDepth(j),Q=j)},reset:function(){P=!1,$=null,ce=null,Q=null,se=!1}}}function r(){let P=!1,se=null,$=null,ce=null,Q=null,j=null,ee=null,Re=null,Qe=null;return{setTest:function(ze){P||(ze?Y(e.STENCIL_TEST):fe(e.STENCIL_TEST))},setMask:function(ze){se!==ze&&!P&&(e.stencilMask(ze),se=ze)},setFunc:function(ze,Ct,Ft){($!==ze||ce!==Ct||Q!==Ft)&&(e.stencilFunc(ze,Ct,Ft),$=ze,ce=Ct,Q=Ft)},setOp:function(ze,Ct,Ft){(j!==ze||ee!==Ct||Re!==Ft)&&(e.stencilOp(ze,Ct,Ft),j=ze,ee=Ct,Re=Ft)},setLocked:function(ze){P=ze},setClear:function(ze){Qe!==ze&&(e.clearStencil(ze),Qe=ze)},reset:function(){P=!1,se=null,$=null,ce=null,Q=null,j=null,ee=null,Re=null,Qe=null}}}const a=new t,o=new i,s=new r,c=new WeakMap,d=new WeakMap;let h={},u={},g=new WeakMap,v=[],R=null,w=!1,p=null,l=null,E=null,M=null,S=null,T=null,A=null,I=new He(0,0,0),z=0,_=!1,b=null,L=null,H=null,G=null,X=null;const q=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,V=0;const Z=e.getParameter(e.VERSION);Z.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec(Z)[1]),B=V>=1):Z.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),B=V>=2);let Se=null,_e={};const xe=e.getParameter(e.SCISSOR_BOX),Be=e.getParameter(e.VIEWPORT),ye=new vt().fromArray(xe),rt=new vt().fromArray(Be);function nt(P,se,$,ce){const Q=new Uint8Array(4),j=e.createTexture();e.bindTexture(P,j),e.texParameteri(P,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(P,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let ee=0;ee<$;ee++)P===e.TEXTURE_3D||P===e.TEXTURE_2D_ARRAY?e.texImage3D(se,0,e.RGBA,1,1,ce,0,e.RGBA,e.UNSIGNED_BYTE,Q):e.texImage2D(se+ee,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,Q);return j}const W={};W[e.TEXTURE_2D]=nt(e.TEXTURE_2D,e.TEXTURE_2D,1),W[e.TEXTURE_CUBE_MAP]=nt(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[e.TEXTURE_2D_ARRAY]=nt(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),W[e.TEXTURE_3D]=nt(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),Y(e.DEPTH_TEST),o.setFunc(zn),Le(!1),ot(wa),Y(e.CULL_FACE),Ve(Wt);function Y(P){h[P]!==!0&&(e.enable(P),h[P]=!0)}function fe(P){h[P]!==!1&&(e.disable(P),h[P]=!1)}function Ce(P,se){return u[P]!==se?(e.bindFramebuffer(P,se),u[P]=se,P===e.DRAW_FRAMEBUFFER&&(u[e.FRAMEBUFFER]=se),P===e.FRAMEBUFFER&&(u[e.DRAW_FRAMEBUFFER]=se),!0):!1}function pe(P,se){let $=v,ce=!1;if(P){$=g.get(se),$===void 0&&($=[],g.set(se,$));const Q=P.textures;if($.length!==Q.length||$[0]!==e.COLOR_ATTACHMENT0){for(let j=0,ee=Q.length;j<ee;j++)$[j]=e.COLOR_ATTACHMENT0+j;$.length=Q.length,ce=!0}}else $[0]!==e.BACK&&($[0]=e.BACK,ce=!0);ce&&e.drawBuffers($)}function Fe(P){return R!==P?(e.useProgram(P),R=P,!0):!1}const ft={[_n]:e.FUNC_ADD,[bo]:e.FUNC_SUBTRACT,[_o]:e.FUNC_REVERSE_SUBTRACT};ft[hs]=e.MIN,ft[ms]=e.MAX;const Ne={[Io]:e.ZERO,[Uo]:e.ONE,[Do]:e.SRC_COLOR,[Lo]:e.SRC_ALPHA,[Po]:e.SRC_ALPHA_SATURATE,[wo]:e.DST_COLOR,[Co]:e.DST_ALPHA,[Ro]:e.ONE_MINUS_SRC_COLOR,[Ao]:e.ONE_MINUS_SRC_ALPHA,[To]:e.ONE_MINUS_DST_COLOR,[Mo]:e.ONE_MINUS_DST_ALPHA,[Eo]:e.CONSTANT_COLOR,[So]:e.ONE_MINUS_CONSTANT_COLOR,[xo]:e.CONSTANT_ALPHA,[vo]:e.ONE_MINUS_CONSTANT_ALPHA};function Ve(P,se,$,ce,Q,j,ee,Re,Qe,ze){if(P===Wt){w===!0&&(fe(e.BLEND),w=!1);return}if(w===!1&&(Y(e.BLEND),w=!0),P!==es){if(P!==p||ze!==_){if((l!==_n||S!==_n)&&(e.blendEquation(e.FUNC_ADD),l=_n,S=_n),ze)switch(P){case Hn:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Da:e.blendFunc(e.ONE,e.ONE);break;case La:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Pa:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:et("WebGLState: Invalid blending: ",P);break}else switch(P){case Hn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case Da:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case La:et("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Pa:et("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:et("WebGLState: Invalid blending: ",P);break}E=null,M=null,T=null,A=null,I.set(0,0,0),z=0,p=P,_=ze}return}Q=Q||se,j=j||$,ee=ee||ce,(se!==l||Q!==S)&&(e.blendEquationSeparate(ft[se],ft[Q]),l=se,S=Q),($!==E||ce!==M||j!==T||ee!==A)&&(e.blendFuncSeparate(Ne[$],Ne[ce],Ne[j],Ne[ee]),E=$,M=ce,T=j,A=ee),(Re.equals(I)===!1||Qe!==z)&&(e.blendColor(Re.r,Re.g,Re.b,Qe),I.copy(Re),z=Qe),p=P,_=!1}function je(P,se){P.side===Ut?fe(e.CULL_FACE):Y(e.CULL_FACE);let $=P.side===Rt;se&&($=!$),Le($),P.blending===Hn&&P.transparent===!1?Ve(Wt):Ve(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),a.setMask(P.colorWrite);const ce=P.stencilWrite;s.setTest(ce),ce&&(s.setMask(P.stencilWriteMask),s.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),s.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),st(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Y(e.SAMPLE_ALPHA_TO_COVERAGE):fe(e.SAMPLE_ALPHA_TO_COVERAGE)}function Le(P){b!==P&&(P?e.frontFace(e.CW):e.frontFace(e.CCW),b=P)}function ot(P){P!==Zo?(Y(e.CULL_FACE),P!==L&&(P===wa?e.cullFace(e.BACK):P===$o?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):fe(e.CULL_FACE),L=P}function C(P){P!==H&&(B&&e.lineWidth(P),H=P)}function st(P,se,$){P?(Y(e.POLYGON_OFFSET_FILL),(G!==se||X!==$)&&(e.polygonOffset(se,$),G=se,X=$)):fe(e.POLYGON_OFFSET_FILL)}function ke(P){P?Y(e.SCISSOR_TEST):fe(e.SCISSOR_TEST)}function Ye(P){P===void 0&&(P=e.TEXTURE0+q-1),Se!==P&&(e.activeTexture(P),Se=P)}function me(P,se,$){$===void 0&&(Se===null?$=e.TEXTURE0+q-1:$=Se);let ce=_e[$];ce===void 0&&(ce={type:void 0,texture:void 0},_e[$]=ce),(ce.type!==P||ce.texture!==se)&&(Se!==$&&(e.activeTexture($),Se=$),e.bindTexture(P,se||W[P]),ce.type=P,ce.texture=se)}function x(){const P=_e[Se];P!==void 0&&P.type!==void 0&&(e.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function f(){try{e.compressedTexImage2D(...arguments)}catch(P){et("WebGLState:",P)}}function D(){try{e.compressedTexImage3D(...arguments)}catch(P){et("WebGLState:",P)}}function k(){try{e.texSubImage2D(...arguments)}catch(P){et("WebGLState:",P)}}function K(){try{e.texSubImage3D(...arguments)}catch(P){et("WebGLState:",P)}}function O(){try{e.compressedTexSubImage2D(...arguments)}catch(P){et("WebGLState:",P)}}function be(){try{e.compressedTexSubImage3D(...arguments)}catch(P){et("WebGLState:",P)}}function te(){try{e.texStorage2D(...arguments)}catch(P){et("WebGLState:",P)}}function he(){try{e.texStorage3D(...arguments)}catch(P){et("WebGLState:",P)}}function Ae(){try{e.texImage2D(...arguments)}catch(P){et("WebGLState:",P)}}function J(){try{e.texImage3D(...arguments)}catch(P){et("WebGLState:",P)}}function ie(P){ye.equals(P)===!1&&(e.scissor(P.x,P.y,P.z,P.w),ye.copy(P))}function ue(P){rt.equals(P)===!1&&(e.viewport(P.x,P.y,P.z,P.w),rt.copy(P))}function ge(P,se){let $=d.get(se);$===void 0&&($=new WeakMap,d.set(se,$));let ce=$.get(P);ce===void 0&&(ce=e.getUniformBlockIndex(se,P.name),$.set(P,ce))}function ne(P,se){const ce=d.get(se).get(P);c.get(se)!==ce&&(e.uniformBlockBinding(se,ce,P.__bindingPointIndex),c.set(se,ce))}function De(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),h={},Se=null,_e={},u={},g=new WeakMap,v=[],R=null,w=!1,p=null,l=null,E=null,M=null,S=null,T=null,A=null,I=new He(0,0,0),z=0,_=!1,b=null,L=null,H=null,G=null,X=null,ye.set(0,0,e.canvas.width,e.canvas.height),rt.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:Y,disable:fe,bindFramebuffer:Ce,drawBuffers:pe,useProgram:Fe,setBlending:Ve,setMaterial:je,setFlipSided:Le,setCullFace:ot,setLineWidth:C,setPolygonOffset:st,setScissorTest:ke,activeTexture:Ye,bindTexture:me,unbindTexture:x,compressedTexImage2D:f,compressedTexImage3D:D,texImage2D:Ae,texImage3D:J,updateUBOMapping:ge,uniformBlockBinding:ne,texStorage2D:te,texStorage3D:he,texSubImage2D:k,texSubImage3D:K,compressedTexSubImage2D:O,compressedTexSubImage3D:be,scissor:ie,viewport:ue,reset:De}}function Ru(e,n,t,i,r,a,o){const s=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new ut,h=new WeakMap;let u;const g=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function R(x,f){return v?new OffscreenCanvas(x,f):fs("canvas")}function w(x,f,D){let k=1;const K=me(x);if((K.width>D||K.height>D)&&(k=D/Math.max(K.width,K.height)),k<1)if(typeof HTMLImageElement<"u"&&x instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&x instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&x instanceof ImageBitmap||typeof VideoFrame<"u"&&x instanceof VideoFrame){const O=Math.floor(k*K.width),be=Math.floor(k*K.height);u===void 0&&(u=R(O,be));const te=f?R(O,be):u;return te.width=O,te.height=be,te.getContext("2d").drawImage(x,0,0,O,be),qe("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+O+"x"+be+")."),te}else return"data"in x&&qe("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),x;return x}function p(x){return x.generateMipmaps}function l(x){e.generateMipmap(x)}function E(x){return x.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:x.isWebGL3DRenderTarget?e.TEXTURE_3D:x.isWebGLArrayRenderTarget||x.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function M(x,f,D,k,K=!1){if(x!==null){if(e[x]!==void 0)return e[x];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+x+"'")}let O=f;if(f===e.RED&&(D===e.FLOAT&&(O=e.R32F),D===e.HALF_FLOAT&&(O=e.R16F),D===e.UNSIGNED_BYTE&&(O=e.R8)),f===e.RED_INTEGER&&(D===e.UNSIGNED_BYTE&&(O=e.R8UI),D===e.UNSIGNED_SHORT&&(O=e.R16UI),D===e.UNSIGNED_INT&&(O=e.R32UI),D===e.BYTE&&(O=e.R8I),D===e.SHORT&&(O=e.R16I),D===e.INT&&(O=e.R32I)),f===e.RG&&(D===e.FLOAT&&(O=e.RG32F),D===e.HALF_FLOAT&&(O=e.RG16F),D===e.UNSIGNED_BYTE&&(O=e.RG8)),f===e.RG_INTEGER&&(D===e.UNSIGNED_BYTE&&(O=e.RG8UI),D===e.UNSIGNED_SHORT&&(O=e.RG16UI),D===e.UNSIGNED_INT&&(O=e.RG32UI),D===e.BYTE&&(O=e.RG8I),D===e.SHORT&&(O=e.RG16I),D===e.INT&&(O=e.RG32I)),f===e.RGB_INTEGER&&(D===e.UNSIGNED_BYTE&&(O=e.RGB8UI),D===e.UNSIGNED_SHORT&&(O=e.RGB16UI),D===e.UNSIGNED_INT&&(O=e.RGB32UI),D===e.BYTE&&(O=e.RGB8I),D===e.SHORT&&(O=e.RGB16I),D===e.INT&&(O=e.RGB32I)),f===e.RGBA_INTEGER&&(D===e.UNSIGNED_BYTE&&(O=e.RGBA8UI),D===e.UNSIGNED_SHORT&&(O=e.RGBA16UI),D===e.UNSIGNED_INT&&(O=e.RGBA32UI),D===e.BYTE&&(O=e.RGBA8I),D===e.SHORT&&(O=e.RGBA16I),D===e.INT&&(O=e.RGBA32I)),f===e.RGB&&(D===e.UNSIGNED_INT_5_9_9_9_REV&&(O=e.RGB9_E5),D===e.UNSIGNED_INT_10F_11F_11F_REV&&(O=e.R11F_G11F_B10F)),f===e.RGBA){const be=K?Br:tt.getTransfer(k);D===e.FLOAT&&(O=e.RGBA32F),D===e.HALF_FLOAT&&(O=e.RGBA16F),D===e.UNSIGNED_BYTE&&(O=be===$e?e.SRGB8_ALPHA8:e.RGBA8),D===e.UNSIGNED_SHORT_4_4_4_4&&(O=e.RGBA4),D===e.UNSIGNED_SHORT_5_5_5_1&&(O=e.RGB5_A1)}return(O===e.R16F||O===e.R32F||O===e.RG16F||O===e.RG32F||O===e.RGBA16F||O===e.RGBA32F)&&n.get("EXT_color_buffer_float"),O}function S(x,f){let D;return x?f===null||f===tn||f===Cn?D=e.DEPTH24_STENCIL8:f===Vt?D=e.DEPTH32F_STENCIL8:f===Xn&&(D=e.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):f===null||f===tn||f===Cn?D=e.DEPTH_COMPONENT24:f===Vt?D=e.DEPTH_COMPONENT32F:f===Xn&&(D=e.DEPTH_COMPONENT16),D}function T(x,f){return p(x)===!0||x.isFramebufferTexture&&x.minFilter!==Ht&&x.minFilter!==mt?Math.log2(Math.max(f.width,f.height))+1:x.mipmaps!==void 0&&x.mipmaps.length>0?x.mipmaps.length:x.isCompressedTexture&&Array.isArray(x.image)?f.mipmaps.length:1}function A(x){const f=x.target;f.removeEventListener("dispose",A),z(f),f.isVideoTexture&&h.delete(f)}function I(x){const f=x.target;f.removeEventListener("dispose",I),b(f)}function z(x){const f=i.get(x);if(f.__webglInit===void 0)return;const D=x.source,k=g.get(D);if(k){const K=k[f.__cacheKey];K.usedTimes--,K.usedTimes===0&&_(x),Object.keys(k).length===0&&g.delete(D)}i.remove(x)}function _(x){const f=i.get(x);e.deleteTexture(f.__webglTexture);const D=x.source,k=g.get(D);delete k[f.__cacheKey],o.memory.textures--}function b(x){const f=i.get(x);if(x.depthTexture&&(x.depthTexture.dispose(),i.remove(x.depthTexture)),x.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(f.__webglFramebuffer[k]))for(let K=0;K<f.__webglFramebuffer[k].length;K++)e.deleteFramebuffer(f.__webglFramebuffer[k][K]);else e.deleteFramebuffer(f.__webglFramebuffer[k]);f.__webglDepthbuffer&&e.deleteRenderbuffer(f.__webglDepthbuffer[k])}else{if(Array.isArray(f.__webglFramebuffer))for(let k=0;k<f.__webglFramebuffer.length;k++)e.deleteFramebuffer(f.__webglFramebuffer[k]);else e.deleteFramebuffer(f.__webglFramebuffer);if(f.__webglDepthbuffer&&e.deleteRenderbuffer(f.__webglDepthbuffer),f.__webglMultisampledFramebuffer&&e.deleteFramebuffer(f.__webglMultisampledFramebuffer),f.__webglColorRenderbuffer)for(let k=0;k<f.__webglColorRenderbuffer.length;k++)f.__webglColorRenderbuffer[k]&&e.deleteRenderbuffer(f.__webglColorRenderbuffer[k]);f.__webglDepthRenderbuffer&&e.deleteRenderbuffer(f.__webglDepthRenderbuffer)}const D=x.textures;for(let k=0,K=D.length;k<K;k++){const O=i.get(D[k]);O.__webglTexture&&(e.deleteTexture(O.__webglTexture),o.memory.textures--),i.remove(D[k])}i.remove(x)}let L=0;function H(){L=0}function G(){const x=L;return x>=r.maxTextures&&qe("WebGLTextures: Trying to use "+x+" texture units while this GPU supports only "+r.maxTextures),L+=1,x}function X(x){const f=[];return f.push(x.wrapS),f.push(x.wrapT),f.push(x.wrapR||0),f.push(x.magFilter),f.push(x.minFilter),f.push(x.anisotropy),f.push(x.internalFormat),f.push(x.format),f.push(x.type),f.push(x.generateMipmaps),f.push(x.premultiplyAlpha),f.push(x.flipY),f.push(x.unpackAlignment),f.push(x.colorSpace),f.join()}function q(x,f){const D=i.get(x);if(x.isVideoTexture&&ke(x),x.isRenderTargetTexture===!1&&x.isExternalTexture!==!0&&x.version>0&&D.__version!==x.version){const k=x.image;if(k===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{W(D,x,f);return}}else x.isExternalTexture&&(D.__webglTexture=x.sourceTexture?x.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,D.__webglTexture,e.TEXTURE0+f)}function B(x,f){const D=i.get(x);if(x.isRenderTargetTexture===!1&&x.version>0&&D.__version!==x.version){W(D,x,f);return}else x.isExternalTexture&&(D.__webglTexture=x.sourceTexture?x.sourceTexture:null);t.bindTexture(e.TEXTURE_2D_ARRAY,D.__webglTexture,e.TEXTURE0+f)}function V(x,f){const D=i.get(x);if(x.isRenderTargetTexture===!1&&x.version>0&&D.__version!==x.version){W(D,x,f);return}t.bindTexture(e.TEXTURE_3D,D.__webglTexture,e.TEXTURE0+f)}function Z(x,f){const D=i.get(x);if(x.isCubeDepthTexture!==!0&&x.version>0&&D.__version!==x.version){Y(D,x,f);return}t.bindTexture(e.TEXTURE_CUBE_MAP,D.__webglTexture,e.TEXTURE0+f)}const Se={[Wn]:e.REPEAT,[Vn]:e.CLAMP_TO_EDGE,[vr]:e.MIRRORED_REPEAT},_e={[Ht]:e.NEAREST,[xr]:e.NEAREST_MIPMAP_NEAREST,[Sn]:e.NEAREST_MIPMAP_LINEAR,[mt]:e.LINEAR,[On]:e.LINEAR_MIPMAP_NEAREST,[en]:e.LINEAR_MIPMAP_LINEAR},xe={[Ho]:e.NEVER,[Go]:e.ALWAYS,[Oo]:e.LESS,[Gi]:e.LEQUAL,[Fo]:e.EQUAL,[Oi]:e.GEQUAL,[No]:e.GREATER,[yo]:e.NOTEQUAL};function Be(x,f){if(f.type===Vt&&n.has("OES_texture_float_linear")===!1&&(f.magFilter===mt||f.magFilter===On||f.magFilter===Sn||f.magFilter===en||f.minFilter===mt||f.minFilter===On||f.minFilter===Sn||f.minFilter===en)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(x,e.TEXTURE_WRAP_S,Se[f.wrapS]),e.texParameteri(x,e.TEXTURE_WRAP_T,Se[f.wrapT]),(x===e.TEXTURE_3D||x===e.TEXTURE_2D_ARRAY)&&e.texParameteri(x,e.TEXTURE_WRAP_R,Se[f.wrapR]),e.texParameteri(x,e.TEXTURE_MAG_FILTER,_e[f.magFilter]),e.texParameteri(x,e.TEXTURE_MIN_FILTER,_e[f.minFilter]),f.compareFunction&&(e.texParameteri(x,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(x,e.TEXTURE_COMPARE_FUNC,xe[f.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(f.magFilter===Ht||f.minFilter!==Sn&&f.minFilter!==en||f.type===Vt&&n.has("OES_texture_float_linear")===!1)return;if(f.anisotropy>1||i.get(f).__currentAnisotropy){const D=n.get("EXT_texture_filter_anisotropic");e.texParameterf(x,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(f.anisotropy,r.getMaxAnisotropy())),i.get(f).__currentAnisotropy=f.anisotropy}}}function ye(x,f){let D=!1;x.__webglInit===void 0&&(x.__webglInit=!0,f.addEventListener("dispose",A));const k=f.source;let K=g.get(k);K===void 0&&(K={},g.set(k,K));const O=X(f);if(O!==x.__cacheKey){K[O]===void 0&&(K[O]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,D=!0),K[O].usedTimes++;const be=K[x.__cacheKey];be!==void 0&&(K[x.__cacheKey].usedTimes--,be.usedTimes===0&&_(f)),x.__cacheKey=O,x.__webglTexture=K[O].texture}return D}function rt(x,f,D){return Math.floor(Math.floor(x/D)/f)}function nt(x,f,D,k){const O=x.updateRanges;if(O.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,f.width,f.height,D,k,f.data);else{O.sort((J,ie)=>J.start-ie.start);let be=0;for(let J=1;J<O.length;J++){const ie=O[be],ue=O[J],ge=ie.start+ie.count,ne=rt(ue.start,f.width,4),De=rt(ie.start,f.width,4);ue.start<=ge+1&&ne===De&&rt(ue.start+ue.count-1,f.width,4)===ne?ie.count=Math.max(ie.count,ue.start+ue.count-ie.start):(++be,O[be]=ue)}O.length=be+1;const te=e.getParameter(e.UNPACK_ROW_LENGTH),he=e.getParameter(e.UNPACK_SKIP_PIXELS),Ae=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,f.width);for(let J=0,ie=O.length;J<ie;J++){const ue=O[J],ge=Math.floor(ue.start/4),ne=Math.ceil(ue.count/4),De=ge%f.width,P=Math.floor(ge/f.width),se=ne,$=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,De),e.pixelStorei(e.UNPACK_SKIP_ROWS,P),t.texSubImage2D(e.TEXTURE_2D,0,De,P,se,$,D,k,f.data)}x.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,te),e.pixelStorei(e.UNPACK_SKIP_PIXELS,he),e.pixelStorei(e.UNPACK_SKIP_ROWS,Ae)}}function W(x,f,D){let k=e.TEXTURE_2D;(f.isDataArrayTexture||f.isCompressedArrayTexture)&&(k=e.TEXTURE_2D_ARRAY),f.isData3DTexture&&(k=e.TEXTURE_3D);const K=ye(x,f),O=f.source;t.bindTexture(k,x.__webglTexture,e.TEXTURE0+D);const be=i.get(O);if(O.version!==be.__version||K===!0){t.activeTexture(e.TEXTURE0+D);const te=tt.getPrimaries(tt.workingColorSpace),he=f.colorSpace===on?null:tt.getPrimaries(f.colorSpace),Ae=f.colorSpace===on||te===he?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,f.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,f.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,f.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);let J=w(f.image,!1,r.maxTextureSize);J=Ye(f,J);const ie=a.convert(f.format,f.colorSpace),ue=a.convert(f.type);let ge=M(f.internalFormat,ie,ue,f.colorSpace,f.isVideoTexture);Be(k,f);let ne;const De=f.mipmaps,P=f.isVideoTexture!==!0,se=be.__version===void 0||K===!0,$=O.dataReady,ce=T(f,J);if(f.isDepthTexture)ge=S(f.format===cn,f.type),se&&(P?t.texStorage2D(e.TEXTURE_2D,1,ge,J.width,J.height):t.texImage2D(e.TEXTURE_2D,0,ge,J.width,J.height,0,ie,ue,null));else if(f.isDataTexture)if(De.length>0){P&&se&&t.texStorage2D(e.TEXTURE_2D,ce,ge,De[0].width,De[0].height);for(let Q=0,j=De.length;Q<j;Q++)ne=De[Q],P?$&&t.texSubImage2D(e.TEXTURE_2D,Q,0,0,ne.width,ne.height,ie,ue,ne.data):t.texImage2D(e.TEXTURE_2D,Q,ge,ne.width,ne.height,0,ie,ue,ne.data);f.generateMipmaps=!1}else P?(se&&t.texStorage2D(e.TEXTURE_2D,ce,ge,J.width,J.height),$&&nt(f,J,ie,ue)):t.texImage2D(e.TEXTURE_2D,0,ge,J.width,J.height,0,ie,ue,J.data);else if(f.isCompressedTexture)if(f.isCompressedArrayTexture){P&&se&&t.texStorage3D(e.TEXTURE_2D_ARRAY,ce,ge,De[0].width,De[0].height,J.depth);for(let Q=0,j=De.length;Q<j;Q++)if(ne=De[Q],f.format!==Gt)if(ie!==null)if(P){if($)if(f.layerUpdates.size>0){const ee=Ia(ne.width,ne.height,f.format,f.type);for(const Re of f.layerUpdates){const Qe=ne.data.subarray(Re*ee/ne.data.BYTES_PER_ELEMENT,(Re+1)*ee/ne.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,Re,ne.width,ne.height,1,ie,Qe)}f.clearLayerUpdates()}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,ne.width,ne.height,J.depth,ie,ne.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Q,ge,ne.width,ne.height,J.depth,0,ne.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?$&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,Q,0,0,0,ne.width,ne.height,J.depth,ie,ue,ne.data):t.texImage3D(e.TEXTURE_2D_ARRAY,Q,ge,ne.width,ne.height,J.depth,0,ie,ue,ne.data)}else{P&&se&&t.texStorage2D(e.TEXTURE_2D,ce,ge,De[0].width,De[0].height);for(let Q=0,j=De.length;Q<j;Q++)ne=De[Q],f.format!==Gt?ie!==null?P?$&&t.compressedTexSubImage2D(e.TEXTURE_2D,Q,0,0,ne.width,ne.height,ie,ne.data):t.compressedTexImage2D(e.TEXTURE_2D,Q,ge,ne.width,ne.height,0,ne.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?$&&t.texSubImage2D(e.TEXTURE_2D,Q,0,0,ne.width,ne.height,ie,ue,ne.data):t.texImage2D(e.TEXTURE_2D,Q,ge,ne.width,ne.height,0,ie,ue,ne.data)}else if(f.isDataArrayTexture)if(P){if(se&&t.texStorage3D(e.TEXTURE_2D_ARRAY,ce,ge,J.width,J.height,J.depth),$)if(f.layerUpdates.size>0){const Q=Ia(J.width,J.height,f.format,f.type);for(const j of f.layerUpdates){const ee=J.data.subarray(j*Q/J.data.BYTES_PER_ELEMENT,(j+1)*Q/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,j,J.width,J.height,1,ie,ue,ee)}f.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,ie,ue,J.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,ge,J.width,J.height,J.depth,0,ie,ue,J.data);else if(f.isData3DTexture)P?(se&&t.texStorage3D(e.TEXTURE_3D,ce,ge,J.width,J.height,J.depth),$&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,ie,ue,J.data)):t.texImage3D(e.TEXTURE_3D,0,ge,J.width,J.height,J.depth,0,ie,ue,J.data);else if(f.isFramebufferTexture){if(se)if(P)t.texStorage2D(e.TEXTURE_2D,ce,ge,J.width,J.height);else{let Q=J.width,j=J.height;for(let ee=0;ee<ce;ee++)t.texImage2D(e.TEXTURE_2D,ee,ge,Q,j,0,ie,ue,null),Q>>=1,j>>=1}}else if(De.length>0){if(P&&se){const Q=me(De[0]);t.texStorage2D(e.TEXTURE_2D,ce,ge,Q.width,Q.height)}for(let Q=0,j=De.length;Q<j;Q++)ne=De[Q],P?$&&t.texSubImage2D(e.TEXTURE_2D,Q,0,0,ie,ue,ne):t.texImage2D(e.TEXTURE_2D,Q,ge,ie,ue,ne);f.generateMipmaps=!1}else if(P){if(se){const Q=me(J);t.texStorage2D(e.TEXTURE_2D,ce,ge,Q.width,Q.height)}$&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,ie,ue,J)}else t.texImage2D(e.TEXTURE_2D,0,ge,ie,ue,J);p(f)&&l(k),be.__version=O.version,f.onUpdate&&f.onUpdate(f)}x.__version=f.version}function Y(x,f,D){if(f.image.length!==6)return;const k=ye(x,f),K=f.source;t.bindTexture(e.TEXTURE_CUBE_MAP,x.__webglTexture,e.TEXTURE0+D);const O=i.get(K);if(K.version!==O.__version||k===!0){t.activeTexture(e.TEXTURE0+D);const be=tt.getPrimaries(tt.workingColorSpace),te=f.colorSpace===on?null:tt.getPrimaries(f.colorSpace),he=f.colorSpace===on||be===te?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,f.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,f.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,f.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const Ae=f.isCompressedTexture||f.image[0].isCompressedTexture,J=f.image[0]&&f.image[0].isDataTexture,ie=[];for(let j=0;j<6;j++)!Ae&&!J?ie[j]=w(f.image[j],!0,r.maxCubemapSize):ie[j]=J?f.image[j].image:f.image[j],ie[j]=Ye(f,ie[j]);const ue=ie[0],ge=a.convert(f.format,f.colorSpace),ne=a.convert(f.type),De=M(f.internalFormat,ge,ne,f.colorSpace),P=f.isVideoTexture!==!0,se=O.__version===void 0||k===!0,$=K.dataReady;let ce=T(f,ue);Be(e.TEXTURE_CUBE_MAP,f);let Q;if(Ae){P&&se&&t.texStorage2D(e.TEXTURE_CUBE_MAP,ce,De,ue.width,ue.height);for(let j=0;j<6;j++){Q=ie[j].mipmaps;for(let ee=0;ee<Q.length;ee++){const Re=Q[ee];f.format!==Gt?ge!==null?P?$&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee,0,0,Re.width,Re.height,ge,Re.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee,De,Re.width,Re.height,0,Re.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?$&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee,0,0,Re.width,Re.height,ge,ne,Re.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee,De,Re.width,Re.height,0,ge,ne,Re.data)}}}else{if(Q=f.mipmaps,P&&se){Q.length>0&&ce++;const j=me(ie[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,ce,De,j.width,j.height)}for(let j=0;j<6;j++)if(J){P?$&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ie[j].width,ie[j].height,ge,ne,ie[j].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,De,ie[j].width,ie[j].height,0,ge,ne,ie[j].data);for(let ee=0;ee<Q.length;ee++){const Qe=Q[ee].image[j].image;P?$&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee+1,0,0,Qe.width,Qe.height,ge,ne,Qe.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee+1,De,Qe.width,Qe.height,0,ge,ne,Qe.data)}}else{P?$&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ge,ne,ie[j]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,De,ge,ne,ie[j]);for(let ee=0;ee<Q.length;ee++){const Re=Q[ee];P?$&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee+1,0,0,ge,ne,Re.image[j]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+j,ee+1,De,ge,ne,Re.image[j])}}}p(f)&&l(e.TEXTURE_CUBE_MAP),O.__version=K.version,f.onUpdate&&f.onUpdate(f)}x.__version=f.version}function fe(x,f,D,k,K,O){const be=a.convert(D.format,D.colorSpace),te=a.convert(D.type),he=M(D.internalFormat,be,te,D.colorSpace),Ae=i.get(f),J=i.get(D);if(J.__renderTarget=f,!Ae.__hasExternalTextures){const ie=Math.max(1,f.width>>O),ue=Math.max(1,f.height>>O);K===e.TEXTURE_3D||K===e.TEXTURE_2D_ARRAY?t.texImage3D(K,O,he,ie,ue,f.depth,0,be,te,null):t.texImage2D(K,O,he,ie,ue,0,be,te,null)}t.bindFramebuffer(e.FRAMEBUFFER,x),st(f)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,k,K,J.__webglTexture,0,C(f)):(K===e.TEXTURE_2D||K>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,k,K,J.__webglTexture,O),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(x,f,D){if(e.bindRenderbuffer(e.RENDERBUFFER,x),f.depthBuffer){const k=f.depthTexture,K=k&&k.isDepthTexture?k.type:null,O=S(f.stencilBuffer,K),be=f.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;st(f)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,C(f),O,f.width,f.height):D?e.renderbufferStorageMultisample(e.RENDERBUFFER,C(f),O,f.width,f.height):e.renderbufferStorage(e.RENDERBUFFER,O,f.width,f.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,be,e.RENDERBUFFER,x)}else{const k=f.textures;for(let K=0;K<k.length;K++){const O=k[K],be=a.convert(O.format,O.colorSpace),te=a.convert(O.type),he=M(O.internalFormat,be,te,O.colorSpace);st(f)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,C(f),he,f.width,f.height):D?e.renderbufferStorageMultisample(e.RENDERBUFFER,C(f),he,f.width,f.height):e.renderbufferStorage(e.RENDERBUFFER,he,f.width,f.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function pe(x,f,D){const k=f.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(e.FRAMEBUFFER,x),!(f.depthTexture&&f.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const K=i.get(f.depthTexture);if(K.__renderTarget=f,(!K.__webglTexture||f.depthTexture.image.width!==f.width||f.depthTexture.image.height!==f.height)&&(f.depthTexture.image.width=f.width,f.depthTexture.image.height=f.height,f.depthTexture.needsUpdate=!0),k){if(K.__webglInit===void 0&&(K.__webglInit=!0,f.depthTexture.addEventListener("dispose",A)),K.__webglTexture===void 0){K.__webglTexture=e.createTexture(),t.bindTexture(e.TEXTURE_CUBE_MAP,K.__webglTexture),Be(e.TEXTURE_CUBE_MAP,f.depthTexture);const Ae=a.convert(f.depthTexture.format),J=a.convert(f.depthTexture.type);let ie;f.depthTexture.format===pn?ie=e.DEPTH_COMPONENT24:f.depthTexture.format===cn&&(ie=e.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,ie,f.width,f.height,0,Ae,J,null)}}else q(f.depthTexture,0);const O=K.__webglTexture,be=C(f),te=k?e.TEXTURE_CUBE_MAP_POSITIVE_X+D:e.TEXTURE_2D,he=f.depthTexture.format===cn?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(f.depthTexture.format===pn)st(f)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,he,te,O,0,be):e.framebufferTexture2D(e.FRAMEBUFFER,he,te,O,0);else if(f.depthTexture.format===cn)st(f)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,he,te,O,0,be):e.framebufferTexture2D(e.FRAMEBUFFER,he,te,O,0);else throw new Error("Unknown depthTexture format")}function Fe(x){const f=i.get(x),D=x.isWebGLCubeRenderTarget===!0;if(f.__boundDepthTexture!==x.depthTexture){const k=x.depthTexture;if(f.__depthDisposeCallback&&f.__depthDisposeCallback(),k){const K=()=>{delete f.__boundDepthTexture,delete f.__depthDisposeCallback,k.removeEventListener("dispose",K)};k.addEventListener("dispose",K),f.__depthDisposeCallback=K}f.__boundDepthTexture=k}if(x.depthTexture&&!f.__autoAllocateDepthBuffer)if(D)for(let k=0;k<6;k++)pe(f.__webglFramebuffer[k],x,k);else{const k=x.texture.mipmaps;k&&k.length>0?pe(f.__webglFramebuffer[0],x,0):pe(f.__webglFramebuffer,x,0)}else if(D){f.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(e.FRAMEBUFFER,f.__webglFramebuffer[k]),f.__webglDepthbuffer[k]===void 0)f.__webglDepthbuffer[k]=e.createRenderbuffer(),Ce(f.__webglDepthbuffer[k],x,!1);else{const K=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,O=f.__webglDepthbuffer[k];e.bindRenderbuffer(e.RENDERBUFFER,O),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,O)}}else{const k=x.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(e.FRAMEBUFFER,f.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,f.__webglFramebuffer),f.__webglDepthbuffer===void 0)f.__webglDepthbuffer=e.createRenderbuffer(),Ce(f.__webglDepthbuffer,x,!1);else{const K=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,O=f.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,O),e.framebufferRenderbuffer(e.FRAMEBUFFER,K,e.RENDERBUFFER,O)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function ft(x,f,D){const k=i.get(x);f!==void 0&&fe(k.__webglFramebuffer,x,x.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),D!==void 0&&Fe(x)}function Ne(x){const f=x.texture,D=i.get(x),k=i.get(f);x.addEventListener("dispose",I);const K=x.textures,O=x.isWebGLCubeRenderTarget===!0,be=K.length>1;if(be||(k.__webglTexture===void 0&&(k.__webglTexture=e.createTexture()),k.__version=f.version,o.memory.textures++),O){D.__webglFramebuffer=[];for(let te=0;te<6;te++)if(f.mipmaps&&f.mipmaps.length>0){D.__webglFramebuffer[te]=[];for(let he=0;he<f.mipmaps.length;he++)D.__webglFramebuffer[te][he]=e.createFramebuffer()}else D.__webglFramebuffer[te]=e.createFramebuffer()}else{if(f.mipmaps&&f.mipmaps.length>0){D.__webglFramebuffer=[];for(let te=0;te<f.mipmaps.length;te++)D.__webglFramebuffer[te]=e.createFramebuffer()}else D.__webglFramebuffer=e.createFramebuffer();if(be)for(let te=0,he=K.length;te<he;te++){const Ae=i.get(K[te]);Ae.__webglTexture===void 0&&(Ae.__webglTexture=e.createTexture(),o.memory.textures++)}if(x.samples>0&&st(x)===!1){D.__webglMultisampledFramebuffer=e.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let te=0;te<K.length;te++){const he=K[te];D.__webglColorRenderbuffer[te]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,D.__webglColorRenderbuffer[te]);const Ae=a.convert(he.format,he.colorSpace),J=a.convert(he.type),ie=M(he.internalFormat,Ae,J,he.colorSpace,x.isXRRenderTarget===!0),ue=C(x);e.renderbufferStorageMultisample(e.RENDERBUFFER,ue,ie,x.width,x.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+te,e.RENDERBUFFER,D.__webglColorRenderbuffer[te])}e.bindRenderbuffer(e.RENDERBUFFER,null),x.depthBuffer&&(D.__webglDepthRenderbuffer=e.createRenderbuffer(),Ce(D.__webglDepthRenderbuffer,x,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(O){t.bindTexture(e.TEXTURE_CUBE_MAP,k.__webglTexture),Be(e.TEXTURE_CUBE_MAP,f);for(let te=0;te<6;te++)if(f.mipmaps&&f.mipmaps.length>0)for(let he=0;he<f.mipmaps.length;he++)fe(D.__webglFramebuffer[te][he],x,f,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+te,he);else fe(D.__webglFramebuffer[te],x,f,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+te,0);p(f)&&l(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(be){for(let te=0,he=K.length;te<he;te++){const Ae=K[te],J=i.get(Ae);let ie=e.TEXTURE_2D;(x.isWebGL3DRenderTarget||x.isWebGLArrayRenderTarget)&&(ie=x.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(ie,J.__webglTexture),Be(ie,Ae),fe(D.__webglFramebuffer,x,Ae,e.COLOR_ATTACHMENT0+te,ie,0),p(Ae)&&l(ie)}t.unbindTexture()}else{let te=e.TEXTURE_2D;if((x.isWebGL3DRenderTarget||x.isWebGLArrayRenderTarget)&&(te=x.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(te,k.__webglTexture),Be(te,f),f.mipmaps&&f.mipmaps.length>0)for(let he=0;he<f.mipmaps.length;he++)fe(D.__webglFramebuffer[he],x,f,e.COLOR_ATTACHMENT0,te,he);else fe(D.__webglFramebuffer,x,f,e.COLOR_ATTACHMENT0,te,0);p(f)&&l(te),t.unbindTexture()}x.depthBuffer&&Fe(x)}function Ve(x){const f=x.textures;for(let D=0,k=f.length;D<k;D++){const K=f[D];if(p(K)){const O=E(x),be=i.get(K).__webglTexture;t.bindTexture(O,be),l(O),t.unbindTexture()}}}const je=[],Le=[];function ot(x){if(x.samples>0){if(st(x)===!1){const f=x.textures,D=x.width,k=x.height;let K=e.COLOR_BUFFER_BIT;const O=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,be=i.get(x),te=f.length>1;if(te)for(let Ae=0;Ae<f.length;Ae++)t.bindFramebuffer(e.FRAMEBUFFER,be.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Ae,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,be.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Ae,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,be.__webglMultisampledFramebuffer);const he=x.texture.mipmaps;he&&he.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,be.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,be.__webglFramebuffer);for(let Ae=0;Ae<f.length;Ae++){if(x.resolveDepthBuffer&&(x.depthBuffer&&(K|=e.DEPTH_BUFFER_BIT),x.stencilBuffer&&x.resolveStencilBuffer&&(K|=e.STENCIL_BUFFER_BIT)),te){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,be.__webglColorRenderbuffer[Ae]);const J=i.get(f[Ae]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,J,0)}e.blitFramebuffer(0,0,D,k,0,0,D,k,K,e.NEAREST),c===!0&&(je.length=0,Le.length=0,je.push(e.COLOR_ATTACHMENT0+Ae),x.depthBuffer&&x.resolveDepthBuffer===!1&&(je.push(O),Le.push(O),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Le)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,je))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),te)for(let Ae=0;Ae<f.length;Ae++){t.bindFramebuffer(e.FRAMEBUFFER,be.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Ae,e.RENDERBUFFER,be.__webglColorRenderbuffer[Ae]);const J=i.get(f[Ae]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,be.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Ae,e.TEXTURE_2D,J,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,be.__webglMultisampledFramebuffer)}else if(x.depthBuffer&&x.resolveDepthBuffer===!1&&c){const f=x.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[f])}}}function C(x){return Math.min(r.maxSamples,x.samples)}function st(x){const f=i.get(x);return x.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&f.__useRenderToTexture!==!1}function ke(x){const f=o.render.frame;h.get(x)!==f&&(h.set(x,f),x.update())}function Ye(x,f){const D=x.colorSpace,k=x.format,K=x.type;return x.isCompressedTexture===!0||x.isVideoTexture===!0||D!==Et&&D!==on&&(tt.getTransfer(D)===$e?(k!==Gt||K!==Dt)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):et("WebGLTextures: Unsupported texture color space:",D)),f}function me(x){return typeof HTMLImageElement<"u"&&x instanceof HTMLImageElement?(d.width=x.naturalWidth||x.width,d.height=x.naturalHeight||x.height):typeof VideoFrame<"u"&&x instanceof VideoFrame?(d.width=x.displayWidth,d.height=x.displayHeight):(d.width=x.width,d.height=x.height),d}this.allocateTextureUnit=G,this.resetTextureUnits=H,this.setTexture2D=q,this.setTexture2DArray=B,this.setTexture3D=V,this.setTextureCube=Z,this.rebindTextures=ft,this.setupRenderTarget=Ne,this.updateRenderTargetMipmap=Ve,this.updateMultisampleRenderTarget=ot,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=st,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function Cu(e,n){function t(i,r=on){let a;const o=tt.getTransfer(r);if(i===Dt)return e.UNSIGNED_BYTE;if(i===Ar)return e.UNSIGNED_SHORT_4_4_4_4;if(i===Rr)return e.UNSIGNED_SHORT_5_5_5_1;if(i===Xo)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===jo)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ko)return e.BYTE;if(i===qo)return e.SHORT;if(i===Xn)return e.UNSIGNED_SHORT;if(i===Pr)return e.INT;if(i===tn)return e.UNSIGNED_INT;if(i===Vt)return e.FLOAT;if(i===jt)return e.HALF_FLOAT;if(i===Yo)return e.ALPHA;if(i===Qo)return e.RGB;if(i===Gt)return e.RGBA;if(i===pn)return e.DEPTH_COMPONENT;if(i===cn)return e.DEPTH_STENCIL;if(i===Jo)return e.RED;if(i===Tr)return e.RED_INTEGER;if(i===wn)return e.RG;if(i===Mr)return e.RG_INTEGER;if(i===Er)return e.RGBA_INTEGER;if(i===ni||i===ii||i===ai||i===ri)if(o===$e)if(a=n.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===ni)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ii)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ai)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ri)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=n.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===ni)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ii)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ai)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ri)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Qi||i===Ji||i===Zi||i===$i)if(a=n.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===Qi)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ji)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Zi)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===$i)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ea||i===ta||i===na||i===ia||i===aa||i===ra||i===oa)if(a=n.get("WEBGL_compressed_texture_etc"),a!==null){if(i===ea||i===ta)return o===$e?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===na)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===ia)return a.COMPRESSED_R11_EAC;if(i===aa)return a.COMPRESSED_SIGNED_R11_EAC;if(i===ra)return a.COMPRESSED_RG11_EAC;if(i===oa)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===sa||i===ca||i===la||i===fa||i===da||i===ua||i===pa||i===ha||i===ma||i===ga||i===_a||i===ba||i===va||i===xa)if(a=n.get("WEBGL_compressed_texture_astc"),a!==null){if(i===sa)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ca)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===la)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===fa)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===da)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ua)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===pa)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===ha)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ma)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ga)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===_a)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ba)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===va)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===xa)return o===$e?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Sa||i===Ea||i===Ma)if(a=n.get("EXT_texture_compression_bptc"),a!==null){if(i===Sa)return o===$e?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ea)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ma)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ta||i===Aa||i===Ra||i===Ca)if(a=n.get("EXT_texture_compression_rgtc"),a!==null){if(i===Ta)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Aa)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ra)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ca)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Cn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}const wu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Lu{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){const i=new Cr(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){const t=n.cameras[0].viewport,i=new Kt({vertexShader:wu,fragmentShader:Pu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Mt(new wr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Du extends po{constructor(n,t){super();const i=this;let r=null,a=1,o=null,s="local-floor",c=1,d=null,h=null,u=null,g=null,v=null,R=null;const w=typeof XRWebGLBinding<"u",p=new Lu,l={},E=t.getContextAttributes();let M=null,S=null;const T=[],A=[],I=new ut;let z=null;const _=new Tn;_.viewport=new vt;const b=new Tn;b.viewport=new vt;const L=[_,b],H=new ho;let G=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let Y=T[W];return Y===void 0&&(Y=new ti,T[W]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(W){let Y=T[W];return Y===void 0&&(Y=new ti,T[W]=Y),Y.getGripSpace()},this.getHand=function(W){let Y=T[W];return Y===void 0&&(Y=new ti,T[W]=Y),Y.getHandSpace()};function q(W){const Y=A.indexOf(W.inputSource);if(Y===-1)return;const fe=T[Y];fe!==void 0&&(fe.update(W.inputSource,W.frame,d||o),fe.dispatchEvent({type:W.type,data:W.inputSource}))}function B(){r.removeEventListener("select",q),r.removeEventListener("selectstart",q),r.removeEventListener("selectend",q),r.removeEventListener("squeeze",q),r.removeEventListener("squeezestart",q),r.removeEventListener("squeezeend",q),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",V);for(let W=0;W<T.length;W++){const Y=A[W];Y!==null&&(A[W]=null,T[W].disconnect(Y))}G=null,X=null,p.reset();for(const W in l)delete l[W];n.setRenderTarget(M),v=null,g=null,u=null,r=null,S=null,nt.stop(),i.isPresenting=!1,n.setPixelRatio(z),n.setSize(I.width,I.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){a=W,i.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){s=W,i.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||o},this.setReferenceSpace=function(W){d=W},this.getBaseLayer=function(){return g!==null?g:v},this.getBinding=function(){return u===null&&w&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return R},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(M=n.getRenderTarget(),r.addEventListener("select",q),r.addEventListener("selectstart",q),r.addEventListener("selectend",q),r.addEventListener("squeeze",q),r.addEventListener("squeezestart",q),r.addEventListener("squeezeend",q),r.addEventListener("end",B),r.addEventListener("inputsourceschange",V),E.xrCompatible!==!0&&await t.makeXRCompatible(),z=n.getPixelRatio(),n.getSize(I),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Ce=null,pe=null;E.depth&&(pe=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=E.stencil?cn:pn,Ce=E.stencil?Cn:tn);const Fe={colorFormat:t.RGBA8,depthFormat:pe,scaleFactor:a};u=this.getBinding(),g=u.createProjectionLayer(Fe),r.updateRenderState({layers:[g]}),n.setPixelRatio(1),n.setSize(g.textureWidth,g.textureHeight,!1),S=new Bt(g.textureWidth,g.textureHeight,{format:Gt,type:Dt,depthTexture:new kn(g.textureWidth,g.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:E.stencil,colorSpace:n.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}else{const fe={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:a};v=new XRWebGLLayer(r,t,fe),r.updateRenderState({baseLayer:v}),n.setPixelRatio(1),n.setSize(v.framebufferWidth,v.framebufferHeight,!1),S=new Bt(v.framebufferWidth,v.framebufferHeight,{format:Gt,type:Dt,colorSpace:n.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:v.ignoreDepthValues===!1,resolveStencilBuffer:v.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(c),d=null,o=await r.requestReferenceSpace(s),nt.setContext(r),nt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function V(W){for(let Y=0;Y<W.removed.length;Y++){const fe=W.removed[Y],Ce=A.indexOf(fe);Ce>=0&&(A[Ce]=null,T[Ce].disconnect(fe))}for(let Y=0;Y<W.added.length;Y++){const fe=W.added[Y];let Ce=A.indexOf(fe);if(Ce===-1){for(let Fe=0;Fe<T.length;Fe++)if(Fe>=A.length){A.push(fe),Ce=Fe;break}else if(A[Fe]===null){A[Fe]=fe,Ce=Fe;break}if(Ce===-1)break}const pe=T[Ce];pe&&pe.connect(fe)}}const Z=new we,Se=new we;function _e(W,Y,fe){Z.setFromMatrixPosition(Y.matrixWorld),Se.setFromMatrixPosition(fe.matrixWorld);const Ce=Z.distanceTo(Se),pe=Y.projectionMatrix.elements,Fe=fe.projectionMatrix.elements,ft=pe[14]/(pe[10]-1),Ne=pe[14]/(pe[10]+1),Ve=(pe[9]+1)/pe[5],je=(pe[9]-1)/pe[5],Le=(pe[8]-1)/pe[0],ot=(Fe[8]+1)/Fe[0],C=ft*Le,st=ft*ot,ke=Ce/(-Le+ot),Ye=ke*-Le;if(Y.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ye),W.translateZ(ke),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),pe[10]===-1)W.projectionMatrix.copy(Y.projectionMatrix),W.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const me=ft+ke,x=Ne+ke,f=C-Ye,D=st+(Ce-Ye),k=Ve*Ne/x*me,K=je*Ne/x*me;W.projectionMatrix.makePerspective(f,D,k,K,me,x),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function xe(W,Y){Y===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(Y.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let Y=W.near,fe=W.far;p.texture!==null&&(p.depthNear>0&&(Y=p.depthNear),p.depthFar>0&&(fe=p.depthFar)),H.near=b.near=_.near=Y,H.far=b.far=_.far=fe,(G!==H.near||X!==H.far)&&(r.updateRenderState({depthNear:H.near,depthFar:H.far}),G=H.near,X=H.far),H.layers.mask=W.layers.mask|6,_.layers.mask=H.layers.mask&3,b.layers.mask=H.layers.mask&5;const Ce=W.parent,pe=H.cameras;xe(H,Ce);for(let Fe=0;Fe<pe.length;Fe++)xe(pe[Fe],Ce);pe.length===2?_e(H,_,b):H.projectionMatrix.copy(_.projectionMatrix),Be(W,H,Ce)};function Be(W,Y,fe){fe===null?W.matrix.copy(Y.matrixWorld):(W.matrix.copy(fe.matrixWorld),W.matrix.invert(),W.matrix.multiply(Y.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(Y.projectionMatrix),W.projectionMatrixInverse.copy(Y.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=mo*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return H},this.getFoveation=function(){if(!(g===null&&v===null))return c},this.setFoveation=function(W){c=W,g!==null&&(g.fixedFoveation=W),v!==null&&v.fixedFoveation!==void 0&&(v.fixedFoveation=W)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(H)},this.getCameraTexture=function(W){return l[W]};let ye=null;function rt(W,Y){if(h=Y.getViewerPose(d||o),R=Y,h!==null){const fe=h.views;v!==null&&(n.setRenderTargetFramebuffer(S,v.framebuffer),n.setRenderTarget(S));let Ce=!1;fe.length!==H.cameras.length&&(H.cameras.length=0,Ce=!0);for(let Ne=0;Ne<fe.length;Ne++){const Ve=fe[Ne];let je=null;if(v!==null)je=v.getViewport(Ve);else{const ot=u.getViewSubImage(g,Ve);je=ot.viewport,Ne===0&&(n.setRenderTargetTextures(S,ot.colorTexture,ot.depthStencilTexture),n.setRenderTarget(S))}let Le=L[Ne];Le===void 0&&(Le=new Tn,Le.layers.enable(Ne),Le.viewport=new vt,L[Ne]=Le),Le.matrix.fromArray(Ve.transform.matrix),Le.matrix.decompose(Le.position,Le.quaternion,Le.scale),Le.projectionMatrix.fromArray(Ve.projectionMatrix),Le.projectionMatrixInverse.copy(Le.projectionMatrix).invert(),Le.viewport.set(je.x,je.y,je.width,je.height),Ne===0&&(H.matrix.copy(Le.matrix),H.matrix.decompose(H.position,H.quaternion,H.scale)),Ce===!0&&H.cameras.push(Le)}const pe=r.enabledFeatures;if(pe&&pe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&w){u=i.getBinding();const Ne=u.getDepthInformation(fe[0]);Ne&&Ne.isValid&&Ne.texture&&p.init(Ne,r.renderState)}if(pe&&pe.includes("camera-access")&&w){n.state.unbindTexture(),u=i.getBinding();for(let Ne=0;Ne<fe.length;Ne++){const Ve=fe[Ne].camera;if(Ve){let je=l[Ve];je||(je=new Cr,l[Ve]=je);const Le=u.getCameraImage(Ve);je.sourceTexture=Le}}}}for(let fe=0;fe<T.length;fe++){const Ce=A[fe],pe=T[fe];Ce!==null&&pe!==void 0&&pe.update(Ce,Y,d||o)}ye&&ye(W,Y),Y.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Y}),R=null}const nt=new jr;nt.setAnimationLoop(rt),this.setAnimationLoop=function(W){ye=W},this.dispose=function(){}}}const Jt=new Ur,Uu=new yt;function Iu(e,n){function t(p,l){p.matrixAutoUpdate===!0&&p.updateMatrix(),l.value.copy(p.matrix)}function i(p,l){l.color.getRGB(p.fogColor.value,Dr(e)),l.isFog?(p.fogNear.value=l.near,p.fogFar.value=l.far):l.isFogExp2&&(p.fogDensity.value=l.density)}function r(p,l,E,M,S){l.isMeshBasicMaterial||l.isMeshLambertMaterial?a(p,l):l.isMeshToonMaterial?(a(p,l),u(p,l)):l.isMeshPhongMaterial?(a(p,l),h(p,l)):l.isMeshStandardMaterial?(a(p,l),g(p,l),l.isMeshPhysicalMaterial&&v(p,l,S)):l.isMeshMatcapMaterial?(a(p,l),R(p,l)):l.isMeshDepthMaterial?a(p,l):l.isMeshDistanceMaterial?(a(p,l),w(p,l)):l.isMeshNormalMaterial?a(p,l):l.isLineBasicMaterial?(o(p,l),l.isLineDashedMaterial&&s(p,l)):l.isPointsMaterial?c(p,l,E,M):l.isSpriteMaterial?d(p,l):l.isShadowMaterial?(p.color.value.copy(l.color),p.opacity.value=l.opacity):l.isShaderMaterial&&(l.uniformsNeedUpdate=!1)}function a(p,l){p.opacity.value=l.opacity,l.color&&p.diffuse.value.copy(l.color),l.emissive&&p.emissive.value.copy(l.emissive).multiplyScalar(l.emissiveIntensity),l.map&&(p.map.value=l.map,t(l.map,p.mapTransform)),l.alphaMap&&(p.alphaMap.value=l.alphaMap,t(l.alphaMap,p.alphaMapTransform)),l.bumpMap&&(p.bumpMap.value=l.bumpMap,t(l.bumpMap,p.bumpMapTransform),p.bumpScale.value=l.bumpScale,l.side===Rt&&(p.bumpScale.value*=-1)),l.normalMap&&(p.normalMap.value=l.normalMap,t(l.normalMap,p.normalMapTransform),p.normalScale.value.copy(l.normalScale),l.side===Rt&&p.normalScale.value.negate()),l.displacementMap&&(p.displacementMap.value=l.displacementMap,t(l.displacementMap,p.displacementMapTransform),p.displacementScale.value=l.displacementScale,p.displacementBias.value=l.displacementBias),l.emissiveMap&&(p.emissiveMap.value=l.emissiveMap,t(l.emissiveMap,p.emissiveMapTransform)),l.specularMap&&(p.specularMap.value=l.specularMap,t(l.specularMap,p.specularMapTransform)),l.alphaTest>0&&(p.alphaTest.value=l.alphaTest);const E=n.get(l),M=E.envMap,S=E.envMapRotation;M&&(p.envMap.value=M,Jt.copy(S),Jt.x*=-1,Jt.y*=-1,Jt.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Jt.y*=-1,Jt.z*=-1),p.envMapRotation.value.setFromMatrix4(Uu.makeRotationFromEuler(Jt)),p.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=l.reflectivity,p.ior.value=l.ior,p.refractionRatio.value=l.refractionRatio),l.lightMap&&(p.lightMap.value=l.lightMap,p.lightMapIntensity.value=l.lightMapIntensity,t(l.lightMap,p.lightMapTransform)),l.aoMap&&(p.aoMap.value=l.aoMap,p.aoMapIntensity.value=l.aoMapIntensity,t(l.aoMap,p.aoMapTransform))}function o(p,l){p.diffuse.value.copy(l.color),p.opacity.value=l.opacity,l.map&&(p.map.value=l.map,t(l.map,p.mapTransform))}function s(p,l){p.dashSize.value=l.dashSize,p.totalSize.value=l.dashSize+l.gapSize,p.scale.value=l.scale}function c(p,l,E,M){p.diffuse.value.copy(l.color),p.opacity.value=l.opacity,p.size.value=l.size*E,p.scale.value=M*.5,l.map&&(p.map.value=l.map,t(l.map,p.uvTransform)),l.alphaMap&&(p.alphaMap.value=l.alphaMap,t(l.alphaMap,p.alphaMapTransform)),l.alphaTest>0&&(p.alphaTest.value=l.alphaTest)}function d(p,l){p.diffuse.value.copy(l.color),p.opacity.value=l.opacity,p.rotation.value=l.rotation,l.map&&(p.map.value=l.map,t(l.map,p.mapTransform)),l.alphaMap&&(p.alphaMap.value=l.alphaMap,t(l.alphaMap,p.alphaMapTransform)),l.alphaTest>0&&(p.alphaTest.value=l.alphaTest)}function h(p,l){p.specular.value.copy(l.specular),p.shininess.value=Math.max(l.shininess,1e-4)}function u(p,l){l.gradientMap&&(p.gradientMap.value=l.gradientMap)}function g(p,l){p.metalness.value=l.metalness,l.metalnessMap&&(p.metalnessMap.value=l.metalnessMap,t(l.metalnessMap,p.metalnessMapTransform)),p.roughness.value=l.roughness,l.roughnessMap&&(p.roughnessMap.value=l.roughnessMap,t(l.roughnessMap,p.roughnessMapTransform)),l.envMap&&(p.envMapIntensity.value=l.envMapIntensity)}function v(p,l,E){p.ior.value=l.ior,l.sheen>0&&(p.sheenColor.value.copy(l.sheenColor).multiplyScalar(l.sheen),p.sheenRoughness.value=l.sheenRoughness,l.sheenColorMap&&(p.sheenColorMap.value=l.sheenColorMap,t(l.sheenColorMap,p.sheenColorMapTransform)),l.sheenRoughnessMap&&(p.sheenRoughnessMap.value=l.sheenRoughnessMap,t(l.sheenRoughnessMap,p.sheenRoughnessMapTransform))),l.clearcoat>0&&(p.clearcoat.value=l.clearcoat,p.clearcoatRoughness.value=l.clearcoatRoughness,l.clearcoatMap&&(p.clearcoatMap.value=l.clearcoatMap,t(l.clearcoatMap,p.clearcoatMapTransform)),l.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=l.clearcoatRoughnessMap,t(l.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),l.clearcoatNormalMap&&(p.clearcoatNormalMap.value=l.clearcoatNormalMap,t(l.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(l.clearcoatNormalScale),l.side===Rt&&p.clearcoatNormalScale.value.negate())),l.dispersion>0&&(p.dispersion.value=l.dispersion),l.iridescence>0&&(p.iridescence.value=l.iridescence,p.iridescenceIOR.value=l.iridescenceIOR,p.iridescenceThicknessMinimum.value=l.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=l.iridescenceThicknessRange[1],l.iridescenceMap&&(p.iridescenceMap.value=l.iridescenceMap,t(l.iridescenceMap,p.iridescenceMapTransform)),l.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=l.iridescenceThicknessMap,t(l.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),l.transmission>0&&(p.transmission.value=l.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),l.transmissionMap&&(p.transmissionMap.value=l.transmissionMap,t(l.transmissionMap,p.transmissionMapTransform)),p.thickness.value=l.thickness,l.thicknessMap&&(p.thicknessMap.value=l.thicknessMap,t(l.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=l.attenuationDistance,p.attenuationColor.value.copy(l.attenuationColor)),l.anisotropy>0&&(p.anisotropyVector.value.set(l.anisotropy*Math.cos(l.anisotropyRotation),l.anisotropy*Math.sin(l.anisotropyRotation)),l.anisotropyMap&&(p.anisotropyMap.value=l.anisotropyMap,t(l.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=l.specularIntensity,p.specularColor.value.copy(l.specularColor),l.specularColorMap&&(p.specularColorMap.value=l.specularColorMap,t(l.specularColorMap,p.specularColorMapTransform)),l.specularIntensityMap&&(p.specularIntensityMap.value=l.specularIntensityMap,t(l.specularIntensityMap,p.specularIntensityMapTransform))}function R(p,l){l.matcap&&(p.matcap.value=l.matcap)}function w(p,l){const E=n.get(l).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function yu(e,n,t,i){let r={},a={},o=[];const s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(E,M){const S=M.program;i.uniformBlockBinding(E,S)}function d(E,M){let S=r[E.id];S===void 0&&(R(E),S=h(E),r[E.id]=S,E.addEventListener("dispose",p));const T=M.program;i.updateUBOMapping(E,T);const A=n.render.frame;a[E.id]!==A&&(g(E),a[E.id]=A)}function h(E){const M=u();E.__bindingPointIndex=M;const S=e.createBuffer(),T=E.__size,A=E.usage;return e.bindBuffer(e.UNIFORM_BUFFER,S),e.bufferData(e.UNIFORM_BUFFER,T,A),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,M,S),S}function u(){for(let E=0;E<s;E++)if(o.indexOf(E)===-1)return o.push(E),E;return et("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(E){const M=r[E.id],S=E.uniforms,T=E.__cache;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let A=0,I=S.length;A<I;A++){const z=Array.isArray(S[A])?S[A]:[S[A]];for(let _=0,b=z.length;_<b;_++){const L=z[_];if(v(L,A,_,T)===!0){const H=L.__offset,G=Array.isArray(L.value)?L.value:[L.value];let X=0;for(let q=0;q<G.length;q++){const B=G[q],V=w(B);typeof B=="number"||typeof B=="boolean"?(L.__data[0]=B,e.bufferSubData(e.UNIFORM_BUFFER,H+X,L.__data)):B.isMatrix3?(L.__data[0]=B.elements[0],L.__data[1]=B.elements[1],L.__data[2]=B.elements[2],L.__data[3]=0,L.__data[4]=B.elements[3],L.__data[5]=B.elements[4],L.__data[6]=B.elements[5],L.__data[7]=0,L.__data[8]=B.elements[6],L.__data[9]=B.elements[7],L.__data[10]=B.elements[8],L.__data[11]=0):(B.toArray(L.__data,X),X+=V.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,H,L.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function v(E,M,S,T){const A=E.value,I=M+"_"+S;if(T[I]===void 0)return typeof A=="number"||typeof A=="boolean"?T[I]=A:T[I]=A.clone(),!0;{const z=T[I];if(typeof A=="number"||typeof A=="boolean"){if(z!==A)return T[I]=A,!0}else if(z.equals(A)===!1)return z.copy(A),!0}return!1}function R(E){const M=E.uniforms;let S=0;const T=16;for(let I=0,z=M.length;I<z;I++){const _=Array.isArray(M[I])?M[I]:[M[I]];for(let b=0,L=_.length;b<L;b++){const H=_[b],G=Array.isArray(H.value)?H.value:[H.value];for(let X=0,q=G.length;X<q;X++){const B=G[X],V=w(B),Z=S%T,Se=Z%V.boundary,_e=Z+Se;S+=Se,_e!==0&&T-_e<V.storage&&(S+=T-_e),H.__data=new Float32Array(V.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=S,S+=V.storage}}}const A=S%T;return A>0&&(S+=T-A),E.__size=S,E.__cache={},this}function w(E){const M={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(M.boundary=4,M.storage=4):E.isVector2?(M.boundary=8,M.storage=8):E.isVector3||E.isColor?(M.boundary=16,M.storage=12):E.isVector4?(M.boundary=16,M.storage=16):E.isMatrix3?(M.boundary=48,M.storage=48):E.isMatrix4?(M.boundary=64,M.storage=64):E.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):qe("WebGLRenderer: Unsupported uniform value type.",E),M}function p(E){const M=E.target;M.removeEventListener("dispose",p);const S=o.indexOf(M.__bindingPointIndex);o.splice(S,1),e.deleteBuffer(r[M.id]),delete r[M.id],delete a[M.id]}function l(){for(const E in r)e.deleteBuffer(r[E]);o=[],r={},a={}}return{bind:c,update:d,dispose:l}}const Nu=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let wt=null;function Fu(){return wt===null&&(wt=new go(Nu,16,16,wn,jt),wt.name="DFG_LUT",wt.minFilter=mt,wt.magFilter=mt,wt.wrapS=Vn,wt.wrapT=Vn,wt.generateMipmaps=!1,wt.needsUpdate=!0),wt}class Gp{constructor(n={}){const{canvas:t=co(),context:i=null,depth:r=!0,stencil:a=!1,alpha:o=!1,antialias:s=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:d=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:g=!1,outputBufferType:v=Dt}=n;this.isWebGLRenderer=!0;let R;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");R=i.getContextAttributes().alpha}else R=o;const w=v,p=new Set([Er,Mr,Tr]),l=new Set([Dt,tn,Xn,Cn,Ar,Rr]),E=new Uint32Array(4),M=new Int32Array(4);let S=null,T=null;const A=[],I=[];let z=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=It,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let b=!1;this._outputColorSpace=fn;let L=0,H=0,G=null,X=-1,q=null;const B=new vt,V=new vt;let Z=null;const Se=new He(0);let _e=0,xe=t.width,Be=t.height,ye=1,rt=null,nt=null;const W=new vt(0,0,xe,Be),Y=new vt(0,0,xe,Be);let fe=!1;const Ce=new br;let pe=!1,Fe=!1;const ft=new yt,Ne=new we,Ve=new vt,je={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Le=!1;function ot(){return G===null?ye:1}let C=i;function st(m,U){return t.getContext(m,U)}try{const m={alpha:!0,depth:r,stencil:a,antialias:s,premultipliedAlpha:c,preserveDrawingBuffer:d,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${lo}`),t.addEventListener("webglcontextlost",Re,!1),t.addEventListener("webglcontextrestored",Qe,!1),t.addEventListener("webglcontextcreationerror",ze,!1),C===null){const U="webgl2";if(C=st(U,m),C===null)throw st(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(m){throw et("WebGLRenderer: "+m.message),m}let ke,Ye,me,x,f,D,k,K,O,be,te,he,Ae,J,ie,ue,ge,ne,De,P,se,$,ce,Q;function j(){ke=new Ff(C),ke.init(),$=new Cu(C,ke),Ye=new Cf(C,ke,n,$),me=new Au(C,ke),Ye.reversedDepthBuffer&&g&&me.buffers.depth.setReversed(!0),x=new Hf(C),f=new fu,D=new Ru(C,ke,me,f,Ye,$,x),k=new Pf(_),K=new Nf(_),O=new Vs(C),ce=new Af(C,O),be=new Of(C,O,x,ce),te=new kf(C,be,O,x),De=new Bf(C,Ye,D),ue=new wf(f),he=new lu(_,k,K,ke,Ye,ce,ue),Ae=new Iu(_,f),J=new uu,ie=new bu(ke),ne=new Tf(_,k,K,me,te,R,c),ge=new Mu(_,te,Ye),Q=new yu(C,x,Ye,me),P=new Rf(C,ke,x),se=new Gf(C,ke,x),x.programs=he.programs,_.capabilities=Ye,_.extensions=ke,_.properties=f,_.renderLists=J,_.shadowMap=ge,_.state=me,_.info=x}j(),w!==Dt&&(z=new zf(w,t.width,t.height,r,a));const ee=new Du(_,C);this.xr=ee,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const m=ke.get("WEBGL_lose_context");m&&m.loseContext()},this.forceContextRestore=function(){const m=ke.get("WEBGL_lose_context");m&&m.restoreContext()},this.getPixelRatio=function(){return ye},this.setPixelRatio=function(m){m!==void 0&&(ye=m,this.setSize(xe,Be,!1))},this.getSize=function(m){return m.set(xe,Be)},this.setSize=function(m,U,F=!0){if(ee.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}xe=m,Be=U,t.width=Math.floor(m*ye),t.height=Math.floor(U*ye),F===!0&&(t.style.width=m+"px",t.style.height=U+"px"),z!==null&&z.setSize(t.width,t.height),this.setViewport(0,0,m,U)},this.getDrawingBufferSize=function(m){return m.set(xe*ye,Be*ye).floor()},this.setDrawingBufferSize=function(m,U,F){xe=m,Be=U,ye=F,t.width=Math.floor(m*F),t.height=Math.floor(U*F),this.setViewport(0,0,m,U)},this.setEffects=function(m){if(w===Dt){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(m){for(let U=0;U<m.length;U++)if(m[U].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}z.setEffects(m||[])},this.getCurrentViewport=function(m){return m.copy(B)},this.getViewport=function(m){return m.copy(W)},this.setViewport=function(m,U,F,N){m.isVector4?W.set(m.x,m.y,m.z,m.w):W.set(m,U,F,N),me.viewport(B.copy(W).multiplyScalar(ye).round())},this.getScissor=function(m){return m.copy(Y)},this.setScissor=function(m,U,F,N){m.isVector4?Y.set(m.x,m.y,m.z,m.w):Y.set(m,U,F,N),me.scissor(V.copy(Y).multiplyScalar(ye).round())},this.getScissorTest=function(){return fe},this.setScissorTest=function(m){me.setScissorTest(fe=m)},this.setOpaqueSort=function(m){rt=m},this.setTransparentSort=function(m){nt=m},this.getClearColor=function(m){return m.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor(...arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha(...arguments)},this.clear=function(m=!0,U=!0,F=!0){let N=0;if(m){let y=!1;if(G!==null){const ae=G.texture.format;y=p.has(ae)}if(y){const ae=G.texture.type,le=l.has(ae),oe=ne.getClearColor(),de=ne.getClearAlpha(),ve=oe.r,Te=oe.g,Ee=oe.b;le?(E[0]=ve,E[1]=Te,E[2]=Ee,E[3]=de,C.clearBufferuiv(C.COLOR,0,E)):(M[0]=ve,M[1]=Te,M[2]=Ee,M[3]=de,C.clearBufferiv(C.COLOR,0,M))}else N|=C.COLOR_BUFFER_BIT}U&&(N|=C.DEPTH_BUFFER_BIT),F&&(N|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Re,!1),t.removeEventListener("webglcontextrestored",Qe,!1),t.removeEventListener("webglcontextcreationerror",ze,!1),ne.dispose(),J.dispose(),ie.dispose(),f.dispose(),k.dispose(),K.dispose(),te.dispose(),ce.dispose(),Q.dispose(),he.dispose(),ee.dispose(),ee.removeEventListener("sessionstart",Bi),ee.removeEventListener("sessionend",ki),qt.stop()};function Re(m){m.preventDefault(),Ki("WebGLRenderer: Context Lost."),b=!0}function Qe(){Ki("WebGLRenderer: Context Restored."),b=!1;const m=x.autoReset,U=ge.enabled,F=ge.autoUpdate,N=ge.needsUpdate,y=ge.type;j(),x.autoReset=m,ge.enabled=U,ge.autoUpdate=F,ge.needsUpdate=N,ge.type=y}function ze(m){et("WebGLRenderer: A WebGL context could not be created. Reason: ",m.statusMessage)}function Ct(m){const U=m.target;U.removeEventListener("dispose",Ct),Ft(U)}function Ft(m){eo(m),f.remove(m)}function eo(m){const U=f.get(m).programs;U!==void 0&&(U.forEach(function(F){he.releaseProgram(F)}),m.isShaderMaterial&&he.releaseShaderCache(m))}this.renderBufferDirect=function(m,U,F,N,y,ae){U===null&&(U=je);const le=y.isMesh&&y.matrixWorld.determinant()<0,oe=no(m,U,F,N,y);me.setMaterial(N,le);let de=F.index,ve=1;if(N.wireframe===!0){if(de=be.getWireframeAttribute(F),de===void 0)return;ve=2}const Te=F.drawRange,Ee=F.attributes.position;let Ue=Te.start*ve,Xe=(Te.start+Te.count)*ve;ae!==null&&(Ue=Math.max(Ue,ae.start*ve),Xe=Math.min(Xe,(ae.start+ae.count)*ve)),de!==null?(Ue=Math.max(Ue,0),Xe=Math.min(Xe,de.count)):Ee!=null&&(Ue=Math.max(Ue,0),Xe=Math.min(Xe,Ee.count));const it=Xe-Ue;if(it<0||it===1/0)return;ce.setup(y,N,oe,F,de);let at,Ke=P;if(de!==null&&(at=O.get(de),Ke=se,Ke.setIndex(at)),y.isMesh)N.wireframe===!0?(me.setLineWidth(N.wireframeLinewidth*ot()),Ke.setMode(C.LINES)):Ke.setMode(C.TRIANGLES);else if(y.isLine){let Me=N.linewidth;Me===void 0&&(Me=1),me.setLineWidth(Me*ot()),y.isLineSegments?Ke.setMode(C.LINES):y.isLineLoop?Ke.setMode(C.LINE_LOOP):Ke.setMode(C.LINE_STRIP)}else y.isPoints?Ke.setMode(C.POINTS):y.isSprite&&Ke.setMode(C.TRIANGLES);if(y.isBatchedMesh)if(y._multiDrawInstances!==null)bi("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Ke.renderMultiDrawInstances(y._multiDrawStarts,y._multiDrawCounts,y._multiDrawCount,y._multiDrawInstances);else if(ke.get("WEBGL_multi_draw"))Ke.renderMultiDraw(y._multiDrawStarts,y._multiDrawCounts,y._multiDrawCount);else{const Me=y._multiDrawStarts,We=y._multiDrawCounts,Oe=y._multiDrawCount,xt=de?O.get(de).bytesPerElement:1,an=f.get(N).currentProgram.getUniforms();for(let St=0;St<Oe;St++)an.setValue(C,"_gl_DrawID",St),Ke.render(Me[St]/xt,We[St])}else if(y.isInstancedMesh)Ke.renderInstances(Ue,it,y.count);else if(F.isInstancedBufferGeometry){const Me=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,We=Math.min(F.instanceCount,Me);Ke.renderInstances(Ue,it,We)}else Ke.render(Ue,it)};function Hi(m,U,F){m.transparent===!0&&m.side===Ut&&m.forceSinglePass===!1?(m.side=Rt,m.needsUpdate=!0,Ln(m,U,F),m.side=dn,m.needsUpdate=!0,Ln(m,U,F),m.side=Ut):Ln(m,U,F)}this.compile=function(m,U,F=null){F===null&&(F=m),T=ie.get(F),T.init(U),I.push(T),F.traverseVisible(function(y){y.isLight&&y.layers.test(U.layers)&&(T.pushLight(y),y.castShadow&&T.pushShadow(y))}),m!==F&&m.traverseVisible(function(y){y.isLight&&y.layers.test(U.layers)&&(T.pushLight(y),y.castShadow&&T.pushShadow(y))}),T.setupLights();const N=new Set;return m.traverse(function(y){if(!(y.isMesh||y.isPoints||y.isLine||y.isSprite))return;const ae=y.material;if(ae)if(Array.isArray(ae))for(let le=0;le<ae.length;le++){const oe=ae[le];Hi(oe,F,y),N.add(oe)}else Hi(ae,F,y),N.add(ae)}),T=I.pop(),N},this.compileAsync=function(m,U,F=null){const N=this.compile(m,U,F);return new Promise(y=>{function ae(){if(N.forEach(function(le){f.get(le).currentProgram.isReady()&&N.delete(le)}),N.size===0){y(m);return}setTimeout(ae,10)}ke.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let Zn=null;function to(m){Zn&&Zn(m)}function Bi(){qt.stop()}function ki(){qt.start()}const qt=new jr;qt.setAnimationLoop(to),typeof self<"u"&&qt.setContext(self),this.setAnimationLoop=function(m){Zn=m,ee.setAnimationLoop(m),m===null?qt.stop():qt.start()},ee.addEventListener("sessionstart",Bi),ee.addEventListener("sessionend",ki),this.render=function(m,U){if(U!==void 0&&U.isCamera!==!0){et("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;const F=ee.enabled===!0&&ee.isPresenting===!0,N=z!==null&&(G===null||F)&&z.begin(_,G);if(m.matrixWorldAutoUpdate===!0&&m.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),ee.enabled===!0&&ee.isPresenting===!0&&(z===null||z.isCompositing()===!1)&&(ee.cameraAutoUpdate===!0&&ee.updateCamera(U),U=ee.getCamera()),m.isScene===!0&&m.onBeforeRender(_,m,U,G),T=ie.get(m,I.length),T.init(U),I.push(T),ft.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ce.setFromProjectionMatrix(ft,qi,U.reversedDepth),Fe=this.localClippingEnabled,pe=ue.init(this.clippingPlanes,Fe),S=J.get(m,A.length),S.init(),A.push(S),ee.enabled===!0&&ee.isPresenting===!0){const le=_.xr.getDepthSensingMesh();le!==null&&$n(le,U,-1/0,_.sortObjects)}$n(m,U,0,_.sortObjects),S.finish(),_.sortObjects===!0&&S.sort(rt,nt),Le=ee.enabled===!1||ee.isPresenting===!1||ee.hasDepthSensing()===!1,Le&&ne.addToRenderList(S,m),this.info.render.frame++,pe===!0&&ue.beginShadows();const y=T.state.shadowsArray;if(ge.render(y,m,U),pe===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset(),(N&&z.hasRenderPass())===!1){const le=S.opaque,oe=S.transmissive;if(T.setupLights(),U.isArrayCamera){const de=U.cameras;if(oe.length>0)for(let ve=0,Te=de.length;ve<Te;ve++){const Ee=de[ve];zi(le,oe,m,Ee)}Le&&ne.render(m);for(let ve=0,Te=de.length;ve<Te;ve++){const Ee=de[ve];Vi(S,m,Ee,Ee.viewport)}}else oe.length>0&&zi(le,oe,m,U),Le&&ne.render(m),Vi(S,m,U)}G!==null&&H===0&&(D.updateMultisampleRenderTarget(G),D.updateRenderTargetMipmap(G)),N&&z.end(_),m.isScene===!0&&m.onAfterRender(_,m,U),ce.resetDefaultState(),X=-1,q=null,I.pop(),I.length>0?(T=I[I.length-1],pe===!0&&ue.setGlobalState(_.clippingPlanes,T.state.camera)):T=null,A.pop(),A.length>0?S=A[A.length-1]:S=null};function $n(m,U,F,N){if(m.visible===!1)return;if(m.layers.test(U.layers)){if(m.isGroup)F=m.renderOrder;else if(m.isLOD)m.autoUpdate===!0&&m.update(U);else if(m.isLight)T.pushLight(m),m.castShadow&&T.pushShadow(m);else if(m.isSprite){if(!m.frustumCulled||Ce.intersectsSprite(m)){N&&Ve.setFromMatrixPosition(m.matrixWorld).applyMatrix4(ft);const le=te.update(m),oe=m.material;oe.visible&&S.push(m,le,oe,F,Ve.z,null)}}else if((m.isMesh||m.isLine||m.isPoints)&&(!m.frustumCulled||Ce.intersectsObject(m))){const le=te.update(m),oe=m.material;if(N&&(m.boundingSphere!==void 0?(m.boundingSphere===null&&m.computeBoundingSphere(),Ve.copy(m.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),Ve.copy(le.boundingSphere.center)),Ve.applyMatrix4(m.matrixWorld).applyMatrix4(ft)),Array.isArray(oe)){const de=le.groups;for(let ve=0,Te=de.length;ve<Te;ve++){const Ee=de[ve],Ue=oe[Ee.materialIndex];Ue&&Ue.visible&&S.push(m,le,Ue,F,Ve.z,Ee)}}else oe.visible&&S.push(m,le,oe,F,Ve.z,null)}}const ae=m.children;for(let le=0,oe=ae.length;le<oe;le++)$n(ae[le],U,F,N)}function Vi(m,U,F,N){const{opaque:y,transmissive:ae,transparent:le}=m;T.setupLightsView(F),pe===!0&&ue.setGlobalState(_.clippingPlanes,F),N&&me.viewport(B.copy(N)),y.length>0&&Pn(y,U,F),ae.length>0&&Pn(ae,U,F),le.length>0&&Pn(le,U,F),me.buffers.depth.setTest(!0),me.buffers.depth.setMask(!0),me.buffers.color.setMask(!0),me.setPolygonOffset(!1)}function zi(m,U,F,N){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[N.id]===void 0){const Ue=ke.has("EXT_color_buffer_half_float")||ke.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[N.id]=new Bt(1,1,{generateMipmaps:!0,type:Ue?jt:Dt,minFilter:en,samples:Ye.samples,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace})}const ae=T.state.transmissionRenderTarget[N.id],le=N.viewport||B;ae.setSize(le.z*_.transmissionResolutionScale,le.w*_.transmissionResolutionScale);const oe=_.getRenderTarget(),de=_.getActiveCubeFace(),ve=_.getActiveMipmapLevel();_.setRenderTarget(ae),_.getClearColor(Se),_e=_.getClearAlpha(),_e<1&&_.setClearColor(16777215,.5),_.clear(),Le&&ne.render(F);const Te=_.toneMapping;_.toneMapping=It;const Ee=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),T.setupLightsView(N),pe===!0&&ue.setGlobalState(_.clippingPlanes,N),Pn(m,F,N),D.updateMultisampleRenderTarget(ae),D.updateRenderTargetMipmap(ae),ke.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let Xe=0,it=U.length;Xe<it;Xe++){const at=U[Xe],{object:Ke,geometry:Me,material:We,group:Oe}=at;if(We.side===Ut&&Ke.layers.test(N.layers)){const xt=We.side;We.side=Rt,We.needsUpdate=!0,Wi(Ke,F,N,Me,We,Oe),We.side=xt,We.needsUpdate=!0,Ue=!0}}Ue===!0&&(D.updateMultisampleRenderTarget(ae),D.updateRenderTargetMipmap(ae))}_.setRenderTarget(oe,de,ve),_.setClearColor(Se,_e),Ee!==void 0&&(N.viewport=Ee),_.toneMapping=Te}function Pn(m,U,F){const N=U.isScene===!0?U.overrideMaterial:null;for(let y=0,ae=m.length;y<ae;y++){const le=m[y],{object:oe,geometry:de,group:ve}=le;let Te=le.material;Te.allowOverride===!0&&N!==null&&(Te=N),oe.layers.test(F.layers)&&Wi(oe,U,F,de,Te,ve)}}function Wi(m,U,F,N,y,ae){m.onBeforeRender(_,U,F,N,y,ae),m.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,m.matrixWorld),m.normalMatrix.getNormalMatrix(m.modelViewMatrix),y.onBeforeRender(_,U,F,N,m,ae),y.transparent===!0&&y.side===Ut&&y.forceSinglePass===!1?(y.side=Rt,y.needsUpdate=!0,_.renderBufferDirect(F,U,N,y,m,ae),y.side=dn,y.needsUpdate=!0,_.renderBufferDirect(F,U,N,y,m,ae),y.side=Ut):_.renderBufferDirect(F,U,N,y,m,ae),m.onAfterRender(_,U,F,N,y,ae)}function Ln(m,U,F){U.isScene!==!0&&(U=je);const N=f.get(m),y=T.state.lights,ae=T.state.shadowsArray,le=y.state.version,oe=he.getParameters(m,y.state,ae,U,F),de=he.getProgramCacheKey(oe);let ve=N.programs;N.environment=m.isMeshStandardMaterial?U.environment:null,N.fog=U.fog,N.envMap=(m.isMeshStandardMaterial?K:k).get(m.envMap||N.environment),N.envMapRotation=N.environment!==null&&m.envMap===null?U.environmentRotation:m.envMapRotation,ve===void 0&&(m.addEventListener("dispose",Ct),ve=new Map,N.programs=ve);let Te=ve.get(de);if(Te!==void 0){if(N.currentProgram===Te&&N.lightsStateVersion===le)return ji(m,oe),Te}else oe.uniforms=he.getUniforms(m),m.onBeforeCompile(oe,_),Te=he.acquireProgram(oe,de),ve.set(de,Te),N.uniforms=oe.uniforms;const Ee=N.uniforms;return(!m.isShaderMaterial&&!m.isRawShaderMaterial||m.clipping===!0)&&(Ee.clippingPlanes=ue.uniform),ji(m,oe),N.needsLights=ao(m),N.lightsStateVersion=le,N.needsLights&&(Ee.ambientLightColor.value=y.state.ambient,Ee.lightProbe.value=y.state.probe,Ee.directionalLights.value=y.state.directional,Ee.directionalLightShadows.value=y.state.directionalShadow,Ee.spotLights.value=y.state.spot,Ee.spotLightShadows.value=y.state.spotShadow,Ee.rectAreaLights.value=y.state.rectArea,Ee.ltc_1.value=y.state.rectAreaLTC1,Ee.ltc_2.value=y.state.rectAreaLTC2,Ee.pointLights.value=y.state.point,Ee.pointLightShadows.value=y.state.pointShadow,Ee.hemisphereLights.value=y.state.hemi,Ee.directionalShadowMap.value=y.state.directionalShadowMap,Ee.directionalShadowMatrix.value=y.state.directionalShadowMatrix,Ee.spotShadowMap.value=y.state.spotShadowMap,Ee.spotLightMatrix.value=y.state.spotLightMatrix,Ee.spotLightMap.value=y.state.spotLightMap,Ee.pointShadowMap.value=y.state.pointShadowMap,Ee.pointShadowMatrix.value=y.state.pointShadowMatrix),N.currentProgram=Te,N.uniformsList=null,Te}function Xi(m){if(m.uniformsList===null){const U=m.currentProgram.getUniforms();m.uniformsList=Bn.seqWithValue(U.seq,m.uniforms)}return m.uniformsList}function ji(m,U){const F=f.get(m);F.outputColorSpace=U.outputColorSpace,F.batching=U.batching,F.batchingColor=U.batchingColor,F.instancing=U.instancing,F.instancingColor=U.instancingColor,F.instancingMorph=U.instancingMorph,F.skinning=U.skinning,F.morphTargets=U.morphTargets,F.morphNormals=U.morphNormals,F.morphColors=U.morphColors,F.morphTargetsCount=U.morphTargetsCount,F.numClippingPlanes=U.numClippingPlanes,F.numIntersection=U.numClipIntersection,F.vertexAlphas=U.vertexAlphas,F.vertexTangents=U.vertexTangents,F.toneMapping=U.toneMapping}function no(m,U,F,N,y){U.isScene!==!0&&(U=je),D.resetTextureUnits();const ae=U.fog,le=N.isMeshStandardMaterial?U.environment:null,oe=G===null?_.outputColorSpace:G.isXRRenderTarget===!0?G.texture.colorSpace:Et,de=(N.isMeshStandardMaterial?K:k).get(N.envMap||le),ve=N.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Te=!!F.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),Ee=!!F.morphAttributes.position,Ue=!!F.morphAttributes.normal,Xe=!!F.morphAttributes.color;let it=It;N.toneMapped&&(G===null||G.isXRRenderTarget===!0)&&(it=_.toneMapping);const at=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Ke=at!==void 0?at.length:0,Me=f.get(N),We=T.state.lights;if(pe===!0&&(Fe===!0||m!==q)){const pt=m===q&&N.id===X;ue.setState(N,m,pt)}let Oe=!1;N.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==We.state.version||Me.outputColorSpace!==oe||y.isBatchedMesh&&Me.batching===!1||!y.isBatchedMesh&&Me.batching===!0||y.isBatchedMesh&&Me.batchingColor===!0&&y.colorTexture===null||y.isBatchedMesh&&Me.batchingColor===!1&&y.colorTexture!==null||y.isInstancedMesh&&Me.instancing===!1||!y.isInstancedMesh&&Me.instancing===!0||y.isSkinnedMesh&&Me.skinning===!1||!y.isSkinnedMesh&&Me.skinning===!0||y.isInstancedMesh&&Me.instancingColor===!0&&y.instanceColor===null||y.isInstancedMesh&&Me.instancingColor===!1&&y.instanceColor!==null||y.isInstancedMesh&&Me.instancingMorph===!0&&y.morphTexture===null||y.isInstancedMesh&&Me.instancingMorph===!1&&y.morphTexture!==null||Me.envMap!==de||N.fog===!0&&Me.fog!==ae||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==ue.numPlanes||Me.numIntersection!==ue.numIntersection)||Me.vertexAlphas!==ve||Me.vertexTangents!==Te||Me.morphTargets!==Ee||Me.morphNormals!==Ue||Me.morphColors!==Xe||Me.toneMapping!==it||Me.morphTargetsCount!==Ke)&&(Oe=!0):(Oe=!0,Me.__version=N.version);let xt=Me.currentProgram;Oe===!0&&(xt=Ln(N,U,y));let an=!1,St=!1,gn=!1;const Je=xt.getUniforms(),gt=Me.uniforms;if(me.useProgram(xt.program)&&(an=!0,St=!0,gn=!0),N.id!==X&&(X=N.id,St=!0),an||q!==m){me.buffers.depth.getReversed()&&m.reversedDepth!==!0&&(m._reversedDepth=!0,m.updateProjectionMatrix()),Je.setValue(C,"projectionMatrix",m.projectionMatrix),Je.setValue(C,"viewMatrix",m.matrixWorldInverse);const _t=Je.map.cameraPosition;_t!==void 0&&_t.setValue(C,Ne.setFromMatrixPosition(m.matrixWorld)),Ye.logarithmicDepthBuffer&&Je.setValue(C,"logDepthBufFC",2/(Math.log(m.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&Je.setValue(C,"isOrthographic",m.isOrthographicCamera===!0),q!==m&&(q=m,St=!0,gn=!0)}if(Me.needsLights&&(We.state.directionalShadowMap.length>0&&Je.setValue(C,"directionalShadowMap",We.state.directionalShadowMap,D),We.state.spotShadowMap.length>0&&Je.setValue(C,"spotShadowMap",We.state.spotShadowMap,D),We.state.pointShadowMap.length>0&&Je.setValue(C,"pointShadowMap",We.state.pointShadowMap,D)),y.isSkinnedMesh){Je.setOptional(C,y,"bindMatrix"),Je.setOptional(C,y,"bindMatrixInverse");const pt=y.skeleton;pt&&(pt.boneTexture===null&&pt.computeBoneTexture(),Je.setValue(C,"boneTexture",pt.boneTexture,D))}y.isBatchedMesh&&(Je.setOptional(C,y,"batchingTexture"),Je.setValue(C,"batchingTexture",y._matricesTexture,D),Je.setOptional(C,y,"batchingIdTexture"),Je.setValue(C,"batchingIdTexture",y._indirectTexture,D),Je.setOptional(C,y,"batchingColorTexture"),y._colorsTexture!==null&&Je.setValue(C,"batchingColorTexture",y._colorsTexture,D));const Tt=F.morphAttributes;if((Tt.position!==void 0||Tt.normal!==void 0||Tt.color!==void 0)&&De.update(y,F,xt),(St||Me.receiveShadow!==y.receiveShadow)&&(Me.receiveShadow=y.receiveShadow,Je.setValue(C,"receiveShadow",y.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(gt.envMap.value=de,gt.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),N.isMeshStandardMaterial&&N.envMap===null&&U.environment!==null&&(gt.envMapIntensity.value=U.environmentIntensity),gt.dfgLUT!==void 0&&(gt.dfgLUT.value=Fu()),St&&(Je.setValue(C,"toneMappingExposure",_.toneMappingExposure),Me.needsLights&&io(gt,gn),ae&&N.fog===!0&&Ae.refreshFogUniforms(gt,ae),Ae.refreshMaterialUniforms(gt,N,ye,Be,T.state.transmissionRenderTarget[m.id]),Bn.upload(C,Xi(Me),gt,D)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(Bn.upload(C,Xi(Me),gt,D),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&Je.setValue(C,"center",y.center),Je.setValue(C,"modelViewMatrix",y.modelViewMatrix),Je.setValue(C,"normalMatrix",y.normalMatrix),Je.setValue(C,"modelMatrix",y.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){const pt=N.uniformsGroups;for(let _t=0,ei=pt.length;_t<ei;_t++){const Yt=pt[_t];Q.update(Yt,xt),Q.bind(Yt,xt)}}return xt}function io(m,U){m.ambientLightColor.needsUpdate=U,m.lightProbe.needsUpdate=U,m.directionalLights.needsUpdate=U,m.directionalLightShadows.needsUpdate=U,m.pointLights.needsUpdate=U,m.pointLightShadows.needsUpdate=U,m.spotLights.needsUpdate=U,m.spotLightShadows.needsUpdate=U,m.rectAreaLights.needsUpdate=U,m.hemisphereLights.needsUpdate=U}function ao(m){return m.isMeshLambertMaterial||m.isMeshToonMaterial||m.isMeshPhongMaterial||m.isMeshStandardMaterial||m.isShadowMaterial||m.isShaderMaterial&&m.lights===!0}this.getActiveCubeFace=function(){return L},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return G},this.setRenderTargetTextures=function(m,U,F){const N=f.get(m);N.__autoAllocateDepthBuffer=m.resolveDepthBuffer===!1,N.__autoAllocateDepthBuffer===!1&&(N.__useRenderToTexture=!1),f.get(m.texture).__webglTexture=U,f.get(m.depthTexture).__webglTexture=N.__autoAllocateDepthBuffer?void 0:F,N.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(m,U){const F=f.get(m);F.__webglFramebuffer=U,F.__useDefaultFramebuffer=U===void 0};const ro=C.createFramebuffer();this.setRenderTarget=function(m,U=0,F=0){G=m,L=U,H=F;let N=null,y=!1,ae=!1;if(m){const oe=f.get(m);if(oe.__useDefaultFramebuffer!==void 0){me.bindFramebuffer(C.FRAMEBUFFER,oe.__webglFramebuffer),B.copy(m.viewport),V.copy(m.scissor),Z=m.scissorTest,me.viewport(B),me.scissor(V),me.setScissorTest(Z),X=-1;return}else if(oe.__webglFramebuffer===void 0)D.setupRenderTarget(m);else if(oe.__hasExternalTextures)D.rebindTextures(m,f.get(m.texture).__webglTexture,f.get(m.depthTexture).__webglTexture);else if(m.depthBuffer){const Te=m.depthTexture;if(oe.__boundDepthTexture!==Te){if(Te!==null&&f.has(Te)&&(m.width!==Te.image.width||m.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");D.setupDepthRenderbuffer(m)}}const de=m.texture;(de.isData3DTexture||de.isDataArrayTexture||de.isCompressedArrayTexture)&&(ae=!0);const ve=f.get(m).__webglFramebuffer;m.isWebGLCubeRenderTarget?(Array.isArray(ve[U])?N=ve[U][F]:N=ve[U],y=!0):m.samples>0&&D.useMultisampledRTT(m)===!1?N=f.get(m).__webglMultisampledFramebuffer:Array.isArray(ve)?N=ve[F]:N=ve,B.copy(m.viewport),V.copy(m.scissor),Z=m.scissorTest}else B.copy(W).multiplyScalar(ye).floor(),V.copy(Y).multiplyScalar(ye).floor(),Z=fe;if(F!==0&&(N=ro),me.bindFramebuffer(C.FRAMEBUFFER,N)&&me.drawBuffers(m,N),me.viewport(B),me.scissor(V),me.setScissorTest(Z),y){const oe=f.get(m.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+U,oe.__webglTexture,F)}else if(ae){const oe=U;for(let de=0;de<m.textures.length;de++){const ve=f.get(m.textures[de]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+de,ve.__webglTexture,F,oe)}}else if(m!==null&&F!==0){const oe=f.get(m.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,oe.__webglTexture,F)}X=-1},this.readRenderTargetPixels=function(m,U,F,N,y,ae,le,oe=0){if(!(m&&m.isWebGLRenderTarget)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=f.get(m).__webglFramebuffer;if(m.isWebGLCubeRenderTarget&&le!==void 0&&(de=de[le]),de){me.bindFramebuffer(C.FRAMEBUFFER,de);try{const ve=m.textures[oe],Te=ve.format,Ee=ve.type;if(!Ye.textureFormatReadable(Te)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ye.textureTypeReadable(Ee)){et("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=m.width-N&&F>=0&&F<=m.height-y&&(m.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+oe),C.readPixels(U,F,N,y,$.convert(Te),$.convert(Ee),ae))}finally{const ve=G!==null?f.get(G).__webglFramebuffer:null;me.bindFramebuffer(C.FRAMEBUFFER,ve)}}},this.readRenderTargetPixelsAsync=async function(m,U,F,N,y,ae,le,oe=0){if(!(m&&m.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=f.get(m).__webglFramebuffer;if(m.isWebGLCubeRenderTarget&&le!==void 0&&(de=de[le]),de)if(U>=0&&U<=m.width-N&&F>=0&&F<=m.height-y){me.bindFramebuffer(C.FRAMEBUFFER,de);const ve=m.textures[oe],Te=ve.format,Ee=ve.type;if(!Ye.textureFormatReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ye.textureTypeReadable(Ee))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ue=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,Ue),C.bufferData(C.PIXEL_PACK_BUFFER,ae.byteLength,C.STREAM_READ),m.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+oe),C.readPixels(U,F,N,y,$.convert(Te),$.convert(Ee),0);const Xe=G!==null?f.get(G).__webglFramebuffer:null;me.bindFramebuffer(C.FRAMEBUFFER,Xe);const it=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await fo(C,it,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,Ue),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,ae),C.deleteBuffer(Ue),C.deleteSync(it),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(m,U=null,F=0){const N=Math.pow(2,-F),y=Math.floor(m.image.width*N),ae=Math.floor(m.image.height*N),le=U!==null?U.x:0,oe=U!==null?U.y:0;D.setTexture2D(m,0),C.copyTexSubImage2D(C.TEXTURE_2D,F,0,0,le,oe,y,ae),me.unbindTexture()};const oo=C.createFramebuffer(),so=C.createFramebuffer();this.copyTextureToTexture=function(m,U,F=null,N=null,y=0,ae=null){ae===null&&(y!==0?(bi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=y,y=0):ae=0);let le,oe,de,ve,Te,Ee,Ue,Xe,it;const at=m.isCompressedTexture?m.mipmaps[ae]:m.image;if(F!==null)le=F.max.x-F.min.x,oe=F.max.y-F.min.y,de=F.isBox3?F.max.z-F.min.z:1,ve=F.min.x,Te=F.min.y,Ee=F.isBox3?F.min.z:0;else{const Tt=Math.pow(2,-y);le=Math.floor(at.width*Tt),oe=Math.floor(at.height*Tt),m.isDataArrayTexture?de=at.depth:m.isData3DTexture?de=Math.floor(at.depth*Tt):de=1,ve=0,Te=0,Ee=0}N!==null?(Ue=N.x,Xe=N.y,it=N.z):(Ue=0,Xe=0,it=0);const Ke=$.convert(U.format),Me=$.convert(U.type);let We;U.isData3DTexture?(D.setTexture3D(U,0),We=C.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(D.setTexture2DArray(U,0),We=C.TEXTURE_2D_ARRAY):(D.setTexture2D(U,0),We=C.TEXTURE_2D),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,U.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,U.unpackAlignment);const Oe=C.getParameter(C.UNPACK_ROW_LENGTH),xt=C.getParameter(C.UNPACK_IMAGE_HEIGHT),an=C.getParameter(C.UNPACK_SKIP_PIXELS),St=C.getParameter(C.UNPACK_SKIP_ROWS),gn=C.getParameter(C.UNPACK_SKIP_IMAGES);C.pixelStorei(C.UNPACK_ROW_LENGTH,at.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,at.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,ve),C.pixelStorei(C.UNPACK_SKIP_ROWS,Te),C.pixelStorei(C.UNPACK_SKIP_IMAGES,Ee);const Je=m.isDataArrayTexture||m.isData3DTexture,gt=U.isDataArrayTexture||U.isData3DTexture;if(m.isDepthTexture){const Tt=f.get(m),pt=f.get(U),_t=f.get(Tt.__renderTarget),ei=f.get(pt.__renderTarget);me.bindFramebuffer(C.READ_FRAMEBUFFER,_t.__webglFramebuffer),me.bindFramebuffer(C.DRAW_FRAMEBUFFER,ei.__webglFramebuffer);for(let Yt=0;Yt<de;Yt++)Je&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,f.get(m).__webglTexture,y,Ee+Yt),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,f.get(U).__webglTexture,ae,it+Yt)),C.blitFramebuffer(ve,Te,le,oe,Ue,Xe,le,oe,C.DEPTH_BUFFER_BIT,C.NEAREST);me.bindFramebuffer(C.READ_FRAMEBUFFER,null),me.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(y!==0||m.isRenderTargetTexture||f.has(m)){const Tt=f.get(m),pt=f.get(U);me.bindFramebuffer(C.READ_FRAMEBUFFER,oo),me.bindFramebuffer(C.DRAW_FRAMEBUFFER,so);for(let _t=0;_t<de;_t++)Je?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,Tt.__webglTexture,y,Ee+_t):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Tt.__webglTexture,y),gt?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,pt.__webglTexture,ae,it+_t):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,pt.__webglTexture,ae),y!==0?C.blitFramebuffer(ve,Te,le,oe,Ue,Xe,le,oe,C.COLOR_BUFFER_BIT,C.NEAREST):gt?C.copyTexSubImage3D(We,ae,Ue,Xe,it+_t,ve,Te,le,oe):C.copyTexSubImage2D(We,ae,Ue,Xe,ve,Te,le,oe);me.bindFramebuffer(C.READ_FRAMEBUFFER,null),me.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else gt?m.isDataTexture||m.isData3DTexture?C.texSubImage3D(We,ae,Ue,Xe,it,le,oe,de,Ke,Me,at.data):U.isCompressedArrayTexture?C.compressedTexSubImage3D(We,ae,Ue,Xe,it,le,oe,de,Ke,at.data):C.texSubImage3D(We,ae,Ue,Xe,it,le,oe,de,Ke,Me,at):m.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,ae,Ue,Xe,le,oe,Ke,Me,at.data):m.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,ae,Ue,Xe,at.width,at.height,Ke,at.data):C.texSubImage2D(C.TEXTURE_2D,ae,Ue,Xe,le,oe,Ke,Me,at);C.pixelStorei(C.UNPACK_ROW_LENGTH,Oe),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,xt),C.pixelStorei(C.UNPACK_SKIP_PIXELS,an),C.pixelStorei(C.UNPACK_SKIP_ROWS,St),C.pixelStorei(C.UNPACK_SKIP_IMAGES,gn),ae===0&&U.generateMipmaps&&C.generateMipmap(We),me.unbindTexture()},this.initRenderTarget=function(m){f.get(m).__webglFramebuffer===void 0&&D.setupRenderTarget(m)},this.initTexture=function(m){m.isCubeTexture?D.setTextureCube(m,0):m.isData3DTexture?D.setTexture3D(m,0):m.isDataArrayTexture||m.isCompressedArrayTexture?D.setTexture2DArray(m,0):D.setTexture2D(m,0),me.unbindTexture()},this.resetState=function(){L=0,H=0,G=null,me.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return qi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(n),t.unpackColorSpace=tt._getUnpackColorSpace()}}function Hp(e,n=!1){const t=e[0].index!==null,i=new Set(Object.keys(e[0].attributes)),r=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new hn;let d=0;for(let h=0;h<e.length;++h){const u=e[h];let g=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const v in u.attributes){if(!i.has(v))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+v+'" attribute exists among all geometries, or in none of them.'),null;a[v]===void 0&&(a[v]=[]),a[v].push(u.attributes[v]),g++}if(g!==i.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(s!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const v in u.morphAttributes){if(!r.has(v))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[v]===void 0&&(o[v]=[]),o[v].push(u.morphAttributes[v])}if(n){let v;if(t)v=u.index.count;else if(u.attributes.position!==void 0)v=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;c.addGroup(d,v,h),d+=v}}if(t){let h=0;const u=[];for(let g=0;g<e.length;++g){const v=e[g].index;for(let R=0;R<v.count;++R)u.push(v.getX(R)+h);h+=e[g].attributes.position.count}c.setIndex(u)}for(const h in a){const u=cr(a[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;c.setAttribute(h,u)}for(const h in o){const u=o[h][0].length;if(u===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[h]=[];for(let g=0;g<u;++g){const v=[];for(let w=0;w<o[h].length;++w)v.push(o[h][w][g]);const R=cr(v);if(!R)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;c.morphAttributes[h].push(R)}}return c}function cr(e){let n,t,i,r=-1,a=0;for(let d=0;d<e.length;++d){const h=e[d];if(n===void 0&&(n=h.array.constructor),n!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(i===void 0&&(i=h.normalized),i!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=h.gpuType),r!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;a+=h.count*t}const o=new n(a),s=new Xt(o,t,i);let c=0;for(let d=0;d<e.length;++d){const h=e[d];if(h.isInterleavedBufferAttribute){const u=c/t;for(let g=0,v=h.count;g<v;g++)for(let R=0;R<t;R++){const w=h.getComponent(g,R);s.setComponent(g+u,R,w)}}else o.set(h.array,c);c+=h.count*t}return r!==void 0&&(s.gpuType=r),s}function lr(e,n){if(n===gs)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),e;if(n===Pi||n===kr){let t=e.getIndex();if(t===null){const o=[],s=e.getAttribute("position");if(s!==void 0){for(let c=0;c<s.count;c++)o.push(c);e.setIndex(o),t=e.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),e}const i=t.count-2,r=[];if(n===Pi)for(let o=1;o<=i;o++)r.push(t.getX(0)),r.push(t.getX(o)),r.push(t.getX(o+1));else for(let o=0;o<i;o++)o%2===0?(r.push(t.getX(o)),r.push(t.getX(o+1)),r.push(t.getX(o+2))):(r.push(t.getX(o+2)),r.push(t.getX(o+1)),r.push(t.getX(o)));r.length/3!==i&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const a=e.clone();return a.setIndex(r),a.clearGroups(),a}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",n),e}class Ou extends _s{constructor(n){super(n),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Vu(t)}),this.register(function(t){return new zu(t)}),this.register(function(t){return new Zu(t)}),this.register(function(t){return new $u(t)}),this.register(function(t){return new ep(t)}),this.register(function(t){return new Xu(t)}),this.register(function(t){return new ju(t)}),this.register(function(t){return new Ku(t)}),this.register(function(t){return new qu(t)}),this.register(function(t){return new ku(t)}),this.register(function(t){return new Yu(t)}),this.register(function(t){return new Wu(t)}),this.register(function(t){return new Ju(t)}),this.register(function(t){return new Qu(t)}),this.register(function(t){return new Hu(t)}),this.register(function(t){return new tp(t)}),this.register(function(t){return new np(t)})}load(n,t,i,r){const a=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const d=An.extractUrlBase(n);o=An.resolveURL(d,this.path)}else o=An.extractUrlBase(n);this.manager.itemStart(n);const s=function(d){r?r(d):console.error(d),a.manager.itemError(n),a.manager.itemEnd(n)},c=new Vr(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(n,function(d){try{a.parse(d,o,function(h){t(h),a.manager.itemEnd(n)},s)}catch(h){s(h)}},i,s)}setDRACOLoader(n){return this.dracoLoader=n,this}setKTX2Loader(n){return this.ktx2Loader=n,this}setMeshoptDecoder(n){return this.meshoptDecoder=n,this}register(n){return this.pluginCallbacks.indexOf(n)===-1&&this.pluginCallbacks.push(n),this}unregister(n){return this.pluginCallbacks.indexOf(n)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(n),1),this}parse(n,t,i,r){let a;const o={},s={},c=new TextDecoder;if(typeof n=="string")a=JSON.parse(n);else if(n instanceof ArrayBuffer)if(c.decode(new Uint8Array(n,0,4))===Jr){try{o[Ie.KHR_BINARY_GLTF]=new ip(n)}catch(u){r&&r(u);return}a=JSON.parse(o[Ie.KHR_BINARY_GLTF].content)}else a=JSON.parse(c.decode(n));else a=n;if(a.asset===void 0||a.asset.version[0]<2){r&&r(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const d=new gp(a,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});d.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](d);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),s[u.name]=u,o[u.name]=!0}if(a.extensionsUsed)for(let h=0;h<a.extensionsUsed.length;++h){const u=a.extensionsUsed[h],g=a.extensionsRequired||[];switch(u){case Ie.KHR_MATERIALS_UNLIT:o[u]=new Bu;break;case Ie.KHR_DRACO_MESH_COMPRESSION:o[u]=new ap(a,this.dracoLoader);break;case Ie.KHR_TEXTURE_TRANSFORM:o[u]=new rp;break;case Ie.KHR_MESH_QUANTIZATION:o[u]=new op;break;default:g.indexOf(u)>=0&&s[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}d.setExtensions(o),d.setPlugins(s),d.parse(i,r)}parseAsync(n,t){const i=this;return new Promise(function(r,a){i.parse(n,t,r,a)})}}function Gu(){let e={};return{get:function(n){return e[n]},add:function(n,t){e[n]=t},remove:function(n){delete e[n]},removeAll:function(){e={}}}}const Ie={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class Hu{constructor(n){this.parser=n,this.name=Ie.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const n=this.parser,t=this.parser.json.nodes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i];a.extensions&&a.extensions[this.name]&&a.extensions[this.name].light!==void 0&&n._addNodeRef(this.cache,a.extensions[this.name].light)}}_loadLight(n){const t=this.parser,i="light:"+n;let r=t.cache.get(i);if(r)return r;const a=t.json,c=((a.extensions&&a.extensions[this.name]||{}).lights||[])[n];let d;const h=new He(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],Et);const u=c.range!==void 0?c.range:0;switch(c.type){case"directional":d=new xs(h),d.target.position.set(0,0,-1),d.add(d.target);break;case"point":d=new vs(h),d.distance=u;break;case"spot":d=new bs(h),d.distance=u,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,d.angle=c.spot.outerConeAngle,d.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,d.target.position.set(0,0,-1),d.add(d.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return d.position.set(0,0,0),Pt(d,c),c.intensity!==void 0&&(d.intensity=c.intensity),d.name=t.createUniqueName(c.name||"light_"+n),r=Promise.resolve(d),t.cache.add(i,r),r}getDependency(n,t){if(n==="light")return this._loadLight(t)}createNodeAttachment(n){const t=this,i=this.parser,a=i.json.nodes[n],s=(a.extensions&&a.extensions[this.name]||{}).light;return s===void 0?null:this._loadLight(s).then(function(c){return i._getNodeRef(t.cache,s,c)})}}class Bu{constructor(){this.name=Ie.KHR_MATERIALS_UNLIT}getMaterialType(){return sn}extendParams(n,t,i){const r=[];n.color=new He(1,1,1),n.opacity=1;const a=t.pbrMetallicRoughness;if(a){if(Array.isArray(a.baseColorFactor)){const o=a.baseColorFactor;n.color.setRGB(o[0],o[1],o[2],Et),n.opacity=o[3]}a.baseColorTexture!==void 0&&r.push(i.assignTexture(n,"map",a.baseColorTexture,fn))}return Promise.all(r)}}class ku{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(n,t){const r=this.parser.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=r.extensions[this.name].emissiveStrength;return a!==void 0&&(t.emissiveIntensity=a),Promise.resolve()}}class Vu{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_CLEARCOAT}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&a.push(i.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&a.push(i.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(a.push(i.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){const s=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ut(s,s)}return Promise.all(a)}}class zu{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_DISPERSION}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const r=this.parser.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=r.extensions[this.name];return t.dispersion=a.dispersion!==void 0?a.dispersion:0,Promise.resolve()}}class Wu{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_IRIDESCENCE}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&a.push(i.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&a.push(i.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(a)}}class Xu{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_SHEEN}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[];t.sheenColor=new He(0,0,0),t.sheenRoughness=0,t.sheen=1;const o=r.extensions[this.name];if(o.sheenColorFactor!==void 0){const s=o.sheenColorFactor;t.sheenColor.setRGB(s[0],s[1],s[2],Et)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&a.push(i.assignTexture(t,"sheenColorMap",o.sheenColorTexture,fn)),o.sheenRoughnessTexture!==void 0&&a.push(i.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(a)}}class ju{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_TRANSMISSION}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&a.push(i.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(a)}}class Ku{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_VOLUME}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&a.push(i.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;const s=o.attenuationColor||[1,1,1];return t.attenuationColor=new He().setRGB(s[0],s[1],s[2],Et),Promise.all(a)}}class qu{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_IOR}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const r=this.parser.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=r.extensions[this.name];return t.ior=a.ior!==void 0?a.ior:1.5,Promise.resolve()}}class Yu{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_SPECULAR}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&a.push(i.assignTexture(t,"specularIntensityMap",o.specularTexture));const s=o.specularColorFactor||[1,1,1];return t.specularColor=new He().setRGB(s[0],s[1],s[2],Et),o.specularColorTexture!==void 0&&a.push(i.assignTexture(t,"specularColorMap",o.specularColorTexture,fn)),Promise.all(a)}}class Qu{constructor(n){this.parser=n,this.name=Ie.EXT_MATERIALS_BUMP}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&a.push(i.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(a)}}class Ju{constructor(n){this.parser=n,this.name=Ie.KHR_MATERIALS_ANISOTROPY}getMaterialType(n){const i=this.parser.json.materials[n];return!i.extensions||!i.extensions[this.name]?null:Nt}extendMaterialParams(n,t){const i=this.parser,r=i.json.materials[n];if(!r.extensions||!r.extensions[this.name])return Promise.resolve();const a=[],o=r.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&a.push(i.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(a)}}class Zu{constructor(n){this.parser=n,this.name=Ie.KHR_TEXTURE_BASISU}loadTexture(n){const t=this.parser,i=t.json,r=i.textures[n];if(!r.extensions||!r.extensions[this.name])return null;const a=r.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(i.extensionsRequired&&i.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(n,a.source,o)}}class $u{constructor(n){this.parser=n,this.name=Ie.EXT_TEXTURE_WEBP}loadTexture(n){const t=this.name,i=this.parser,r=i.json,a=r.textures[n];if(!a.extensions||!a.extensions[t])return null;const o=a.extensions[t],s=r.images[o.source];let c=i.textureLoader;if(s.uri){const d=i.options.manager.getHandler(s.uri);d!==null&&(c=d)}return i.loadTextureImage(n,o.source,c)}}class ep{constructor(n){this.parser=n,this.name=Ie.EXT_TEXTURE_AVIF}loadTexture(n){const t=this.name,i=this.parser,r=i.json,a=r.textures[n];if(!a.extensions||!a.extensions[t])return null;const o=a.extensions[t],s=r.images[o.source];let c=i.textureLoader;if(s.uri){const d=i.options.manager.getHandler(s.uri);d!==null&&(c=d)}return i.loadTextureImage(n,o.source,c)}}class tp{constructor(n){this.name=Ie.EXT_MESHOPT_COMPRESSION,this.parser=n}loadBufferView(n){const t=this.parser.json,i=t.bufferViews[n];if(i.extensions&&i.extensions[this.name]){const r=i.extensions[this.name],a=this.parser.getDependency("buffer",r.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return a.then(function(s){const c=r.byteOffset||0,d=r.byteLength||0,h=r.count,u=r.byteStride,g=new Uint8Array(s,c,d);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,g,r.mode,r.filter).then(function(v){return v.buffer}):o.ready.then(function(){const v=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(v),h,u,g,r.mode,r.filter),v})})}else return null}}class np{constructor(n){this.name=Ie.EXT_MESH_GPU_INSTANCING,this.parser=n}createNodeMesh(n){const t=this.parser.json,i=t.nodes[n];if(!i.extensions||!i.extensions[this.name]||i.mesh===void 0)return null;const r=t.meshes[i.mesh];for(const d of r.primitives)if(d.mode!==At.TRIANGLES&&d.mode!==At.TRIANGLE_STRIP&&d.mode!==At.TRIANGLE_FAN&&d.mode!==void 0)return null;const o=i.extensions[this.name].attributes,s=[],c={};for(const d in o)s.push(this.parser.getDependency("accessor",o[d]).then(h=>(c[d]=h,c[d])));return s.length<1?null:(s.push(this.parser.createNodeMesh(n)),Promise.all(s).then(d=>{const h=d.pop(),u=h.isGroup?h.children:[h],g=d[0].count,v=[];for(const R of u){const w=new yt,p=new we,l=new zr,E=new we(1,1,1),M=new Ss(R.geometry,R.material,g);for(let S=0;S<g;S++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,S),c.ROTATION&&l.fromBufferAttribute(c.ROTATION,S),c.SCALE&&E.fromBufferAttribute(c.SCALE,S),M.setMatrixAt(S,w.compose(p,l,E));for(const S in c)if(S==="_COLOR_0"){const T=c[S];M.instanceColor=new Es(T.array,T.itemSize,T.normalized)}else S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"&&R.geometry.setAttribute(S,c[S]);Wr.prototype.copy.call(M,R),this.parser.assignFinalMaterial(M),v.push(M)}return h.isGroup?(h.clear(),h.add(...v),h):v[0]}))}}const Jr="glTF",xn=12,fr={JSON:1313821514,BIN:5130562};class ip{constructor(n){this.name=Ie.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(n,0,xn),i=new TextDecoder;if(this.header={magic:i.decode(new Uint8Array(n.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Jr)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const r=this.header.length-xn,a=new DataView(n,xn);let o=0;for(;o<r;){const s=a.getUint32(o,!0);o+=4;const c=a.getUint32(o,!0);if(o+=4,c===fr.JSON){const d=new Uint8Array(n,xn+o,s);this.content=i.decode(d)}else if(c===fr.BIN){const d=xn+o;this.body=n.slice(d,d+s)}o+=s}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class ap{constructor(n,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=Ie.KHR_DRACO_MESH_COMPRESSION,this.json=n,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(n,t){const i=this.json,r=this.dracoLoader,a=n.extensions[this.name].bufferView,o=n.extensions[this.name].attributes,s={},c={},d={};for(const h in o){const u=Ii[h]||h.toLowerCase();s[u]=o[h]}for(const h in n.attributes){const u=Ii[h]||h.toLowerCase();if(o[h]!==void 0){const g=i.accessors[n.attributes[h]],v=ln[g.componentType];d[u]=v.name,c[u]=g.normalized===!0}}return t.getDependency("bufferView",a).then(function(h){return new Promise(function(u,g){r.decodeDracoFile(h,function(v){for(const R in v.attributes){const w=v.attributes[R],p=c[R];p!==void 0&&(w.normalized=p)}u(v)},s,d,Et,g)})})}}class rp{constructor(){this.name=Ie.KHR_TEXTURE_TRANSFORM}extendTexture(n,t){return(t.texCoord===void 0||t.texCoord===n.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(n=n.clone(),t.texCoord!==void 0&&(n.channel=t.texCoord),t.offset!==void 0&&n.offset.fromArray(t.offset),t.rotation!==void 0&&(n.rotation=t.rotation),t.scale!==void 0&&n.repeat.fromArray(t.scale),n.needsUpdate=!0),n}}class op{constructor(){this.name=Ie.KHR_MESH_QUANTIZATION}}class Zr extends Hs{constructor(n,t,i,r){super(n,t,i,r)}copySampleValue_(n){const t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,a=n*r*3+r;for(let o=0;o!==r;o++)t[o]=i[a+o];return t}interpolate_(n,t,i,r){const a=this.resultBuffer,o=this.sampleValues,s=this.valueSize,c=s*2,d=s*3,h=r-t,u=(i-t)/h,g=u*u,v=g*u,R=n*d,w=R-d,p=-2*v+3*g,l=v-g,E=1-p,M=l-g+u;for(let S=0;S!==s;S++){const T=o[w+S+s],A=o[w+S+c]*h,I=o[R+S+s],z=o[R+S]*h;a[S]=E*T+M*A+p*I+l*z}return a}}const sp=new zr;class cp extends Zr{interpolate_(n,t,i,r){const a=super.interpolate_(n,t,i,r);return sp.fromArray(a).normalize().toArray(a),a}}const At={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},ln={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},dr={9728:Ht,9729:mt,9984:xr,9985:On,9986:Sn,9987:en},ur={33071:Vn,33648:vr,10497:Wn},pi={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Ii={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},kt={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},lp={CUBICSPLINE:void 0,LINEAR:Xr,STEP:Os},hi={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function fp(e){return e.DefaultMaterial===void 0&&(e.DefaultMaterial=new Yn({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:dn})),e.DefaultMaterial}function Zt(e,n,t){for(const i in t.extensions)e[i]===void 0&&(n.userData.gltfExtensions=n.userData.gltfExtensions||{},n.userData.gltfExtensions[i]=t.extensions[i])}function Pt(e,n){n.extras!==void 0&&(typeof n.extras=="object"?Object.assign(e.userData,n.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+n.extras))}function dp(e,n,t){let i=!1,r=!1,a=!1;for(let d=0,h=n.length;d<h;d++){const u=n[d];if(u.POSITION!==void 0&&(i=!0),u.NORMAL!==void 0&&(r=!0),u.COLOR_0!==void 0&&(a=!0),i&&r&&a)break}if(!i&&!r&&!a)return Promise.resolve(e);const o=[],s=[],c=[];for(let d=0,h=n.length;d<h;d++){const u=n[d];if(i){const g=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):e.attributes.position;o.push(g)}if(r){const g=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):e.attributes.normal;s.push(g)}if(a){const g=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):e.attributes.color;c.push(g)}}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c)]).then(function(d){const h=d[0],u=d[1],g=d[2];return i&&(e.morphAttributes.position=h),r&&(e.morphAttributes.normal=u),a&&(e.morphAttributes.color=g),e.morphTargetsRelative=!0,e})}function up(e,n){if(e.updateMorphTargets(),n.weights!==void 0)for(let t=0,i=n.weights.length;t<i;t++)e.morphTargetInfluences[t]=n.weights[t];if(n.extras&&Array.isArray(n.extras.targetNames)){const t=n.extras.targetNames;if(e.morphTargetInfluences.length===t.length){e.morphTargetDictionary={};for(let i=0,r=t.length;i<r;i++)e.morphTargetDictionary[t[i]]=i}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function pp(e){let n;const t=e.extensions&&e.extensions[Ie.KHR_DRACO_MESH_COMPRESSION];if(t?n="draco:"+t.bufferView+":"+t.indices+":"+mi(t.attributes):n=e.indices+":"+mi(e.attributes)+":"+e.mode,e.targets!==void 0)for(let i=0,r=e.targets.length;i<r;i++)n+=":"+mi(e.targets[i]);return n}function mi(e){let n="";const t=Object.keys(e).sort();for(let i=0,r=t.length;i<r;i++)n+=t[i]+":"+e[t[i]]+";";return n}function yi(e){switch(e){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function hp(e){return e.search(/\.jpe?g($|\?)/i)>0||e.search(/^data\:image\/jpeg/)===0?"image/jpeg":e.search(/\.webp($|\?)/i)>0||e.search(/^data\:image\/webp/)===0?"image/webp":e.search(/\.ktx2($|\?)/i)>0||e.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const mp=new yt;class gp{constructor(n={},t={}){this.json=n,this.extensions={},this.plugins={},this.options=t,this.cache=new Gu,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let i=!1,r=-1,a=!1,o=-1;if(typeof navigator<"u"){const s=navigator.userAgent;i=/^((?!chrome|android).)*safari/i.test(s)===!0;const c=s.match(/Version\/(\d+)/);r=i&&c?parseInt(c[1],10):-1,a=s.indexOf("Firefox")>-1,o=a?s.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||i&&r<17||a&&o<98?this.textureLoader=new Ms(this.options.manager):this.textureLoader=new Ts(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Vr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(n){this.extensions=n}setPlugins(n){this.plugins=n}parse(n,t){const i=this,r=this.json,a=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([i.getDependencies("scene"),i.getDependencies("animation"),i.getDependencies("camera")])}).then(function(o){const s={scene:o[0][r.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:r.asset,parser:i,userData:{}};return Zt(a,s,r),Pt(s,r),Promise.all(i._invokeAll(function(c){return c.afterRoot&&c.afterRoot(s)})).then(function(){for(const c of s.scenes)c.updateMatrixWorld();n(s)})}).catch(t)}_markDefs(){const n=this.json.nodes||[],t=this.json.skins||[],i=this.json.meshes||[];for(let r=0,a=t.length;r<a;r++){const o=t[r].joints;for(let s=0,c=o.length;s<c;s++)n[o[s]].isBone=!0}for(let r=0,a=n.length;r<a;r++){const o=n[r];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(i[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(n,t){t!==void 0&&(n.refs[t]===void 0&&(n.refs[t]=n.uses[t]=0),n.refs[t]++)}_getNodeRef(n,t,i){if(n.refs[t]<=1)return i;const r=i.clone(),a=(o,s)=>{const c=this.associations.get(o);c!=null&&this.associations.set(s,c);for(const[d,h]of o.children.entries())a(h,s.children[d])};return a(i,r),r.name+="_instance_"+n.uses[t]++,r}_invokeOne(n){const t=Object.values(this.plugins);t.push(this);for(let i=0;i<t.length;i++){const r=n(t[i]);if(r)return r}return null}_invokeAll(n){const t=Object.values(this.plugins);t.unshift(this);const i=[];for(let r=0;r<t.length;r++){const a=n(t[r]);a&&i.push(a)}return i}getDependency(n,t){const i=n+":"+t;let r=this.cache.get(i);if(!r){switch(n){case"scene":r=this.loadScene(t);break;case"node":r=this._invokeOne(function(a){return a.loadNode&&a.loadNode(t)});break;case"mesh":r=this._invokeOne(function(a){return a.loadMesh&&a.loadMesh(t)});break;case"accessor":r=this.loadAccessor(t);break;case"bufferView":r=this._invokeOne(function(a){return a.loadBufferView&&a.loadBufferView(t)});break;case"buffer":r=this.loadBuffer(t);break;case"material":r=this._invokeOne(function(a){return a.loadMaterial&&a.loadMaterial(t)});break;case"texture":r=this._invokeOne(function(a){return a.loadTexture&&a.loadTexture(t)});break;case"skin":r=this.loadSkin(t);break;case"animation":r=this._invokeOne(function(a){return a.loadAnimation&&a.loadAnimation(t)});break;case"camera":r=this.loadCamera(t);break;default:if(r=this._invokeOne(function(a){return a!=this&&a.getDependency&&a.getDependency(n,t)}),!r)throw new Error("Unknown type: "+n);break}this.cache.add(i,r)}return r}getDependencies(n){let t=this.cache.get(n);if(!t){const i=this,r=this.json[n+(n==="mesh"?"es":"s")]||[];t=Promise.all(r.map(function(a,o){return i.getDependency(n,o)})),this.cache.add(n,t)}return t}loadBuffer(n){const t=this.json.buffers[n],i=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&n===0)return Promise.resolve(this.extensions[Ie.KHR_BINARY_GLTF].body);const r=this.options;return new Promise(function(a,o){i.load(An.resolveURL(t.uri,r.path),a,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(n){const t=this.json.bufferViews[n];return this.getDependency("buffer",t.buffer).then(function(i){const r=t.byteLength||0,a=t.byteOffset||0;return i.slice(a,a+r)})}loadAccessor(n){const t=this,i=this.json,r=this.json.accessors[n];if(r.bufferView===void 0&&r.sparse===void 0){const o=pi[r.type],s=ln[r.componentType],c=r.normalized===!0,d=new s(r.count*o);return Promise.resolve(new Xt(d,o,c))}const a=[];return r.bufferView!==void 0?a.push(this.getDependency("bufferView",r.bufferView)):a.push(null),r.sparse!==void 0&&(a.push(this.getDependency("bufferView",r.sparse.indices.bufferView)),a.push(this.getDependency("bufferView",r.sparse.values.bufferView))),Promise.all(a).then(function(o){const s=o[0],c=pi[r.type],d=ln[r.componentType],h=d.BYTES_PER_ELEMENT,u=h*c,g=r.byteOffset||0,v=r.bufferView!==void 0?i.bufferViews[r.bufferView].byteStride:void 0,R=r.normalized===!0;let w,p;if(v&&v!==u){const l=Math.floor(g/v),E="InterleavedBuffer:"+r.bufferView+":"+r.componentType+":"+l+":"+r.count;let M=t.cache.get(E);M||(w=new d(s,l*v,r.count*v/h),M=new As(w,v/h),t.cache.add(E,M)),p=new Gs(M,c,g%v/h,R)}else s===null?w=new d(r.count*c):w=new d(s,g,r.count*c),p=new Xt(w,c,R);if(r.sparse!==void 0){const l=pi.SCALAR,E=ln[r.sparse.indices.componentType],M=r.sparse.indices.byteOffset||0,S=r.sparse.values.byteOffset||0,T=new E(o[1],M,r.sparse.count*l),A=new d(o[2],S,r.sparse.count*c);s!==null&&(p=new Xt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let I=0,z=T.length;I<z;I++){const _=T[I];if(p.setX(_,A[I*c]),c>=2&&p.setY(_,A[I*c+1]),c>=3&&p.setZ(_,A[I*c+2]),c>=4&&p.setW(_,A[I*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=R}return p})}loadTexture(n){const t=this.json,i=this.options,a=t.textures[n].source,o=t.images[a];let s=this.textureLoader;if(o.uri){const c=i.manager.getHandler(o.uri);c!==null&&(s=c)}return this.loadTextureImage(n,a,s)}loadTextureImage(n,t,i){const r=this,a=this.json,o=a.textures[n],s=a.images[t],c=(s.uri||s.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const d=this.loadImageSource(t,i).then(function(h){h.flipY=!1,h.name=o.name||s.name||"",h.name===""&&typeof s.uri=="string"&&s.uri.startsWith("data:image/")===!1&&(h.name=s.uri);const g=(a.samplers||{})[o.sampler]||{};return h.magFilter=dr[g.magFilter]||mt,h.minFilter=dr[g.minFilter]||en,h.wrapS=ur[g.wrapS]||Wn,h.wrapT=ur[g.wrapT]||Wn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Ht&&h.minFilter!==mt,r.associations.set(h,{textures:n}),h}).catch(function(){return null});return this.textureCache[c]=d,d}loadImageSource(n,t){const i=this,r=this.json,a=this.options;if(this.sourceCache[n]!==void 0)return this.sourceCache[n].then(u=>u.clone());const o=r.images[n],s=self.URL||self.webkitURL;let c=o.uri||"",d=!1;if(o.bufferView!==void 0)c=i.getDependency("bufferView",o.bufferView).then(function(u){d=!0;const g=new Blob([u],{type:o.mimeType});return c=s.createObjectURL(g),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+n+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(u){return new Promise(function(g,v){let R=g;t.isImageBitmapLoader===!0&&(R=function(w){const p=new wi(w);p.needsUpdate=!0,g(p)}),t.load(An.resolveURL(u,a.path),R,void 0,v)})}).then(function(u){return d===!0&&s.revokeObjectURL(c),Pt(u,o),u.userData.mimeType=o.mimeType||hp(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),u});return this.sourceCache[n]=h,h}assignTexture(n,t,i,r){const a=this;return this.getDependency("texture",i.index).then(function(o){if(!o)return null;if(i.texCoord!==void 0&&i.texCoord>0&&(o=o.clone(),o.channel=i.texCoord),a.extensions[Ie.KHR_TEXTURE_TRANSFORM]){const s=i.extensions!==void 0?i.extensions[Ie.KHR_TEXTURE_TRANSFORM]:void 0;if(s){const c=a.associations.get(o);o=a.extensions[Ie.KHR_TEXTURE_TRANSFORM].extendTexture(o,s),a.associations.set(o,c)}}return r!==void 0&&(o.colorSpace=r),n[t]=o,o})}assignFinalMaterial(n){const t=n.geometry;let i=n.material;const r=t.attributes.tangent===void 0,a=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(n.isPoints){const s="PointsMaterial:"+i.uuid;let c=this.cache.get(s);c||(c=new Rs,oi.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,c.sizeAttenuation=!1,this.cache.add(s,c)),i=c}else if(n.isLine){const s="LineBasicMaterial:"+i.uuid;let c=this.cache.get(s);c||(c=new Cs,oi.prototype.copy.call(c,i),c.color.copy(i.color),c.map=i.map,this.cache.add(s,c)),i=c}if(r||a||o){let s="ClonedMaterial:"+i.uuid+":";r&&(s+="derivative-tangents:"),a&&(s+="vertex-colors:"),o&&(s+="flat-shading:");let c=this.cache.get(s);c||(c=i.clone(),a&&(c.vertexColors=!0),o&&(c.flatShading=!0),r&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(s,c),this.associations.set(c,this.associations.get(i))),i=c}n.material=i}getMaterialType(){return Yn}loadMaterial(n){const t=this,i=this.json,r=this.extensions,a=i.materials[n];let o;const s={},c=a.extensions||{},d=[];if(c[Ie.KHR_MATERIALS_UNLIT]){const u=r[Ie.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),d.push(u.extendParams(s,a,t))}else{const u=a.pbrMetallicRoughness||{};if(s.color=new He(1,1,1),s.opacity=1,Array.isArray(u.baseColorFactor)){const g=u.baseColorFactor;s.color.setRGB(g[0],g[1],g[2],Et),s.opacity=g[3]}u.baseColorTexture!==void 0&&d.push(t.assignTexture(s,"map",u.baseColorTexture,fn)),s.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,s.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(d.push(t.assignTexture(s,"metalnessMap",u.metallicRoughnessTexture)),d.push(t.assignTexture(s,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(g){return g.getMaterialType&&g.getMaterialType(n)}),d.push(Promise.all(this._invokeAll(function(g){return g.extendMaterialParams&&g.extendMaterialParams(n,s)})))}a.doubleSided===!0&&(s.side=Ut);const h=a.alphaMode||hi.OPAQUE;if(h===hi.BLEND?(s.transparent=!0,s.depthWrite=!1):(s.transparent=!1,h===hi.MASK&&(s.alphaTest=a.alphaCutoff!==void 0?a.alphaCutoff:.5)),a.normalTexture!==void 0&&o!==sn&&(d.push(t.assignTexture(s,"normalMap",a.normalTexture)),s.normalScale=new ut(1,1),a.normalTexture.scale!==void 0)){const u=a.normalTexture.scale;s.normalScale.set(u,u)}if(a.occlusionTexture!==void 0&&o!==sn&&(d.push(t.assignTexture(s,"aoMap",a.occlusionTexture)),a.occlusionTexture.strength!==void 0&&(s.aoMapIntensity=a.occlusionTexture.strength)),a.emissiveFactor!==void 0&&o!==sn){const u=a.emissiveFactor;s.emissive=new He().setRGB(u[0],u[1],u[2],Et)}return a.emissiveTexture!==void 0&&o!==sn&&d.push(t.assignTexture(s,"emissiveMap",a.emissiveTexture,fn)),Promise.all(d).then(function(){const u=new o(s);return a.name&&(u.name=a.name),Pt(u,a),t.associations.set(u,{materials:n}),a.extensions&&Zt(r,u,a),u})}createUniqueName(n){const t=ws.sanitizeNodeName(n||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(n){const t=this,i=this.extensions,r=this.primitiveCache;function a(s){return i[Ie.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(s,t).then(function(c){return pr(c,s,t)})}const o=[];for(let s=0,c=n.length;s<c;s++){const d=n[s],h=pp(d),u=r[h];if(u)o.push(u.promise);else{let g;d.extensions&&d.extensions[Ie.KHR_DRACO_MESH_COMPRESSION]?g=a(d):g=pr(new hn,d,t),r[h]={primitive:d,promise:g},o.push(g)}}return Promise.all(o)}loadMesh(n){const t=this,i=this.json,r=this.extensions,a=i.meshes[n],o=a.primitives,s=[];for(let c=0,d=o.length;c<d;c++){const h=o[c].material===void 0?fp(this.cache):this.getDependency("material",o[c].material);s.push(h)}return s.push(t.loadGeometries(o)),Promise.all(s).then(function(c){const d=c.slice(0,c.length-1),h=c[c.length-1],u=[];for(let v=0,R=h.length;v<R;v++){const w=h[v],p=o[v];let l;const E=d[v];if(p.mode===At.TRIANGLES||p.mode===At.TRIANGLE_STRIP||p.mode===At.TRIANGLE_FAN||p.mode===void 0)l=a.isSkinnedMesh===!0?new Ps(w,E):new Mt(w,E),l.isSkinnedMesh===!0&&l.normalizeSkinWeights(),p.mode===At.TRIANGLE_STRIP?l.geometry=lr(l.geometry,kr):p.mode===At.TRIANGLE_FAN&&(l.geometry=lr(l.geometry,Pi));else if(p.mode===At.LINES)l=new Ls(w,E);else if(p.mode===At.LINE_STRIP)l=new Ds(w,E);else if(p.mode===At.LINE_LOOP)l=new Us(w,E);else if(p.mode===At.POINTS)l=new Is(w,E);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(l.geometry.morphAttributes).length>0&&up(l,a),l.name=t.createUniqueName(a.name||"mesh_"+n),Pt(l,a),p.extensions&&Zt(r,l,p),t.assignFinalMaterial(l),u.push(l)}for(let v=0,R=u.length;v<R;v++)t.associations.set(u[v],{meshes:n,primitives:v});if(u.length===1)return a.extensions&&Zt(r,u[0],a),u[0];const g=new dt;a.extensions&&Zt(r,g,a),t.associations.set(g,{meshes:n});for(let v=0,R=u.length;v<R;v++)g.add(u[v]);return g})}loadCamera(n){let t;const i=this.json.cameras[n],r=i[i.type];if(!r){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return i.type==="perspective"?t=new Tn(nn.radToDeg(r.yfov),r.aspectRatio||1,r.znear||1,r.zfar||2e6):i.type==="orthographic"&&(t=new Fi(-r.xmag,r.xmag,r.ymag,-r.ymag,r.znear,r.zfar)),i.name&&(t.name=this.createUniqueName(i.name)),Pt(t,i),Promise.resolve(t)}loadSkin(n){const t=this.json.skins[n],i=[];for(let r=0,a=t.joints.length;r<a;r++)i.push(this._loadNodeShallow(t.joints[r]));return t.inverseBindMatrices!==void 0?i.push(this.getDependency("accessor",t.inverseBindMatrices)):i.push(null),Promise.all(i).then(function(r){const a=r.pop(),o=r,s=[],c=[];for(let d=0,h=o.length;d<h;d++){const u=o[d];if(u){s.push(u);const g=new yt;a!==null&&g.fromArray(a.array,d*16),c.push(g)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[d])}return new ys(s,c)})}loadAnimation(n){const t=this.json,i=this,r=t.animations[n],a=r.name?r.name:"animation_"+n,o=[],s=[],c=[],d=[],h=[];for(let u=0,g=r.channels.length;u<g;u++){const v=r.channels[u],R=r.samplers[v.sampler],w=v.target,p=w.node,l=r.parameters!==void 0?r.parameters[R.input]:R.input,E=r.parameters!==void 0?r.parameters[R.output]:R.output;w.node!==void 0&&(o.push(this.getDependency("node",p)),s.push(this.getDependency("accessor",l)),c.push(this.getDependency("accessor",E)),d.push(R),h.push(w))}return Promise.all([Promise.all(o),Promise.all(s),Promise.all(c),Promise.all(d),Promise.all(h)]).then(function(u){const g=u[0],v=u[1],R=u[2],w=u[3],p=u[4],l=[];for(let M=0,S=g.length;M<S;M++){const T=g[M],A=v[M],I=R[M],z=w[M],_=p[M];if(T===void 0)continue;T.updateMatrix&&T.updateMatrix();const b=i._createAnimationTracks(T,A,I,z,_);if(b)for(let L=0;L<b.length;L++)l.push(b[L])}const E=new Ns(a,void 0,l);return Pt(E,r),E})}createNodeMesh(n){const t=this.json,i=this,r=t.nodes[n];return r.mesh===void 0?null:i.getDependency("mesh",r.mesh).then(function(a){const o=i._getNodeRef(i.meshCache,r.mesh,a);return r.weights!==void 0&&o.traverse(function(s){if(s.isMesh)for(let c=0,d=r.weights.length;c<d;c++)s.morphTargetInfluences[c]=r.weights[c]}),o})}loadNode(n){const t=this.json,i=this,r=t.nodes[n],a=i._loadNodeShallow(n),o=[],s=r.children||[];for(let d=0,h=s.length;d<h;d++)o.push(i.getDependency("node",s[d]));const c=r.skin===void 0?Promise.resolve(null):i.getDependency("skin",r.skin);return Promise.all([a,Promise.all(o),c]).then(function(d){const h=d[0],u=d[1],g=d[2];g!==null&&h.traverse(function(v){v.isSkinnedMesh&&v.bind(g,mp)});for(let v=0,R=u.length;v<R;v++)h.add(u[v]);return h})}_loadNodeShallow(n){const t=this.json,i=this.extensions,r=this;if(this.nodeCache[n]!==void 0)return this.nodeCache[n];const a=t.nodes[n],o=a.name?r.createUniqueName(a.name):"",s=[],c=r._invokeOne(function(d){return d.createNodeMesh&&d.createNodeMesh(n)});return c&&s.push(c),a.camera!==void 0&&s.push(r.getDependency("camera",a.camera).then(function(d){return r._getNodeRef(r.cameraCache,a.camera,d)})),r._invokeAll(function(d){return d.createNodeAttachment&&d.createNodeAttachment(n)}).forEach(function(d){s.push(d)}),this.nodeCache[n]=Promise.all(s).then(function(d){let h;if(a.isBone===!0?h=new Fs:d.length>1?h=new dt:d.length===1?h=d[0]:h=new Wr,h!==d[0])for(let u=0,g=d.length;u<g;u++)h.add(d[u]);if(a.name&&(h.userData.name=a.name,h.name=o),Pt(h,a),a.extensions&&Zt(i,h,a),a.matrix!==void 0){const u=new yt;u.fromArray(a.matrix),h.applyMatrix4(u)}else a.translation!==void 0&&h.position.fromArray(a.translation),a.rotation!==void 0&&h.quaternion.fromArray(a.rotation),a.scale!==void 0&&h.scale.fromArray(a.scale);if(!r.associations.has(h))r.associations.set(h,{});else if(a.mesh!==void 0&&r.meshCache.refs[a.mesh]>1){const u=r.associations.get(h);r.associations.set(h,{...u})}return r.associations.get(h).nodes=n,h}),this.nodeCache[n]}loadScene(n){const t=this.extensions,i=this.json.scenes[n],r=this,a=new dt;i.name&&(a.name=r.createUniqueName(i.name)),Pt(a,i),i.extensions&&Zt(t,a,i);const o=i.nodes||[],s=[];for(let c=0,d=o.length;c<d;c++)s.push(r.getDependency("node",o[c]));return Promise.all(s).then(function(c){for(let h=0,u=c.length;h<u;h++)a.add(c[h]);const d=h=>{const u=new Map;for(const[g,v]of r.associations)(g instanceof oi||g instanceof wi)&&u.set(g,v);return h.traverse(g=>{const v=r.associations.get(g);v!=null&&u.set(g,v)}),u};return r.associations=d(a),a})}_createAnimationTracks(n,t,i,r,a){const o=[],s=n.name?n.name:n.uuid,c=[];kt[a.path]===kt.weights?n.traverse(function(g){g.morphTargetInfluences&&c.push(g.name?g.name:g.uuid)}):c.push(s);let d;switch(kt[a.path]){case kt.weights:d=Fa;break;case kt.rotation:d=Oa;break;case kt.translation:case kt.scale:d=Na;break;default:switch(i.itemSize){case 1:d=Fa;break;case 2:case 3:default:d=Na;break}break}const h=r.interpolation!==void 0?lp[r.interpolation]:Xr,u=this._getArrayFromAccessor(i);for(let g=0,v=c.length;g<v;g++){const R=new d(c[g]+"."+kt[a.path],t.array,u,h);r.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(R),o.push(R)}return o}_getArrayFromAccessor(n){let t=n.array;if(n.normalized){const i=yi(t.constructor),r=new Float32Array(t.length);for(let a=0,o=t.length;a<o;a++)r[a]=t[a]*i;t=r}return t}_createCubicSplineTrackInterpolant(n){n.createInterpolant=function(i){const r=this instanceof Oa?cp:Zr;return new r(this.times,this.values,this.getValueSize()/3,i)},n.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function _p(e,n,t){const i=n.attributes,r=new Li;if(i.POSITION!==void 0){const s=t.json.accessors[i.POSITION],c=s.min,d=s.max;if(c!==void 0&&d!==void 0){if(r.set(new we(c[0],c[1],c[2]),new we(d[0],d[1],d[2])),s.normalized){const h=yi(ln[s.componentType]);r.min.multiplyScalar(h),r.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const a=n.targets;if(a!==void 0){const s=new we,c=new we;for(let d=0,h=a.length;d<h;d++){const u=a[d];if(u.POSITION!==void 0){const g=t.json.accessors[u.POSITION],v=g.min,R=g.max;if(v!==void 0&&R!==void 0){if(c.setX(Math.max(Math.abs(v[0]),Math.abs(R[0]))),c.setY(Math.max(Math.abs(v[1]),Math.abs(R[1]))),c.setZ(Math.max(Math.abs(v[2]),Math.abs(R[2]))),g.normalized){const w=yi(ln[g.componentType]);c.multiplyScalar(w)}s.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}r.expandByVector(s)}e.boundingBox=r;const o=new Bs;r.getCenter(o.center),o.radius=r.min.distanceTo(r.max)/2,e.boundingSphere=o}function pr(e,n,t){const i=n.attributes,r=[];function a(o,s){return t.getDependency("accessor",o).then(function(c){e.setAttribute(s,c)})}for(const o in i){const s=Ii[o]||o.toLowerCase();s in e.attributes||r.push(a(i[o],s))}if(n.indices!==void 0&&!e.index){const o=t.getDependency("accessor",n.indices).then(function(s){e.setIndex(s)});r.push(o)}return tt.workingColorSpace!==Et&&"COLOR_0"in i&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${tt.workingColorSpace}" not supported.`),Pt(e,n),_p(e,n,t),Promise.all(r).then(function(){return n.targets!==void 0?dp(e,n.targets,t):e})}var bp=function(){var e="b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb",n="b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),i=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var r=WebAssembly.validate(t)?s(n):s(e),a,o=WebAssembly.instantiate(r,{}).then(function(l){a=l.instance,a.exports.__wasm_call_ctors()});function s(l){for(var E=new Uint8Array(l.length),M=0;M<l.length;++M){var S=l.charCodeAt(M);E[M]=S>96?S-97:S>64?S-39:S+4}for(var T=0,M=0;M<l.length;++M)E[T++]=E[M]<60?i[E[M]]:(E[M]-60)*64+E[++M];return E.buffer.slice(0,T)}function c(l,E,M,S,T,A,I){var z=l.exports.sbrk,_=S+3&-4,b=z(_*T),L=z(A.length),H=new Uint8Array(l.exports.memory.buffer);H.set(A,L);var G=E(b,S,T,L,A.length);if(G==0&&I&&I(b,_,T),M.set(H.subarray(b,b+S*T)),z(b-z(0)),G!=0)throw new Error("Malformed buffer data: "+G)}var d={NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},h={ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"},u=[],g=0;function v(l){var E={object:new Worker(l),pending:0,requests:{}};return E.object.onmessage=function(M){var S=M.data;E.pending-=S.count,E.requests[S.id][S.action](S.value),delete E.requests[S.id]},E}function R(l){for(var E="self.ready = WebAssembly.instantiate(new Uint8Array(["+new Uint8Array(r)+"]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = "+p.name+";"+c.toString()+p.toString(),M=new Blob([E],{type:"text/javascript"}),S=URL.createObjectURL(M),T=u.length;T<l;++T)u[T]=v(S);for(var T=l;T<u.length;++T)u[T].object.postMessage({});u.length=l,URL.revokeObjectURL(S)}function w(l,E,M,S,T){for(var A=u[0],I=1;I<u.length;++I)u[I].pending<A.pending&&(A=u[I]);return new Promise(function(z,_){var b=new Uint8Array(M),L=++g;A.pending+=l,A.requests[L]={resolve:z,reject:_},A.object.postMessage({id:L,count:l,size:E,source:b,mode:S,filter:T},[b.buffer])})}function p(l){var E=l.data;if(!E.id)return self.close();self.ready.then(function(M){try{var S=new Uint8Array(E.count*E.size);c(M,M.exports[E.mode],S,E.count,E.size,E.source,M.exports[E.filter]),self.postMessage({id:E.id,count:E.count,action:"resolve",value:S},[S.buffer])}catch(T){self.postMessage({id:E.id,count:E.count,action:"reject",value:T})}})}return{ready:o,supported:!0,useWorkers:function(l){R(l)},decodeVertexBuffer:function(l,E,M,S,T){c(a,a.exports.meshopt_decodeVertexBuffer,l,E,M,S,a.exports[d[T]])},decodeIndexBuffer:function(l,E,M,S){c(a,a.exports.meshopt_decodeIndexBuffer,l,E,M,S)},decodeIndexSequence:function(l,E,M,S){c(a,a.exports.meshopt_decodeIndexSequence,l,E,M,S)},decodeGltfBuffer:function(l,E,M,S,T,A){c(a,a.exports[h[T]],l,E,M,S,a.exports[d[A]])},decodeGltfBufferAsync:function(l,E,M,S,T){return u.length>0?w(l,E,M,h[S],d[T]):o.then(function(){var A=new Uint8Array(l*E);return c(a,a.exports[h[S]],A,l,E,M,a.exports[d[T]]),A})}}}();const vp={hero:{primary:14173231,secondary:3830484,trim:13950436,accent:16763196,eye:6288127},river:{primary:3112912,secondary:10148078,trim:12174540,accent:8188872,eye:6615295},citadel:{primary:12072234,secondary:6113834,trim:14271098,accent:16758531,eye:16765286},ark:{primary:15134194,secondary:3123354,trim:11056317,accent:8188872,eye:10484991},fortress:{primary:5975438,secondary:1446688,trim:4011858,accent:12602367,eye:11824127}},jn=new Map;function Ot(e,n=.5,t=.18){const i=`${e}-${n}-${t}`,r=jn.get(i);if(r)return r;const a=new Yn({color:e,roughness:n,metalness:t,flatShading:!0});return jn.set(i,a),a}function $r(e,n=2.2){const t=`glow-${e}-${n}`,i=jn.get(t);if(i)return i;const r=new Yn({color:726040,emissive:e,emissiveIntensity:n,roughness:.3,metalness:.2});return jn.set(t,r),r}const xp=1.62,In=.98;function Ze(e,n,t,i,r=0,a=0,o=0){const s=new Mt(new Kn(e,n,t),i);return s.position.set(r,a,o),s.castShadow=!0,s.receiveShadow=!0,s}function Sp(e){const n=Ot(e.primary,.42,.2),t=Ot(e.secondary,.5,.16),i=Ot(e.trim,.34,.45),r=Ot(e.accent,.35,.4),a=$r(e.eye,2.6),o=new dt,s=new dt;o.add(s),s.add(Ze(.52,.2,.34,t,0,In+.04,0)),s.add(Ze(.34,.1,.3,i,0,In+.16,0));const c=new dt;c.position.y=In+.2,s.add(c),c.add(Ze(.44,.26,.3,t,0,.13,0)),c.add(Ze(.74,.34,.42,n,0,.38,0)),c.add(Ze(.58,.2,.06,i,0,.36,.22)),c.add(Ze(.22,.14,.03,r,0,.36,.255)),c.add(Ze(.5,.3,.14,t,0,.34,-.24)),c.add(Ze(.26,.12,.16,i,0,.56,-.2));const d=new dt;d.position.y=.62,c.add(d),d.add(Ze(.16,.1,.16,i,0,-.04,0)),d.add(Ze(.34,.26,.32,n,0,.13,0)),d.add(Ze(.3,.1,.04,t,0,.14,.17)),d.add(Ze(.09,.055,.03,a,-.08,.15,.19)),d.add(Ze(.09,.055,.03,a,.08,.15,.19)),d.add(Ze(.05,.16,.05,i,.17,.26,-.02)),d.add(Ze(.05,.16,.05,i,-.17,.26,-.02));const h=S=>{const T=new dt;T.position.set(S*.43,.46,0),c.add(T),T.add(Ze(.22,.18,.26,n,0,0,0)),T.add(Ze(.16,.26,.18,i,0,-.22,0));const A=Ze(.19,.3,.21,t,0,-.46,0);T.add(A);const I=new dt;return I.position.y=-.6,T.add(I),I.add(Ze(.17,.28,.19,n,0,-.14,0)),I.add(Ze(.2,.16,.22,i,0,-.32,.01)),{shoulder:T,elbow:I}},u=h(-1),g=h(1),v=S=>{const T=new dt;T.position.set(S*.15,In,0),s.add(T),T.add(Ze(.2,.16,.22,i,0,.02,0)),T.add(Ze(.24,.36,.26,n,0,-.24,0)),T.add(Ze(.12,.22,.24,r,S*.12,-.24,0));const A=new dt;return A.position.y=-.44,T.add(A),A.add(Ze(.22,.12,.24,i,0,0,0)),A.add(Ze(.2,.34,.22,t,0,-.24,0)),A.add(Ze(.28,.13,.4,n,0,-.5+.07,.05)),{hip:T,knee:A}},R=v(-1),w=v(1);let p=0,l=0;const E=Math.random()*Math.PI*2,M=(S,T)=>{let A=!1;const I=nn.clamp(T.speed01,0,1);if(T.airborne){const L=Math.min(1,S*12);return R.hip.rotation.x+=(-.62-R.hip.rotation.x)*L,w.hip.rotation.x+=(.34-w.hip.rotation.x)*L,R.knee.rotation.x+=(-1.1-R.knee.rotation.x)*L,w.knee.rotation.x+=(-.45-w.knee.rotation.x)*L,u.shoulder.rotation.x+=(-1.9-u.shoulder.rotation.x)*L,g.shoulder.rotation.x+=(-2.1-g.shoulder.rotation.x)*L,s.position.y+=(0-s.position.y)*L,!1}if(Math.abs(T.speed)<.12){const L=Math.min(1,S*8);for(const G of[R.hip,w.hip,R.knee,w.knee])G.rotation.x+=(0-G.rotation.x)*L;u.shoulder.rotation.x+=(.05-u.shoulder.rotation.x)*L,g.shoulder.rotation.x+=(.05-g.shoulder.rotation.x)*L,u.elbow.rotation.x+=(-.18-u.elbow.rotation.x)*L,g.elbow.rotation.x+=(-.18-g.elbow.rotation.x)*L;const H=Math.sin(T.time*.5+E);return c.rotation.x=0,c.rotation.z=0,c.rotation.y=H*.18,d.rotation.y=H*.4,s.position.y=Math.sin(T.time*1.8)*.014,p=0,l=0,!1}const z=Math.sign(T.speed);p=(p+Math.abs(T.speed)*S/xp)%1;const _=p<.5?0:1;_!==l&&(A=!0),l=_;const b=Math.sin(p*Math.PI*2)*(.42+.34*I)*z;return R.hip.rotation.x=b,w.hip.rotation.x=-b,R.knee.rotation.x=-Math.max(0,-b)*1.5-.06,w.knee.rotation.x=-Math.max(0,b)*1.5-.06,u.shoulder.rotation.x=-b*(.8+.5*I)+.06,g.shoulder.rotation.x=b*(.8+.5*I)+.06,u.elbow.rotation.x=-.35-.5*I,g.elbow.rotation.x=-.35-.5*I,c.rotation.x=.04+.16*I,c.rotation.y=-b*.1,d.rotation.y+=(0-d.rotation.y)*Math.min(1,S*6),s.position.y=Math.abs(Math.cos(p*Math.PI*2))*.05*I,A};return o.userData.anim=M,{root:o,anim:M}}const yn=.3,hr=.22,Nn=.86,Fn=.6;function ht(e,n,t,i,r=0,a=0,o=0){const s=new Mt(new Kn(e,n,t),i);return s.position.set(r,a,o),s.castShadow=!0,s.receiveShadow=!0,s}function Ep(e){const n=Ot(e.primary,.38,.22),t=Ot(e.secondary,.5,.16),i=Ot(e.trim,.32,.5),r=Ot(e.accent,.35,.4),a=$r(e.eye,2.6),o=Ot(1316378,.95,.05),s=new dt,c=new dt;s.add(c),c.add(ht(1.14,.3,2.1,n,0,.46,0)),c.add(ht(1,.22,2.5,t,0,.32,0)),c.add(ht(1.16,.1,2,i,0,.6,-.05));const d=ht(.96,.22,.6,n,0,.5,1);d.rotation.x=-.22,c.add(d),c.add(ht(1.08,.2,.16,i,0,.34,1.28)),c.add(ht(1.06,.3,.14,t,0,.34,-1.26)),c.add(ht(.92,.34,.94,n,0,.78,-.12)),c.add(ht(.78,.22,.04,t,0,.8,.36)),c.add(ht(.8,.06,.5,i,0,.95,-.16)),c.add(ht(.24,.07,.04,a,-.3,.48,1.28)),c.add(ht(.24,.07,.04,a,.3,.48,1.28)),c.add(ht(.16,.05,.04,r,0,.62,1.15)),c.add(ht(.96,.06,.26,i,0,1,-.98)),c.add(ht(.06,.22,.22,t,-.44,.9,-.98)),c.add(ht(.06,.22,.22,t,.44,.9,-.98));const h=new Ga(yn,yn,hr,14),u=new Ga(.13,.13,hr+.02,8),g=[],v=[];for(const[p,l]of[[-Fn,Nn],[Fn,Nn],[-Fn,-Nn],[Fn,-Nn]]){const E=new dt;E.rotation.order="YXZ",E.position.set(p,yn,l),s.add(E);const M=new Mt(h,o);M.rotation.z=Math.PI/2,M.castShadow=!0;const S=new Mt(u,i);S.rotation.z=Math.PI/2,S.position.x=p<0?-.02:.02,E.add(M,S),g.push(E),l>0&&v.push(E)}let R=0;const w=(p,l)=>{R=(R+l.speed*p/yn)%(Math.PI*2);for(const S of g)S.rotation.x=R;const E=nn.clamp(l.steer,-1,1)*.28;for(const S of v)S.rotation.y=E;const M=-E*.16*Math.min(1,Math.abs(l.speed)/6);return c.rotation.z+=(M-c.rotation.z)*Math.min(1,p*6),c.rotation.x+=(Math.min(.06,Math.abs(l.speed)*.004)-c.rotation.x)*Math.min(1,p*4),c.position.y=Math.sin(l.time*9)*.006*Math.min(1,Math.abs(l.speed)/6),!1};return s.userData.anim=w,{root:s,anim:w}}const Mp={hero:{robot:{file:"hero-robot.glb",yaw:0,bob:.055,sway:.045,roll:.17},vehicle:{file:"hero-vehicle.glb",yaw:0,bob:.055,sway:.045,roll:.17}},river:{robot:{file:"river-robot.glb",yaw:0,bob:.055,sway:.045,roll:.17},vehicle:{file:"river-vehicle.glb",yaw:0,bob:.055,sway:.045,roll:.17}},citadel:{robot:{file:"citadel-robot.glb",yaw:0,bob:.055,sway:.045,roll:.17},vehicle:{file:"citadel-vehicle.glb",yaw:0,bob:.055,sway:.045,roll:.17}},ark:{robot:{file:"ark-robot.glb",yaw:0,bob:.055,sway:.045,roll:.17},vehicle:{file:"ark-vehicle.glb",yaw:0,bob:.055,sway:.045,roll:.17}},fortress:{robot:{file:"fortress-robot.glb",yaw:0,bob:.055,sway:.045,roll:.17},vehicle:{file:"fortress-vehicle.glb",yaw:0,bob:.055,sway:.045,roll:.17}}},Tp=2,Ap=2.4,Ni={bob:.055,sway:.045,roll:.17};let gi=null;function Rp(){if(gi)return gi;const e=new Ou;return e.setMeshoptDecoder(bp),gi=e,e}const _i=new Map;function mr(e,n){const t=Mp[e]?.[n];if(!t)return Promise.resolve(null);const i=`${e}-${n}`;let r=_i.get(i);return r||(r=wp(t,n).then(a=>(a||_i.delete(i),a)),_i.set(i,r)),r}async function Cp(e){const[n,t]=await Promise.all([mr(e,"robot"),mr(e,"vehicle")]);return{robot:n,vehicle:t}}async function Bp(e,n){const{robot:t,vehicle:i}=await Cp(n),r=vp[n],a=Sp(r),o=Ep(r),s=t??a.root,c=i??o.root;return t||(s.userData.anim=a.anim),i||(c.userData.anim=o.anim),e.setForms(s,c),{robot:!!t,vehicle:!!i}}async function wp(e,n){try{const t=await Rp().loadAsync(`${ks}/models/${e.file}`);return Pp(t.scene,e,n)}catch(t){return console.warn(`[models] could not load ${e.file}, keeping the built-in form`,t),null}}function Pp(e,n,t){const i=new dt;i.add(e),i.rotation.y=nn.degToRad(n.yaw),i.updateMatrixWorld(!0);const a=new Li().setFromObject(i).getSize(new we);let o;if(t==="robot")o=a.y>1e-4?Tp/a.y:1;else{const h=Math.max(a.x,a.z,1e-4);o=Ap/h}i.scale.setScalar(o),i.updateMatrixWorld(!0);const s=new Li().setFromObject(i),c=s.getCenter(new we);i.position.set(-c.x,-s.min.y,-c.z);const d=new dt;return d.add(i),d.userData.anim=t==="robot"?Lp(i,n):Dp(i,n),d.traverse(h=>{const u=h;if(!u.isMesh)return;u.castShadow=!0,u.receiveShadow=!0;const g=Array.isArray(u.material)?u.material:[u.material];for(const v of g){const R=v;R.metalness=.06,R.roughness=.7,R.map&&(R.map.anisotropy=4,R.emissiveMap=R.map,R.emissive=new He(16777215),R.emissiveIntensity=.3),R.needsUpdate=!0}}),d}function Lp(e,n){const t=n.bob||Ni.bob,i=n.sway||Ni.sway;let r=0,a=0,o=!1;return(s,c)=>{const d=nn.clamp(c.speed01,0,1),h=d>.04&&Math.abs(c.speed)>.15&&!c.airborne;if(o=!1,h){r+=s*(5.4+d*5.6);const v=Math.floor(r/Math.PI);v!==a&&(a=v,o=!0)}else a=Math.floor(r/Math.PI);if(c.airborne)return e.position.y=t*.55,e.rotation.z=0,e.rotation.x=-.08,!1;const u=h?.45+d*.55:0,g=Math.sin(c.time*1.5)*t*.16;return e.position.y=Math.abs(Math.sin(r))*t*u+g,e.rotation.z=h?Math.sin(r)*i*u:Math.sin(c.time*1.1)*i*.18,e.rotation.x=-.05*d,o}}function Dp(e,n){const t=n.roll||Ni.roll;let i=0;return(r,a)=>{const s=-nn.clamp(a.steer,-1,1)*t*Math.min(1,Math.abs(a.speed)/6);return i+=(s-i)*Math.min(1,r*9),e.rotation.z=i,e.rotation.x=-.02*nn.clamp(a.speed01,0,1),e.position.y=Math.sin(a.time*1.3)*.012,!1}}const Up=25,Ip=180,gr=new we,yp=new we;let _r=-1/0;function Np(e,n){e.traverse(t=>{const i=t;if(!i.isMesh)return;if((Array.isArray(i.material)?i.material:[i.material]).every(a=>a.transparent&&a.opacity===0)){i.castShadow&&(i.castShadow=!1);return}i.castShadow!==n&&(i.castShadow=n)})}function kp(e,n){const t=performance.now();if(!(t-_r<Ip)){_r=t,n.root.getWorldPosition(gr);for(const i of e){const r=i===n||i.root.getWorldPosition(yp).distanceTo(gr)<=Up;Np(i.root,r)}}}export{Mp as M,ka as P,Tp as R,vp as S,Ap as V,Gp as W,Ep as a,Sp as b,Bp as e,mr as l,Hp as m,kp as u};

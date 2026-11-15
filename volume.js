(()=>{var kh=0,ic=1,Hh=2;var Fr=1,ta=2,Dn=3,Zt=0,Tt=1,Ft=2,Xn=0,Pi=1,sc=2,rc=3,oc=4,Vh=5,ci=100,Gh=101,Wh=102,Xh=103,qh=104,Yh=200,Zh=201,Jh=202,$h=203,Eo=204,wo=205,Kh=206,jh=207,Qh=208,eu=209,tu=210,nu=211,iu=212,su=213,ru=214,na=0,ia=1,sa=2,Di=3,ra=4,oa=5,aa=6,la=7,ca=0,ou=1,au=2,qn=0,lu=1,cu=2,hu=3,uu=4,fu=5,du=6,ha=7;var ac=300,zi=301,ki=302,ua=303,fa=304,Or=306,To=1e3,li=1001,Ao=1002,zt=1003,pu=1004;var Br=1005;var Jt=1006,da=1007;var gi=1008;var Rn=1009,lc=1010,cc=1011,Ss=1012,pa=1013,_i=1014,cn=1015,bs=1016,ma=1017,ga=1018,Es=1020,hc=35902,uc=35899,fc=1021,dc=1022,$t=1023,ds=1026,ws=1027,_a=1028,xa=1029,pc=1030,ya=1031;var va=1033,zr=33776,kr=33777,Hr=33778,Vr=33779,Ma=35840,Sa=35841,ba=35842,Ea=35843,wa=36196,Ta=37492,Aa=37496,Ra=37808,Ca=37809,Ia=37810,Pa=37811,Da=37812,La=37813,Ua=37814,Na=37815,Fa=37816,Oa=37817,Ba=37818,za=37819,ka=37820,Ha=37821,Va=36492,Ga=36494,Wa=36495,Xa=36283,qa=36284,Ya=36285,Za=36286;var rr=2300,Ro=2301,bo=2302,ql=2400,Yl=2401,Zl=2402;var mu=3200,Ts=3201;var Ja=0,gu=1,Yn="",At="srgb",Li="srgb-linear",or="linear",ft="srgb";var Ci=7680;var Jl=519,_u=512,xu=513,yu=514,mc=515,vu=516,Mu=517,Su=518,bu=519,$l=35044,As=35048;var gc="300 es",En=2e3,ar=2001;var Hn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let s=n[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},Ot=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var gl=Math.PI/180,Co=180/Math.PI;function Rs(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ot[i&255]+Ot[i>>8&255]+Ot[i>>16&255]+Ot[i>>24&255]+"-"+Ot[e&255]+Ot[e>>8&255]+"-"+Ot[e>>16&15|64]+Ot[e>>24&255]+"-"+Ot[t&63|128]+Ot[t>>8&255]+"-"+Ot[t>>16&255]+Ot[t>>24&255]+Ot[n&255]+Ot[n>>8&255]+Ot[n>>16&255]+Ot[n>>24&255]).toLowerCase()}function tt(i,e,t){return Math.max(e,Math.min(t,i))}function od(i,e){return(i%e+e)%e}function _l(i,e,t){return(1-t)*i+t*e}function Ys(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var ve=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ut=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],p=r[o+1],_=r[o+2],y=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=_,e[t+3]=y;return}if(u!==y||l!==d||c!==p||h!==_){let m=1-a,f=l*d+c*p+h*_+u*y,b=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){let R=Math.sqrt(x),T=Math.atan2(R,f*b);m=Math.sin(m*T)/R,a=Math.sin(a*T)/R}let g=a*b;if(l=l*m+d*g,c=c*m+p*g,h=h*m+_*g,u=u*m+y*g,m===1-a){let R=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=R,c*=R,h*=R,u*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],p=r[o+2],_=r[o+3];return e[t]=a*_+h*u+l*p-c*d,e[t+1]=l*_+h*d+c*u-a*p,e[t+2]=c*_+h*p+a*d-l*u,e[t+3]=h*_-a*u-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),p=l(s/2),_=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*p*_,this._y=c*p*u-d*h*_,this._z=c*h*_+d*p*u,this._w=c*h*u-d*p*_;break;case"YXZ":this._x=d*h*u+c*p*_,this._y=c*p*u-d*h*_,this._z=c*h*_-d*p*u,this._w=c*h*u+d*p*_;break;case"ZXY":this._x=d*h*u-c*p*_,this._y=c*p*u+d*h*_,this._z=c*h*_+d*p*u,this._w=c*h*u-d*p*_;break;case"ZYX":this._x=d*h*u-c*p*_,this._y=c*p*u+d*h*_,this._z=c*h*_-d*p*u,this._w=c*h*u+d*p*_;break;case"YZX":this._x=d*h*u+c*p*_,this._y=c*p*u+d*h*_,this._z=c*h*_-d*p*u,this._w=c*h*u-d*p*_;break;case"XZY":this._x=d*h*u-c*p*_,this._y=c*p*u-d*h*_,this._z=c*h*_+d*p*u,this._w=c*h*u+d*p*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>u){let p=2*Math.sqrt(1+n-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>u){let p=2*Math.sqrt(1+a-n-u);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+h)/p}else{let p=2*Math.sqrt(1+u-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(tt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ch.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ch.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return xl.copy(this).projectOnVector(e),this.sub(xl)}reflect(e){return this.sub(xl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(tt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},xl=new U,ch=new Ut,Ke=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],p=n[5],_=n[8],y=s[0],m=s[3],f=s[6],b=s[1],x=s[4],g=s[7],R=s[2],T=s[5],w=s[8];return r[0]=o*y+a*b+l*R,r[3]=o*m+a*x+l*T,r[6]=o*f+a*g+l*w,r[1]=c*y+h*b+u*R,r[4]=c*m+h*x+u*T,r[7]=c*f+h*g+u*w,r[2]=d*y+p*b+_*R,r[5]=d*m+p*x+_*T,r[8]=d*f+p*g+_*w,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,p=c*r-o*l,_=t*u+n*d+s*p;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let y=1/_;return e[0]=u*y,e[1]=(s*c-h*n)*y,e[2]=(a*n-s*o)*y,e[3]=d*y,e[4]=(h*t-s*l)*y,e[5]=(s*r-a*t)*y,e[6]=p*y,e[7]=(n*l-c*t)*y,e[8]=(o*t-n*r)*y,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(yl.makeScale(e,t)),this}rotate(e){return this.premultiply(yl.makeRotation(-e)),this}translate(e,t){return this.premultiply(yl.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},yl=new Ke;function _c(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function lr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Eu(){let i=lr("canvas");return i.style.display="block",i}var hh={};function ps(i){i in hh||(hh[i]=!0,console.warn(i))}function wu(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var uh=new Ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fh=new Ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ad(){let i={enabled:!0,workingColorSpace:Li,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ft&&(s.r=kn(s.r),s.g=kn(s.g),s.b=kn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ft&&(s.r=fs(s.r),s.g=fs(s.g),s.b=fs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Yn?or:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ps("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ps("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Li]:{primaries:e,whitePoint:n,transfer:or,toXYZ:uh,fromXYZ:fh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:At},outputColorSpaceConfig:{drawingBufferColorSpace:At}},[At]:{primaries:e,whitePoint:n,transfer:ft,toXYZ:uh,fromXYZ:fh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:At}}}),i}var rt=ad();function kn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function fs(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Qi,Io=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Qi===void 0&&(Qi=lr("canvas")),Qi.width=e.width,Qi.height=e.height;let s=Qi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Qi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=lr("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=kn(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(kn(t[n]/255)*255):t[n]=kn(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},ld=0,ms=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=Rs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(vl(s[o].image)):r.push(vl(s[o]))}else r=vl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function vl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Io.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var cd=0,Ml=new U,Wt=class i extends Hn{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=li,s=li,r=Jt,o=gi,a=$t,l=Rn,c=i.DEFAULT_ANISOTROPY,h=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:cd++}),this.uuid=Rs(),this.name="",this.source=new ms(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ve(0,0),this.repeat=new ve(1,1),this.center=new ve(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ml).x}get height(){return this.source.getSize(Ml).y}get depth(){return this.source.getSize(Ml).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ac)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case To:e.x=e.x-Math.floor(e.x);break;case li:e.x=e.x<0?0:1;break;case Ao:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case To:e.y=e.y-Math.floor(e.y);break;case li:e.y=e.y<0?0:1;break;case Ao:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=ac;Wt.DEFAULT_ANISOTROPY=1;var ct=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],p=l[5],_=l[9],y=l[2],m=l[6],f=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-y)<.01&&Math.abs(_-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+y)<.1&&Math.abs(_+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,g=(p+1)/2,R=(f+1)/2,T=(h+d)/4,w=(u+y)/4,C=(_+m)/4;return x>g&&x>R?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=T/n,r=w/n):g>R?g<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),n=T/s,r=C/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=w/r,s=C/r),this.set(n,s,r,t),this}let b=Math.sqrt((m-_)*(m-_)+(u-y)*(u-y)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-_)/b,this.y=(u-y)/b,this.z=(d-h)/b,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=tt(this.x,e.x,t.x),this.y=tt(this.y,e.y,t.y),this.z=tt(this.z,e.z,t.z),this.w=tt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=tt(this.x,e,t),this.y=tt(this.y,e,t),this.z=tt(this.z,e,t),this.w=tt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(tt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Po=class extends Hn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Jt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);let s={width:e,height:t,depth:n.depth},r=new Wt(s);this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Jt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new ms(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},_n=class extends Po{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},cr=class extends Wt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Do=class extends Wt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=zt,this.minFilter=zt,this.wrapR=li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var kt=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Mn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Mn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Mn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Mn):Mn.fromBufferAttribute(r,o),Mn.applyMatrix4(e.matrixWorld),this.expandByPoint(Mn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Kr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Kr.copy(n.boundingBox)),Kr.applyMatrix4(e.matrixWorld),this.union(Kr)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Mn),Mn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zs),jr.subVectors(this.max,Zs),es.subVectors(e.a,Zs),ts.subVectors(e.b,Zs),ns.subVectors(e.c,Zs),ti.subVectors(ts,es),ni.subVectors(ns,ts),wi.subVectors(es,ns);let t=[0,-ti.z,ti.y,0,-ni.z,ni.y,0,-wi.z,wi.y,ti.z,0,-ti.x,ni.z,0,-ni.x,wi.z,0,-wi.x,-ti.y,ti.x,0,-ni.y,ni.x,0,-wi.y,wi.x,0];return!Sl(t,es,ts,ns,jr)||(t=[1,0,0,0,1,0,0,0,1],!Sl(t,es,ts,ns,jr))?!1:(Qr.crossVectors(ti,ni),t=[Qr.x,Qr.y,Qr.z],Sl(t,es,ts,ns,jr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Mn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Mn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Nn=[new U,new U,new U,new U,new U,new U,new U,new U],Mn=new U,Kr=new kt,es=new U,ts=new U,ns=new U,ti=new U,ni=new U,wi=new U,Zs=new U,jr=new U,Qr=new U,Ti=new U;function Sl(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ti.fromArray(i,r);let a=s.x*Math.abs(Ti.x)+s.y*Math.abs(Ti.y)+s.z*Math.abs(Ti.z),l=e.dot(Ti),c=t.dot(Ti),h=n.dot(Ti);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var hd=new kt,Js=new U,bl=new U,wn=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):hd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Js.subVectors(e,this.center);let t=Js.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Js,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(bl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Js.copy(e.center).add(bl)),this.expandByPoint(Js.copy(e.center).sub(bl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Fn=new U,El=new U,eo=new U,ii=new U,wl=new U,to=new U,Tl=new U,Ui=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Fn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Fn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Fn.copy(this.origin).addScaledVector(this.direction,t),Fn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){El.copy(e).add(t).multiplyScalar(.5),eo.copy(t).sub(e).normalize(),ii.copy(this.origin).sub(El);let r=e.distanceTo(t)*.5,o=-this.direction.dot(eo),a=ii.dot(this.direction),l=-ii.dot(eo),c=ii.lengthSq(),h=Math.abs(1-o*o),u,d,p,_;if(h>0)if(u=o*l-a,d=o*a-l,_=r*h,u>=0)if(d>=-_)if(d<=_){let y=1/h;u*=y,d*=y,p=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;else d<=-_?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c):d<=_?(u=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),p=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(El).addScaledVector(eo,d),p}intersectSphere(e,t){Fn.subVectors(e.center,this.origin);let n=Fn.dot(this.direction),s=Fn.dot(Fn)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Fn)!==null}intersectTriangle(e,t,n,s,r){wl.subVectors(t,e),to.subVectors(n,e),Tl.crossVectors(wl,to);let o=this.direction.dot(Tl),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;ii.subVectors(this.origin,e);let l=a*this.direction.dot(to.crossVectors(ii,to));if(l<0)return null;let c=a*this.direction.dot(wl.cross(ii));if(c<0||l+c>o)return null;let h=-a*ii.dot(Tl);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},nt=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,d,p,_,y,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,p,_,y,m)}set(e,t,n,s,r,o,a,l,c,h,u,d,p,_,y,m){let f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=_,f[11]=y,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/is.setFromMatrixColumn(e,0).length(),r=1/is.setFromMatrixColumn(e,1).length(),o=1/is.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,p=o*u,_=a*h,y=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+_*c,t[5]=d-y*c,t[9]=-a*l,t[2]=y-d*c,t[6]=_+p*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,p=l*u,_=c*h,y=c*u;t[0]=d+y*a,t[4]=_*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-_,t[6]=y+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,p=l*u,_=c*h,y=c*u;t[0]=d-y*a,t[4]=-o*u,t[8]=_+p*a,t[1]=p+_*a,t[5]=o*h,t[9]=y-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,p=o*u,_=a*h,y=a*u;t[0]=l*h,t[4]=_*c-p,t[8]=d*c+y,t[1]=l*u,t[5]=y*c+d,t[9]=p*c-_,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,p=o*c,_=a*l,y=a*c;t[0]=l*h,t[4]=y-d*u,t[8]=_*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+_,t[10]=d-y*u}else if(e.order==="XZY"){let d=o*l,p=o*c,_=a*l,y=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+y,t[5]=o*h,t[9]=p*u-_,t[2]=_*u-p,t[6]=a*h,t[10]=y*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(ud,e,fd)}lookAt(e,t,n){let s=this.elements;return sn.subVectors(e,t),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),si.crossVectors(n,sn),si.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),si.crossVectors(n,sn)),si.normalize(),no.crossVectors(sn,si),s[0]=si.x,s[4]=no.x,s[8]=sn.x,s[1]=si.y,s[5]=no.y,s[9]=sn.y,s[2]=si.z,s[6]=no.z,s[10]=sn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],p=n[13],_=n[2],y=n[6],m=n[10],f=n[14],b=n[3],x=n[7],g=n[11],R=n[15],T=s[0],w=s[4],C=s[8],S=s[12],v=s[1],E=s[5],P=s[9],O=s[13],Y=s[2],z=s[6],H=s[10],Z=s[14],q=s[3],ge=s[7],me=s[11],Me=s[15];return r[0]=o*T+a*v+l*Y+c*q,r[4]=o*w+a*E+l*z+c*ge,r[8]=o*C+a*P+l*H+c*me,r[12]=o*S+a*O+l*Z+c*Me,r[1]=h*T+u*v+d*Y+p*q,r[5]=h*w+u*E+d*z+p*ge,r[9]=h*C+u*P+d*H+p*me,r[13]=h*S+u*O+d*Z+p*Me,r[2]=_*T+y*v+m*Y+f*q,r[6]=_*w+y*E+m*z+f*ge,r[10]=_*C+y*P+m*H+f*me,r[14]=_*S+y*O+m*Z+f*Me,r[3]=b*T+x*v+g*Y+R*q,r[7]=b*w+x*E+g*z+R*ge,r[11]=b*C+x*P+g*H+R*me,r[15]=b*S+x*O+g*Z+R*Me,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],p=e[14],_=e[3],y=e[7],m=e[11],f=e[15];return _*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*p-n*l*p)+y*(+t*l*p-t*c*d+r*o*d-s*o*p+s*c*h-r*l*h)+m*(+t*c*u-t*a*p-r*o*u+n*o*p+r*a*h-n*c*h)+f*(-s*a*h-t*l*u+t*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],p=e[11],_=e[12],y=e[13],m=e[14],f=e[15],b=u*m*c-y*d*c+y*l*p-a*m*p-u*l*f+a*d*f,x=_*d*c-h*m*c-_*l*p+o*m*p+h*l*f-o*d*f,g=h*y*c-_*u*c+_*a*p-o*y*p-h*a*f+o*u*f,R=_*u*l-h*y*l-_*a*d+o*y*d+h*a*m-o*u*m,T=t*b+n*x+s*g+r*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let w=1/T;return e[0]=b*w,e[1]=(y*d*r-u*m*r-y*s*p+n*m*p+u*s*f-n*d*f)*w,e[2]=(a*m*r-y*l*r+y*s*c-n*m*c-a*s*f+n*l*f)*w,e[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*p-n*l*p)*w,e[4]=x*w,e[5]=(h*m*r-_*d*r+_*s*p-t*m*p-h*s*f+t*d*f)*w,e[6]=(_*l*r-o*m*r-_*s*c+t*m*c+o*s*f-t*l*f)*w,e[7]=(o*d*r-h*l*r+h*s*c-t*d*c-o*s*p+t*l*p)*w,e[8]=g*w,e[9]=(_*u*r-h*y*r-_*n*p+t*y*p+h*n*f-t*u*f)*w,e[10]=(o*y*r-_*a*r+_*n*c-t*y*c-o*n*f+t*a*f)*w,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*p-t*a*p)*w,e[12]=R*w,e[13]=(h*y*s-_*u*s+_*n*d-t*y*d-h*n*m+t*u*m)*w,e[14]=(_*a*s-o*y*s-_*n*l+t*y*l+o*n*m-t*a*m)*w,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*d+t*a*d)*w,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,p=r*h,_=r*u,y=o*h,m=o*u,f=a*u,b=l*c,x=l*h,g=l*u,R=n.x,T=n.y,w=n.z;return s[0]=(1-(y+f))*R,s[1]=(p+g)*R,s[2]=(_-x)*R,s[3]=0,s[4]=(p-g)*T,s[5]=(1-(d+f))*T,s[6]=(m+b)*T,s[7]=0,s[8]=(_+x)*w,s[9]=(m-b)*w,s[10]=(1-(d+y))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=is.set(s[0],s[1],s[2]).length(),o=is.set(s[4],s[5],s[6]).length(),a=is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Sn.copy(this);let c=1/r,h=1/o,u=1/a;return Sn.elements[0]*=c,Sn.elements[1]*=c,Sn.elements[2]*=c,Sn.elements[4]*=h,Sn.elements[5]*=h,Sn.elements[6]*=h,Sn.elements[8]*=u,Sn.elements[9]*=u,Sn.elements[10]*=u,t.setFromRotationMatrix(Sn),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=En,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-s),d=(t+e)/(t-e),p=(n+s)/(n-s),_,y;if(l)_=r/(o-r),y=o*r/(o-r);else if(a===En)_=-(o+r)/(o-r),y=-2*o*r/(o-r);else if(a===ar)_=-o/(o-r),y=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=En,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-s),d=-(t+e)/(t-e),p=-(n+s)/(n-s),_,y;if(l)_=1/(o-r),y=o/(o-r);else if(a===En)_=-2/(o-r),y=-(o+r)/(o-r);else if(a===ar)_=-1/(o-r),y=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=_,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},is=new U,Sn=new nt,ud=new U(0,0,0),fd=new U(1,1,1),si=new U,no=new U,sn=new U,dh=new nt,ph=new Ut,xn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(tt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-tt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(tt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-tt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(tt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-tt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return dh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ph.setFromEuler(this),this.setFromQuaternion(ph,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};xn.DEFAULT_ORDER="XYZ";var hr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},dd=0,mh=new U,ss=new Ut,On=new nt,io=new U,$s=new U,pd=new U,md=new Ut,gh=new U(1,0,0),_h=new U(0,1,0),xh=new U(0,0,1),yh={type:"added"},gd={type:"removed"},rs={type:"childadded",child:null},Al={type:"childremoved",child:null},wt=class i extends Hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=Rs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new U,t=new xn,n=new Ut,s=new U(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new nt},normalMatrix:{value:new Ke}}),this.matrix=new nt,this.matrixWorld=new nt,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.multiply(ss),this}rotateOnWorldAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.premultiply(ss),this}rotateX(e){return this.rotateOnAxis(gh,e)}rotateY(e){return this.rotateOnAxis(_h,e)}rotateZ(e){return this.rotateOnAxis(xh,e)}translateOnAxis(e,t){return mh.copy(e).applyQuaternion(this.quaternion),this.position.add(mh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gh,e)}translateY(e){return this.translateOnAxis(_h,e)}translateZ(e){return this.translateOnAxis(xh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?io.copy(e):io.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),$s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?On.lookAt($s,io,this.up):On.lookAt(io,$s,this.up),this.quaternion.setFromRotationMatrix(On),s&&(On.extractRotation(s.matrixWorld),ss.setFromRotationMatrix(On),this.quaternion.premultiply(ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(yh),rs.child=e,this.dispatchEvent(rs),rs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(gd),Al.child=e,this.dispatchEvent(Al),Al.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),On.multiply(e.parent.matrixWorld)),e.applyMatrix4(On),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(yh),rs.child=e,this.dispatchEvent(rs),rs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,e,pd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($s,md,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),p=o(e.animations),_=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),_.length>0&&(n.nodes=_)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};wt.DEFAULT_UP=new U(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var bn=new U,Bn=new U,Rl=new U,zn=new U,os=new U,as=new U,vh=new U,Cl=new U,Il=new U,Pl=new U,Dl=new ct,Ll=new ct,Ul=new ct,ai=class i{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),bn.subVectors(e,t),s.cross(bn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){bn.subVectors(s,t),Bn.subVectors(n,t),Rl.subVectors(e,t);let o=bn.dot(bn),a=bn.dot(Bn),l=bn.dot(Rl),c=Bn.dot(Bn),h=Bn.dot(Rl),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,p=(c*l-a*h)*d,_=(o*h-a*l)*d;return r.set(1-p-_,_,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,zn)===null?!1:zn.x>=0&&zn.y>=0&&zn.x+zn.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,zn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,zn.x),l.addScaledVector(o,zn.y),l.addScaledVector(a,zn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return Dl.setScalar(0),Ll.setScalar(0),Ul.setScalar(0),Dl.fromBufferAttribute(e,t),Ll.fromBufferAttribute(e,n),Ul.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Dl,r.x),o.addScaledVector(Ll,r.y),o.addScaledVector(Ul,r.z),o}static isFrontFacing(e,t,n,s){return bn.subVectors(n,t),Bn.subVectors(e,t),bn.cross(Bn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),bn.cross(Bn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;os.subVectors(s,n),as.subVectors(r,n),Cl.subVectors(e,n);let l=os.dot(Cl),c=as.dot(Cl);if(l<=0&&c<=0)return t.copy(n);Il.subVectors(e,s);let h=os.dot(Il),u=as.dot(Il);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(os,o);Pl.subVectors(e,r);let p=os.dot(Pl),_=as.dot(Pl);if(_>=0&&p<=_)return t.copy(r);let y=p*c-l*_;if(y<=0&&c>=0&&_<=0)return a=c/(c-_),t.copy(n).addScaledVector(as,a);let m=h*_-p*u;if(m<=0&&u-h>=0&&p-_>=0)return vh.subVectors(r,s),a=(u-h)/(u-h+(p-_)),t.copy(s).addScaledVector(vh,a);let f=1/(m+y+d);return o=y*f,a=d*f,t.copy(n).addScaledVector(os,o).addScaledVector(as,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Tu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ri={h:0,s:0,l:0},so={h:0,s:0,l:0};function Nl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Ge=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=At){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,rt.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=rt.workingColorSpace){return this.r=e,this.g=t,this.b=n,rt.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=rt.workingColorSpace){if(e=od(e,1),t=tt(t,0,1),n=tt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Nl(o,r,e+1/3),this.g=Nl(o,r,e),this.b=Nl(o,r,e-1/3)}return rt.colorSpaceToWorking(this,s),this}setStyle(e,t=At){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=At){let n=Tu[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=fs(e.r),this.g=fs(e.g),this.b=fs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=At){return rt.workingToColorSpace(Bt.copy(this),e),Math.round(tt(Bt.r*255,0,255))*65536+Math.round(tt(Bt.g*255,0,255))*256+Math.round(tt(Bt.b*255,0,255))}getHexString(e=At){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=rt.workingColorSpace){rt.workingToColorSpace(Bt.copy(this),t);let n=Bt.r,s=Bt.g,r=Bt.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=rt.workingColorSpace){return rt.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=At){rt.workingToColorSpace(Bt.copy(this),e);let t=Bt.r,n=Bt.g,s=Bt.b;return e!==At?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ri),this.setHSL(ri.h+e,ri.s+t,ri.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ri),e.getHSL(so);let n=_l(ri.h,so.h,t),s=_l(ri.s,so.s,t),r=_l(ri.l,so.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Bt=new Ge;Ge.NAMES=Tu;var _d=0,In=class extends Hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_d++}),this.uuid=Rs(),this.name="",this.type="Material",this.blending=Pi,this.side=Zt,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Eo,this.blendDst=wo,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=Di,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Pi&&(n.blending=this.blending),this.side!==Zt&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Eo&&(n.blendSrc=this.blendSrc),this.blendDst!==wo&&(n.blendDst=this.blendDst),this.blendEquation!==ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Di&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},on=class extends In{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=ca,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Et=new U,ro=new ve,xd=0,qe=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:xd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=$l,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ro.fromBufferAttribute(this,t),ro.applyMatrix3(e),this.setXY(t,ro.x,ro.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix3(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyMatrix4(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.applyNormalMatrix(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Et.fromBufferAttribute(this,t),Et.transformDirection(e),this.setXYZ(t,Et.x,Et.y,Et.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Ys(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ys(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ys(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ys(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ys(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array),s=Yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),n=Yt(n,this.array),s=Yt(s,this.array),r=Yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==$l&&(e.usage=this.usage),e}};var hi=class extends qe{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var ui=class extends qe{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var ut=class extends qe{constructor(e,t,n){super(new Float32Array(e),t,n)}},yd=0,gn=new nt,Fl=new wt,ls=new U,rn=new kt,Ks=new kt,Pt=new U,ot=class i extends Hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:yd++}),this.uuid=Rs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(_c(e)?ui:hi)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return gn.makeRotationFromQuaternion(e),this.applyMatrix4(gn),this}rotateX(e){return gn.makeRotationX(e),this.applyMatrix4(gn),this}rotateY(e){return gn.makeRotationY(e),this.applyMatrix4(gn),this}rotateZ(e){return gn.makeRotationZ(e),this.applyMatrix4(gn),this}translate(e,t,n){return gn.makeTranslation(e,t,n),this.applyMatrix4(gn),this}scale(e,t,n){return gn.makeScale(e,t,n),this.applyMatrix4(gn),this}lookAt(e){return Fl.lookAt(e),Fl.updateMatrix(),this.applyMatrix4(Fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ls).negate(),this.translate(ls.x,ls.y,ls.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ut(n,3))}else{let n=Math.min(e.length,t.count);for(let s=0;s<n;s++){let r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Pt.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Pt),Pt.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Pt)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new wn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){let n=this.boundingSphere.center;if(rn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Ks.setFromBufferAttribute(a),this.morphTargetsRelative?(Pt.addVectors(rn.min,Ks.min),rn.expandByPoint(Pt),Pt.addVectors(rn.max,Ks.max),rn.expandByPoint(Pt)):(rn.expandByPoint(Ks.min),rn.expandByPoint(Ks.max))}rn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Pt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Pt));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Pt.fromBufferAttribute(a,c),l&&(ls.fromBufferAttribute(e,c),Pt.add(ls)),s=Math.max(s,n.distanceToSquared(Pt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qe(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<n.count;C++)a[C]=new U,l[C]=new U;let c=new U,h=new U,u=new U,d=new ve,p=new ve,_=new ve,y=new U,m=new U;function f(C,S,v){c.fromBufferAttribute(n,C),h.fromBufferAttribute(n,S),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,C),p.fromBufferAttribute(r,S),_.fromBufferAttribute(r,v),h.sub(c),u.sub(c),p.sub(d),_.sub(d);let E=1/(p.x*_.y-_.x*p.y);isFinite(E)&&(y.copy(h).multiplyScalar(_.y).addScaledVector(u,-p.y).multiplyScalar(E),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-_.x).multiplyScalar(E),a[C].add(y),a[S].add(y),a[v].add(y),l[C].add(m),l[S].add(m),l[v].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let C=0,S=b.length;C<S;++C){let v=b[C],E=v.start,P=v.count;for(let O=E,Y=E+P;O<Y;O+=3)f(e.getX(O+0),e.getX(O+1),e.getX(O+2))}let x=new U,g=new U,R=new U,T=new U;function w(C){R.fromBufferAttribute(s,C),T.copy(R);let S=a[C];x.copy(S),x.sub(R.multiplyScalar(R.dot(S))).normalize(),g.crossVectors(T,S);let E=g.dot(l[C])<0?-1:1;o.setXYZW(C,x.x,x.y,x.z,E)}for(let C=0,S=b.length;C<S;++C){let v=b[C],E=v.start,P=v.count;for(let O=E,Y=E+P;O<Y;O+=3)w(e.getX(O+0)),w(e.getX(O+1)),w(e.getX(O+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new qe(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);let s=new U,r=new U,o=new U,a=new U,l=new U,c=new U,h=new U,u=new U;if(e)for(let d=0,p=e.count;d<p;d+=3){let _=e.getX(d+0),y=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,_),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(_,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Pt.fromBufferAttribute(e,t),Pt.normalize(),e.setXYZ(t,Pt.x,Pt.y,Pt.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),p=0,_=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?p=l[y]*a.data.stride+a.offset:p=l[y]*h;for(let f=0;f<h;f++)d[_++]=c[p++]}return new qe(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],p=e(d,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Mh=new nt,Ai=new Ui,oo=new wn,Sh=new U,ao=new U,lo=new U,co=new U,Ol=new U,ho=new U,bh=new U,uo=new U,et=class extends wt{constructor(e=new ot,t=new on){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ho.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Ol.fromBufferAttribute(u,e),o?ho.addScaledVector(Ol,h):ho.addScaledVector(Ol.sub(t),h))}t.add(ho)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oo.copy(n.boundingSphere),oo.applyMatrix4(r),Ai.copy(e.ray).recast(e.near),!(oo.containsPoint(Ai.origin)===!1&&(Ai.intersectSphere(oo,Sh)===null||Ai.origin.distanceToSquared(Sh)>(e.far-e.near)**2))&&(Mh.copy(r).invert(),Ai.copy(e.ray).applyMatrix4(Mh),!(n.boundingBox!==null&&Ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ai)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,y=d.length;_<y;_++){let m=d[_],f=o[m.materialIndex],b=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let g=b,R=x;g<R;g+=3){let T=a.getX(g),w=a.getX(g+1),C=a.getX(g+2);s=fo(this,f,e,n,c,h,u,T,w,C),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let m=_,f=y;m<f;m+=3){let b=a.getX(m),x=a.getX(m+1),g=a.getX(m+2);s=fo(this,o,e,n,c,h,u,b,x,g),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,y=d.length;_<y;_++){let m=d[_],f=o[m.materialIndex],b=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let g=b,R=x;g<R;g+=3){let T=g,w=g+1,C=g+2;s=fo(this,f,e,n,c,h,u,T,w,C),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{let _=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=_,f=y;m<f;m+=3){let b=m,x=m+1,g=m+2;s=fo(this,o,e,n,c,h,u,b,x,g),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function vd(i,e,t,n,s,r,o,a){let l;if(e.side===Tt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Zt,a),l===null)return null;uo.copy(a),uo.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(uo);return c<t.near||c>t.far?null:{distance:c,point:uo.clone(),object:i}}function fo(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,ao),i.getVertexPosition(l,lo),i.getVertexPosition(c,co);let h=vd(i,e,t,n,ao,lo,co,bh);if(h){let u=new U;ai.getBarycoord(bh,ao,lo,co,u),s&&(h.uv=ai.getInterpolatedAttribute(s,a,l,c,u,new ve)),r&&(h.uv1=ai.getInterpolatedAttribute(r,a,l,c,u,new ve)),o&&(h.normal=ai.getInterpolatedAttribute(o,a,l,c,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new U,materialIndex:0};ai.getNormal(ao,lo,co,d.normal),h.face=d,h.barycoord=u}return h}var yn=class i extends ot{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,p=0;_("z","y","x",-1,-1,n,t,e,o,r,0),_("z","y","x",1,-1,n,t,-e,o,r,1),_("x","z","y",1,1,e,n,t,s,o,2),_("x","z","y",1,-1,e,n,-t,s,o,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ut(c,3)),this.setAttribute("normal",new ut(h,3)),this.setAttribute("uv",new ut(u,2));function _(y,m,f,b,x,g,R,T,w,C,S){let v=g/w,E=R/C,P=g/2,O=R/2,Y=T/2,z=w+1,H=C+1,Z=0,q=0,ge=new U;for(let me=0;me<H;me++){let Me=me*E-O;for(let we=0;we<z;we++){let We=we*v-P;ge[y]=We*b,ge[m]=Me*x,ge[f]=Y,c.push(ge.x,ge.y,ge.z),ge[y]=0,ge[m]=0,ge[f]=T>0?1:-1,h.push(ge.x,ge.y,ge.z),u.push(we/w),u.push(1-me/C),Z+=1}}for(let me=0;me<C;me++)for(let Me=0;Me<w;Me++){let we=d+Me+z*me,We=d+Me+z*(me+1),je=d+(Me+1)+z*(me+1),Je=d+(Me+1)+z*me;l.push(we,We,Je),l.push(We,je,Je),q+=6}a.addGroup(p,q,S),p+=q,d+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Hi(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ht(i){let e={};for(let t=0;t<i.length;t++){let n=Hi(i[t]);for(let s in n)e[s]=n[s]}return e}function Md(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function xc(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:rt.workingColorSpace}var Au={clone:Hi,merge:Ht},Sd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Tn=class extends In{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sd,this.fragmentShader=bd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hi(e.uniforms),this.uniformsGroups=Md(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},ur=class extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new nt,this.projectionMatrix=new nt,this.projectionMatrixInverse=new nt,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},oi=new U,Eh=new ve,wh=new ve,Lt=class extends ur{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Co*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(gl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Co*2*Math.atan(Math.tan(gl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){oi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(oi.x,oi.y).multiplyScalar(-e/oi.z),oi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(oi.x,oi.y).multiplyScalar(-e/oi.z)}getViewSize(e,t){return this.getViewBounds(e,Eh,wh),t.subVectors(wh,Eh)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(gl*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},cs=-90,hs=1,Lo=class extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Lt(cs,hs,e,t);s.layers=this.layers,this.add(s);let r=new Lt(cs,hs,e,t);r.layers=this.layers,this.add(r);let o=new Lt(cs,hs,e,t);o.layers=this.layers,this.add(o);let a=new Lt(cs,hs,e,t);a.layers=this.layers,this.add(a);let l=new Lt(cs,hs,e,t);l.layers=this.layers,this.add(l);let c=new Lt(cs,hs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ar)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;let y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,p),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},fr=class extends Wt{constructor(e=[],t=zi,n,s,r,o,a,l,c,h){super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Uo=class extends _n{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new fr(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new yn(5,5,5),r=new Tn({name:"CubemapFromEquirect",uniforms:Hi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Tt,blending:Xn});r.uniforms.tEquirect.value=t;let o=new et(s,r),a=t.minFilter;return t.minFilter===gi&&(t.minFilter=Jt),new Lo(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},ht=class extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ed={type:"move"},gs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let y of e.hand.values()){let m=t.getJointPose(y,n),f=this._getHandJoint(c,y);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,_=.005;c.inputState.pinching&&d>p+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ed)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ht;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Vn=class extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new xn,this.environmentIntensity=1,this.environmentRotation=new xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var fi=class extends Wt{constructor(e=null,t=1,n=1,s,r,o,a,l,c=zt,h=zt,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var dr=class extends qe{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},us=new nt,Th=new nt,po=[],Ah=new kt,wd=new nt,js=new et,Qs=new wn,pr=class extends et{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new dr(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,wd)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new kt),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,us),Ah.copy(e.boundingBox).applyMatrix4(us),this.boundingBox.union(Ah)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new wn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,us),Qs.copy(e.boundingSphere).applyMatrix4(us),this.boundingSphere.union(Qs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(js.geometry=this.geometry,js.material=this.material,js.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qs.copy(this.boundingSphere),Qs.applyMatrix4(n),e.ray.intersectsSphere(Qs)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,us),Th.multiplyMatrices(n,us),js.matrixWorld=Th,js.raycast(e,po);for(let o=0,a=po.length;o<a;o++){let l=po[o];l.instanceId=r,l.object=this,t.push(l)}po.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new dr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new fi(new Float32Array(s*this.count),s,this.count,_a,cn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Bl=new U,Td=new U,Ad=new Ke,Cn=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Bl.subVectors(n,t).cross(Td.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Bl),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Ad.getNormalMatrix(e),s=this.coplanarPoint(Bl).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ri=new wn,Rd=new ve(.5,.5),mo=new U,_s=class{constructor(e=new Cn,t=new Cn,n=new Cn,s=new Cn,r=new Cn,o=new Cn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){let s=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],p=r[7],_=r[8],y=r[9],m=r[10],f=r[11],b=r[12],x=r[13],g=r[14],R=r[15];if(s[0].setComponents(c-o,p-h,f-_,R-b).normalize(),s[1].setComponents(c+o,p+h,f+_,R+b).normalize(),s[2].setComponents(c+a,p+u,f+y,R+x).normalize(),s[3].setComponents(c-a,p-u,f-y,R-x).normalize(),n)s[4].setComponents(l,d,m,g).normalize(),s[5].setComponents(c-l,p-d,f-m,R-g).normalize();else if(s[4].setComponents(c-l,p-d,f-m,R-g).normalize(),t===En)s[5].setComponents(c+l,p+d,f+m,R+g).normalize();else if(t===ar)s[5].setComponents(l,d,m,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ri)}intersectsSprite(e){Ri.center.set(0,0,0);let t=Rd.distanceTo(e.center);return Ri.radius=.7071067811865476+t,Ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ri)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(mo.x=s.normal.x>0?e.max.x:e.min.x,mo.y=s.normal.y>0?e.max.y:e.min.y,mo.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(mo)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Gn=class extends In{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ge(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},No=new U,Fo=new U,Rh=new nt,er=new Ui,go=new wn,zl=new U,Ch=new U,Ni=class extends wt{constructor(e=new ot,t=new Gn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)No.fromBufferAttribute(t,s-1),Fo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=No.distanceTo(Fo);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),go.copy(n.boundingSphere),go.applyMatrix4(s),go.radius+=r,e.ray.intersectsSphere(go)===!1)return;Rh.copy(s).invert(),er.copy(e.ray).applyMatrix4(Rh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let p=Math.max(0,o.start),_=Math.min(h.count,o.start+o.count);for(let y=p,m=_-1;y<m;y+=c){let f=h.getX(y),b=h.getX(y+1),x=_o(this,e,er,l,f,b,y);x&&t.push(x)}if(this.isLineLoop){let y=h.getX(_-1),m=h.getX(p),f=_o(this,e,er,l,y,m,_-1);f&&t.push(f)}}else{let p=Math.max(0,o.start),_=Math.min(d.count,o.start+o.count);for(let y=p,m=_-1;y<m;y+=c){let f=_o(this,e,er,l,y,y+1,y);f&&t.push(f)}if(this.isLineLoop){let y=_o(this,e,er,l,_-1,p,_-1);y&&t.push(y)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function _o(i,e,t,n,s,r,o){let a=i.geometry.attributes.position;if(No.fromBufferAttribute(a,s),Fo.fromBufferAttribute(a,r),t.distanceSqToSegment(No,Fo,zl,Ch)>n)return;zl.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(zl);if(!(c<e.near||c>e.far))return{distance:c,point:Ch.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}var Ih=new U,Ph=new U,mr=class extends Ni{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Ih.fromBufferAttribute(t,s),Ph.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ih.distanceTo(Ph);e.setAttribute("lineDistance",new ut(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var gr=class extends Wt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},_r=class extends Wt{constructor(e,t,n=_i,s,r,o,a=zt,l=zt,c,h=ds,u=1){if(h!==ds&&h!==ws)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ms(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},xr=class extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}};var bt=class i extends ot{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],p=[],_=0,y=[],m=n/2,f=0;b(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new ut(u,3)),this.setAttribute("normal",new ut(d,3)),this.setAttribute("uv",new ut(p,2));function b(){let g=new U,R=new U,T=0,w=(t-e)/n;for(let C=0;C<=r;C++){let S=[],v=C/r,E=v*(t-e)+e;for(let P=0;P<=s;P++){let O=P/s,Y=O*l+a,z=Math.sin(Y),H=Math.cos(Y);R.x=E*z,R.y=-v*n+m,R.z=E*H,u.push(R.x,R.y,R.z),g.set(z,w,H).normalize(),d.push(g.x,g.y,g.z),p.push(O,1-v),S.push(_++)}y.push(S)}for(let C=0;C<s;C++)for(let S=0;S<r;S++){let v=y[S][C],E=y[S+1][C],P=y[S+1][C+1],O=y[S][C+1];(e>0||S!==0)&&(h.push(v,E,O),T+=3),(t>0||S!==r-1)&&(h.push(E,P,O),T+=3)}c.addGroup(f,T,0),f+=T}function x(g){let R=_,T=new ve,w=new U,C=0,S=g===!0?e:t,v=g===!0?1:-1;for(let P=1;P<=s;P++)u.push(0,m*v,0),d.push(0,v,0),p.push(.5,.5),_++;let E=_;for(let P=0;P<=s;P++){let Y=P/s*l+a,z=Math.cos(Y),H=Math.sin(Y);w.x=S*H,w.y=m*v,w.z=S*z,u.push(w.x,w.y,w.z),d.push(0,v,0),T.x=z*.5+.5,T.y=H*.5*v+.5,p.push(T.x,T.y),_++}for(let P=0;P<s;P++){let O=R+P,Y=E+P;g===!0?h.push(Y,Y+1,O):h.push(Y+1,Y,O),C+=3}c.addGroup(f,C,g===!0?1:2),f+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Oo=class i extends bt{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var an=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,p=(o-h)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ve:new U);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new U,s=[],r=[],o=[],a=new U,l=new nt;for(let p=0;p<=e;p++){let _=p/e;s[p]=this.getTangentAt(_,new U)}r[0]=new U,o[0]=new U;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();let _=Math.acos(tt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,_))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(tt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(s[_],p*_)),o[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},xs=class extends an{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ve){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*h-p*u+this.aX,c=d*u+p*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Bo=class extends xs{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function yc(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,p*=h,s(o,a,d,p)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var xo=new U,kl=new yc,Hl=new yc,Vl=new yc,An=class extends an{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new U){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(xo.subVectors(s[0],s[1]).add(s[0]),c=xo);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(xo.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=xo),this.curveType==="centripetal"||this.curveType==="chordal"){let p=this.curveType==="chordal"?.5:.25,_=Math.pow(c.distanceToSquared(u),p),y=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);y<1e-4&&(y=1),_<1e-4&&(_=y),m<1e-4&&(m=y),kl.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,_,y,m),Hl.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,_,y,m),Vl.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,_,y,m)}else this.curveType==="catmullrom"&&(kl.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Hl.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Vl.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(kl.calc(l),Hl.calc(l),Vl.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new U().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Dh(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Cd(i,e){let t=1-i;return t*t*e}function Id(i,e){return 2*(1-i)*i*e}function Pd(i,e){return i*i*e}function ir(i,e,t,n){return Cd(i,e)+Id(i,t)+Pd(i,n)}function Dd(i,e){let t=1-i;return t*t*t*e}function Ld(i,e){let t=1-i;return 3*t*t*i*e}function Ud(i,e){return 3*(1-i)*i*i*e}function Nd(i,e){return i*i*i*e}function sr(i,e,t,n,s){return Dd(i,e)+Ld(i,t)+Ud(i,n)+Nd(i,s)}var yr=class extends an{constructor(e=new ve,t=new ve,n=new ve,s=new ve){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ve){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(sr(e,s.x,r.x,o.x,a.x),sr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},zo=class extends an{constructor(e=new U,t=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new U){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(sr(e,s.x,r.x,o.x,a.x),sr(e,s.y,r.y,o.y,a.y),sr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},vr=class extends an{constructor(e=new ve,t=new ve){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ve){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ve){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ko=class extends an{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Mr=class extends an{constructor(e=new ve,t=new ve,n=new ve){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ve){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ir(e,s.x,r.x,o.x),ir(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Sr=class extends an{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ir(e,s.x,r.x,o.x),ir(e,s.y,r.y,o.y),ir(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},br=class extends an{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ve){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(Dh(a,l.x,c.x,h.x,u.x),Dh(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ve().fromArray(s))}return this}},Ho=Object.freeze({__proto__:null,ArcCurve:Bo,CatmullRomCurve3:An,CubicBezierCurve:yr,CubicBezierCurve3:zo,EllipseCurve:xs,LineCurve:vr,LineCurve3:ko,QuadraticBezierCurve:Mr,QuadraticBezierCurve3:Sr,SplineCurve:br}),Vo=class extends an{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ho[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Ho[s.type]().fromJSON(s))}return this}},Er=class extends Vo{constructor(e){super(),this.type="Path",this.currentPoint=new ve,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new vr(this.currentPoint.clone(),new ve(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Mr(this.currentPoint.clone(),new ve(e,t),new ve(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new yr(this.currentPoint.clone(),new ve(e,t),new ve(n,s),new ve(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new br(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new xs(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},ys=class extends Er{constructor(e){super(e),this.uuid=Rs(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Er().fromJSON(s))}return this}};function Fd(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Ru(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c;if(n&&(r=Hd(i,e,r,t)),i.length>80*t){a=1/0,l=1/0;let h=-1/0,u=-1/0;for(let d=t;d<s;d+=t){let p=i[d],_=i[d+1];p<a&&(a=p),_<l&&(l=_),p>h&&(h=p),_>u&&(u=_)}c=Math.max(h-a,u-l),c=c!==0?32767/c:0}return wr(r,o,t,a,l,c,0),o}function Ru(i,e,t,n,s){let r;if(s===jd(i,e,t,n)>0)for(let o=e;o<t;o+=n)r=Lh(o/n|0,i[o],i[o+1],r);else for(let o=t-n;o>=e;o-=n)r=Lh(o/n|0,i[o],i[o+1],r);return r&&vs(r,r.next)&&(Ar(r),r=r.next),r}function Fi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(vs(t,t.next)||Mt(t.prev,t,t.next)===0)){if(Ar(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function wr(i,e,t,n,s,r,o){if(!i)return;!o&&r&&qd(i,n,s,r);let a=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(r?Bd(i,n,s,r):Od(i)){e.push(l.i,i.i,c.i),Ar(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=zd(Fi(i),e),wr(i,e,t,n,s,r,2)):o===2&&kd(i,e,t,n,s,r):wr(Fi(i),e,t,n,s,r,1);break}}}function Od(i){let e=i.prev,t=i,n=i.next;if(Mt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=Math.min(s,r,o),u=Math.min(a,l,c),d=Math.max(s,r,o),p=Math.max(a,l,c),_=n.next;for(;_!==e;){if(_.x>=h&&_.x<=d&&_.y>=u&&_.y<=p&&nr(s,a,r,l,o,c,_.x,_.y)&&Mt(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Bd(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Mt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,p=Math.min(a,l,c),_=Math.min(h,u,d),y=Math.max(a,l,c),m=Math.max(h,u,d),f=Kl(p,_,e,t,n),b=Kl(y,m,e,t,n),x=i.prevZ,g=i.nextZ;for(;x&&x.z>=f&&g&&g.z<=b;){if(x.x>=p&&x.x<=y&&x.y>=_&&x.y<=m&&x!==s&&x!==o&&nr(a,h,l,u,c,d,x.x,x.y)&&Mt(x.prev,x,x.next)>=0||(x=x.prevZ,g.x>=p&&g.x<=y&&g.y>=_&&g.y<=m&&g!==s&&g!==o&&nr(a,h,l,u,c,d,g.x,g.y)&&Mt(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;x&&x.z>=f;){if(x.x>=p&&x.x<=y&&x.y>=_&&x.y<=m&&x!==s&&x!==o&&nr(a,h,l,u,c,d,x.x,x.y)&&Mt(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;g&&g.z<=b;){if(g.x>=p&&g.x<=y&&g.y>=_&&g.y<=m&&g!==s&&g!==o&&nr(a,h,l,u,c,d,g.x,g.y)&&Mt(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function zd(i,e){let t=i;do{let n=t.prev,s=t.next.next;!vs(n,s)&&Iu(n,t,t.next,s)&&Tr(n,s)&&Tr(s,n)&&(e.push(n.i,t.i,s.i),Ar(t),Ar(t.next),t=i=s),t=t.next}while(t!==i);return Fi(t)}function kd(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Jd(o,a)){let l=Pu(o,a);o=Fi(o,o.next),l=Fi(l,l.next),wr(o,e,t,n,s,r,0),wr(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Hd(i,e,t,n){let s=[];for(let r=0,o=e.length;r<o;r++){let a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Ru(i,a,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Zd(c))}s.sort(Vd);for(let r=0;r<s.length;r++)t=Gd(s[r],t);return t}function Vd(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function Gd(i,e){let t=Wd(i,e);if(!t)return e;let n=Pu(t,i);return Fi(n,n.next),Fi(t,t.next)}function Wd(i,e){let t=e,n=i.x,s=i.y,r=-1/0,o;if(vs(i,t))return t;do{if(vs(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,o=t.x<t.next.x?t:t.next,u===n))return o}t=t.next}while(t!==e);if(!o)return null;let a=o,l=o.x,c=o.y,h=1/0;t=o;do{if(n>=t.x&&t.x>=l&&n!==t.x&&Cu(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){let u=Math.abs(s-t.y)/(n-t.x);Tr(t,i)&&(u<h||u===h&&(t.x>o.x||t.x===o.x&&Xd(o,t)))&&(o=t,h=u)}t=t.next}while(t!==a);return o}function Xd(i,e){return Mt(i.prev,i,e.prev)<0&&Mt(e.next,i,i.next)<0}function qd(i,e,t,n){let s=i;do s.z===0&&(s.z=Kl(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Yd(s)}function Yd(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let o=n,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,t*=2}while(e>1);return i}function Kl(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Zd(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Cu(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function nr(i,e,t,n,s,r,o,a){return!(i===o&&e===a)&&Cu(i,e,t,n,s,r,o,a)}function Jd(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!$d(i,e)&&(Tr(i,e)&&Tr(e,i)&&Kd(i,e)&&(Mt(i.prev,i,e.prev)||Mt(i,e.prev,e))||vs(i,e)&&Mt(i.prev,i,i.next)>0&&Mt(e.prev,e,e.next)>0)}function Mt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function vs(i,e){return i.x===e.x&&i.y===e.y}function Iu(i,e,t,n){let s=vo(Mt(i,e,t)),r=vo(Mt(i,e,n)),o=vo(Mt(t,n,i)),a=vo(Mt(t,n,e));return!!(s!==r&&o!==a||s===0&&yo(i,t,e)||r===0&&yo(i,n,e)||o===0&&yo(t,i,n)||a===0&&yo(t,e,n))}function yo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function vo(i){return i>0?1:i<0?-1:0}function $d(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Iu(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Tr(i,e){return Mt(i.prev,i,i.next)<0?Mt(i,e,i.next)>=0&&Mt(i,i.prev,e)>=0:Mt(i,e,i.prev)<0||Mt(i,i.next,e)<0}function Kd(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Pu(i,e){let t=jl(i.i,i.x,i.y),n=jl(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Lh(i,e,t,n){let s=jl(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ar(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function jl(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function jd(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var Ql=class{static triangulate(e,t,n=2){return Fd(e,t,n)}},Ii=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Uh(e),Nh(n,e);let o=e.length;t.forEach(Uh);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,Nh(n,t[l]);let a=Ql.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Uh(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Nh(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Rr=class i extends ot{constructor(e=new ys([new ve(.5,.5),new ve(-.5,.5),new ve(-.5,-.5),new ve(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new ut(s,3)),this.setAttribute("uv",new ut(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:p-.1,y=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3,f=t.extrudePath,b=t.UVGenerator!==void 0?t.UVGenerator:Qd,x,g=!1,R,T,w,C;f&&(x=f.getSpacedPoints(h),g=!0,d=!1,R=f.computeFrenetFrames(h,!1),T=new U,w=new U,C=new U),d||(m=0,p=0,_=0,y=0);let S=a.extractPoints(c),v=S.shape,E=S.holes;if(!Ii.isClockWise(v)){v=v.reverse();for(let se=0,re=E.length;se<re;se++){let oe=E[se];Ii.isClockWise(oe)&&(E[se]=oe.reverse())}}function O(se){let oe=10000000000000001e-36,ie=se[0];for(let ye=1;ye<=se.length;ye++){let ue=ye%se.length,be=se[ue],Be=be.x-ie.x,ke=be.y-ie.y,I=Be*Be+ke*ke,M=Math.max(Math.abs(be.x),Math.abs(be.y),Math.abs(ie.x),Math.abs(ie.y)),X=oe*M*M;if(I<=X){se.splice(ue,1),ye--;continue}ie=be}}O(v),E.forEach(O);let Y=E.length,z=v;for(let se=0;se<Y;se++){let re=E[se];v=v.concat(re)}function H(se,re,oe){return re||console.error("THREE.ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(re,oe)}let Z=v.length;function q(se,re,oe){let ie,ye,ue,be=se.x-re.x,Be=se.y-re.y,ke=oe.x-se.x,I=oe.y-se.y,M=be*be+Be*Be,X=be*I-Be*ke;if(Math.abs(X)>Number.EPSILON){let D=Math.sqrt(M),k=Math.sqrt(ke*ke+I*I),F=re.x-Be/D,Q=re.y+be/D,V=oe.x-I/k,ae=oe.y+ke/k,pe=((V-F)*I-(ae-Q)*ke)/(be*I-Be*ke);ie=F+be*pe-se.x,ye=Q+Be*pe-se.y;let ee=ie*ie+ye*ye;if(ee<=2)return new ve(ie,ye);ue=Math.sqrt(ee/2)}else{let D=!1;be>Number.EPSILON?ke>Number.EPSILON&&(D=!0):be<-Number.EPSILON?ke<-Number.EPSILON&&(D=!0):Math.sign(Be)===Math.sign(I)&&(D=!0),D?(ie=-Be,ye=be,ue=Math.sqrt(M)):(ie=be,ye=Be,ue=Math.sqrt(M/2))}return new ve(ie/ue,ye/ue)}let ge=[];for(let se=0,re=z.length,oe=re-1,ie=se+1;se<re;se++,oe++,ie++)oe===re&&(oe=0),ie===re&&(ie=0),ge[se]=q(z[se],z[oe],z[ie]);let me=[],Me,we=ge.concat();for(let se=0,re=Y;se<re;se++){let oe=E[se];Me=[];for(let ie=0,ye=oe.length,ue=ye-1,be=ie+1;ie<ye;ie++,ue++,be++)ue===ye&&(ue=0),be===ye&&(be=0),Me[ie]=q(oe[ie],oe[ue],oe[be]);me.push(Me),we=we.concat(Me)}let We;if(m===0)We=Ii.triangulateShape(z,E);else{let se=[],re=[];for(let oe=0;oe<m;oe++){let ie=oe/m,ye=p*Math.cos(ie*Math.PI/2),ue=_*Math.sin(ie*Math.PI/2)+y;for(let be=0,Be=z.length;be<Be;be++){let ke=H(z[be],ge[be],ue);Ue(ke.x,ke.y,-ye),ie===0&&se.push(ke)}for(let be=0,Be=Y;be<Be;be++){let ke=E[be];Me=me[be];let I=[];for(let M=0,X=ke.length;M<X;M++){let D=H(ke[M],Me[M],ue);Ue(D.x,D.y,-ye),ie===0&&I.push(D)}ie===0&&re.push(I)}}We=Ii.triangulateShape(se,re)}let je=We.length,Je=_+y;for(let se=0;se<Z;se++){let re=d?H(v[se],we[se],Je):v[se];g?(w.copy(R.normals[0]).multiplyScalar(re.x),T.copy(R.binormals[0]).multiplyScalar(re.y),C.copy(x[0]).add(w).add(T),Ue(C.x,C.y,C.z)):Ue(re.x,re.y,0)}for(let se=1;se<=h;se++)for(let re=0;re<Z;re++){let oe=d?H(v[re],we[re],Je):v[re];g?(w.copy(R.normals[se]).multiplyScalar(oe.x),T.copy(R.binormals[se]).multiplyScalar(oe.y),C.copy(x[se]).add(w).add(T),Ue(C.x,C.y,C.z)):Ue(oe.x,oe.y,u/h*se)}for(let se=m-1;se>=0;se--){let re=se/m,oe=p*Math.cos(re*Math.PI/2),ie=_*Math.sin(re*Math.PI/2)+y;for(let ye=0,ue=z.length;ye<ue;ye++){let be=H(z[ye],ge[ye],ie);Ue(be.x,be.y,u+oe)}for(let ye=0,ue=E.length;ye<ue;ye++){let be=E[ye];Me=me[ye];for(let Be=0,ke=be.length;Be<ke;Be++){let I=H(be[Be],Me[Be],ie);g?Ue(I.x,I.y+x[h-1].y,x[h-1].x+oe):Ue(I.x,I.y,u+oe)}}}te(),ne();function te(){let se=s.length/3;if(d){let re=0,oe=Z*re;for(let ie=0;ie<je;ie++){let ye=We[ie];Ae(ye[2]+oe,ye[1]+oe,ye[0]+oe)}re=h+m*2,oe=Z*re;for(let ie=0;ie<je;ie++){let ye=We[ie];Ae(ye[0]+oe,ye[1]+oe,ye[2]+oe)}}else{for(let re=0;re<je;re++){let oe=We[re];Ae(oe[2],oe[1],oe[0])}for(let re=0;re<je;re++){let oe=We[re];Ae(oe[0]+Z*h,oe[1]+Z*h,oe[2]+Z*h)}}n.addGroup(se,s.length/3-se,0)}function ne(){let se=s.length/3,re=0;Ie(z,re),re+=z.length;for(let oe=0,ie=E.length;oe<ie;oe++){let ye=E[oe];Ie(ye,re),re+=ye.length}n.addGroup(se,s.length/3-se,1)}function Ie(se,re){let oe=se.length;for(;--oe>=0;){let ie=oe,ye=oe-1;ye<0&&(ye=se.length-1);for(let ue=0,be=h+m*2;ue<be;ue++){let Be=Z*ue,ke=Z*(ue+1),I=re+ie+Be,M=re+ye+Be,X=re+ye+ke,D=re+ie+ke;$e(I,M,X,D)}}}function Ue(se,re,oe){l.push(se),l.push(re),l.push(oe)}function Ae(se,re,oe){st(se),st(re),st(oe);let ie=s.length/3,ye=b.generateTopUV(n,s,ie-3,ie-2,ie-1);N(ye[0]),N(ye[1]),N(ye[2])}function $e(se,re,oe,ie){st(se),st(re),st(ie),st(re),st(oe),st(ie);let ye=s.length/3,ue=b.generateSideWallUV(n,s,ye-6,ye-3,ye-2,ye-1);N(ue[0]),N(ue[1]),N(ue[3]),N(ue[1]),N(ue[2]),N(ue[3])}function st(se){s.push(l[se*3+0]),s.push(l[se*3+1]),s.push(l[se*3+2])}function N(se){r.push(se.x),r.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return ep(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Ho[s.type]().fromJSON(s)),new i(n,e.options)}},Qd={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ve(r,o),new ve(a,l),new ve(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],p=e[s*3+1],_=e[s*3+2],y=e[r*3],m=e[r*3+1],f=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ve(o,1-l),new ve(c,1-u),new ve(d,1-_),new ve(y,1-f)]:[new ve(a,1-l),new ve(h,1-u),new ve(p,1-_),new ve(m,1-f)]}};function ep(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Cr=class i extends ot{constructor(e=[new ve(0,-.5),new ve(.5,0),new ve(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=tt(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new U,d=new ve,p=new U,_=new U,y=new U,m=0,f=0;for(let b=0;b<=e.length-1;b++)switch(b){case 0:m=e[b+1].x-e[b].x,f=e[b+1].y-e[b].y,p.x=f*1,p.y=-m,p.z=f*0,y.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(y.x,y.y,y.z);break;default:m=e[b+1].x-e[b].x,f=e[b+1].y-e[b].y,p.x=f*1,p.y=-m,p.z=f*0,_.copy(p),p.x+=y.x,p.y+=y.y,p.z+=y.z,p.normalize(),l.push(p.x,p.y,p.z),y.copy(_)}for(let b=0;b<=t;b++){let x=n+b*h*s,g=Math.sin(x),R=Math.cos(x);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*g,u.y=e[T].y,u.z=e[T].x*R,o.push(u.x,u.y,u.z),d.x=b/t,d.y=T/(e.length-1),a.push(d.x,d.y);let w=l[3*T+0]*g,C=l[3*T+1],S=l[3*T+0]*R;c.push(w,C,S)}}for(let b=0;b<t;b++)for(let x=0;x<e.length-1;x++){let g=x+b*e.length,R=g,T=g+e.length,w=g+e.length+1,C=g+1;r.push(R,T,C),r.push(w,C,T)}this.setIndex(r),this.setAttribute("position",new ut(o,3)),this.setAttribute("uv",new ut(a,2)),this.setAttribute("normal",new ut(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}};var Oi=class i extends ot{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,p=[],_=[],y=[],m=[];for(let f=0;f<h;f++){let b=f*d-o;for(let x=0;x<c;x++){let g=x*u-r;_.push(g,-b,0),y.push(0,0,1),m.push(x/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<a;b++){let x=b+c*f,g=b+c*(f+1),R=b+1+c*(f+1),T=b+1+c*f;p.push(x,g,T),p.push(g,R,T)}this.setIndex(p),this.setAttribute("position",new ut(_,3)),this.setAttribute("normal",new ut(y,3)),this.setAttribute("uv",new ut(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}};var Nt=class i extends ot{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new U,d=new U,p=[],_=[],y=[],m=[];for(let f=0;f<=n;f++){let b=[],x=f/n,g=0;f===0&&o===0?g=.5/t:f===n&&l===Math.PI&&(g=-.5/t);for(let R=0;R<=t;R++){let T=R/t;u.x=-e*Math.cos(s+T*r)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(s+T*r)*Math.sin(o+x*a),_.push(u.x,u.y,u.z),d.copy(u).normalize(),y.push(d.x,d.y,d.z),m.push(T+g,1-x),b.push(c++)}h.push(b)}for(let f=0;f<n;f++)for(let b=0;b<t;b++){let x=h[f][b+1],g=h[f][b],R=h[f+1][b],T=h[f+1][b+1];(f!==0||o>0)&&p.push(x,g,T),(f!==n-1||l<Math.PI)&&p.push(g,R,T)}this.setIndex(p),this.setAttribute("position",new ut(_,3)),this.setAttribute("normal",new ut(y,3)),this.setAttribute("uv",new ut(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Pn=class i extends ot{constructor(e=new Sr(new U(-1,-1,0),new U(-1,1,0),new U(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};let o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new U,l=new U,c=new ve,h=new U,u=[],d=[],p=[],_=[];y(),this.setIndex(_),this.setAttribute("position",new ut(u,3)),this.setAttribute("normal",new ut(d,3)),this.setAttribute("uv",new ut(p,2));function y(){for(let x=0;x<t;x++)m(x);m(r===!1?t:0),b(),f()}function m(x){h=e.getPointAt(x/t,h);let g=o.normals[x],R=o.binormals[x];for(let T=0;T<=s;T++){let w=T/s*Math.PI*2,C=Math.sin(w),S=-Math.cos(w);l.x=S*g.x+C*R.x,l.y=S*g.y+C*R.y,l.z=S*g.z+C*R.z,l.normalize(),d.push(l.x,l.y,l.z),a.x=h.x+n*l.x,a.y=h.y+n*l.y,a.z=h.z+n*l.z,u.push(a.x,a.y,a.z)}}function f(){for(let x=1;x<=t;x++)for(let g=1;g<=s;g++){let R=(s+1)*(x-1)+(g-1),T=(s+1)*x+(g-1),w=(s+1)*x+g,C=(s+1)*(x-1)+g;_.push(R,T,C),_.push(T,w,C)}}function b(){for(let x=0;x<=t;x++)for(let g=0;g<=s;g++)c.x=x/t,c.y=g/s,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new i(new Ho[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}};var Xt=class extends In{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ja,this.normalScale=new ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};var Ir=class extends In{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ja,this.normalScale=new ve(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new xn,this.combine=ca,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},di=class extends In{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Go=class extends In{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Mo(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function tp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Bi=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Wo=class extends Bi{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ql,endingEnd:ql}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Yl:r=e,a=2*t-n;break;case Zl:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Yl:o=e,l=2*n-t;break;case Zl:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,p=this._weightNext,_=(n-t)/(s-t),y=_*_,m=y*_,f=-d*m+2*d*y-d*_,b=(1+d)*m+(-1.5-2*d)*y+(-.5+d)*_+1,x=(-1-p)*m+(1.5+p)*y+.5*_,g=p*m-p*y;for(let R=0;R!==a;++R)r[R]=f*o[h+R]+b*o[c+R]+x*o[l+R]+g*o[u+R];return r}},Xo=class extends Bi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},qo=class extends Bi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ln=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Mo(t,this.TimeBufferType),this.values=Mo(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Mo(e.times,Array),values:Mo(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new qo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Xo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Wo(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case rr:t=this.InterpolantFactoryMethodDiscrete;break;case Ro:t=this.InterpolantFactoryMethodLinear;break;case bo:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return rr;case this.InterpolantFactoryMethodLinear:return Ro;case this.InterpolantFactoryMethodSmooth:return bo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&tp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===bo,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,p=u+n;for(let _=0;_!==n;++_){let y=t[u+_];if(y!==t[d+_]||y!==t[p+_]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let p=0;p!==n;++p)t[d+p]=t[u+p]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ln.prototype.ValueTypeName="";ln.prototype.TimeBufferType=Float32Array;ln.prototype.ValueBufferType=Float32Array;ln.prototype.DefaultInterpolation=Ro;var pi=class extends ln{constructor(e,t,n){super(e,t,n)}};pi.prototype.ValueTypeName="bool";pi.prototype.ValueBufferType=Array;pi.prototype.DefaultInterpolation=rr;pi.prototype.InterpolantFactoryMethodLinear=void 0;pi.prototype.InterpolantFactoryMethodSmooth=void 0;var Yo=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}};Yo.prototype.ValueTypeName="color";var Zo=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}};Zo.prototype.ValueTypeName="number";var Jo=class extends Bi{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)Ut.slerpFlat(r,0,o,c-a,o,c,l);return r}},Pr=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Jo(this.times,this.values,this.getValueSize(),e)}};Pr.prototype.ValueTypeName="quaternion";Pr.prototype.InterpolantFactoryMethodSmooth=void 0;var mi=class extends ln{constructor(e,t,n){super(e,t,n)}};mi.prototype.ValueTypeName="string";mi.prototype.ValueBufferType=Array;mi.prototype.DefaultInterpolation=rr;mi.prototype.InterpolantFactoryMethodLinear=void 0;mi.prototype.InterpolantFactoryMethodSmooth=void 0;var $o=class extends ln{constructor(e,t,n,s){super(e,t,n,s)}};$o.prototype.ValueTypeName="vector";var Ko=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let p=c[u],_=c[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Du=new Ko,jo=class{constructor(e){this.manager=e!==void 0?e:Du,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};jo.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ms=class extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Dr=class extends Ms{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Gl=new nt,Fh=new U,Oh=new U,Qo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ve(512,512),this.mapType=Rn,this.map=null,this.mapPass=null,this.matrix=new nt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _s,this._frameExtents=new ve(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Fh.setFromMatrixPosition(e.matrixWorld),t.position.copy(Fh),Oh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Oh),t.updateMatrixWorld(),Gl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Gl,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Gl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var Bh=new nt,tr=new U,Wl=new U,ec=class extends Qo{constructor(){super(new Lt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ve(4,2),this._viewportCount=6,this._viewports=[new ct(2,1,1,1),new ct(0,1,1,1),new ct(3,1,1,1),new ct(1,1,1,1),new ct(3,0,1,1),new ct(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),tr.setFromMatrixPosition(e.matrixWorld),n.position.copy(tr),Wl.copy(n.position),Wl.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Wl),n.updateMatrixWorld(),s.makeTranslation(-tr.x,-tr.y,-tr.z),Bh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bh,n.coordinateSystem,n.reversedDepth)}},Lr=class extends Ms{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ec}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},Wn=class extends ur{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},tc=class extends Qo{constructor(){super(new Wn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ur=class extends Ms{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new tc}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var ea=class extends Lt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var vc="\\[\\]\\.:\\/",np=new RegExp("["+vc+"]","g"),Mc="[^"+vc+"]",ip="[^"+vc.replace("\\.","")+"]",sp=/((?:WC+[\/:])*)/.source.replace("WC",Mc),rp=/(WCOD+)?/.source.replace("WCOD",ip),op=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Mc),ap=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Mc),lp=new RegExp("^"+sp+rp+op+ap+"$"),cp=["material","materials","bones","map"],nc=class{constructor(e,t,n){let s=n||xt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},xt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(np,"")}static parseTrackName(e){let t=lp.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);cp.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};xt.Composite=nc;xt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};xt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};xt.prototype.GetterByBindingType=[xt.prototype._getValue_direct,xt.prototype._getValue_array,xt.prototype._getValue_arrayElement,xt.prototype._getValue_toArray];xt.prototype.SetterByBindingTypeAndVersioning=[[xt.prototype._setValue_direct,xt.prototype._setValue_direct_setNeedsUpdate,xt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_array,xt.prototype._setValue_array_setNeedsUpdate,xt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_arrayElement,xt.prototype._setValue_arrayElement_setNeedsUpdate,xt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[xt.prototype._setValue_fromArray,xt.prototype._setValue_fromArray_setNeedsUpdate,xt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Kx=new Float32Array(1);var zh=new U,So,Xl,Nr=class extends wt{constructor(e=new U(0,0,1),t=new U(0,0,0),n=1,s=16776960,r=n*.2,o=r*.2){super(),this.type="ArrowHelper",So===void 0&&(So=new ot,So.setAttribute("position",new ut([0,0,0,0,1,0],3)),Xl=new Oo(.5,1,5,1),Xl.translate(0,-.5,0)),this.position.copy(t),this.line=new Ni(So,new Gn({color:s,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new et(Xl,new on({color:s,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(n,r,o)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{zh.set(e.z,0,-e.x).normalize();let t=Math.acos(e.y);this.quaternion.setFromAxisAngle(zh,t)}}setLength(e,t=e*.2,n=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(n,t,n),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}};function Sc(i,e,t,n){let s=hp(n);switch(t){case fc:return i*e;case _a:return i*e/s.components*s.byteLength;case xa:return i*e/s.components*s.byteLength;case pc:return i*e*2/s.components*s.byteLength;case ya:return i*e*2/s.components*s.byteLength;case dc:return i*e*3/s.components*s.byteLength;case $t:return i*e*4/s.components*s.byteLength;case va:return i*e*4/s.components*s.byteLength;case zr:case kr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Hr:case Vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Sa:case Ea:return Math.max(i,16)*Math.max(e,8)/4;case Ma:case ba:return Math.max(i,8)*Math.max(e,8)/2;case wa:case Ta:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Aa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ca:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ia:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Pa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Da:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case La:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ua:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Na:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Fa:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Oa:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ba:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case za:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ka:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ha:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Va:case Ga:case Wa:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Xa:case qa:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ya:case Za:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function hp(i){switch(i){case Rn:case lc:return{byteLength:1,components:1};case Ss:case cc:case bs:return{byteLength:2,components:1};case ma:case ga:return{byteLength:2,components:4};case _i:case pa:case cn:return{byteLength:4,components:1};case hc:case uc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function nf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function fp(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((p,_)=>p.start-_.start);let d=0;for(let p=1;p<u.length;p++){let _=u[d],y=u[p];y.start<=_.start+_.count+1?_.count=Math.max(_.count,y.start+y.count-_.start):(++d,u[d]=y)}u.length=d+1;for(let p=0,_=u.length;p<_;p++){let y=u[p];i.bufferSubData(c,y.start*h.BYTES_PER_ELEMENT,h,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var dp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pp=`#ifdef USE_ALPHAHASH
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
#endif`,mp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_p=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,yp=`#ifdef USE_AOMAP
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
#endif`,vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mp=`#ifdef USE_BATCHING
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
#endif`,Sp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ep=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Tp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ap=`#ifdef USE_BUMPMAP
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
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Up=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Fp=`#define PI 3.141592653589793
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
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
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
} // validated`,Op=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Bp=`vec3 transformedNormal = objectNormal;
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
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,kp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Hp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Wp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Xp=`#ifdef USE_ENVMAP
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
#endif`,qp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yp=`#ifdef USE_ENVMAP
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
#endif`,Zp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Jp=`#ifdef USE_ENVMAP
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
#endif`,$p=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,em=`#ifdef USE_GRADIENTMAP
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
}`,tm=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,nm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,im=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sm=`uniform bool receiveShadow;
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
#endif`,rm=`#ifdef USE_ENVMAP
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
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
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
#endif`,om=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,am=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,cm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,um=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
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
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,fm=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif`,dm=`#if defined( RE_IndirectDiffuse )
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
#endif`,pm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_m=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ym=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Sm=`#if defined( USE_POINTS_UV )
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
#endif`,bm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Em=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Am=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rm=`#ifdef USE_MORPHTARGETS
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
#endif`,Cm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Im=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Pm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Um=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Nm=`#ifdef USE_NORMALMAP
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
#endif`,Fm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Om=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,km=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Vm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ym=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Jm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$m=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Km=`float getShadowMask() {
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,jm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qm=`#ifdef USE_SKINNING
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
#endif`,eg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tg=`#ifdef USE_SKINNING
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
#endif`,ng=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ig=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,og=`#ifdef USE_TRANSMISSION
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
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ag=`#ifdef USE_TRANSMISSION
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
#endif`,lg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ug=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,fg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,dg=`uniform sampler2D t2D;
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
}`,pg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_g=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`#include <common>
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
}`,yg=`#if DEPTH_PACKING == 3200
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
}`,vg=`#define DISTANCE
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
}`,Mg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
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
	gl_FragColor = packDepthToRGBA( dist );
}`,Sg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Eg=`uniform float scale;
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
}`,wg=`uniform vec3 diffuse;
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
}`,Tg=`#include <common>
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
}`,Ag=`uniform vec3 diffuse;
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
}`,Rg=`#define LAMBERT
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
}`,Cg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Ig=`#define MATCAP
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
}`,Pg=`#define MATCAP
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
}`,Dg=`#define NORMAL
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
}`,Lg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ug=`#define PHONG
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
}`,Ng=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Fg=`#define STANDARD
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
}`,Og=`#define STANDARD
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
#include <packing>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,Bg=`#define TOON
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
}`,zg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,kg=`uniform float size;
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
}`,Hg=`uniform vec3 diffuse;
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
}`,Vg=`#include <common>
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
}`,Gg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Wg=`uniform float rotation;
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
}`,Xg=`uniform vec3 diffuse;
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
}`,Qe={alphahash_fragment:dp,alphahash_pars_fragment:pp,alphamap_fragment:mp,alphamap_pars_fragment:gp,alphatest_fragment:_p,alphatest_pars_fragment:xp,aomap_fragment:yp,aomap_pars_fragment:vp,batching_pars_vertex:Mp,batching_vertex:Sp,begin_vertex:bp,beginnormal_vertex:Ep,bsdfs:wp,iridescence_fragment:Tp,bumpmap_pars_fragment:Ap,clipping_planes_fragment:Rp,clipping_planes_pars_fragment:Cp,clipping_planes_pars_vertex:Ip,clipping_planes_vertex:Pp,color_fragment:Dp,color_pars_fragment:Lp,color_pars_vertex:Up,color_vertex:Np,common:Fp,cube_uv_reflection_fragment:Op,defaultnormal_vertex:Bp,displacementmap_pars_vertex:zp,displacementmap_vertex:kp,emissivemap_fragment:Hp,emissivemap_pars_fragment:Vp,colorspace_fragment:Gp,colorspace_pars_fragment:Wp,envmap_fragment:Xp,envmap_common_pars_fragment:qp,envmap_pars_fragment:Yp,envmap_pars_vertex:Zp,envmap_physical_pars_fragment:rm,envmap_vertex:Jp,fog_vertex:$p,fog_pars_vertex:Kp,fog_fragment:jp,fog_pars_fragment:Qp,gradientmap_pars_fragment:em,lightmap_pars_fragment:tm,lights_lambert_fragment:nm,lights_lambert_pars_fragment:im,lights_pars_begin:sm,lights_toon_fragment:om,lights_toon_pars_fragment:am,lights_phong_fragment:lm,lights_phong_pars_fragment:cm,lights_physical_fragment:hm,lights_physical_pars_fragment:um,lights_fragment_begin:fm,lights_fragment_maps:dm,lights_fragment_end:pm,logdepthbuf_fragment:mm,logdepthbuf_pars_fragment:gm,logdepthbuf_pars_vertex:_m,logdepthbuf_vertex:xm,map_fragment:ym,map_pars_fragment:vm,map_particle_fragment:Mm,map_particle_pars_fragment:Sm,metalnessmap_fragment:bm,metalnessmap_pars_fragment:Em,morphinstance_vertex:wm,morphcolor_vertex:Tm,morphnormal_vertex:Am,morphtarget_pars_vertex:Rm,morphtarget_vertex:Cm,normal_fragment_begin:Im,normal_fragment_maps:Pm,normal_pars_fragment:Dm,normal_pars_vertex:Lm,normal_vertex:Um,normalmap_pars_fragment:Nm,clearcoat_normal_fragment_begin:Fm,clearcoat_normal_fragment_maps:Om,clearcoat_pars_fragment:Bm,iridescence_pars_fragment:zm,opaque_fragment:km,packing:Hm,premultiplied_alpha_fragment:Vm,project_vertex:Gm,dithering_fragment:Wm,dithering_pars_fragment:Xm,roughnessmap_fragment:qm,roughnessmap_pars_fragment:Ym,shadowmap_pars_fragment:Zm,shadowmap_pars_vertex:Jm,shadowmap_vertex:$m,shadowmask_pars_fragment:Km,skinbase_vertex:jm,skinning_pars_vertex:Qm,skinning_vertex:eg,skinnormal_vertex:tg,specularmap_fragment:ng,specularmap_pars_fragment:ig,tonemapping_fragment:sg,tonemapping_pars_fragment:rg,transmission_fragment:og,transmission_pars_fragment:ag,uv_pars_fragment:lg,uv_pars_vertex:cg,uv_vertex:hg,worldpos_vertex:ug,background_vert:fg,background_frag:dg,backgroundCube_vert:pg,backgroundCube_frag:mg,cube_vert:gg,cube_frag:_g,depth_vert:xg,depth_frag:yg,distanceRGBA_vert:vg,distanceRGBA_frag:Mg,equirect_vert:Sg,equirect_frag:bg,linedashed_vert:Eg,linedashed_frag:wg,meshbasic_vert:Tg,meshbasic_frag:Ag,meshlambert_vert:Rg,meshlambert_frag:Cg,meshmatcap_vert:Ig,meshmatcap_frag:Pg,meshnormal_vert:Dg,meshnormal_frag:Lg,meshphong_vert:Ug,meshphong_frag:Ng,meshphysical_vert:Fg,meshphysical_frag:Og,meshtoon_vert:Bg,meshtoon_frag:zg,points_vert:kg,points_frag:Hg,shadow_vert:Vg,shadow_frag:Gg,sprite_vert:Wg,sprite_frag:Xg},Te={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ke}},envmap:{envMap:{value:null},envMapRotation:{value:new Ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ke},normalScale:{value:new ve(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0},uvTransform:{value:new Ke}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new ve(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ke},alphaMap:{value:null},alphaMapTransform:{value:new Ke},alphaTest:{value:0}}},Ln={basic:{uniforms:Ht([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:Qe.meshbasic_vert,fragmentShader:Qe.meshbasic_frag},lambert:{uniforms:Ht([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Qe.meshlambert_vert,fragmentShader:Qe.meshlambert_frag},phong:{uniforms:Ht([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30}}]),vertexShader:Qe.meshphong_vert,fragmentShader:Qe.meshphong_frag},standard:{uniforms:Ht([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag},toon:{uniforms:Ht([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Qe.meshtoon_vert,fragmentShader:Qe.meshtoon_frag},matcap:{uniforms:Ht([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:Qe.meshmatcap_vert,fragmentShader:Qe.meshmatcap_frag},points:{uniforms:Ht([Te.points,Te.fog]),vertexShader:Qe.points_vert,fragmentShader:Qe.points_frag},dashed:{uniforms:Ht([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qe.linedashed_vert,fragmentShader:Qe.linedashed_frag},depth:{uniforms:Ht([Te.common,Te.displacementmap]),vertexShader:Qe.depth_vert,fragmentShader:Qe.depth_frag},normal:{uniforms:Ht([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:Qe.meshnormal_vert,fragmentShader:Qe.meshnormal_frag},sprite:{uniforms:Ht([Te.sprite,Te.fog]),vertexShader:Qe.sprite_vert,fragmentShader:Qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qe.background_vert,fragmentShader:Qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ke}},vertexShader:Qe.backgroundCube_vert,fragmentShader:Qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qe.cube_vert,fragmentShader:Qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qe.equirect_vert,fragmentShader:Qe.equirect_frag},distanceRGBA:{uniforms:Ht([Te.common,Te.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qe.distanceRGBA_vert,fragmentShader:Qe.distanceRGBA_frag},shadow:{uniforms:Ht([Te.lights,Te.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:Qe.shadow_vert,fragmentShader:Qe.shadow_frag}};Ln.physical={uniforms:Ht([Ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ke},clearcoatNormalScale:{value:new ve(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ke},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ke},transmissionSamplerSize:{value:new ve},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ke},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ke},anisotropyVector:{value:new ve},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ke}}]),vertexShader:Qe.meshphysical_vert,fragmentShader:Qe.meshphysical_frag};var $a={r:0,b:0,g:0},Vi=new xn,qg=new nt;function Yg(i,e,t,n,s,r,o){let a=new Ge(0),l=r===!0?0:1,c,h,u=null,d=0,p=null;function _(x){let g=x.isScene===!0?x.background:null;return g&&g.isTexture&&(g=(x.backgroundBlurriness>0?t:e).get(g)),g}function y(x){let g=!1,R=_(x);R===null?f(a,l):R&&R.isColor&&(f(R,1),g=!0);let T=i.xr.getEnvironmentBlendMode();T==="additive"?n.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||g)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(x,g){let R=_(g);R&&(R.isCubeTexture||R.mapping===Or)?(h===void 0&&(h=new et(new yn(1,1,1),new Tn({name:"BackgroundCubeMaterial",uniforms:Hi(Ln.backgroundCube.uniforms),vertexShader:Ln.backgroundCube.vertexShader,fragmentShader:Ln.backgroundCube.fragmentShader,side:Tt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,w,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Vi.copy(g.backgroundRotation),Vi.x*=-1,Vi.y*=-1,Vi.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Vi.y*=-1,Vi.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(qg.makeRotationFromEuler(Vi)),h.material.toneMapped=rt.getTransfer(R.colorSpace)!==ft,(u!==R||d!==R.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new et(new Oi(2,2),new Tn({name:"BackgroundMaterial",uniforms:Hi(Ln.background.uniforms),vertexShader:Ln.background.vertexShader,fragmentShader:Ln.background.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.toneMapped=rt.getTransfer(R.colorSpace)!==ft,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=R,d=R.version,p=i.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null))}function f(x,g){x.getRGB($a,xc(i)),n.buffers.color.setClear($a.r,$a.g,$a.b,g,o)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,g=1){a.set(x),l=g,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(x){l=x,f(a,l)},render:y,addToRenderList:m,dispose:b}}function Zg(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(v,E,P,O,Y){let z=!1,H=u(O,P,E);r!==H&&(r=H,c(r.object)),z=p(v,O,P,Y),z&&_(v,O,P,Y),Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,g(v,E,P,O),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,E,P){let O=P.wireframe===!0,Y=n[v.id];Y===void 0&&(Y={},n[v.id]=Y);let z=Y[E.id];z===void 0&&(z={},Y[E.id]=z);let H=z[O];return H===void 0&&(H=d(l()),z[O]=H),H}function d(v){let E=[],P=[],O=[];for(let Y=0;Y<t;Y++)E[Y]=0,P[Y]=0,O[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:P,attributeDivisors:O,object:v,attributes:{},index:null}}function p(v,E,P,O){let Y=r.attributes,z=E.attributes,H=0,Z=P.getAttributes();for(let q in Z)if(Z[q].location>=0){let me=Y[q],Me=z[q];if(Me===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(Me=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(Me=v.instanceColor)),me===void 0||me.attribute!==Me||Me&&me.data!==Me.data)return!0;H++}return r.attributesNum!==H||r.index!==O}function _(v,E,P,O){let Y={},z=E.attributes,H=0,Z=P.getAttributes();for(let q in Z)if(Z[q].location>=0){let me=z[q];me===void 0&&(q==="instanceMatrix"&&v.instanceMatrix&&(me=v.instanceMatrix),q==="instanceColor"&&v.instanceColor&&(me=v.instanceColor));let Me={};Me.attribute=me,me&&me.data&&(Me.data=me.data),Y[q]=Me,H++}r.attributes=Y,r.attributesNum=H,r.index=O}function y(){let v=r.newAttributes;for(let E=0,P=v.length;E<P;E++)v[E]=0}function m(v){f(v,0)}function f(v,E){let P=r.newAttributes,O=r.enabledAttributes,Y=r.attributeDivisors;P[v]=1,O[v]===0&&(i.enableVertexAttribArray(v),O[v]=1),Y[v]!==E&&(i.vertexAttribDivisor(v,E),Y[v]=E)}function b(){let v=r.newAttributes,E=r.enabledAttributes;for(let P=0,O=E.length;P<O;P++)E[P]!==v[P]&&(i.disableVertexAttribArray(P),E[P]=0)}function x(v,E,P,O,Y,z,H){H===!0?i.vertexAttribIPointer(v,E,P,Y,z):i.vertexAttribPointer(v,E,P,O,Y,z)}function g(v,E,P,O){y();let Y=O.attributes,z=P.getAttributes(),H=E.defaultAttributeValues;for(let Z in z){let q=z[Z];if(q.location>=0){let ge=Y[Z];if(ge===void 0&&(Z==="instanceMatrix"&&v.instanceMatrix&&(ge=v.instanceMatrix),Z==="instanceColor"&&v.instanceColor&&(ge=v.instanceColor)),ge!==void 0){let me=ge.normalized,Me=ge.itemSize,we=e.get(ge);if(we===void 0)continue;let We=we.buffer,je=we.type,Je=we.bytesPerElement,te=je===i.INT||je===i.UNSIGNED_INT||ge.gpuType===pa;if(ge.isInterleavedBufferAttribute){let ne=ge.data,Ie=ne.stride,Ue=ge.offset;if(ne.isInstancedInterleavedBuffer){for(let Ae=0;Ae<q.locationSize;Ae++)f(q.location+Ae,ne.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ae=0;Ae<q.locationSize;Ae++)m(q.location+Ae);i.bindBuffer(i.ARRAY_BUFFER,We);for(let Ae=0;Ae<q.locationSize;Ae++)x(q.location+Ae,Me/q.locationSize,je,me,Ie*Je,(Ue+Me/q.locationSize*Ae)*Je,te)}else{if(ge.isInstancedBufferAttribute){for(let ne=0;ne<q.locationSize;ne++)f(q.location+ne,ge.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let ne=0;ne<q.locationSize;ne++)m(q.location+ne);i.bindBuffer(i.ARRAY_BUFFER,We);for(let ne=0;ne<q.locationSize;ne++)x(q.location+ne,Me/q.locationSize,je,me,Me*Je,Me/q.locationSize*ne*Je,te)}}else if(H!==void 0){let me=H[Z];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(q.location,me);break;case 3:i.vertexAttrib3fv(q.location,me);break;case 4:i.vertexAttrib4fv(q.location,me);break;default:i.vertexAttrib1fv(q.location,me)}}}}b()}function R(){C();for(let v in n){let E=n[v];for(let P in E){let O=E[P];for(let Y in O)h(O[Y].object),delete O[Y];delete E[P]}delete n[v]}}function T(v){if(n[v.id]===void 0)return;let E=n[v.id];for(let P in E){let O=E[P];for(let Y in O)h(O[Y].object),delete O[Y];delete E[P]}delete n[v.id]}function w(v){for(let E in n){let P=n[E];if(P[v.id]===void 0)continue;let O=P[v.id];for(let Y in O)h(O[Y].object),delete O[Y];delete P[v.id]}}function C(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:S,dispose:R,releaseStatesOfGeometry:T,releaseStatesOfProgram:w,initAttributes:y,enableAttribute:m,disableUnusedAttributes:b}}function Jg(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let p=0;for(let _=0;_<u;_++)p+=h[_];t.update(p,n,1)}function l(c,h,u,d){if(u===0)return;let p=e.get("WEBGL_multi_draw");if(p===null)for(let _=0;_<c.length;_++)o(c[_],h[_],d[_]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let _=0;for(let y=0;y<u;y++)_+=h[y]*d[y];t.update(_,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function $g(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let w=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==$t&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){let C=w===bs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==Rn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==cn&&!C)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),g=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=_>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:_,maxTextureSize:y,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:b,maxVaryings:x,maxFragmentUniforms:g,vertexTextures:R,maxSamples:T}}function Kg(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Cn,a=new Ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let p=u.length!==0||d||n!==0||s;return s=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,p){let _=u.clippingPlanes,y=u.clipIntersection,m=u.clipShadows,f=i.get(u);if(!s||_===null||_.length===0||r&&!m)r?h(null):c();else{let b=r?0:n,x=b*4,g=f.clippingState||null;l.value=g,g=h(_,d,x,p);for(let R=0;R!==x;++R)g[R]=t[R];f.clippingState=g,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,p,_){let y=u!==null?u.length:0,m=null;if(y!==0){if(m=l.value,_!==!0||m===null){let f=p+y*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,g=p;x!==y;++x,g+=4)o.copy(u[x]).applyMatrix4(b,a),o.normal.toArray(m,g),m[g+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function jg(i){let e=new WeakMap;function t(o,a){return a===ua?o.mapping=zi:a===fa&&(o.mapping=ki),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===ua||a===fa)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Uo(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Is=4,Lu=[.125,.215,.35,.446,.526,.582],Xi=20,bc=new Wn,Uu=new Ge,Ec=null,wc=0,Tc=0,Ac=!1,Wi=(1+Math.sqrt(5))/2,Cs=1/Wi,Nu=[new U(-Wi,Cs,0),new U(Wi,Cs,0),new U(-Cs,0,Wi),new U(Cs,0,Wi),new U(0,Wi,-Cs),new U(0,Wi,Cs),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],Qg=new U,Ds=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100,r={}){let{size:o=256,position:a=Qg}=r;Ec=this._renderer.getRenderTarget(),wc=this._renderer.getActiveCubeFace(),Tc=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ou(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ec,wc,Tc),this._renderer.xr.enabled=Ac,e.scissorTest=!1,Ka(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===zi||e.mapping===ki?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ec=this._renderer.getRenderTarget(),wc=this._renderer.getActiveCubeFace(),Tc=this._renderer.getActiveMipmapLevel(),Ac=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Jt,minFilter:Jt,generateMipmaps:!1,type:bs,format:$t,colorSpace:Li,depthBuffer:!1},s=Fu(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fu(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=e0(r)),this._blurMaterial=t0(r,e,t)}return s}_compileMaterial(e){let t=new et(this._lodPlanes[0],e);this._renderer.compile(t,bc)}_sceneToCubeUV(e,t,n,s,r){let l=new Lt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(Uu),u.toneMapping=qn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));let y=new on({name:"PMREM.Background",side:Tt,depthWrite:!1,depthTest:!1}),m=new et(new yn,y),f=!1,b=e.background;b?b.isColor&&(y.color.copy(b),e.background=null,f=!0):(y.color.copy(Uu),f=!0);for(let x=0;x<6;x++){let g=x%3;g===0?(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[x],r.y,r.z)):g===1?(l.up.set(0,0,c[x]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[x],r.z)):(l.up.set(0,c[x],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[x]));let R=this._cubeSize;Ka(s,g*R,x>2?R:0,R,R),u.setRenderTarget(s),f&&u.render(m,l),u.render(e,l)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===zi||e.mapping===ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ou());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new et(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;Ka(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,bc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Nu[(s-r-1)%Nu.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new et(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Xi-1),y=r/_,m=isFinite(r)?1+Math.floor(h*y):Xi;m>Xi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Xi}`);let f=[],b=0;for(let w=0;w<Xi;++w){let C=w/y,S=Math.exp(-C*C/2);f.push(S),w===0?b+=S:w<m&&(b+=2*S)}for(let w=0;w<f.length;w++)f[w]=f[w]/b;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=_,d.mipInt.value=x-n;let g=this._sizeLods[s],R=3*g*(s>x-Is?s-x+Is:0),T=4*(this._cubeSize-g);Ka(t,R,T,3*g,2*g),l.setRenderTarget(t),l.render(u,bc)}};function e0(i){let e=[],t=[],n=[],s=i,r=i-Is+1+Lu.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-Is?l=Lu[o-i+Is-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,_=6,y=3,m=2,f=1,b=new Float32Array(y*_*p),x=new Float32Array(m*_*p),g=new Float32Array(f*_*p);for(let T=0;T<p;T++){let w=T%3*2/3-1,C=T>2?0:-1,S=[w,C,0,w+2/3,C,0,w+2/3,C+1,0,w,C,0,w+2/3,C+1,0,w,C+1,0];b.set(S,y*_*T),x.set(d,m*_*T);let v=[T,T,T,T,T,T];g.set(v,f*_*T)}let R=new ot;R.setAttribute("position",new qe(b,y)),R.setAttribute("uv",new qe(x,m)),R.setAttribute("faceIndex",new qe(g,f)),e.push(R),s>Is&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Fu(i,e,t){let n=new _n(i,e,t);return n.texture.mapping=Or,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ka(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function t0(i,e,t){let n=new Float32Array(Xi),s=new U(0,1,0);return new Tn({name:"SphericalGaussianBlur",defines:{n:Xi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Oc(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Ou(){return new Tn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Oc(),fragmentShader:`

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
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Bu(){return new Tn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Oc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Xn,depthTest:!1,depthWrite:!1})}function Oc(){return`

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
	`}function n0(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===ua||l===fa,h=l===zi||l===ki;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ds(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let p=a.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new Ds(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function i0(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&ps("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function s0(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let _ in d.attributes)e.remove(d.attributes[_]);d.removeEventListener("dispose",o),delete s[d.id];let p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let p in d)e.update(d[p],i.ARRAY_BUFFER)}function c(u){let d=[],p=u.index,_=u.attributes.position,y=0;if(p!==null){let b=p.array;y=p.version;for(let x=0,g=b.length;x<g;x+=3){let R=b[x+0],T=b[x+1],w=b[x+2];d.push(R,T,T,w,w,R)}}else if(_!==void 0){let b=_.array;y=_.version;for(let x=0,g=b.length/3-1;x<g;x+=3){let R=x+0,T=x+1,w=x+2;d.push(R,T,T,w,w,R)}}else return;let m=new(_c(d)?ui:hi)(d,1);m.version=y;let f=r.get(u);f&&e.remove(f),r.set(u,m)}function h(u){let d=r.get(u);if(d){let p=u.index;p!==null&&d.version<p.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function r0(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),t.update(p,n,1)}function c(d,p,_){_!==0&&(i.drawElementsInstanced(n,p,r,d*o,_),t.update(p,n,_))}function h(d,p,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,d,0,_);let m=0;for(let f=0;f<_;f++)m+=p[f];t.update(m,n,1)}function u(d,p,_,y){if(_===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],y[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,y,0,_);let f=0;for(let b=0;b<_;b++)f+=p[b]*y[b];t.update(f,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function o0(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function a0(i,e,t){let n=new WeakMap,s=new ct;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let S=function(){w.dispose(),n.delete(a),a.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();let p=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,y=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],f=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],x=0;p===!0&&(x=1),_===!0&&(x=2),y===!0&&(x=3);let g=a.attributes.position.count*x,R=1;g>e.maxTextureSize&&(R=Math.ceil(g/e.maxTextureSize),g=e.maxTextureSize);let T=new Float32Array(g*R*4*u),w=new cr(T,g,R,u);w.type=cn,w.needsUpdate=!0;let C=x*4;for(let v=0;v<u;v++){let E=m[v],P=f[v],O=b[v],Y=g*R*4*v;for(let z=0;z<E.count;z++){let H=z*C;p===!0&&(s.fromBufferAttribute(E,z),T[Y+H+0]=s.x,T[Y+H+1]=s.y,T[Y+H+2]=s.z,T[Y+H+3]=0),_===!0&&(s.fromBufferAttribute(P,z),T[Y+H+4]=s.x,T[Y+H+5]=s.y,T[Y+H+6]=s.z,T[Y+H+7]=0),y===!0&&(s.fromBufferAttribute(O,z),T[Y+H+8]=s.x,T[Y+H+9]=s.y,T[Y+H+10]=s.z,T[Y+H+11]=O.itemSize===4?s.w:1)}}d={count:u,texture:w,size:new ve(g,R)},n.set(a,d),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let p=0;for(let y=0;y<c.length;y++)p+=c[y];let _=a.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function l0(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var sf=new Wt,zu=new _r(1,1),rf=new cr,of=new Do,af=new fr,ku=[],Hu=[],Vu=new Float32Array(16),Gu=new Float32Array(9),Wu=new Float32Array(4);function Ls(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=ku[s];if(r===void 0&&(r=new Float32Array(s),ku[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Rt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Ct(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Qa(i,e){let t=Hu[e];t===void 0&&(t=new Int32Array(e),Hu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function c0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function h0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;i.uniform2fv(this.addr,e),Ct(t,e)}}function u0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Rt(t,e))return;i.uniform3fv(this.addr,e),Ct(t,e)}}function f0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;i.uniform4fv(this.addr,e),Ct(t,e)}}function d0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Wu.set(n),i.uniformMatrix2fv(this.addr,!1,Wu),Ct(t,n)}}function p0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Gu.set(n),i.uniformMatrix3fv(this.addr,!1,Gu),Ct(t,n)}}function m0(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Rt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Ct(t,e)}else{if(Rt(t,n))return;Vu.set(n),i.uniformMatrix4fv(this.addr,!1,Vu),Ct(t,n)}}function g0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function _0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;i.uniform2iv(this.addr,e),Ct(t,e)}}function x0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;i.uniform3iv(this.addr,e),Ct(t,e)}}function y0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;i.uniform4iv(this.addr,e),Ct(t,e)}}function v0(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function M0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Rt(t,e))return;i.uniform2uiv(this.addr,e),Ct(t,e)}}function S0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Rt(t,e))return;i.uniform3uiv(this.addr,e),Ct(t,e)}}function b0(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Rt(t,e))return;i.uniform4uiv(this.addr,e),Ct(t,e)}}function E0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(zu.compareFunction=mc,r=zu):r=sf,t.setTexture2D(e||r,s)}function w0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||of,s)}function T0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||af,s)}function A0(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||rf,s)}function R0(i){switch(i){case 5126:return c0;case 35664:return h0;case 35665:return u0;case 35666:return f0;case 35674:return d0;case 35675:return p0;case 35676:return m0;case 5124:case 35670:return g0;case 35667:case 35671:return _0;case 35668:case 35672:return x0;case 35669:case 35673:return y0;case 5125:return v0;case 36294:return M0;case 36295:return S0;case 36296:return b0;case 35678:case 36198:case 36298:case 36306:case 35682:return E0;case 35679:case 36299:case 36307:return w0;case 35680:case 36300:case 36308:case 36293:return T0;case 36289:case 36303:case 36311:case 36292:return A0}}function C0(i,e){i.uniform1fv(this.addr,e)}function I0(i,e){let t=Ls(e,this.size,2);i.uniform2fv(this.addr,t)}function P0(i,e){let t=Ls(e,this.size,3);i.uniform3fv(this.addr,t)}function D0(i,e){let t=Ls(e,this.size,4);i.uniform4fv(this.addr,t)}function L0(i,e){let t=Ls(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function U0(i,e){let t=Ls(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function N0(i,e){let t=Ls(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function F0(i,e){i.uniform1iv(this.addr,e)}function O0(i,e){i.uniform2iv(this.addr,e)}function B0(i,e){i.uniform3iv(this.addr,e)}function z0(i,e){i.uniform4iv(this.addr,e)}function k0(i,e){i.uniform1uiv(this.addr,e)}function H0(i,e){i.uniform2uiv(this.addr,e)}function V0(i,e){i.uniform3uiv(this.addr,e)}function G0(i,e){i.uniform4uiv(this.addr,e)}function W0(i,e,t){let n=this.cache,s=e.length,r=Qa(t,s);Rt(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||sf,r[o])}function X0(i,e,t){let n=this.cache,s=e.length,r=Qa(t,s);Rt(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||of,r[o])}function q0(i,e,t){let n=this.cache,s=e.length,r=Qa(t,s);Rt(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||af,r[o])}function Y0(i,e,t){let n=this.cache,s=e.length,r=Qa(t,s);Rt(n,r)||(i.uniform1iv(this.addr,r),Ct(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||rf,r[o])}function Z0(i){switch(i){case 5126:return C0;case 35664:return I0;case 35665:return P0;case 35666:return D0;case 35674:return L0;case 35675:return U0;case 35676:return N0;case 5124:case 35670:return F0;case 35667:case 35671:return O0;case 35668:case 35672:return B0;case 35669:case 35673:return z0;case 5125:return k0;case 36294:return H0;case 36295:return V0;case 36296:return G0;case 35678:case 36198:case 36298:case 36306:case 35682:return W0;case 35679:case 36299:case 36307:return X0;case 35680:case 36300:case 36308:case 36293:return q0;case 36289:case 36303:case 36311:case 36292:return Y0}}var Cc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=R0(t.type)}},Ic=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Z0(t.type)}},Pc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Rc=/(\w+)(\])?(\[|\.)?/g;function Xu(i,e){i.seq.push(e),i.map[e.id]=e}function J0(i,e,t){let n=i.name,s=n.length;for(Rc.lastIndex=0;;){let r=Rc.exec(n),o=Rc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Xu(t,c===void 0?new Cc(a,i,e):new Ic(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Pc(a),Xu(t,u)),t=u}}}var Ps=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);J0(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function qu(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var $0=37297,K0=0;function j0(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Yu=new Ke;function Q0(i){rt._getMatrix(Yu,rt.workingColorSpace,i);let e=`mat3( ${Yu.elements.map(t=>t.toFixed(4))} )`;switch(rt.getTransfer(i)){case or:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zu(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+j0(i.getShaderSource(e),a)}else return r}function e_(i,e){let t=Q0(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function t_(i,e){let t;switch(e){case lu:t="Linear";break;case cu:t="Reinhard";break;case hu:t="Cineon";break;case uu:t="ACESFilmic";break;case du:t="AgX";break;case ha:t="Neutral";break;case fu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ja=new U;function n_(){rt.getLuminanceCoefficients(ja);let i=ja.x.toFixed(4),e=ja.y.toFixed(4),t=ja.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function i_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Gr).join(`
`)}function s_(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function r_(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Gr(i){return i!==""}function Ju(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function $u(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var o_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dc(i){return i.replace(o_,l_)}var a_=new Map;function l_(i,e){let t=Qe[e];if(t===void 0){let n=a_.get(e);if(n!==void 0)t=Qe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Dc(t)}var c_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ku(i){return i.replace(c_,h_)}function h_(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ju(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function u_(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Fr?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===ta?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(e="SHADOWMAP_TYPE_VSM"),e}function f_(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case zi:case ki:e="ENVMAP_TYPE_CUBE";break;case Or:e="ENVMAP_TYPE_CUBE_UV";break}return e}function d_(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ki:e="ENVMAP_MODE_REFRACTION";break}return e}function p_(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case ca:e="ENVMAP_BLENDING_MULTIPLY";break;case ou:e="ENVMAP_BLENDING_MIX";break;case au:e="ENVMAP_BLENDING_ADD";break}return e}function m_(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function g_(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=u_(t),c=f_(t),h=d_(t),u=p_(t),d=m_(t),p=i_(t),_=s_(r),y=s.createProgram(),m,f,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Gr).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(Gr).join(`
`),f.length>0&&(f+=`
`)):(m=[ju(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gr).join(`
`),f=[ju(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==qn?"#define TONE_MAPPING":"",t.toneMapping!==qn?Qe.tonemapping_pars_fragment:"",t.toneMapping!==qn?t_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Qe.colorspace_pars_fragment,e_("linearToOutputTexel",t.outputColorSpace),n_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Gr).join(`
`)),o=Dc(o),o=Ju(o,t),o=$u(o,t),a=Dc(a),a=Ju(a,t),a=$u(a,t),o=Ku(o),a=Ku(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===gc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);let x=b+m+o,g=b+f+a,R=qu(s,s.VERTEX_SHADER,x),T=qu(s,s.FRAGMENT_SHADER,g);s.attachShader(y,R),s.attachShader(y,T),t.index0AttributeName!==void 0?s.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(y,0,"position"),s.linkProgram(y);function w(E){if(i.debug.checkShaderErrors){let P=s.getProgramInfoLog(y)||"",O=s.getShaderInfoLog(R)||"",Y=s.getShaderInfoLog(T)||"",z=P.trim(),H=O.trim(),Z=Y.trim(),q=!0,ge=!0;if(s.getProgramParameter(y,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,y,R,T);else{let me=Zu(s,R,"vertex"),Me=Zu(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(y,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+z+`
`+me+`
`+Me)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(H===""||Z==="")&&(ge=!1);ge&&(E.diagnostics={runnable:q,programLog:z,vertexShader:{log:H,prefix:m},fragmentShader:{log:Z,prefix:f}})}s.deleteShader(R),s.deleteShader(T),C=new Ps(s,y),S=r_(s,y)}let C;this.getUniforms=function(){return C===void 0&&w(this),C};let S;this.getAttributes=function(){return S===void 0&&w(this),S};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(y,$0)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=K0++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=T,this}var __=0,Lc=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Uc(e),t.set(e,n)),n}},Uc=class{constructor(e){this.id=__++,this.code=e,this.usedTimes=0}};function x_(i,e,t,n,s,r,o){let a=new hr,l=new Lc,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,p=s.precision,_={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,v,E,P,O){let Y=P.fog,z=O.geometry,H=S.isMeshStandardMaterial?P.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||H),q=Z&&Z.mapping===Or?Z.image.height:null,ge=_[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));let me=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,Me=me!==void 0?me.length:0,we=0;z.morphAttributes.position!==void 0&&(we=1),z.morphAttributes.normal!==void 0&&(we=2),z.morphAttributes.color!==void 0&&(we=3);let We,je,Je,te;if(ge){let $=Ln[ge];We=$.vertexShader,je=$.fragmentShader}else We=S.vertexShader,je=S.fragmentShader,l.update(S),Je=l.getVertexShaderID(S),te=l.getFragmentShaderID(S);let ne=i.getRenderTarget(),Ie=i.state.buffers.depth.getReversed(),Ue=O.isInstancedMesh===!0,Ae=O.isBatchedMesh===!0,$e=!!S.map,st=!!S.matcap,N=!!Z,se=!!S.aoMap,re=!!S.lightMap,oe=!!S.bumpMap,ie=!!S.normalMap,ye=!!S.displacementMap,ue=!!S.emissiveMap,be=!!S.metalnessMap,Be=!!S.roughnessMap,ke=S.anisotropy>0,I=S.clearcoat>0,M=S.dispersion>0,X=S.iridescence>0,D=S.sheen>0,k=S.transmission>0,F=ke&&!!S.anisotropyMap,Q=I&&!!S.clearcoatMap,V=I&&!!S.clearcoatNormalMap,ae=I&&!!S.clearcoatRoughnessMap,pe=X&&!!S.iridescenceMap,ee=X&&!!S.iridescenceThicknessMap,fe=D&&!!S.sheenColorMap,Le=D&&!!S.sheenRoughnessMap,Ee=!!S.specularMap,Se=!!S.specularColorMap,Xe=!!S.specularIntensityMap,B=k&&!!S.transmissionMap,le=k&&!!S.thicknessMap,de=!!S.gradientMap,Pe=!!S.alphaMap,_e=S.alphaTest>0,he=!!S.alphaHash,L=!!S.extensions,j=qn;S.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(j=i.toneMapping);let ce={shaderID:ge,shaderType:S.type,shaderName:S.name,vertexShader:We,fragmentShader:je,defines:S.defines,customVertexShaderID:Je,customFragmentShaderID:te,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Ae,batchingColor:Ae&&O._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&O.instanceColor!==null,instancingMorph:Ue&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ne===null?i.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Li,alphaToCoverage:!!S.alphaToCoverage,map:$e,matcap:st,envMap:N,envMapMode:N&&Z.mapping,envMapCubeUVHeight:q,aoMap:se,lightMap:re,bumpMap:oe,normalMap:ie,displacementMap:d&&ye,emissiveMap:ue,normalMapObjectSpace:ie&&S.normalMapType===gu,normalMapTangentSpace:ie&&S.normalMapType===Ja,metalnessMap:be,roughnessMap:Be,anisotropy:ke,anisotropyMap:F,clearcoat:I,clearcoatMap:Q,clearcoatNormalMap:V,clearcoatRoughnessMap:ae,dispersion:M,iridescence:X,iridescenceMap:pe,iridescenceThicknessMap:ee,sheen:D,sheenColorMap:fe,sheenRoughnessMap:Le,specularMap:Ee,specularColorMap:Se,specularIntensityMap:Xe,transmission:k,transmissionMap:B,thicknessMap:le,gradientMap:de,opaque:S.transparent===!1&&S.blending===Pi&&S.alphaToCoverage===!1,alphaMap:Pe,alphaTest:_e,alphaHash:he,combine:S.combine,mapUv:$e&&y(S.map.channel),aoMapUv:se&&y(S.aoMap.channel),lightMapUv:re&&y(S.lightMap.channel),bumpMapUv:oe&&y(S.bumpMap.channel),normalMapUv:ie&&y(S.normalMap.channel),displacementMapUv:ye&&y(S.displacementMap.channel),emissiveMapUv:ue&&y(S.emissiveMap.channel),metalnessMapUv:be&&y(S.metalnessMap.channel),roughnessMapUv:Be&&y(S.roughnessMap.channel),anisotropyMapUv:F&&y(S.anisotropyMap.channel),clearcoatMapUv:Q&&y(S.clearcoatMap.channel),clearcoatNormalMapUv:V&&y(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&y(S.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&y(S.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&y(S.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&y(S.sheenColorMap.channel),sheenRoughnessMapUv:Le&&y(S.sheenRoughnessMap.channel),specularMapUv:Ee&&y(S.specularMap.channel),specularColorMapUv:Se&&y(S.specularColorMap.channel),specularIntensityMapUv:Xe&&y(S.specularIntensityMap.channel),transmissionMapUv:B&&y(S.transmissionMap.channel),thicknessMapUv:le&&y(S.thicknessMap.channel),alphaMapUv:Pe&&y(S.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(ie||ke),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!z.attributes.uv&&($e||Pe),fog:!!Y,useFog:S.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ie,skinning:O.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:we,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&E.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:$e&&S.map.isVideoTexture===!0&&rt.getTransfer(S.map.colorSpace)===ft,decodeVideoTextureEmissive:ue&&S.emissiveMap.isVideoTexture===!0&&rt.getTransfer(S.emissiveMap.colorSpace)===ft,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Ft,flipSided:S.side===Tt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:L&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(L&&S.extensions.multiDraw===!0||Ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ce.vertexUv1s=c.has(1),ce.vertexUv2s=c.has(2),ce.vertexUv3s=c.has(3),c.clear(),ce}function f(S){let v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(let E in S.defines)v.push(E),v.push(S.defines[E]);return S.isRawShaderMaterial===!1&&(b(v,S),x(v,S),v.push(i.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function b(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function x(S,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),S.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),S.push(a.mask)}function g(S){let v=_[S.type],E;if(v){let P=Ln[v];E=Au.clone(P.uniforms)}else E=S.uniforms;return E}function R(S,v){let E;for(let P=0,O=h.length;P<O;P++){let Y=h[P];if(Y.cacheKey===v){E=Y,++E.usedTimes;break}}return E===void 0&&(E=new g_(i,v,S,r),h.push(E)),E}function T(S){if(--S.usedTimes===0){let v=h.indexOf(S);h[v]=h[h.length-1],h.pop(),S.destroy()}}function w(S){l.remove(S)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:g,acquireProgram:R,releaseProgram:T,releaseShaderCache:w,programs:h,dispose:C}}function y_(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function v_(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Qu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ef(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,p,_,y,m){let f=i[e];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:_,renderOrder:u.renderOrder,z:y,group:m},i[e]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=_,f.renderOrder=u.renderOrder,f.z=y,f.group=m),e++,f}function a(u,d,p,_,y,m){let f=o(u,d,p,_,y,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(u,d,p,_,y,m){let f=o(u,d,p,_,y,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,d){t.length>1&&t.sort(u||v_),n.length>1&&n.sort(d||Qu),s.length>1&&s.sort(d||Qu)}function h(){for(let u=e,d=i.length;u<d;u++){let p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function M_(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new ef,i.set(n,[o])):s>=r.length?(o=new ef,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function S_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new Ge};break;case"SpotLight":t={position:new U,direction:new U,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function b_(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ve,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var E_=0;function w_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function T_(i){let e=new S_,t=b_(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new U);let s=new U,r=new nt,o=new nt;function a(c){let h=0,u=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,_=0,y=0,m=0,f=0,b=0,x=0,g=0,R=0,T=0,w=0;c.sort(w_);for(let S=0,v=c.length;S<v;S++){let E=c[S],P=E.color,O=E.intensity,Y=E.distance,z=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)h+=P.r*O,u+=P.g*O,d+=P.b*O;else if(E.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(E.sh.coefficients[H],O);w++}else if(E.isDirectionalLight){let H=e.get(E);if(H.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){let Z=E.shadow,q=t.get(E);q.shadowIntensity=Z.intensity,q.shadowBias=Z.bias,q.shadowNormalBias=Z.normalBias,q.shadowRadius=Z.radius,q.shadowMapSize=Z.mapSize,n.directionalShadow[p]=q,n.directionalShadowMap[p]=z,n.directionalShadowMatrix[p]=E.shadow.matrix,b++}n.directional[p]=H,p++}else if(E.isSpotLight){let H=e.get(E);H.position.setFromMatrixPosition(E.matrixWorld),H.color.copy(P).multiplyScalar(O),H.distance=Y,H.coneCos=Math.cos(E.angle),H.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),H.decay=E.decay,n.spot[y]=H;let Z=E.shadow;if(E.map&&(n.spotLightMap[R]=E.map,R++,Z.updateMatrices(E),E.castShadow&&T++),n.spotLightMatrix[y]=Z.matrix,E.castShadow){let q=t.get(E);q.shadowIntensity=Z.intensity,q.shadowBias=Z.bias,q.shadowNormalBias=Z.normalBias,q.shadowRadius=Z.radius,q.shadowMapSize=Z.mapSize,n.spotShadow[y]=q,n.spotShadowMap[y]=z,g++}y++}else if(E.isRectAreaLight){let H=e.get(E);H.color.copy(P).multiplyScalar(O),H.halfWidth.set(E.width*.5,0,0),H.halfHeight.set(0,E.height*.5,0),n.rectArea[m]=H,m++}else if(E.isPointLight){let H=e.get(E);if(H.color.copy(E.color).multiplyScalar(E.intensity),H.distance=E.distance,H.decay=E.decay,E.castShadow){let Z=E.shadow,q=t.get(E);q.shadowIntensity=Z.intensity,q.shadowBias=Z.bias,q.shadowNormalBias=Z.normalBias,q.shadowRadius=Z.radius,q.shadowMapSize=Z.mapSize,q.shadowCameraNear=Z.camera.near,q.shadowCameraFar=Z.camera.far,n.pointShadow[_]=q,n.pointShadowMap[_]=z,n.pointShadowMatrix[_]=E.shadow.matrix,x++}n.point[_]=H,_++}else if(E.isHemisphereLight){let H=e.get(E);H.skyColor.copy(E.color).multiplyScalar(O),H.groundColor.copy(E.groundColor).multiplyScalar(O),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Te.LTC_FLOAT_1,n.rectAreaLTC2=Te.LTC_FLOAT_2):(n.rectAreaLTC1=Te.LTC_HALF_1,n.rectAreaLTC2=Te.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let C=n.hash;(C.directionalLength!==p||C.pointLength!==_||C.spotLength!==y||C.rectAreaLength!==m||C.hemiLength!==f||C.numDirectionalShadows!==b||C.numPointShadows!==x||C.numSpotShadows!==g||C.numSpotMaps!==R||C.numLightProbes!==w)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=_,n.hemi.length=f,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=g,n.spotShadowMap.length=g,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=g+R-T,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=w,C.directionalLength=p,C.pointLength=_,C.spotLength=y,C.rectAreaLength=m,C.hemiLength=f,C.numDirectionalShadows=b,C.numPointShadows=x,C.numSpotShadows=g,C.numSpotMaps=R,C.numLightProbes=w,n.version=E_++)}function l(c,h){let u=0,d=0,p=0,_=0,y=0,m=h.matrixWorldInverse;for(let f=0,b=c.length;f<b;f++){let x=c[f];if(x.isDirectionalLight){let g=n.directional[u];g.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(m),u++}else if(x.isSpotLight){let g=n.spot[p];g.position.setFromMatrixPosition(x.matrixWorld),g.position.applyMatrix4(m),g.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(m),p++}else if(x.isRectAreaLight){let g=n.rectArea[_];g.position.setFromMatrixPosition(x.matrixWorld),g.position.applyMatrix4(m),o.identity(),r.copy(x.matrixWorld),r.premultiply(m),o.extractRotation(r),g.halfWidth.set(x.width*.5,0,0),g.halfHeight.set(0,x.height*.5,0),g.halfWidth.applyMatrix4(o),g.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){let g=n.point[d];g.position.setFromMatrixPosition(x.matrixWorld),g.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){let g=n.hemi[y];g.direction.setFromMatrixPosition(x.matrixWorld),g.direction.transformDirection(m),y++}}}return{setup:a,setupView:l,state:n}}function tf(i){let e=new T_(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function A_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new tf(i),e.set(s,[a])):r>=o.length?(a=new tf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var R_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,C_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function I_(i,e,t){let n=new _s,s=new ve,r=new ve,o=new ct,a=new di({depthPacking:Ts}),l=new Go,c={},h=t.maxTextureSize,u={[Zt]:Tt,[Tt]:Zt,[Ft]:Ft},d=new Tn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ve},radius:{value:4}},vertexShader:R_,fragmentShader:C_}),p=d.clone();p.defines.HORIZONTAL_PASS=1;let _=new ot;_.setAttribute("position",new qe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new et(_,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Fr;let f=this.type;this.render=function(T,w,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;let S=i.getRenderTarget(),v=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),P=i.state;P.setBlending(Xn),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let O=f!==Dn&&this.type===Dn,Y=f===Dn&&this.type!==Dn;for(let z=0,H=T.length;z<H;z++){let Z=T[z],q=Z.shadow;if(q===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;s.copy(q.mapSize);let ge=q.getFrameExtents();if(s.multiply(ge),r.copy(q.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ge.x),s.x=r.x*ge.x,q.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ge.y),s.y=r.y*ge.y,q.mapSize.y=r.y)),q.map===null||O===!0||Y===!0){let Me=this.type!==Dn?{minFilter:zt,magFilter:zt}:{};q.map!==null&&q.map.dispose(),q.map=new _n(s.x,s.y,Me),q.map.texture.name=Z.name+".shadowMap",q.camera.updateProjectionMatrix()}i.setRenderTarget(q.map),i.clear();let me=q.getViewportCount();for(let Me=0;Me<me;Me++){let we=q.getViewport(Me);o.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),P.viewport(o),q.updateMatrices(Z,Me),n=q.getFrustum(),g(w,C,q.camera,Z,this.type)}q.isPointLightShadow!==!0&&this.type===Dn&&b(q,C),q.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,v,E)};function b(T,w){let C=e.update(y);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new _n(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(w,null,C,d,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(w,null,C,p,y,null)}function x(T,w,C,S){let v=null,E=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(E!==void 0)v=E;else if(v=C.isPointLight===!0?l:a,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let P=v.uuid,O=w.uuid,Y=c[P];Y===void 0&&(Y={},c[P]=Y);let z=Y[O];z===void 0&&(z=v.clone(),Y[O]=z,w.addEventListener("dispose",R)),v=z}if(v.visible=w.visible,v.wireframe=w.wireframe,S===Dn?v.side=w.shadowSide!==null?w.shadowSide:w.side:v.side=w.shadowSide!==null?w.shadowSide:u[w.side],v.alphaMap=w.alphaMap,v.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,v.map=w.map,v.clipShadows=w.clipShadows,v.clippingPlanes=w.clippingPlanes,v.clipIntersection=w.clipIntersection,v.displacementMap=w.displacementMap,v.displacementScale=w.displacementScale,v.displacementBias=w.displacementBias,v.wireframeLinewidth=w.wireframeLinewidth,v.linewidth=w.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){let P=i.properties.get(v);P.light=C}return v}function g(T,w,C,S,v){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&v===Dn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);let O=e.update(T),Y=T.material;if(Array.isArray(Y)){let z=O.groups;for(let H=0,Z=z.length;H<Z;H++){let q=z[H],ge=Y[q.materialIndex];if(ge&&ge.visible){let me=x(T,ge,S,v);T.onBeforeShadow(i,T,w,C,O,me,q),i.renderBufferDirect(C,null,O,me,T,q),T.onAfterShadow(i,T,w,C,O,me,q)}}}else if(Y.visible){let z=x(T,Y,S,v);T.onBeforeShadow(i,T,w,C,O,z,null),i.renderBufferDirect(C,null,O,z,T,null),T.onAfterShadow(i,T,w,C,O,z,null)}}let P=T.children;for(let O=0,Y=P.length;O<Y;O++)g(P[O],w,C,S,v)}function R(T){T.target.removeEventListener("dispose",R);for(let C in c){let S=c[C],v=T.target.uuid;v in S&&(S[v].dispose(),delete S[v])}}}var P_={[na]:ia,[sa]:aa,[ra]:la,[Di]:oa,[ia]:na,[aa]:sa,[la]:ra,[oa]:Di};function D_(i,e){function t(){let B=!1,le=new ct,de=null,Pe=new ct(0,0,0,0);return{setMask:function(_e){de!==_e&&!B&&(i.colorMask(_e,_e,_e,_e),de=_e)},setLocked:function(_e){B=_e},setClear:function(_e,he,L,j,ce){ce===!0&&(_e*=j,he*=j,L*=j),le.set(_e,he,L,j),Pe.equals(le)===!1&&(i.clearColor(_e,he,L,j),Pe.copy(le))},reset:function(){B=!1,de=null,Pe.set(-1,0,0,0)}}}function n(){let B=!1,le=!1,de=null,Pe=null,_e=null;return{setReversed:function(he){if(le!==he){let L=e.get("EXT_clip_control");he?L.clipControlEXT(L.LOWER_LEFT_EXT,L.ZERO_TO_ONE_EXT):L.clipControlEXT(L.LOWER_LEFT_EXT,L.NEGATIVE_ONE_TO_ONE_EXT),le=he;let j=_e;_e=null,this.setClear(j)}},getReversed:function(){return le},setTest:function(he){he?ne(i.DEPTH_TEST):Ie(i.DEPTH_TEST)},setMask:function(he){de!==he&&!B&&(i.depthMask(he),de=he)},setFunc:function(he){if(le&&(he=P_[he]),Pe!==he){switch(he){case na:i.depthFunc(i.NEVER);break;case ia:i.depthFunc(i.ALWAYS);break;case sa:i.depthFunc(i.LESS);break;case Di:i.depthFunc(i.LEQUAL);break;case ra:i.depthFunc(i.EQUAL);break;case oa:i.depthFunc(i.GEQUAL);break;case aa:i.depthFunc(i.GREATER);break;case la:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Pe=he}},setLocked:function(he){B=he},setClear:function(he){_e!==he&&(le&&(he=1-he),i.clearDepth(he),_e=he)},reset:function(){B=!1,de=null,Pe=null,_e=null,le=!1}}}function s(){let B=!1,le=null,de=null,Pe=null,_e=null,he=null,L=null,j=null,ce=null;return{setTest:function($){B||($?ne(i.STENCIL_TEST):Ie(i.STENCIL_TEST))},setMask:function($){le!==$&&!B&&(i.stencilMask($),le=$)},setFunc:function($,Re,Fe){(de!==$||Pe!==Re||_e!==Fe)&&(i.stencilFunc($,Re,Fe),de=$,Pe=Re,_e=Fe)},setOp:function($,Re,Fe){(he!==$||L!==Re||j!==Fe)&&(i.stencilOp($,Re,Fe),he=$,L=Re,j=Fe)},setLocked:function($){B=$},setClear:function($){ce!==$&&(i.clearStencil($),ce=$)},reset:function(){B=!1,le=null,de=null,Pe=null,_e=null,he=null,L=null,j=null,ce=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,p=[],_=null,y=!1,m=null,f=null,b=null,x=null,g=null,R=null,T=null,w=new Ge(0,0,0),C=0,S=!1,v=null,E=null,P=null,O=null,Y=null,z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,Z=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(q)[1]),H=Z>=1):q.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),H=Z>=2);let ge=null,me={},Me=i.getParameter(i.SCISSOR_BOX),we=i.getParameter(i.VIEWPORT),We=new ct().fromArray(Me),je=new ct().fromArray(we);function Je(B,le,de,Pe){let _e=new Uint8Array(4),he=i.createTexture();i.bindTexture(B,he),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let L=0;L<de;L++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(le,0,i.RGBA,1,1,Pe,0,i.RGBA,i.UNSIGNED_BYTE,_e):i.texImage2D(le+L,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,_e);return he}let te={};te[i.TEXTURE_2D]=Je(i.TEXTURE_2D,i.TEXTURE_2D,1),te[i.TEXTURE_CUBE_MAP]=Je(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[i.TEXTURE_2D_ARRAY]=Je(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),te[i.TEXTURE_3D]=Je(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(i.DEPTH_TEST),o.setFunc(Di),oe(!1),ie(ic),ne(i.CULL_FACE),se(Xn);function ne(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function Ie(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Ue(B,le){return u[B]!==le?(i.bindFramebuffer(B,le),u[B]=le,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=le),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=le),!0):!1}function Ae(B,le){let de=p,Pe=!1;if(B){de=d.get(le),de===void 0&&(de=[],d.set(le,de));let _e=B.textures;if(de.length!==_e.length||de[0]!==i.COLOR_ATTACHMENT0){for(let he=0,L=_e.length;he<L;he++)de[he]=i.COLOR_ATTACHMENT0+he;de.length=_e.length,Pe=!0}}else de[0]!==i.BACK&&(de[0]=i.BACK,Pe=!0);Pe&&i.drawBuffers(de)}function $e(B){return _!==B?(i.useProgram(B),_=B,!0):!1}let st={[ci]:i.FUNC_ADD,[Gh]:i.FUNC_SUBTRACT,[Wh]:i.FUNC_REVERSE_SUBTRACT};st[Xh]=i.MIN,st[qh]=i.MAX;let N={[Yh]:i.ZERO,[Zh]:i.ONE,[Jh]:i.SRC_COLOR,[Eo]:i.SRC_ALPHA,[tu]:i.SRC_ALPHA_SATURATE,[Qh]:i.DST_COLOR,[Kh]:i.DST_ALPHA,[$h]:i.ONE_MINUS_SRC_COLOR,[wo]:i.ONE_MINUS_SRC_ALPHA,[eu]:i.ONE_MINUS_DST_COLOR,[jh]:i.ONE_MINUS_DST_ALPHA,[nu]:i.CONSTANT_COLOR,[iu]:i.ONE_MINUS_CONSTANT_COLOR,[su]:i.CONSTANT_ALPHA,[ru]:i.ONE_MINUS_CONSTANT_ALPHA};function se(B,le,de,Pe,_e,he,L,j,ce,$){if(B===Xn){y===!0&&(Ie(i.BLEND),y=!1);return}if(y===!1&&(ne(i.BLEND),y=!0),B!==Vh){if(B!==m||$!==S){if((f!==ci||g!==ci)&&(i.blendEquation(i.FUNC_ADD),f=ci,g=ci),$)switch(B){case Pi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sc:i.blendFunc(i.ONE,i.ONE);break;case rc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case oc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Pi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case sc:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case rc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case oc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}b=null,x=null,R=null,T=null,w.set(0,0,0),C=0,m=B,S=$}return}_e=_e||le,he=he||de,L=L||Pe,(le!==f||_e!==g)&&(i.blendEquationSeparate(st[le],st[_e]),f=le,g=_e),(de!==b||Pe!==x||he!==R||L!==T)&&(i.blendFuncSeparate(N[de],N[Pe],N[he],N[L]),b=de,x=Pe,R=he,T=L),(j.equals(w)===!1||ce!==C)&&(i.blendColor(j.r,j.g,j.b,ce),w.copy(j),C=ce),m=B,S=!1}function re(B,le){B.side===Ft?Ie(i.CULL_FACE):ne(i.CULL_FACE);let de=B.side===Tt;le&&(de=!de),oe(de),B.blending===Pi&&B.transparent===!1?se(Xn):se(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let Pe=B.stencilWrite;a.setTest(Pe),Pe&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),ue(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ne(i.SAMPLE_ALPHA_TO_COVERAGE):Ie(i.SAMPLE_ALPHA_TO_COVERAGE)}function oe(B){v!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),v=B)}function ie(B){B!==kh?(ne(i.CULL_FACE),B!==E&&(B===ic?i.cullFace(i.BACK):B===Hh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ie(i.CULL_FACE),E=B}function ye(B){B!==P&&(H&&i.lineWidth(B),P=B)}function ue(B,le,de){B?(ne(i.POLYGON_OFFSET_FILL),(O!==le||Y!==de)&&(i.polygonOffset(le,de),O=le,Y=de)):Ie(i.POLYGON_OFFSET_FILL)}function be(B){B?ne(i.SCISSOR_TEST):Ie(i.SCISSOR_TEST)}function Be(B){B===void 0&&(B=i.TEXTURE0+z-1),ge!==B&&(i.activeTexture(B),ge=B)}function ke(B,le,de){de===void 0&&(ge===null?de=i.TEXTURE0+z-1:de=ge);let Pe=me[de];Pe===void 0&&(Pe={type:void 0,texture:void 0},me[de]=Pe),(Pe.type!==B||Pe.texture!==le)&&(ge!==de&&(i.activeTexture(de),ge=de),i.bindTexture(B,le||te[B]),Pe.type=B,Pe.texture=le)}function I(){let B=me[ge];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function M(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function X(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function D(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function k(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function F(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function V(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ae(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function pe(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ee(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function fe(B){We.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),We.copy(B))}function Le(B){je.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),je.copy(B))}function Ee(B,le){let de=c.get(le);de===void 0&&(de=new WeakMap,c.set(le,de));let Pe=de.get(B);Pe===void 0&&(Pe=i.getUniformBlockIndex(le,B.name),de.set(B,Pe))}function Se(B,le){let Pe=c.get(le).get(B);l.get(le)!==Pe&&(i.uniformBlockBinding(le,Pe,B.__bindingPointIndex),l.set(le,Pe))}function Xe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ge=null,me={},u={},d=new WeakMap,p=[],_=null,y=!1,m=null,f=null,b=null,x=null,g=null,R=null,T=null,w=new Ge(0,0,0),C=0,S=!1,v=null,E=null,P=null,O=null,Y=null,We.set(0,0,i.canvas.width,i.canvas.height),je.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ne,disable:Ie,bindFramebuffer:Ue,drawBuffers:Ae,useProgram:$e,setBlending:se,setMaterial:re,setFlipSided:oe,setCullFace:ie,setLineWidth:ye,setPolygonOffset:ue,setScissorTest:be,activeTexture:Be,bindTexture:ke,unbindTexture:I,compressedTexImage2D:M,compressedTexImage3D:X,texImage2D:pe,texImage3D:ee,updateUBOMapping:Ee,uniformBlockBinding:Se,texStorage2D:V,texStorage3D:ae,texSubImage2D:D,texSubImage3D:k,compressedTexSubImage2D:F,compressedTexSubImage3D:Q,scissor:fe,viewport:Le,reset:Xe}}function L_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ve,h=new WeakMap,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(I,M){return p?new OffscreenCanvas(I,M):lr("canvas")}function y(I,M,X){let D=1,k=ke(I);if((k.width>X||k.height>X)&&(D=X/Math.max(k.width,k.height)),D<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let F=Math.floor(D*k.width),Q=Math.floor(D*k.height);u===void 0&&(u=_(F,Q));let V=M?_(F,Q):u;return V.width=F,V.height=Q,V.getContext("2d").drawImage(I,0,0,F,Q),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+k.width+"x"+k.height+") to ("+F+"x"+Q+")."),V}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+k.width+"x"+k.height+")."),I;return I}function m(I){return I.generateMipmaps}function f(I){i.generateMipmap(I)}function b(I){return I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?i.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(I,M,X,D,k=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let F=M;if(M===i.RED&&(X===i.FLOAT&&(F=i.R32F),X===i.HALF_FLOAT&&(F=i.R16F),X===i.UNSIGNED_BYTE&&(F=i.R8)),M===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(F=i.R8UI),X===i.UNSIGNED_SHORT&&(F=i.R16UI),X===i.UNSIGNED_INT&&(F=i.R32UI),X===i.BYTE&&(F=i.R8I),X===i.SHORT&&(F=i.R16I),X===i.INT&&(F=i.R32I)),M===i.RG&&(X===i.FLOAT&&(F=i.RG32F),X===i.HALF_FLOAT&&(F=i.RG16F),X===i.UNSIGNED_BYTE&&(F=i.RG8)),M===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(F=i.RG8UI),X===i.UNSIGNED_SHORT&&(F=i.RG16UI),X===i.UNSIGNED_INT&&(F=i.RG32UI),X===i.BYTE&&(F=i.RG8I),X===i.SHORT&&(F=i.RG16I),X===i.INT&&(F=i.RG32I)),M===i.RGB_INTEGER&&(X===i.UNSIGNED_BYTE&&(F=i.RGB8UI),X===i.UNSIGNED_SHORT&&(F=i.RGB16UI),X===i.UNSIGNED_INT&&(F=i.RGB32UI),X===i.BYTE&&(F=i.RGB8I),X===i.SHORT&&(F=i.RGB16I),X===i.INT&&(F=i.RGB32I)),M===i.RGBA_INTEGER&&(X===i.UNSIGNED_BYTE&&(F=i.RGBA8UI),X===i.UNSIGNED_SHORT&&(F=i.RGBA16UI),X===i.UNSIGNED_INT&&(F=i.RGBA32UI),X===i.BYTE&&(F=i.RGBA8I),X===i.SHORT&&(F=i.RGBA16I),X===i.INT&&(F=i.RGBA32I)),M===i.RGB&&(X===i.UNSIGNED_INT_5_9_9_9_REV&&(F=i.RGB9_E5),X===i.UNSIGNED_INT_10F_11F_11F_REV&&(F=i.R11F_G11F_B10F)),M===i.RGBA){let Q=k?or:rt.getTransfer(D);X===i.FLOAT&&(F=i.RGBA32F),X===i.HALF_FLOAT&&(F=i.RGBA16F),X===i.UNSIGNED_BYTE&&(F=Q===ft?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT_4_4_4_4&&(F=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(F=i.RGB5_A1)}return(F===i.R16F||F===i.R32F||F===i.RG16F||F===i.RG32F||F===i.RGBA16F||F===i.RGBA32F)&&e.get("EXT_color_buffer_float"),F}function g(I,M){let X;return I?M===null||M===_i||M===Es?X=i.DEPTH24_STENCIL8:M===cn?X=i.DEPTH32F_STENCIL8:M===Ss&&(X=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===_i||M===Es?X=i.DEPTH_COMPONENT24:M===cn?X=i.DEPTH_COMPONENT32F:M===Ss&&(X=i.DEPTH_COMPONENT16),X}function R(I,M){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==zt&&I.minFilter!==Jt?Math.log2(Math.max(M.width,M.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?M.mipmaps.length:1}function T(I){let M=I.target;M.removeEventListener("dispose",T),C(M),M.isVideoTexture&&h.delete(M)}function w(I){let M=I.target;M.removeEventListener("dispose",w),v(M)}function C(I){let M=n.get(I);if(M.__webglInit===void 0)return;let X=I.source,D=d.get(X);if(D){let k=D[M.__cacheKey];k.usedTimes--,k.usedTimes===0&&S(I),Object.keys(D).length===0&&d.delete(X)}n.remove(I)}function S(I){let M=n.get(I);i.deleteTexture(M.__webglTexture);let X=I.source,D=d.get(X);delete D[M.__cacheKey],o.memory.textures--}function v(I){let M=n.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),n.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let D=0;D<6;D++){if(Array.isArray(M.__webglFramebuffer[D]))for(let k=0;k<M.__webglFramebuffer[D].length;k++)i.deleteFramebuffer(M.__webglFramebuffer[D][k]);else i.deleteFramebuffer(M.__webglFramebuffer[D]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[D])}else{if(Array.isArray(M.__webglFramebuffer))for(let D=0;D<M.__webglFramebuffer.length;D++)i.deleteFramebuffer(M.__webglFramebuffer[D]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let D=0;D<M.__webglColorRenderbuffer.length;D++)M.__webglColorRenderbuffer[D]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[D]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}let X=I.textures;for(let D=0,k=X.length;D<k;D++){let F=n.get(X[D]);F.__webglTexture&&(i.deleteTexture(F.__webglTexture),o.memory.textures--),n.remove(X[D])}n.remove(I)}let E=0;function P(){E=0}function O(){let I=E;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),E+=1,I}function Y(I){let M=[];return M.push(I.wrapS),M.push(I.wrapT),M.push(I.wrapR||0),M.push(I.magFilter),M.push(I.minFilter),M.push(I.anisotropy),M.push(I.internalFormat),M.push(I.format),M.push(I.type),M.push(I.generateMipmaps),M.push(I.premultiplyAlpha),M.push(I.flipY),M.push(I.unpackAlignment),M.push(I.colorSpace),M.join()}function z(I,M){let X=n.get(I);if(I.isVideoTexture&&be(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&X.__version!==I.version){let D=I.image;if(D===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(D.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{te(X,I,M);return}}else I.isExternalTexture&&(X.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+M)}function H(I,M){let X=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&X.__version!==I.version){te(X,I,M);return}t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+M)}function Z(I,M){let X=n.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&X.__version!==I.version){te(X,I,M);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+M)}function q(I,M){let X=n.get(I);if(I.version>0&&X.__version!==I.version){ne(X,I,M);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+M)}let ge={[To]:i.REPEAT,[li]:i.CLAMP_TO_EDGE,[Ao]:i.MIRRORED_REPEAT},me={[zt]:i.NEAREST,[pu]:i.NEAREST_MIPMAP_NEAREST,[Br]:i.NEAREST_MIPMAP_LINEAR,[Jt]:i.LINEAR,[da]:i.LINEAR_MIPMAP_NEAREST,[gi]:i.LINEAR_MIPMAP_LINEAR},Me={[_u]:i.NEVER,[bu]:i.ALWAYS,[xu]:i.LESS,[mc]:i.LEQUAL,[yu]:i.EQUAL,[Su]:i.GEQUAL,[vu]:i.GREATER,[Mu]:i.NOTEQUAL};function we(I,M){if(M.type===cn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Jt||M.magFilter===da||M.magFilter===Br||M.magFilter===gi||M.minFilter===Jt||M.minFilter===da||M.minFilter===Br||M.minFilter===gi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,ge[M.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,ge[M.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,ge[M.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,me[M.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,me[M.minFilter]),M.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,Me[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===zt||M.minFilter!==Br&&M.minFilter!==gi||M.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){let X=e.get("EXT_texture_filter_anisotropic");i.texParameterf(I,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function We(I,M){let X=!1;I.__webglInit===void 0&&(I.__webglInit=!0,M.addEventListener("dispose",T));let D=M.source,k=d.get(D);k===void 0&&(k={},d.set(D,k));let F=Y(M);if(F!==I.__cacheKey){k[F]===void 0&&(k[F]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,X=!0),k[F].usedTimes++;let Q=k[I.__cacheKey];Q!==void 0&&(k[I.__cacheKey].usedTimes--,Q.usedTimes===0&&S(M)),I.__cacheKey=F,I.__webglTexture=k[F].texture}return X}function je(I,M,X){return Math.floor(Math.floor(I/X)/M)}function Je(I,M,X,D){let F=I.updateRanges;if(F.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,M.width,M.height,X,D,M.data);else{F.sort((ee,fe)=>ee.start-fe.start);let Q=0;for(let ee=1;ee<F.length;ee++){let fe=F[Q],Le=F[ee],Ee=fe.start+fe.count,Se=je(Le.start,M.width,4),Xe=je(fe.start,M.width,4);Le.start<=Ee+1&&Se===Xe&&je(Le.start+Le.count-1,M.width,4)===Se?fe.count=Math.max(fe.count,Le.start+Le.count-fe.start):(++Q,F[Q]=Le)}F.length=Q+1;let V=i.getParameter(i.UNPACK_ROW_LENGTH),ae=i.getParameter(i.UNPACK_SKIP_PIXELS),pe=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,M.width);for(let ee=0,fe=F.length;ee<fe;ee++){let Le=F[ee],Ee=Math.floor(Le.start/4),Se=Math.ceil(Le.count/4),Xe=Ee%M.width,B=Math.floor(Ee/M.width),le=Se,de=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Xe),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),t.texSubImage2D(i.TEXTURE_2D,0,Xe,B,le,de,X,D,M.data)}I.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,V),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ae),i.pixelStorei(i.UNPACK_SKIP_ROWS,pe)}}function te(I,M,X){let D=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(D=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(D=i.TEXTURE_3D);let k=We(I,M),F=M.source;t.bindTexture(D,I.__webglTexture,i.TEXTURE0+X);let Q=n.get(F);if(F.version!==Q.__version||k===!0){t.activeTexture(i.TEXTURE0+X);let V=rt.getPrimaries(rt.workingColorSpace),ae=M.colorSpace===Yn?null:rt.getPrimaries(M.colorSpace),pe=M.colorSpace===Yn||V===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe);let ee=y(M.image,!1,s.maxTextureSize);ee=Be(M,ee);let fe=r.convert(M.format,M.colorSpace),Le=r.convert(M.type),Ee=x(M.internalFormat,fe,Le,M.colorSpace,M.isVideoTexture);we(D,M);let Se,Xe=M.mipmaps,B=M.isVideoTexture!==!0,le=Q.__version===void 0||k===!0,de=F.dataReady,Pe=R(M,ee);if(M.isDepthTexture)Ee=g(M.format===ws,M.type),le&&(B?t.texStorage2D(i.TEXTURE_2D,1,Ee,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,Ee,ee.width,ee.height,0,fe,Le,null));else if(M.isDataTexture)if(Xe.length>0){B&&le&&t.texStorage2D(i.TEXTURE_2D,Pe,Ee,Xe[0].width,Xe[0].height);for(let _e=0,he=Xe.length;_e<he;_e++)Se=Xe[_e],B?de&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Se.width,Se.height,fe,Le,Se.data):t.texImage2D(i.TEXTURE_2D,_e,Ee,Se.width,Se.height,0,fe,Le,Se.data);M.generateMipmaps=!1}else B?(le&&t.texStorage2D(i.TEXTURE_2D,Pe,Ee,ee.width,ee.height),de&&Je(M,ee,fe,Le)):t.texImage2D(i.TEXTURE_2D,0,Ee,ee.width,ee.height,0,fe,Le,ee.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){B&&le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Pe,Ee,Xe[0].width,Xe[0].height,ee.depth);for(let _e=0,he=Xe.length;_e<he;_e++)if(Se=Xe[_e],M.format!==$t)if(fe!==null)if(B){if(de)if(M.layerUpdates.size>0){let L=Sc(Se.width,Se.height,M.format,M.type);for(let j of M.layerUpdates){let ce=Se.data.subarray(j*L/Se.data.BYTES_PER_ELEMENT,(j+1)*L/Se.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,j,Se.width,Se.height,1,fe,ce)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Se.width,Se.height,ee.depth,fe,Se.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,_e,Ee,Se.width,Se.height,ee.depth,0,Se.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?de&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,_e,0,0,0,Se.width,Se.height,ee.depth,fe,Le,Se.data):t.texImage3D(i.TEXTURE_2D_ARRAY,_e,Ee,Se.width,Se.height,ee.depth,0,fe,Le,Se.data)}else{B&&le&&t.texStorage2D(i.TEXTURE_2D,Pe,Ee,Xe[0].width,Xe[0].height);for(let _e=0,he=Xe.length;_e<he;_e++)Se=Xe[_e],M.format!==$t?fe!==null?B?de&&t.compressedTexSubImage2D(i.TEXTURE_2D,_e,0,0,Se.width,Se.height,fe,Se.data):t.compressedTexImage2D(i.TEXTURE_2D,_e,Ee,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?de&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,Se.width,Se.height,fe,Le,Se.data):t.texImage2D(i.TEXTURE_2D,_e,Ee,Se.width,Se.height,0,fe,Le,Se.data)}else if(M.isDataArrayTexture)if(B){if(le&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Pe,Ee,ee.width,ee.height,ee.depth),de)if(M.layerUpdates.size>0){let _e=Sc(ee.width,ee.height,M.format,M.type);for(let he of M.layerUpdates){let L=ee.data.subarray(he*_e/ee.data.BYTES_PER_ELEMENT,(he+1)*_e/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,he,ee.width,ee.height,1,fe,Le,L)}M.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,fe,Le,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,ee.width,ee.height,ee.depth,0,fe,Le,ee.data);else if(M.isData3DTexture)B?(le&&t.texStorage3D(i.TEXTURE_3D,Pe,Ee,ee.width,ee.height,ee.depth),de&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,fe,Le,ee.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,ee.width,ee.height,ee.depth,0,fe,Le,ee.data);else if(M.isFramebufferTexture){if(le)if(B)t.texStorage2D(i.TEXTURE_2D,Pe,Ee,ee.width,ee.height);else{let _e=ee.width,he=ee.height;for(let L=0;L<Pe;L++)t.texImage2D(i.TEXTURE_2D,L,Ee,_e,he,0,fe,Le,null),_e>>=1,he>>=1}}else if(Xe.length>0){if(B&&le){let _e=ke(Xe[0]);t.texStorage2D(i.TEXTURE_2D,Pe,Ee,_e.width,_e.height)}for(let _e=0,he=Xe.length;_e<he;_e++)Se=Xe[_e],B?de&&t.texSubImage2D(i.TEXTURE_2D,_e,0,0,fe,Le,Se):t.texImage2D(i.TEXTURE_2D,_e,Ee,fe,Le,Se);M.generateMipmaps=!1}else if(B){if(le){let _e=ke(ee);t.texStorage2D(i.TEXTURE_2D,Pe,Ee,_e.width,_e.height)}de&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,fe,Le,ee)}else t.texImage2D(i.TEXTURE_2D,0,Ee,fe,Le,ee);m(M)&&f(D),Q.__version=F.version,M.onUpdate&&M.onUpdate(M)}I.__version=M.version}function ne(I,M,X){if(M.image.length!==6)return;let D=We(I,M),k=M.source;t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+X);let F=n.get(k);if(k.version!==F.__version||D===!0){t.activeTexture(i.TEXTURE0+X);let Q=rt.getPrimaries(rt.workingColorSpace),V=M.colorSpace===Yn?null:rt.getPrimaries(M.colorSpace),ae=M.colorSpace===Yn||Q===V?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);let pe=M.isCompressedTexture||M.image[0].isCompressedTexture,ee=M.image[0]&&M.image[0].isDataTexture,fe=[];for(let he=0;he<6;he++)!pe&&!ee?fe[he]=y(M.image[he],!0,s.maxCubemapSize):fe[he]=ee?M.image[he].image:M.image[he],fe[he]=Be(M,fe[he]);let Le=fe[0],Ee=r.convert(M.format,M.colorSpace),Se=r.convert(M.type),Xe=x(M.internalFormat,Ee,Se,M.colorSpace),B=M.isVideoTexture!==!0,le=F.__version===void 0||D===!0,de=k.dataReady,Pe=R(M,Le);we(i.TEXTURE_CUBE_MAP,M);let _e;if(pe){B&&le&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Pe,Xe,Le.width,Le.height);for(let he=0;he<6;he++){_e=fe[he].mipmaps;for(let L=0;L<_e.length;L++){let j=_e[L];M.format!==$t?Ee!==null?B?de&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L,0,0,j.width,j.height,Ee,j.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L,Xe,j.width,j.height,0,j.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L,0,0,j.width,j.height,Ee,Se,j.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L,Xe,j.width,j.height,0,Ee,Se,j.data)}}}else{if(_e=M.mipmaps,B&&le){_e.length>0&&Pe++;let he=ke(fe[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Pe,Xe,he.width,he.height)}for(let he=0;he<6;he++)if(ee){B?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,fe[he].width,fe[he].height,Ee,Se,fe[he].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,Xe,fe[he].width,fe[he].height,0,Ee,Se,fe[he].data);for(let L=0;L<_e.length;L++){let ce=_e[L].image[he].image;B?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L+1,0,0,ce.width,ce.height,Ee,Se,ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L+1,Xe,ce.width,ce.height,0,Ee,Se,ce.data)}}else{B?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,0,0,Ee,Se,fe[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,Xe,Ee,Se,fe[he]);for(let L=0;L<_e.length;L++){let j=_e[L];B?de&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L+1,0,0,Ee,Se,j.image[he]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+he,L+1,Xe,Ee,Se,j.image[he])}}}m(M)&&f(i.TEXTURE_CUBE_MAP),F.__version=k.version,M.onUpdate&&M.onUpdate(M)}I.__version=M.version}function Ie(I,M,X,D,k,F){let Q=r.convert(X.format,X.colorSpace),V=r.convert(X.type),ae=x(X.internalFormat,Q,V,X.colorSpace),pe=n.get(M),ee=n.get(X);if(ee.__renderTarget=M,!pe.__hasExternalTextures){let fe=Math.max(1,M.width>>F),Le=Math.max(1,M.height>>F);k===i.TEXTURE_3D||k===i.TEXTURE_2D_ARRAY?t.texImage3D(k,F,ae,fe,Le,M.depth,0,Q,V,null):t.texImage2D(k,F,ae,fe,Le,0,Q,V,null)}t.bindFramebuffer(i.FRAMEBUFFER,I),ue(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,D,k,ee.__webglTexture,0,ye(M)):(k===i.TEXTURE_2D||k>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&k<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,D,k,ee.__webglTexture,F),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(I,M,X){if(i.bindRenderbuffer(i.RENDERBUFFER,I),M.depthBuffer){let D=M.depthTexture,k=D&&D.isDepthTexture?D.type:null,F=g(M.stencilBuffer,k),Q=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,V=ye(M);ue(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,V,F,M.width,M.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,V,F,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,F,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,I)}else{let D=M.textures;for(let k=0;k<D.length;k++){let F=D[k],Q=r.convert(F.format,F.colorSpace),V=r.convert(F.type),ae=x(F.internalFormat,Q,V,F.colorSpace),pe=ye(M);X&&ue(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,pe,ae,M.width,M.height):ue(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,pe,ae,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ae,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ae(I,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,I),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let D=n.get(M.depthTexture);D.__renderTarget=M,(!D.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),z(M.depthTexture,0);let k=D.__webglTexture,F=ye(M);if(M.depthTexture.format===ds)ue(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,k,0,F):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,k,0);else if(M.depthTexture.format===ws)ue(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,k,0,F):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,k,0);else throw new Error("Unknown depthTexture format")}function $e(I){let M=n.get(I),X=I.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==I.depthTexture){let D=I.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),D){let k=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,D.removeEventListener("dispose",k)};D.addEventListener("dispose",k),M.__depthDisposeCallback=k}M.__boundDepthTexture=D}if(I.depthTexture&&!M.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");let D=I.texture.mipmaps;D&&D.length>0?Ae(M.__webglFramebuffer[0],I):Ae(M.__webglFramebuffer,I)}else if(X){M.__webglDepthbuffer=[];for(let D=0;D<6;D++)if(t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[D]),M.__webglDepthbuffer[D]===void 0)M.__webglDepthbuffer[D]=i.createRenderbuffer(),Ue(M.__webglDepthbuffer[D],I,!1);else{let k=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,F=M.__webglDepthbuffer[D];i.bindRenderbuffer(i.RENDERBUFFER,F),i.framebufferRenderbuffer(i.FRAMEBUFFER,k,i.RENDERBUFFER,F)}}else{let D=I.texture.mipmaps;if(D&&D.length>0?t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=i.createRenderbuffer(),Ue(M.__webglDepthbuffer,I,!1);else{let k=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,F=M.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,F),i.framebufferRenderbuffer(i.FRAMEBUFFER,k,i.RENDERBUFFER,F)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function st(I,M,X){let D=n.get(I);M!==void 0&&Ie(D.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&$e(I)}function N(I){let M=I.texture,X=n.get(I),D=n.get(M);I.addEventListener("dispose",w);let k=I.textures,F=I.isWebGLCubeRenderTarget===!0,Q=k.length>1;if(Q||(D.__webglTexture===void 0&&(D.__webglTexture=i.createTexture()),D.__version=M.version,o.memory.textures++),F){X.__webglFramebuffer=[];for(let V=0;V<6;V++)if(M.mipmaps&&M.mipmaps.length>0){X.__webglFramebuffer[V]=[];for(let ae=0;ae<M.mipmaps.length;ae++)X.__webglFramebuffer[V][ae]=i.createFramebuffer()}else X.__webglFramebuffer[V]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){X.__webglFramebuffer=[];for(let V=0;V<M.mipmaps.length;V++)X.__webglFramebuffer[V]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(Q)for(let V=0,ae=k.length;V<ae;V++){let pe=n.get(k[V]);pe.__webglTexture===void 0&&(pe.__webglTexture=i.createTexture(),o.memory.textures++)}if(I.samples>0&&ue(I)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let V=0;V<k.length;V++){let ae=k[V];X.__webglColorRenderbuffer[V]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[V]);let pe=r.convert(ae.format,ae.colorSpace),ee=r.convert(ae.type),fe=x(ae.internalFormat,pe,ee,ae.colorSpace,I.isXRRenderTarget===!0),Le=ye(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Le,fe,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+V,i.RENDERBUFFER,X.__webglColorRenderbuffer[V])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),Ue(X.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(F){t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture),we(i.TEXTURE_CUBE_MAP,M);for(let V=0;V<6;V++)if(M.mipmaps&&M.mipmaps.length>0)for(let ae=0;ae<M.mipmaps.length;ae++)Ie(X.__webglFramebuffer[V][ae],I,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+V,ae);else Ie(X.__webglFramebuffer[V],I,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0);m(M)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Q){for(let V=0,ae=k.length;V<ae;V++){let pe=k[V],ee=n.get(pe),fe=i.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(fe=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(fe,ee.__webglTexture),we(fe,pe),Ie(X.__webglFramebuffer,I,pe,i.COLOR_ATTACHMENT0+V,fe,0),m(pe)&&f(fe)}t.unbindTexture()}else{let V=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(V=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(V,D.__webglTexture),we(V,M),M.mipmaps&&M.mipmaps.length>0)for(let ae=0;ae<M.mipmaps.length;ae++)Ie(X.__webglFramebuffer[ae],I,M,i.COLOR_ATTACHMENT0,V,ae);else Ie(X.__webglFramebuffer,I,M,i.COLOR_ATTACHMENT0,V,0);m(M)&&f(V),t.unbindTexture()}I.depthBuffer&&$e(I)}function se(I){let M=I.textures;for(let X=0,D=M.length;X<D;X++){let k=M[X];if(m(k)){let F=b(I),Q=n.get(k).__webglTexture;t.bindTexture(F,Q),f(F),t.unbindTexture()}}}let re=[],oe=[];function ie(I){if(I.samples>0){if(ue(I)===!1){let M=I.textures,X=I.width,D=I.height,k=i.COLOR_BUFFER_BIT,F=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=n.get(I),V=M.length>1;if(V)for(let pe=0;pe<M.length;pe++)t.bindFramebuffer(i.FRAMEBUFFER,Q.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Q.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Q.__webglMultisampledFramebuffer);let ae=I.texture.mipmaps;ae&&ae.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Q.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Q.__webglFramebuffer);for(let pe=0;pe<M.length;pe++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(k|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(k|=i.STENCIL_BUFFER_BIT)),V){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Q.__webglColorRenderbuffer[pe]);let ee=n.get(M[pe]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ee,0)}i.blitFramebuffer(0,0,X,D,0,0,X,D,k,i.NEAREST),l===!0&&(re.length=0,oe.length=0,re.push(i.COLOR_ATTACHMENT0+pe),I.depthBuffer&&I.resolveDepthBuffer===!1&&(re.push(F),oe.push(F),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,oe)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,re))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),V)for(let pe=0;pe<M.length;pe++){t.bindFramebuffer(i.FRAMEBUFFER,Q.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.RENDERBUFFER,Q.__webglColorRenderbuffer[pe]);let ee=n.get(M[pe]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Q.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+pe,i.TEXTURE_2D,ee,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Q.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){let M=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function ye(I){return Math.min(s.maxSamples,I.samples)}function ue(I){let M=n.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function be(I){let M=o.render.frame;h.get(I)!==M&&(h.set(I,M),I.update())}function Be(I,M){let X=I.colorSpace,D=I.format,k=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||X!==Li&&X!==Yn&&(rt.getTransfer(X)===ft?(D!==$t||k!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),M}function ke(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=P,this.setTexture2D=z,this.setTexture2DArray=H,this.setTexture3D=Z,this.setTextureCube=q,this.rebindTextures=st,this.setupRenderTarget=N,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=ie,this.setupDepthRenderbuffer=$e,this.setupFrameBufferTexture=Ie,this.useMultisampledRTT=ue}function U_(i,e){function t(n,s=Yn){let r,o=rt.getTransfer(s);if(n===Rn)return i.UNSIGNED_BYTE;if(n===ma)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ga)return i.UNSIGNED_SHORT_5_5_5_1;if(n===hc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===uc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===lc)return i.BYTE;if(n===cc)return i.SHORT;if(n===Ss)return i.UNSIGNED_SHORT;if(n===pa)return i.INT;if(n===_i)return i.UNSIGNED_INT;if(n===cn)return i.FLOAT;if(n===bs)return i.HALF_FLOAT;if(n===fc)return i.ALPHA;if(n===dc)return i.RGB;if(n===$t)return i.RGBA;if(n===ds)return i.DEPTH_COMPONENT;if(n===ws)return i.DEPTH_STENCIL;if(n===_a)return i.RED;if(n===xa)return i.RED_INTEGER;if(n===pc)return i.RG;if(n===ya)return i.RG_INTEGER;if(n===va)return i.RGBA_INTEGER;if(n===zr||n===kr||n===Hr||n===Vr)if(o===ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Hr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ma||n===Sa||n===ba||n===Ea)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ma)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Sa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ba)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ea)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===wa||n===Ta||n===Aa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===wa||n===Ta)return o===ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Aa)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ra||n===Ca||n===Ia||n===Pa||n===Da||n===La||n===Ua||n===Na||n===Fa||n===Oa||n===Ba||n===za||n===ka||n===Ha)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ra)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ca)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ia)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Pa)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Da)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===La)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ua)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Na)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Fa)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Oa)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ba)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===za)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ka)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ha)return o===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Va||n===Ga||n===Wa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Va)return o===ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ga)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Wa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Xa||n===qa||n===Ya||n===Za)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Xa)return r.COMPRESSED_RED_RGTC1_EXT;if(n===qa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ya)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Za)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var N_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,F_=`
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

}`,Nc=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new xr(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Tn({vertexShader:N_,fragmentShader:F_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new et(new Oi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Fc=class extends Hn{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,p=null,_=null,y=typeof XRWebGLBinding<"u",m=new Nc,f={},b=t.getContextAttributes(),x=null,g=null,R=[],T=[],w=new ve,C=null,S=new Lt;S.viewport=new ct;let v=new Lt;v.viewport=new ct;let E=[S,v],P=new ea,O=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(te){let ne=R[te];return ne===void 0&&(ne=new gs,R[te]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(te){let ne=R[te];return ne===void 0&&(ne=new gs,R[te]=ne),ne.getGripSpace()},this.getHand=function(te){let ne=R[te];return ne===void 0&&(ne=new gs,R[te]=ne),ne.getHandSpace()};function z(te){let ne=T.indexOf(te.inputSource);if(ne===-1)return;let Ie=R[ne];Ie!==void 0&&(Ie.update(te.inputSource,te.frame,c||o),Ie.dispatchEvent({type:te.type,data:te.inputSource}))}function H(){s.removeEventListener("select",z),s.removeEventListener("selectstart",z),s.removeEventListener("selectend",z),s.removeEventListener("squeeze",z),s.removeEventListener("squeezestart",z),s.removeEventListener("squeezeend",z),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",Z);for(let te=0;te<R.length;te++){let ne=T[te];ne!==null&&(T[te]=null,R[te].disconnect(ne))}O=null,Y=null,m.reset();for(let te in f)delete f[te];e.setRenderTarget(x),p=null,d=null,u=null,s=null,g=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(te){r=te,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(te){a=te,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(te){c=te},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(te){if(s=te,s!==null){if(x=e.getRenderTarget(),s.addEventListener("select",z),s.addEventListener("selectstart",z),s.addEventListener("selectend",z),s.addEventListener("squeeze",z),s.addEventListener("squeezestart",z),s.addEventListener("squeezeend",z),s.addEventListener("end",H),s.addEventListener("inputsourceschange",Z),b.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(w),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ie=null,Ue=null,Ae=null;b.depth&&(Ae=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Ie=b.stencil?ws:ds,Ue=b.stencil?Es:_i);let $e={colorFormat:t.RGBA8,depthFormat:Ae,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer($e),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),g=new _n(d.textureWidth,d.textureHeight,{format:$t,type:Rn,depthTexture:new _r(d.textureWidth,d.textureHeight,Ue,void 0,void 0,void 0,void 0,void 0,void 0,Ie),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{let Ie={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,Ie),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new _n(p.framebufferWidth,p.framebufferHeight,{format:$t,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Je.setContext(s),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Z(te){for(let ne=0;ne<te.removed.length;ne++){let Ie=te.removed[ne],Ue=T.indexOf(Ie);Ue>=0&&(T[Ue]=null,R[Ue].disconnect(Ie))}for(let ne=0;ne<te.added.length;ne++){let Ie=te.added[ne],Ue=T.indexOf(Ie);if(Ue===-1){for(let $e=0;$e<R.length;$e++)if($e>=T.length){T.push(Ie),Ue=$e;break}else if(T[$e]===null){T[$e]=Ie,Ue=$e;break}if(Ue===-1)break}let Ae=R[Ue];Ae&&Ae.connect(Ie)}}let q=new U,ge=new U;function me(te,ne,Ie){q.setFromMatrixPosition(ne.matrixWorld),ge.setFromMatrixPosition(Ie.matrixWorld);let Ue=q.distanceTo(ge),Ae=ne.projectionMatrix.elements,$e=Ie.projectionMatrix.elements,st=Ae[14]/(Ae[10]-1),N=Ae[14]/(Ae[10]+1),se=(Ae[9]+1)/Ae[5],re=(Ae[9]-1)/Ae[5],oe=(Ae[8]-1)/Ae[0],ie=($e[8]+1)/$e[0],ye=st*oe,ue=st*ie,be=Ue/(-oe+ie),Be=be*-oe;if(ne.matrixWorld.decompose(te.position,te.quaternion,te.scale),te.translateX(Be),te.translateZ(be),te.matrixWorld.compose(te.position,te.quaternion,te.scale),te.matrixWorldInverse.copy(te.matrixWorld).invert(),Ae[10]===-1)te.projectionMatrix.copy(ne.projectionMatrix),te.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let ke=st+be,I=N+be,M=ye-Be,X=ue+(Ue-Be),D=se*N/I*ke,k=re*N/I*ke;te.projectionMatrix.makePerspective(M,X,D,k,ke,I),te.projectionMatrixInverse.copy(te.projectionMatrix).invert()}}function Me(te,ne){ne===null?te.matrixWorld.copy(te.matrix):te.matrixWorld.multiplyMatrices(ne.matrixWorld,te.matrix),te.matrixWorldInverse.copy(te.matrixWorld).invert()}this.updateCamera=function(te){if(s===null)return;let ne=te.near,Ie=te.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(Ie=m.depthFar)),P.near=v.near=S.near=ne,P.far=v.far=S.far=Ie,(O!==P.near||Y!==P.far)&&(s.updateRenderState({depthNear:P.near,depthFar:P.far}),O=P.near,Y=P.far),P.layers.mask=te.layers.mask|6,S.layers.mask=P.layers.mask&3,v.layers.mask=P.layers.mask&5;let Ue=te.parent,Ae=P.cameras;Me(P,Ue);for(let $e=0;$e<Ae.length;$e++)Me(Ae[$e],Ue);Ae.length===2?me(P,S,v):P.projectionMatrix.copy(S.projectionMatrix),we(te,P,Ue)};function we(te,ne,Ie){Ie===null?te.matrix.copy(ne.matrixWorld):(te.matrix.copy(Ie.matrixWorld),te.matrix.invert(),te.matrix.multiply(ne.matrixWorld)),te.matrix.decompose(te.position,te.quaternion,te.scale),te.updateMatrixWorld(!0),te.projectionMatrix.copy(ne.projectionMatrix),te.projectionMatrixInverse.copy(ne.projectionMatrixInverse),te.isPerspectiveCamera&&(te.fov=Co*2*Math.atan(1/te.projectionMatrix.elements[5]),te.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(te){l=te,d!==null&&(d.fixedFoveation=te),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=te)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(P)},this.getCameraTexture=function(te){return f[te]};let We=null;function je(te,ne){if(h=ne.getViewerPose(c||o),_=ne,h!==null){let Ie=h.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let Ue=!1;Ie.length!==P.cameras.length&&(P.cameras.length=0,Ue=!0);for(let N=0;N<Ie.length;N++){let se=Ie[N],re=null;if(p!==null)re=p.getViewport(se);else{let ie=u.getViewSubImage(d,se);re=ie.viewport,N===0&&(e.setRenderTargetTextures(g,ie.colorTexture,ie.depthStencilTexture),e.setRenderTarget(g))}let oe=E[N];oe===void 0&&(oe=new Lt,oe.layers.enable(N),oe.viewport=new ct,E[N]=oe),oe.matrix.fromArray(se.transform.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale),oe.projectionMatrix.fromArray(se.projectionMatrix),oe.projectionMatrixInverse.copy(oe.projectionMatrix).invert(),oe.viewport.set(re.x,re.y,re.width,re.height),N===0&&(P.matrix.copy(oe.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),Ue===!0&&P.cameras.push(oe)}let Ae=s.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&y){u=n.getBinding();let N=u.getDepthInformation(Ie[0]);N&&N.isValid&&N.texture&&m.init(N,s.renderState)}if(Ae&&Ae.includes("camera-access")&&y){e.state.unbindTexture(),u=n.getBinding();for(let N=0;N<Ie.length;N++){let se=Ie[N].camera;if(se){let re=f[se];re||(re=new xr,f[se]=re);let oe=u.getCameraImage(se);re.sourceTexture=oe}}}}for(let Ie=0;Ie<R.length;Ie++){let Ue=T[Ie],Ae=R[Ie];Ue!==null&&Ae!==void 0&&Ae.update(Ue,ne,c||o)}We&&We(te,ne),ne.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ne}),_=null}let Je=new nf;Je.setAnimationLoop(je),this.setAnimationLoop=function(te){We=te},this.dispose=function(){}}},Gi=new xn,O_=new nt;function B_(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,xc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,b,x,g){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),u(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,g)):f.isMeshMatcapMaterial?(r(m,f),_(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),y(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,b,x):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Tt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Tt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);let b=e.get(f),x=b.envMap,g=b.envMapRotation;x&&(m.envMap.value=x,Gi.copy(g),Gi.x*=-1,Gi.y*=-1,Gi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Gi.y*=-1,Gi.z*=-1),m.envMapRotation.value.setFromMatrix4(O_.makeRotationFromEuler(Gi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,b,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*b,m.scale.value=x*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,b){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Tt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function _(m,f){f.matcap&&(m.matcap.value=f.matcap)}function y(m,f){let b=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function z_(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,x){let g=x.program;n.uniformBlockBinding(b,g)}function c(b,x){let g=s[b.id];g===void 0&&(_(b),g=h(b),s[b.id]=g,b.addEventListener("dispose",m));let R=x.program;n.updateUBOMapping(b,R);let T=e.render.frame;r[b.id]!==T&&(d(b),r[b.id]=T)}function h(b){let x=u();b.__bindingPointIndex=x;let g=i.createBuffer(),R=b.__size,T=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,g),i.bufferData(i.UNIFORM_BUFFER,R,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,g),g}function u(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let x=s[b.id],g=b.uniforms,R=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let T=0,w=g.length;T<w;T++){let C=Array.isArray(g[T])?g[T]:[g[T]];for(let S=0,v=C.length;S<v;S++){let E=C[S];if(p(E,T,S,R)===!0){let P=E.__offset,O=Array.isArray(E.value)?E.value:[E.value],Y=0;for(let z=0;z<O.length;z++){let H=O[z],Z=y(H);typeof H=="number"||typeof H=="boolean"?(E.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,P+Y,E.__data)):H.isMatrix3?(E.__data[0]=H.elements[0],E.__data[1]=H.elements[1],E.__data[2]=H.elements[2],E.__data[3]=0,E.__data[4]=H.elements[3],E.__data[5]=H.elements[4],E.__data[6]=H.elements[5],E.__data[7]=0,E.__data[8]=H.elements[6],E.__data[9]=H.elements[7],E.__data[10]=H.elements[8],E.__data[11]=0):(H.toArray(E.__data,Y),Y+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,P,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(b,x,g,R){let T=b.value,w=x+"_"+g;if(R[w]===void 0)return typeof T=="number"||typeof T=="boolean"?R[w]=T:R[w]=T.clone(),!0;{let C=R[w];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return R[w]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function _(b){let x=b.uniforms,g=0,R=16;for(let w=0,C=x.length;w<C;w++){let S=Array.isArray(x[w])?x[w]:[x[w]];for(let v=0,E=S.length;v<E;v++){let P=S[v],O=Array.isArray(P.value)?P.value:[P.value];for(let Y=0,z=O.length;Y<z;Y++){let H=O[Y],Z=y(H),q=g%R,ge=q%Z.boundary,me=q+ge;g+=ge,me!==0&&R-me<Z.storage&&(g+=R-me),P.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),P.__offset=g,g+=Z.storage}}}let T=g%R;return T>0&&(g+=R-T),b.__size=g,b.__cache={},this}function y(b){let x={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(x.boundary=4,x.storage=4):b.isVector2?(x.boundary=8,x.storage=8):b.isVector3||b.isColor?(x.boundary=16,x.storage=12):b.isVector4?(x.boundary=16,x.storage=16):b.isMatrix3?(x.boundary=48,x.storage=48):b.isMatrix4?(x.boundary=64,x.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),x}function m(b){let x=b.target;x.removeEventListener("dispose",m);let g=o.indexOf(x.__bindingPointIndex);o.splice(g,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function f(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}var Wr=class{constructor(e={}){let{canvas:t=Eu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=o;let _=new Uint32Array(4),y=new Int32Array(4),m=null,f=null,b=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let g=this,R=!1;this._outputColorSpace=At;let T=0,w=0,C=null,S=-1,v=null,E=new ct,P=new ct,O=null,Y=new Ge(0),z=0,H=t.width,Z=t.height,q=1,ge=null,me=null,Me=new ct(0,0,H,Z),we=new ct(0,0,H,Z),We=!1,je=new _s,Je=!1,te=!1,ne=new nt,Ie=new U,Ue=new ct,Ae={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},$e=!1;function st(){return C===null?q:1}let N=n;function se(A,G){return t.getContext(A,G)}try{let A={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",Pe,!1),t.addEventListener("webglcontextcreationerror",_e,!1),N===null){let G="webgl2";if(N=se(G,A),N===null)throw se(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let re,oe,ie,ye,ue,be,Be,ke,I,M,X,D,k,F,Q,V,ae,pe,ee,fe,Le,Ee,Se,Xe;function B(){re=new i0(N),re.init(),Ee=new U_(N,re),oe=new $g(N,re,e,Ee),ie=new D_(N,re),oe.reversedDepthBuffer&&d&&ie.buffers.depth.setReversed(!0),ye=new o0(N),ue=new y_,be=new L_(N,re,ie,ue,oe,Ee,ye),Be=new jg(g),ke=new n0(g),I=new fp(N),Se=new Zg(N,I),M=new s0(N,I,ye,Se),X=new l0(N,M,I,ye),ee=new a0(N,oe,be),V=new Kg(ue),D=new x_(g,Be,ke,re,oe,Se,V),k=new B_(g,ue),F=new M_,Q=new A_(re),pe=new Yg(g,Be,ke,ie,X,p,l),ae=new I_(g,X,oe),Xe=new z_(N,ye,oe,ie),fe=new Jg(N,re,ye),Le=new r0(N,re,ye),ye.programs=D.programs,g.capabilities=oe,g.extensions=re,g.properties=ue,g.renderLists=F,g.shadowMap=ae,g.state=ie,g.info=ye}B();let le=new Fc(g,N);this.xr=le,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let A=re.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=re.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(A){A!==void 0&&(q=A,this.setSize(H,Z,!1))},this.getSize=function(A){return A.set(H,Z)},this.setSize=function(A,G,J=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=A,Z=G,t.width=Math.floor(A*q),t.height=Math.floor(G*q),J===!0&&(t.style.width=A+"px",t.style.height=G+"px"),this.setViewport(0,0,A,G)},this.getDrawingBufferSize=function(A){return A.set(H*q,Z*q).floor()},this.setDrawingBufferSize=function(A,G,J){H=A,Z=G,q=J,t.width=Math.floor(A*J),t.height=Math.floor(G*J),this.setViewport(0,0,A,G)},this.getCurrentViewport=function(A){return A.copy(E)},this.getViewport=function(A){return A.copy(Me)},this.setViewport=function(A,G,J,K){A.isVector4?Me.set(A.x,A.y,A.z,A.w):Me.set(A,G,J,K),ie.viewport(E.copy(Me).multiplyScalar(q).round())},this.getScissor=function(A){return A.copy(we)},this.setScissor=function(A,G,J,K){A.isVector4?we.set(A.x,A.y,A.z,A.w):we.set(A,G,J,K),ie.scissor(P.copy(we).multiplyScalar(q).round())},this.getScissorTest=function(){return We},this.setScissorTest=function(A){ie.setScissorTest(We=A)},this.setOpaqueSort=function(A){ge=A},this.setTransparentSort=function(A){me=A},this.getClearColor=function(A){return A.copy(pe.getClearColor())},this.setClearColor=function(){pe.setClearColor(...arguments)},this.getClearAlpha=function(){return pe.getClearAlpha()},this.setClearAlpha=function(){pe.setClearAlpha(...arguments)},this.clear=function(A=!0,G=!0,J=!0){let K=0;if(A){let W=!1;if(C!==null){let xe=C.texture.format;W=xe===va||xe===ya||xe===xa}if(W){let xe=C.texture.type,Ce=xe===Rn||xe===_i||xe===Ss||xe===Es||xe===ma||xe===ga,Ne=pe.getClearColor(),De=pe.getClearAlpha(),Ve=Ne.r,Ze=Ne.g,Oe=Ne.b;Ce?(_[0]=Ve,_[1]=Ze,_[2]=Oe,_[3]=De,N.clearBufferuiv(N.COLOR,0,_)):(y[0]=Ve,y[1]=Ze,y[2]=Oe,y[3]=De,N.clearBufferiv(N.COLOR,0,y))}else K|=N.COLOR_BUFFER_BIT}G&&(K|=N.DEPTH_BUFFER_BIT),J&&(K|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",Pe,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),pe.dispose(),F.dispose(),Q.dispose(),ue.dispose(),Be.dispose(),ke.dispose(),X.dispose(),Se.dispose(),Xe.dispose(),D.dispose(),le.dispose(),le.removeEventListener("sessionstart",Fe),le.removeEventListener("sessionend",pt),mt.stop()};function de(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function Pe(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let A=ye.autoReset,G=ae.enabled,J=ae.autoUpdate,K=ae.needsUpdate,W=ae.type;B(),ye.autoReset=A,ae.enabled=G,ae.autoUpdate=J,ae.needsUpdate=K,ae.type=W}function _e(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function he(A){let G=A.target;G.removeEventListener("dispose",he),L(G)}function L(A){j(A),ue.remove(A)}function j(A){let G=ue.get(A).programs;G!==void 0&&(G.forEach(function(J){D.releaseProgram(J)}),A.isShaderMaterial&&D.releaseShaderCache(A))}this.renderBufferDirect=function(A,G,J,K,W,xe){G===null&&(G=Ae);let Ce=W.isMesh&&W.matrixWorld.determinant()<0,Ne=at(A,G,J,K,W);ie.setMaterial(K,Ce);let De=J.index,Ve=1;if(K.wireframe===!0){if(De=M.getWireframeAttribute(J),De===void 0)return;Ve=2}let Ze=J.drawRange,Oe=J.attributes.position,it=Ze.start*Ve,dt=(Ze.start+Ze.count)*Ve;xe!==null&&(it=Math.max(it,xe.start*Ve),dt=Math.min(dt,(xe.start+xe.count)*Ve)),De!==null?(it=Math.max(it,0),dt=Math.min(dt,De.count)):Oe!=null&&(it=Math.max(it,0),dt=Math.min(dt,Oe.count));let St=dt-it;if(St<0||St===1/0)return;Se.setup(W,K,Ne,J,De);let _t,gt=fe;if(De!==null&&(_t=I.get(De),gt=Le,gt.setIndex(_t)),W.isMesh)K.wireframe===!0?(ie.setLineWidth(K.wireframeLinewidth*st()),gt.setMode(N.LINES)):gt.setMode(N.TRIANGLES);else if(W.isLine){let ze=K.linewidth;ze===void 0&&(ze=1),ie.setLineWidth(ze*st()),W.isLineSegments?gt.setMode(N.LINES):W.isLineLoop?gt.setMode(N.LINE_LOOP):gt.setMode(N.LINE_STRIP)}else W.isPoints?gt.setMode(N.POINTS):W.isSprite&&gt.setMode(N.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)ps("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),gt.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(re.get("WEBGL_multi_draw"))gt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let ze=W._multiDrawStarts,yt=W._multiDrawCounts,lt=W._multiDrawCount,tn=De?I.get(De).bytesPerElement:1,ji=ue.get(K).currentProgram.getUniforms();for(let nn=0;nn<lt;nn++)ji.setValue(N,"_gl_DrawID",nn),gt.render(ze[nn]/tn,yt[nn])}else if(W.isInstancedMesh)gt.renderInstances(it,St,W.count);else if(J.isInstancedBufferGeometry){let ze=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,yt=Math.min(J.instanceCount,ze);gt.renderInstances(it,St,yt)}else gt.render(it,St)};function ce(A,G,J){A.transparent===!0&&A.side===Ft&&A.forceSinglePass===!1?(A.side=Tt,A.needsUpdate=!0,ei(A,G,J),A.side=Zt,A.needsUpdate=!0,ei(A,G,J),A.side=Ft):ei(A,G,J)}this.compile=function(A,G,J=null){J===null&&(J=A),f=Q.get(J),f.init(G),x.push(f),J.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(f.pushLight(W),W.castShadow&&f.pushShadow(W))}),A!==J&&A.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(f.pushLight(W),W.castShadow&&f.pushShadow(W))}),f.setupLights();let K=new Set;return A.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let xe=W.material;if(xe)if(Array.isArray(xe))for(let Ce=0;Ce<xe.length;Ce++){let Ne=xe[Ce];ce(Ne,J,W),K.add(Ne)}else ce(xe,J,W),K.add(xe)}),f=x.pop(),K},this.compileAsync=function(A,G,J=null){let K=this.compile(A,G,J);return new Promise(W=>{function xe(){if(K.forEach(function(Ce){ue.get(Ce).currentProgram.isReady()&&K.delete(Ce)}),K.size===0){W(A);return}setTimeout(xe,10)}re.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let $=null;function Re(A){$&&$(A)}function Fe(){mt.stop()}function pt(){mt.start()}let mt=new nf;mt.setAnimationLoop(Re),typeof self<"u"&&mt.setContext(self),this.setAnimationLoop=function(A){$=A,le.setAnimationLoop(A),A===null?mt.stop():mt.start()},le.addEventListener("sessionstart",Fe),le.addEventListener("sessionend",pt),this.render=function(A,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(G),G=le.getCamera()),A.isScene===!0&&A.onBeforeRender(g,A,G,C),f=Q.get(A,x.length),f.init(G),x.push(f),ne.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),je.setFromProjectionMatrix(ne,En,G.reversedDepth),te=this.localClippingEnabled,Je=V.init(this.clippingPlanes,te),m=F.get(A,b.length),m.init(),b.push(m),le.enabled===!0&&le.isPresenting===!0){let xe=g.xr.getDepthSensingMesh();xe!==null&&fn(xe,G,-1/0,g.sortObjects)}fn(A,G,0,g.sortObjects),m.finish(),g.sortObjects===!0&&m.sort(ge,me),$e=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,$e&&pe.addToRenderList(m,A),this.info.render.frame++,Je===!0&&V.beginShadows();let J=f.state.shadowsArray;ae.render(J,A,G),Je===!0&&V.endShadows(),this.info.autoReset===!0&&this.info.reset();let K=m.opaque,W=m.transmissive;if(f.setupLights(),G.isArrayCamera){let xe=G.cameras;if(W.length>0)for(let Ce=0,Ne=xe.length;Ce<Ne;Ce++){let De=xe[Ce];bi(K,W,A,De)}$e&&pe.render(A);for(let Ce=0,Ne=xe.length;Ce<Ne;Ce++){let De=xe[Ce];jn(m,A,De,De.viewport)}}else W.length>0&&bi(K,W,A,G),$e&&pe.render(A),jn(m,A,G);C!==null&&w===0&&(be.updateMultisampleRenderTarget(C),be.updateRenderTargetMipmap(C)),A.isScene===!0&&A.onAfterRender(g,A,G),Se.resetDefaultState(),S=-1,v=null,x.pop(),x.length>0?(f=x[x.length-1],Je===!0&&V.setGlobalState(g.clippingPlanes,f.state.camera)):f=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function fn(A,G,J,K){if(A.visible===!1)return;if(A.layers.test(G.layers)){if(A.isGroup)J=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(G);else if(A.isLight)f.pushLight(A),A.castShadow&&f.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||je.intersectsSprite(A)){K&&Ue.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ne);let Ce=X.update(A),Ne=A.material;Ne.visible&&m.push(A,Ce,Ne,J,Ue.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||je.intersectsObject(A))){let Ce=X.update(A),Ne=A.material;if(K&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Ue.copy(A.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),Ue.copy(Ce.boundingSphere.center)),Ue.applyMatrix4(A.matrixWorld).applyMatrix4(ne)),Array.isArray(Ne)){let De=Ce.groups;for(let Ve=0,Ze=De.length;Ve<Ze;Ve++){let Oe=De[Ve],it=Ne[Oe.materialIndex];it&&it.visible&&m.push(A,Ce,it,J,Ue.z,Oe)}}else Ne.visible&&m.push(A,Ce,Ne,J,Ue.z,null)}}let xe=A.children;for(let Ce=0,Ne=xe.length;Ce<Ne;Ce++)fn(xe[Ce],G,J,K)}function jn(A,G,J,K){let W=A.opaque,xe=A.transmissive,Ce=A.transparent;f.setupLightsView(J),Je===!0&&V.setGlobalState(g.clippingPlanes,J),K&&ie.viewport(E.copy(K)),W.length>0&&Qn(W,G,J),xe.length>0&&Qn(xe,G,J),Ce.length>0&&Qn(Ce,G,J),ie.buffers.depth.setTest(!0),ie.buffers.depth.setMask(!0),ie.buffers.color.setMask(!0),ie.setPolygonOffset(!1)}function bi(A,G,J,K){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[K.id]===void 0&&(f.state.transmissionRenderTarget[K.id]=new _n(1,1,{generateMipmaps:!0,type:re.has("EXT_color_buffer_half_float")||re.has("EXT_color_buffer_float")?bs:Rn,minFilter:gi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:rt.workingColorSpace}));let xe=f.state.transmissionRenderTarget[K.id],Ce=K.viewport||E;xe.setSize(Ce.z*g.transmissionResolutionScale,Ce.w*g.transmissionResolutionScale);let Ne=g.getRenderTarget(),De=g.getActiveCubeFace(),Ve=g.getActiveMipmapLevel();g.setRenderTarget(xe),g.getClearColor(Y),z=g.getClearAlpha(),z<1&&g.setClearColor(16777215,.5),g.clear(),$e&&pe.render(J);let Ze=g.toneMapping;g.toneMapping=qn;let Oe=K.viewport;if(K.viewport!==void 0&&(K.viewport=void 0),f.setupLightsView(K),Je===!0&&V.setGlobalState(g.clippingPlanes,K),Qn(A,J,K),be.updateMultisampleRenderTarget(xe),be.updateRenderTargetMipmap(xe),re.has("WEBGL_multisampled_render_to_texture")===!1){let it=!1;for(let dt=0,St=G.length;dt<St;dt++){let _t=G[dt],gt=_t.object,ze=_t.geometry,yt=_t.material,lt=_t.group;if(yt.side===Ft&&gt.layers.test(K.layers)){let tn=yt.side;yt.side=Tt,yt.needsUpdate=!0,Ki(gt,J,K,ze,yt,lt),yt.side=tn,yt.needsUpdate=!0,it=!0}}it===!0&&(be.updateMultisampleRenderTarget(xe),be.updateRenderTargetMipmap(xe))}g.setRenderTarget(Ne,De,Ve),g.setClearColor(Y,z),Oe!==void 0&&(K.viewport=Oe),g.toneMapping=Ze}function Qn(A,G,J){let K=G.isScene===!0?G.overrideMaterial:null;for(let W=0,xe=A.length;W<xe;W++){let Ce=A[W],Ne=Ce.object,De=Ce.geometry,Ve=Ce.group,Ze=Ce.material;Ze.allowOverride===!0&&K!==null&&(Ze=K),Ne.layers.test(J.layers)&&Ki(Ne,G,J,De,Ze,Ve)}}function Ki(A,G,J,K,W,xe){A.onBeforeRender(g,G,J,K,W,xe),A.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(g,G,J,K,A,xe),W.transparent===!0&&W.side===Ft&&W.forceSinglePass===!1?(W.side=Tt,W.needsUpdate=!0,g.renderBufferDirect(J,G,K,W,A,xe),W.side=Zt,W.needsUpdate=!0,g.renderBufferDirect(J,G,K,W,A,xe),W.side=Ft):g.renderBufferDirect(J,G,K,W,A,xe),A.onAfterRender(g,G,J,K,W,xe)}function ei(A,G,J){G.isScene!==!0&&(G=Ae);let K=ue.get(A),W=f.state.lights,xe=f.state.shadowsArray,Ce=W.state.version,Ne=D.getParameters(A,W.state,xe,G,J),De=D.getProgramCacheKey(Ne),Ve=K.programs;K.environment=A.isMeshStandardMaterial?G.environment:null,K.fog=G.fog,K.envMap=(A.isMeshStandardMaterial?ke:Be).get(A.envMap||K.environment),K.envMapRotation=K.environment!==null&&A.envMap===null?G.environmentRotation:A.envMapRotation,Ve===void 0&&(A.addEventListener("dispose",he),Ve=new Map,K.programs=Ve);let Ze=Ve.get(De);if(Ze!==void 0){if(K.currentProgram===Ze&&K.lightsStateVersion===Ce)return Ye(A,Ne),Ze}else Ne.uniforms=D.getUniforms(A),A.onBeforeCompile(Ne,g),Ze=D.acquireProgram(Ne,De),Ve.set(De,Ze),K.uniforms=Ne.uniforms;let Oe=K.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Oe.clippingPlanes=V.uniform),Ye(A,Ne),K.needsLights=Un(A),K.lightsStateVersion=Ce,K.needsLights&&(Oe.ambientLightColor.value=W.state.ambient,Oe.lightProbe.value=W.state.probe,Oe.directionalLights.value=W.state.directional,Oe.directionalLightShadows.value=W.state.directionalShadow,Oe.spotLights.value=W.state.spot,Oe.spotLightShadows.value=W.state.spotShadow,Oe.rectAreaLights.value=W.state.rectArea,Oe.ltc_1.value=W.state.rectAreaLTC1,Oe.ltc_2.value=W.state.rectAreaLTC2,Oe.pointLights.value=W.state.point,Oe.pointLightShadows.value=W.state.pointShadow,Oe.hemisphereLights.value=W.state.hemi,Oe.directionalShadowMap.value=W.state.directionalShadowMap,Oe.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Oe.spotShadowMap.value=W.state.spotShadowMap,Oe.spotLightMatrix.value=W.state.spotLightMatrix,Oe.spotLightMap.value=W.state.spotLightMap,Oe.pointShadowMap.value=W.state.pointShadowMap,Oe.pointShadowMatrix.value=W.state.pointShadowMatrix),K.currentProgram=Ze,K.uniformsList=null,Ze}function He(A){if(A.uniformsList===null){let G=A.currentProgram.getUniforms();A.uniformsList=Ps.seqWithValue(G.seq,A.uniforms)}return A.uniformsList}function Ye(A,G){let J=ue.get(A);J.outputColorSpace=G.outputColorSpace,J.batching=G.batching,J.batchingColor=G.batchingColor,J.instancing=G.instancing,J.instancingColor=G.instancingColor,J.instancingMorph=G.instancingMorph,J.skinning=G.skinning,J.morphTargets=G.morphTargets,J.morphNormals=G.morphNormals,J.morphColors=G.morphColors,J.morphTargetsCount=G.morphTargetsCount,J.numClippingPlanes=G.numClippingPlanes,J.numIntersection=G.numClipIntersection,J.vertexAlphas=G.vertexAlphas,J.vertexTangents=G.vertexTangents,J.toneMapping=G.toneMapping}function at(A,G,J,K,W){G.isScene!==!0&&(G=Ae),be.resetTextureUnits();let xe=G.fog,Ce=K.isMeshStandardMaterial?G.environment:null,Ne=C===null?g.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Li,De=(K.isMeshStandardMaterial?ke:Be).get(K.envMap||Ce),Ve=K.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Ze=!!J.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Oe=!!J.morphAttributes.position,it=!!J.morphAttributes.normal,dt=!!J.morphAttributes.color,St=qn;K.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(St=g.toneMapping);let _t=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,gt=_t!==void 0?_t.length:0,ze=ue.get(K),yt=f.state.lights;if(Je===!0&&(te===!0||A!==v)){let Gt=A===v&&K.id===S;V.setState(K,A,Gt)}let lt=!1;K.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==yt.state.version||ze.outputColorSpace!==Ne||W.isBatchedMesh&&ze.batching===!1||!W.isBatchedMesh&&ze.batching===!0||W.isBatchedMesh&&ze.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&ze.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&ze.instancing===!1||!W.isInstancedMesh&&ze.instancing===!0||W.isSkinnedMesh&&ze.skinning===!1||!W.isSkinnedMesh&&ze.skinning===!0||W.isInstancedMesh&&ze.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&ze.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&ze.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&ze.instancingMorph===!1&&W.morphTexture!==null||ze.envMap!==De||K.fog===!0&&ze.fog!==xe||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==V.numPlanes||ze.numIntersection!==V.numIntersection)||ze.vertexAlphas!==Ve||ze.vertexTangents!==Ze||ze.morphTargets!==Oe||ze.morphNormals!==it||ze.morphColors!==dt||ze.toneMapping!==St||ze.morphTargetsCount!==gt)&&(lt=!0):(lt=!0,ze.__version=K.version);let tn=ze.currentProgram;lt===!0&&(tn=ei(K,G,W));let ji=!1,nn=!1,qs=!1,vt=tn.getUniforms(),pn=ze.uniforms;if(ie.useProgram(tn.program)&&(ji=!0,nn=!0,qs=!0),K.id!==S&&(S=K.id,nn=!0),ji||v!==A){ie.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),vt.setValue(N,"projectionMatrix",A.projectionMatrix),vt.setValue(N,"viewMatrix",A.matrixWorldInverse);let qt=vt.map.cameraPosition;qt!==void 0&&qt.setValue(N,Ie.setFromMatrixPosition(A.matrixWorld)),oe.logarithmicDepthBuffer&&vt.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&vt.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),v!==A&&(v=A,nn=!0,qs=!0)}if(W.isSkinnedMesh){vt.setOptional(N,W,"bindMatrix"),vt.setOptional(N,W,"bindMatrixInverse");let Gt=W.skeleton;Gt&&(Gt.boneTexture===null&&Gt.computeBoneTexture(),vt.setValue(N,"boneTexture",Gt.boneTexture,be))}W.isBatchedMesh&&(vt.setOptional(N,W,"batchingTexture"),vt.setValue(N,"batchingTexture",W._matricesTexture,be),vt.setOptional(N,W,"batchingIdTexture"),vt.setValue(N,"batchingIdTexture",W._indirectTexture,be),vt.setOptional(N,W,"batchingColorTexture"),W._colorsTexture!==null&&vt.setValue(N,"batchingColorTexture",W._colorsTexture,be));let mn=J.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&ee.update(W,J,tn),(nn||ze.receiveShadow!==W.receiveShadow)&&(ze.receiveShadow=W.receiveShadow,vt.setValue(N,"receiveShadow",W.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(pn.envMap.value=De,pn.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),K.isMeshStandardMaterial&&K.envMap===null&&G.environment!==null&&(pn.envMapIntensity.value=G.environmentIntensity),nn&&(vt.setValue(N,"toneMappingExposure",g.toneMappingExposure),ze.needsLights&&dn(pn,qs),xe&&K.fog===!0&&k.refreshFogUniforms(pn,xe),k.refreshMaterialUniforms(pn,K,q,Z,f.state.transmissionRenderTarget[A.id]),Ps.upload(N,He(ze),pn,be)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(Ps.upload(N,He(ze),pn,be),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&vt.setValue(N,"center",W.center),vt.setValue(N,"modelViewMatrix",W.modelViewMatrix),vt.setValue(N,"normalMatrix",W.normalMatrix),vt.setValue(N,"modelMatrix",W.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){let Gt=K.uniformsGroups;for(let qt=0,ml=Gt.length;qt<ml;qt++){let Ei=Gt[qt];Xe.update(Ei,tn),Xe.bind(Ei,tn)}}return tn}function dn(A,G){A.ambientLightColor.needsUpdate=G,A.lightProbe.needsUpdate=G,A.directionalLights.needsUpdate=G,A.directionalLightShadows.needsUpdate=G,A.pointLights.needsUpdate=G,A.pointLightShadows.needsUpdate=G,A.spotLights.needsUpdate=G,A.spotLightShadows.needsUpdate=G,A.rectAreaLights.needsUpdate=G,A.hemisphereLights.needsUpdate=G}function Un(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(A,G,J){let K=ue.get(A);K.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,K.__autoAllocateDepthBuffer===!1&&(K.__useRenderToTexture=!1),ue.get(A.texture).__webglTexture=G,ue.get(A.depthTexture).__webglTexture=K.__autoAllocateDepthBuffer?void 0:J,K.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,G){let J=ue.get(A);J.__webglFramebuffer=G,J.__useDefaultFramebuffer=G===void 0};let Xs=N.createFramebuffer();this.setRenderTarget=function(A,G=0,J=0){C=A,T=G,w=J;let K=!0,W=null,xe=!1,Ce=!1;if(A){let De=ue.get(A);if(De.__useDefaultFramebuffer!==void 0)ie.bindFramebuffer(N.FRAMEBUFFER,null),K=!1;else if(De.__webglFramebuffer===void 0)be.setupRenderTarget(A);else if(De.__hasExternalTextures)be.rebindTextures(A,ue.get(A.texture).__webglTexture,ue.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Oe=A.depthTexture;if(De.__boundDepthTexture!==Oe){if(Oe!==null&&ue.has(Oe)&&(A.width!==Oe.image.width||A.height!==Oe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");be.setupDepthRenderbuffer(A)}}let Ve=A.texture;(Ve.isData3DTexture||Ve.isDataArrayTexture||Ve.isCompressedArrayTexture)&&(Ce=!0);let Ze=ue.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Ze[G])?W=Ze[G][J]:W=Ze[G],xe=!0):A.samples>0&&be.useMultisampledRTT(A)===!1?W=ue.get(A).__webglMultisampledFramebuffer:Array.isArray(Ze)?W=Ze[J]:W=Ze,E.copy(A.viewport),P.copy(A.scissor),O=A.scissorTest}else E.copy(Me).multiplyScalar(q).floor(),P.copy(we).multiplyScalar(q).floor(),O=We;if(J!==0&&(W=Xs),ie.bindFramebuffer(N.FRAMEBUFFER,W)&&K&&ie.drawBuffers(A,W),ie.viewport(E),ie.scissor(P),ie.setScissorTest(O),xe){let De=ue.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+G,De.__webglTexture,J)}else if(Ce){let De=G;for(let Ve=0;Ve<A.textures.length;Ve++){let Ze=ue.get(A.textures[Ve]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Ve,Ze.__webglTexture,J,De)}}else if(A!==null&&J!==0){let De=ue.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,De.__webglTexture,J)}S=-1},this.readRenderTargetPixels=function(A,G,J,K,W,xe,Ce,Ne=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=ue.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(De=De[Ce]),De){ie.bindFramebuffer(N.FRAMEBUFFER,De);try{let Ve=A.textures[Ne],Ze=Ve.format,Oe=Ve.type;if(!oe.textureFormatReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!oe.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=A.width-K&&J>=0&&J<=A.height-W&&(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ne),N.readPixels(G,J,K,W,Ee.convert(Ze),Ee.convert(Oe),xe))}finally{let Ve=C!==null?ue.get(C).__webglFramebuffer:null;ie.bindFramebuffer(N.FRAMEBUFFER,Ve)}}},this.readRenderTargetPixelsAsync=async function(A,G,J,K,W,xe,Ce,Ne=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=ue.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(De=De[Ce]),De)if(G>=0&&G<=A.width-K&&J>=0&&J<=A.height-W){ie.bindFramebuffer(N.FRAMEBUFFER,De);let Ve=A.textures[Ne],Ze=Ve.format,Oe=Ve.type;if(!oe.textureFormatReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!oe.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let it=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,it),N.bufferData(N.PIXEL_PACK_BUFFER,xe.byteLength,N.STREAM_READ),A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ne),N.readPixels(G,J,K,W,Ee.convert(Ze),Ee.convert(Oe),0);let dt=C!==null?ue.get(C).__webglFramebuffer:null;ie.bindFramebuffer(N.FRAMEBUFFER,dt);let St=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await wu(N,St,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,it),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,xe),N.deleteBuffer(it),N.deleteSync(St),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,G=null,J=0){let K=Math.pow(2,-J),W=Math.floor(A.image.width*K),xe=Math.floor(A.image.height*K),Ce=G!==null?G.x:0,Ne=G!==null?G.y:0;be.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,J,0,0,Ce,Ne,W,xe),ie.unbindTexture()};let sd=N.createFramebuffer(),rd=N.createFramebuffer();this.copyTextureToTexture=function(A,G,J=null,K=null,W=0,xe=null){xe===null&&(W!==0?(ps("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),xe=W,W=0):xe=0);let Ce,Ne,De,Ve,Ze,Oe,it,dt,St,_t=A.isCompressedTexture?A.mipmaps[xe]:A.image;if(J!==null)Ce=J.max.x-J.min.x,Ne=J.max.y-J.min.y,De=J.isBox3?J.max.z-J.min.z:1,Ve=J.min.x,Ze=J.min.y,Oe=J.isBox3?J.min.z:0;else{let mn=Math.pow(2,-W);Ce=Math.floor(_t.width*mn),Ne=Math.floor(_t.height*mn),A.isDataArrayTexture?De=_t.depth:A.isData3DTexture?De=Math.floor(_t.depth*mn):De=1,Ve=0,Ze=0,Oe=0}K!==null?(it=K.x,dt=K.y,St=K.z):(it=0,dt=0,St=0);let gt=Ee.convert(G.format),ze=Ee.convert(G.type),yt;G.isData3DTexture?(be.setTexture3D(G,0),yt=N.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(be.setTexture2DArray(G,0),yt=N.TEXTURE_2D_ARRAY):(be.setTexture2D(G,0),yt=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,G.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,G.unpackAlignment);let lt=N.getParameter(N.UNPACK_ROW_LENGTH),tn=N.getParameter(N.UNPACK_IMAGE_HEIGHT),ji=N.getParameter(N.UNPACK_SKIP_PIXELS),nn=N.getParameter(N.UNPACK_SKIP_ROWS),qs=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,_t.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,_t.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ve),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ze),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Oe);let vt=A.isDataArrayTexture||A.isData3DTexture,pn=G.isDataArrayTexture||G.isData3DTexture;if(A.isDepthTexture){let mn=ue.get(A),Gt=ue.get(G),qt=ue.get(mn.__renderTarget),ml=ue.get(Gt.__renderTarget);ie.bindFramebuffer(N.READ_FRAMEBUFFER,qt.__webglFramebuffer),ie.bindFramebuffer(N.DRAW_FRAMEBUFFER,ml.__webglFramebuffer);for(let Ei=0;Ei<De;Ei++)vt&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ue.get(A).__webglTexture,W,Oe+Ei),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ue.get(G).__webglTexture,xe,St+Ei)),N.blitFramebuffer(Ve,Ze,Ce,Ne,it,dt,Ce,Ne,N.DEPTH_BUFFER_BIT,N.NEAREST);ie.bindFramebuffer(N.READ_FRAMEBUFFER,null),ie.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(W!==0||A.isRenderTargetTexture||ue.has(A)){let mn=ue.get(A),Gt=ue.get(G);ie.bindFramebuffer(N.READ_FRAMEBUFFER,sd),ie.bindFramebuffer(N.DRAW_FRAMEBUFFER,rd);for(let qt=0;qt<De;qt++)vt?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,mn.__webglTexture,W,Oe+qt):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,mn.__webglTexture,W),pn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Gt.__webglTexture,xe,St+qt):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Gt.__webglTexture,xe),W!==0?N.blitFramebuffer(Ve,Ze,Ce,Ne,it,dt,Ce,Ne,N.COLOR_BUFFER_BIT,N.NEAREST):pn?N.copyTexSubImage3D(yt,xe,it,dt,St+qt,Ve,Ze,Ce,Ne):N.copyTexSubImage2D(yt,xe,it,dt,Ve,Ze,Ce,Ne);ie.bindFramebuffer(N.READ_FRAMEBUFFER,null),ie.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else pn?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(yt,xe,it,dt,St,Ce,Ne,De,gt,ze,_t.data):G.isCompressedArrayTexture?N.compressedTexSubImage3D(yt,xe,it,dt,St,Ce,Ne,De,gt,_t.data):N.texSubImage3D(yt,xe,it,dt,St,Ce,Ne,De,gt,ze,_t):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,xe,it,dt,Ce,Ne,gt,ze,_t.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,xe,it,dt,_t.width,_t.height,gt,_t.data):N.texSubImage2D(N.TEXTURE_2D,xe,it,dt,Ce,Ne,gt,ze,_t);N.pixelStorei(N.UNPACK_ROW_LENGTH,lt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,tn),N.pixelStorei(N.UNPACK_SKIP_PIXELS,ji),N.pixelStorei(N.UNPACK_SKIP_ROWS,nn),N.pixelStorei(N.UNPACK_SKIP_IMAGES,qs),xe===0&&G.generateMipmaps&&N.generateMipmap(yt),ie.unbindTexture()},this.initRenderTarget=function(A){ue.get(A).__webglFramebuffer===void 0&&be.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?be.setTextureCube(A,0):A.isData3DTexture?be.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?be.setTexture2DArray(A,0):be.setTexture2D(A,0),ie.unbindTexture()},this.resetState=function(){T=0,w=0,C=null,ie.reset(),Se.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=rt._getDrawingBufferColorSpace(e),t.unpackColorSpace=rt._getUnpackColorSpace()}};var Xr=new U;function vn(i,e,t,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Xr.copy(e),Xr[n]=0,Xr.normalize();let c=.5*o/(o+a),h=1-Xr.angleTo(i)/l;return Math.sign(Xr[t])===1?h*c:a/(o+a)+c+c*(1-h)}var Zn=class i extends yn{constructor(e=1,t=1,n=1,s=2,r=.1){let o=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new U,c=new U,h=new U(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,p=this.attributes.uv.array,_=u.length/6,y=new U,m=.5/o;for(let f=0,b=0;f<u.length;f+=3,b+=2)switch(l.fromArray(u,f),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[f+0]=h.x*Math.sign(l.x)+c.x*r,u[f+1]=h.y*Math.sign(l.y)+c.y*r,u[f+2]=h.z*Math.sign(l.z)+c.z*r,d[f+0]=c.x,d[f+1]=c.y,d[f+2]=c.z,Math.floor(f/_)){case 0:y.set(1,0,0),p[b+0]=vn(y,c,"z","y",r,n),p[b+1]=1-vn(y,c,"y","z",r,t);break;case 1:y.set(-1,0,0),p[b+0]=1-vn(y,c,"z","y",r,n),p[b+1]=1-vn(y,c,"y","z",r,t);break;case 2:y.set(0,1,0),p[b+0]=1-vn(y,c,"x","z",r,e),p[b+1]=vn(y,c,"z","x",r,n);break;case 3:y.set(0,-1,0),p[b+0]=1-vn(y,c,"x","z",r,e),p[b+1]=1-vn(y,c,"z","x",r,n);break;case 4:y.set(0,0,1),p[b+0]=1-vn(y,c,"x","y",r,e),p[b+1]=1-vn(y,c,"y","x",r,t);break;case 5:y.set(0,0,-1),p[b+0]=vn(y,c,"x","y",r,e),p[b+1]=1-vn(y,c,"y","x",r,t);break}}static fromJSON(e){return new i(e.width,e.height,e.depth,e.segments,e.radius)}};var el=class extends Vn{constructor(){super();let e=new yn;e.deleteAttribute("uv");let t=new Xt({side:Tt}),n=new Xt,s=new Lr(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new et(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new pr(e,n,6),a=new wt;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new et(e,Us(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new et(e,Us(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new et(e,Us(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new et(e,Us(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new et(e,Us(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let p=new et(e,Us(100));p.position.set(0,20,0),p.scale.set(1,.1,1),this.add(p)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Us(i){return new Ir({color:0,emissive:16777215,emissiveIntensity:i})}var hn=i=>[i[0]/100,(186-i[1])/100,i[2]/100],Bc=i=>[i[0],-i[1],i[2]],xi=i=>new U(...i);function zc(i){return new Ut().setFromRotationMatrix(new nt().makeBasis(xi(Bc(i.x)),xi(Bc(i.y)),xi(Bc(i.z))))}function tl(i,e){let t=new ot,n=[];t.setAttribute("position",new qe(new Float32Array((i+1)*(e+1)*3),3));for(let s=0;s<i;s++)for(let r=0;r<e;r++){let o=s*(e+1)+r,a=o+1,l=o+e+1;n.push(o,a,l,a,l+1,l)}return t.setIndex(n),t}function nl(i,e,t=hn,n=!1){let s=e[0].length,r=i.attributes.position,o=0;for(let h of e)for(let u=0;u<=s;u++)r.setXYZ(o++,...t(h[u%s]));if(r.needsUpdate=!0,n){i.boundingSphere=null,i.boundingBox=null;return}i.computeVertexNormals();let a=i.attributes.normal,l=new U,c=new U;for(let h=0;h<e.length;h++){let u=h*(s+1),d=u+s;l.fromBufferAttribute(a,u).add(c.fromBufferAttribute(a,d)),l.lengthSq()>1e-12&&(l.normalize(),a.setXYZ(u,l.x,l.y,l.z),a.setXYZ(d,l.x,l.y,l.z))}a.needsUpdate=!0,i.boundingSphere=null,i.boundingBox=null}var lf=i=>i.reduce((e,t)=>[e[0]+t[0]/i.length,e[1]+t[1]/i.length,e[2]+t[2]/i.length],[0,0,0]);function k_(i){let e=[],n=new Zn(i.palm.size[0]*.01,i.palm.size[1]*.01,i.palm.size[2]*.01,2,.012);n.translate(...i.palm.c.map(s=>s*.01)),e.push(n);for(let s of[...i.fingers,i.thumb]){let r=s.pts.map(l=>xi(l.map(c=>c*.01))),o=new Pn(new An(r),Math.max(6,r.length*3),s.r*.01,7,!1);e.push(o);let a=new Nt(s.r*.01,8,6);a.translate(...s.pts.at(-1).map(l=>l*.01)),e.push(a)}return e}var kc=i=>[i[0]/100,i[1]/100,i[2]/100];function H_(i){let e=[];for(let t of i.toes){let n=t.pts.map(o=>xi(kc(o)));e.push(new Pn(new An(n),Math.max(6,n.length*3),t.r/100,8,!1));let s=new Nt(t.r/100,8,6);s.translate(...kc(t.pts[0])),e.push(s);let r=new Nt(t.r/100,10,8);r.translate(...kc(t.pts.at(-1))),e.push(r)}return e}function cf(i,e,{skin:t,joint:n,sole:s,mesh:r}){let o=(...R)=>{let T=r(...R);return T.receiveShadow=!1,T.frustumCulled=!1,T},a=e.body,l={},c=new ht;c.name="mannequin",i.add(c);let h=a.torso.length+1;l.torso={mesh:o(c,tl(h,a.torso[0].length),t,"torso")};for(let[R,T]of Object.entries(a.limbs))l[R]={mesh:o(c,tl(T.length-1,T[0].length),t,R)};l.neck={mesh:o(c,tl(a.neck.length-1,a.neck[0].length),t,"neck")};let u=new ht;u.name="head",c.add(u);{let R=a.head.mesh,T=new ot;T.setAttribute("position",new qe(new Float32Array(R.pts.flatMap(w=>w.map(C=>C/100))),3)),T.setAttribute("normal",new qe(new Float32Array(R.nrm.flat()),3)),T.setIndex(R.idx),T.computeBoundingSphere(),T.computeBoundingBox(),o(u,T,t,"skull");for(let w of Object.values(a.head.ears)){let C=o(u,new Nt(1,16,12),t,"ear");C.position.set(...w.c.map(S=>S/100)),C.quaternion.setFromRotationMatrix(new nt().makeBasis(xi(w.ax[0]),xi(w.ax[1]),xi(w.ax[2]))),C.scale.set(...w.r.map(S=>S/100))}}l.head={mesh:u};for(let R of a.caps)l["cap-"+R.key]={mesh:o(c,new Nt(1,16,12),t,"cap-"+R.key)};let d=new Map;for(let R of["L","R"]){let T=new ht;T.name="hand"+R,c.add(T),l["hand"+R]={mesh:T,key:null};let w=e.body.feet[R],C=o(c,tl(w.rows.length-1,w.rows[0].length),t,"foot-rear"+R),S=new ht;S.name="foot-toes"+R,c.add(S);for(let v of H_(w.shape))o(S,v,t,"toe"+R);l["foot-rear"+R]={mesh:C},l["foot-toes"+R]={mesh:S}}let p=new ht;p.name="joint-dots",i.add(p);let _=new on({color:"#e2f1ff",depthTest:!1,toneMapped:!1}),y=new on({color:"#0e1520",depthTest:!1,toneMapped:!1}),m=new Nt(.021,10,8),f=new Nt(.031,10,8);for(let R of["L","R"])for(let T of["sh","el","wr","hip","kn","an"]){let w=o(p,m,_,T+R),C=new et(f,y);C.name="dot-ring",C.renderOrder=10,w.renderOrder=11,w.castShadow=w.receiveShadow=!1,w.add(C),l["dot"+T+R]={mesh:w}}function b(R,T){let w=l["hand"+R];if(w.key!==T.key){w.mesh.traverse(C=>{C.isMesh&&!d.has(C.geometry.uuid)&&C.geometry.dispose()}),w.mesh.clear();for(let C of k_(T.shape))o(w.mesh,C,t,"hand-part"+R);w.key=T.key}w.mesh.position.fromArray(hn(T.frame.o)),w.mesh.quaternion.copy(zc(T.frame))}function x(R,T,w=!1){let C=R.body,S=R.pose,v=C.torso,E=lf(v.at(-1)),P=lf(v[0]),O=(z,H)=>z.map((Z,q)=>[2*Z[0]-H[q][0],2*Z[1]-H[q][1],2*Z[2]-H[q][2]]),Y=l.torso.mesh.geometry;nl(Y,[O(v[0],v[1]),...v,O(v.at(-1),v.at(-2))],hn,w);{let z=Y.attributes.position,H=v[0].length,Z=(v.length+1)*(H+1);for(let q=0;q<=H;q++)z.setXYZ(q,...hn(P)),z.setXYZ(Z+q,...hn(E));z.needsUpdate=!0,Y.boundingSphere=null,Y.boundingBox=null}for(let[z,H]of Object.entries(C.limbs))nl(l[z].mesh.geometry,H,hn,w);nl(l.neck.mesh.geometry,C.neck,hn,w),u.position.fromArray(hn(C.head.c)),u.quaternion.copy(zc({x:C.head.axes[0],y:C.head.axes[1],z:C.head.axes[2]}));for(let z of C.caps){let H=l["cap-"+z.key].mesh;H.position.fromArray(hn(z.c)),H.scale.setScalar(z.r/100)}for(let z of["L","R"]){b(z,C.hands[z]),nl(l["foot-rear"+z].mesh.geometry,C.feet[z].rows,hn,w);{let H=C.feet[z].toes,Z=l["foot-toes"+z].mesh;Z.position.fromArray(hn(H.o)),Z.quaternion.copy(zc(H))}for(let H of["sh","el","wr","hip","kn","an"])l["dot"+H+z].mesh.position.fromArray(hn(S[H+z]))}p.visible=!!T.joints}function g(R,T){let w=R.pose;for(let C of["L","R"])for(let S of["sh","el","wr","hip","kn","an"])l["dot"+S+C].mesh.position.fromArray(hn(w[S+C]));p.visible=!!T.joints}return{group:c,parts:l,apply:x,dots:g}}var V_=186,Hc=6,G_=`attribute float skelBone;
uniform highp sampler2D skelBones;`,W_=`void main() {
 int skelRow=int(skelBone+.5);
 vec4 skelA0=texelFetch(skelBones,ivec2(0,skelRow),0),skelA1=texelFetch(skelBones,ivec2(1,skelRow),0),skelA2=texelFetch(skelBones,ivec2(2,skelRow),0);`,X_=`#include <beginnormal_vertex>
 {vec3 skelN0=texelFetch(skelBones,ivec2(3,skelRow),0).xyz,skelN1=texelFetch(skelBones,ivec2(4,skelRow),0).xyz,skelN2=texelFetch(skelBones,ivec2(5,skelRow),0).xyz;
  objectNormal=vec3(dot(skelN0,objectNormal),dot(skelN1,objectNormal),dot(skelN2,objectNormal));}`,q_=`#include <begin_vertex>
 transformed=vec3(dot(skelA0.xyz,transformed)+skelA0.w,dot(skelA1.xyz,transformed)+skelA1.w,dot(skelA2.xyz,transformed)+skelA2.w);`;function hf(i,e,t){return i.onBeforeCompile=n=>{n.uniforms.skelBones={value:e},n.vertexShader=G_+`
`+n.vertexShader.replace("void main() {",W_).replace("#include <beginnormal_vertex>",X_).replace("#include <begin_vertex>",q_)},i.customProgramCacheKey=()=>t,i}function Y_(i){let e=0,t=0;for(let u of i)e+=u.pos.length/3,t+=u.idx.length;let n=new Float32Array(e*3),s=new Float32Array(e*3),r=new Uint16Array(e),o=e>65535?new Uint32Array(t):new Uint16Array(t),a=[],l=0,c=0;i.forEach((u,d)=>{let p=new ot;p.setAttribute("position",new qe(u.pos,3)),p.setIndex(new qe(u.idx,1)),p.computeVertexNormals(),p.computeBoundingBox(),n.set(u.pos,l*3),s.set(p.attributes.normal.array,l*3),r.fill(d,l,l+u.pos.length/3);for(let m=0;m<u.idx.length;m++)o[c++]=u.idx[m]+l;let{min:_,max:y}=p.boundingBox;a.push([_.x,_.y,_.z,y.x,y.y,y.z]),l+=u.pos.length/3,p.dispose()});let h=new ot;return h.setAttribute("position",new qe(n,3)),h.setAttribute("normal",new qe(s,3)),h.setAttribute("skelBone",new qe(r,1)),h.setIndex(new qe(o,1)),{geometry:h,boxes:a}}function uf(i){let e=new ht;e.name="skeleton",e.visible=!1,i.add(e);let t=null,n=null,s=null,r=null,o=null,a=[],l=[],c=null,h=null;function u(g){y();let R=g.bones.length;t=new fi(new Float32Array(Hc*4*R),Hc,R,$t,cn),t.minFilter=t.magFilter=zt,t.generateMipmaps=!1,t.name="skeleton-bones",n=hf(new Xt({color:"#ece2cb",roughness:.62,metalness:0}),t,"skeleton-bones"),n.name="skeleton-bones",s=hf(new di({depthPacking:Ts}),t,"skeleton-bones-depth"),s.name="skeleton-bones-depth";let T=Y_(g.bones);l=T.boxes,a=g.bones.map(w=>w.name+(w.side||"")),r=new et(T.geometry,n),r.name="bones",r.matrixAutoUpdate=!1,r.castShadow=!0,r.receiveShadow=!1,r.frustumCulled=!1,r.customDepthMaterial=s,Object.defineProperty(r.userData,"boundsPoints",{get:d,enumerable:!1,configurable:!0}),e.add(r),c=new Float32Array(R*12),h=null,o=g}function d(){return h||(h=[],l.forEach((g,R)=>{let T=R*12;for(let w of[g[0],g[3]])for(let C of[g[1],g[4]])for(let S of[g[2],g[5]])h.push(new U(c[T]*w+c[T+1]*C+c[T+2]*S+c[T+3],c[T+4]*w+c[T+5]*C+c[T+6]*S+c[T+7],c[T+8]*w+c[T+9]*C+c[T+10]*S+c[T+11]))}),h)}function p(g,R,T,w=globalThis.Skeleton.frames(R,T,g.bones)){o!==g&&u(g);let C=t.image.data,S=a.length;for(let v=0;v<S;v++){let E=v*12,P=c;P[E]=w[E]/100,P[E+1]=w[E+1]/100,P[E+2]=w[E+2]/100,P[E+3]=w[E+3]/100,P[E+4]=-w[E+4]/100,P[E+5]=-w[E+5]/100,P[E+6]=-w[E+6]/100,P[E+7]=(V_-w[E+7])/100,P[E+8]=w[E+8]/100,P[E+9]=w[E+9]/100,P[E+10]=w[E+10]/100,P[E+11]=w[E+11]/100;let O=v*Hc*4;C.set(P.subarray(E,E+12),O);let Y=P[E],z=P[E+1],H=P[E+2],Z=P[E+4],q=P[E+5],ge=P[E+6],me=P[E+8],Me=P[E+9],we=P[E+10],We=q*we-ge*Me,je=ge*me-Z*we,Je=Z*Me-q*me,te=Y*We+z*je+H*Je,ne=te?1/te:0;C[O+12]=We*ne,C[O+13]=je*ne,C[O+14]=Je*ne,C[O+15]=0,C[O+16]=(H*Me-z*we)*ne,C[O+17]=(Y*we-H*me)*ne,C[O+18]=(z*me-Y*Me)*ne,C[O+19]=0,C[O+20]=(z*ge-H*q)*ne,C[O+21]=(H*Z-Y*ge)*ne,C[O+22]=(Y*q-z*Z)*ne,C[O+23]=0}t.needsUpdate=!0,h=null,e.visible=!0}function _(){e.visible=!1}function y(){r&&(r.geometry.dispose(),e.remove(r)),t?.dispose(),n?.dispose(),s?.dispose(),r=t=n=s=null}function m(){y(),o=null,a=[],l=[],c=null,h=null}function f(){t?.dispose()}function b(g){let R=a.indexOf(g);if(R<0||!c)return null;let T=R*12,w=c;return new nt().set(w[T],w[T+1],w[T+2],w[T+3],w[T+4],w[T+5],w[T+6],w[T+7],w[T+8],w[T+9],w[T+10],w[T+11],0,0,0,1)}let x={group:e,update:p,hide:_,dispose:m,disposeTexture:f,matrixOf:b,get names(){return a.slice()},get meshes(){return r?[r]:[]},get material(){return n}};return e.userData.layer=x,x}var Z_=1.5,qr="#b98c86",pf={pecm1:"pec_clavicular",pecm2:"pec_sternal",pecm3:"pec_costal",trilong:"tri_long",trilat:"tri_lateral",trimed:"tri_medial",biclong:"bi_long",bicshort:"bi_short",recfem:"quad_rectus",vaslat:"quad_lateral",vasmed:"quad_medial",vasint:"quad_deep",bflh:"ham_lateral",semimem:"ham_medial",semiten:"ham_medial",gasmed:"calf_medial",gaslat:"calf_lateral",soleus:"soleus",glmax:"glute_max",glmed:"glute_lateral",glmin:"glute_lateral",trapsup:"trap_upper",trapmid:"trap_mid"};Object.assign(pf,{bra:"brachialis",trapinf:"trap_lower",levscap:"lev_scap",bfsh:"ham_short",eo:"obl_ext",io:"obl_int",pecmin:"pec_minor",supsp:"cuff_sup",infsp:"cuff_ext",tmin:"cuff_ext",subsc:"cuff_int",brd:"brachiorad",fcr:"forearm_flex",fcu:"forearm_flex",pl:"forearm_flex",fds:"forearm_flex",fdp:"forearm_flex",fpl:"forearm_flex",pt:"forearm_flex",pq:"forearm_flex",ecrl:"forearm_ext",ecrb:"forearm_ext",ecu:"forearm_ext",edc:"forearm_ext",edm:"forearm_ext",eip:"forearm_ext",epl:"forearm_ext",epb:"forearm_ext",apl:"forearm_ext",sup:"forearm_ext"});var ff=new WeakMap;function J_(i){if(!i)return new Map;let e=ff.get(i);if(e)return e;e=new Map;for(let[t,n]of Object.entries(i))e.has(n.parent)||e.set(n.parent,[]),e.get(n.parent).push(t);return ff.set(i,e),e}var $_={trapmid:"traps"};function K_(i,e,t,n){let s=i.group||[];if(!s.length)return qr;let r=l=>{let c=pf[i.part];return c&&t?.regions?.[c]?.parent===l?c:l},o=t?.selected&&t.selected!=="all"?t.selected:null;if(o&&!s.some(l=>r(l)===o||l===o))return qr;if(t?.phases&&t.values){let l=t.sideValues?.[i.side]||t.values,c=J_(t.regions),h=0,u=!1,d=$_[i.part],p=d&&t.values[d]!==void 0?[d]:s;for(let _ of p){if(t.values[_]===void 0)continue;u=!0;let y=r(_),m=y!==_||t.regions?.[_]?l[y]:void 0,f=m===void 0?(c.get(_)||[]).map(b=>l[b]).filter(Number.isFinite):[];h=Math.max(h,m??(f.length?Math.max(...f):l[_]??t.values[_]))}return u&&h>0?n(h):qr}let a=Math.max(0,...s.map(l=>e?.[l]||0));return a>=1?n(1):a>0?n(.55):qr}var Kt={muscles:null,only:null,frames:null,pos:null,nor:null},j_=(i,e)=>{if(!i||!e||i.length!==e.length)return!1;for(let t=0;t<i.length;t++)if(i[t]!==e[t])return!1;return!0},Fs=64,df=2,Q_=2/Fs+1e-9,Vc=16<<20,Yi=new Map,Ns=0,mf=0;function ex(i,e){let t=Yi.get(i);return t&&t.data!==e&&(Ns-=t.bytes,Yi.delete(i),t=null),t?Yi.delete(i):t={data:e,bins:new Array(Fs+1).fill(null),bytes:0},Yi.set(i,t),t}function tx(i,e,t,n){for(let[s,r]of Yi){if(Ns+n.byteLength<=Vc||r===i)break;Yi.delete(s),Ns-=r.bytes}Ns+n.byteLength>Vc||i.bins[e]||(i.bins[e]={t,tape:n},i.bytes+=n.byteLength,Ns+=n.byteLength)}function nx(i,e,t){let n=Math.min(Fs,Math.floor(e*Fs)),s=null,r=null;for(let a=Math.max(0,n-df);a<=Math.min(Fs,n+df);a++){let l=i.bins[a];if(l){if(Math.abs(l.t-e)<1e-7)return{memo:{a:l.tape,b:l.tape,w:0}};l.t<e?(!s||l.t>s.t)&&(s=l):(!r||l.t<r.t)&&(r=l)}}if(s&&r&&r.t-s.t<=Q_)return{memo:{a:s.tape,b:r.tape,w:(e-s.t)/(r.t-s.t)}};if(i.bins[n])return null;let o=new Int16Array(t);return{memo:{rec:o},e:i,b:n,rec:o}}function gf(){return{bytes:Ns,figures:Yi.size,limit:Vc,phases:Fs,misses:mf}}var ix=186,sx=new Set(["trapmid","trapinf"]),rx=.02;function ox(i){return i.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute float layer;`).replace("#include <project_vertex>",`#include <project_vertex>
 if(layer>0.){vec3 toCam=isOrthographic?vec3(0.,0.,1.):normalize(-mvPosition.xyz);mvPosition.xyz+=toCam*layer*`+rx.toFixed(3)+";gl_Position=projectionMatrix*mvPosition;}")},i.customProgramCacheKey=()=>"muscle-layer",i}function ax(i,e,t){let n=globalThis.Muscles,s=new Map;return(i.sheets||[]).forEach((r,o)=>{if(t&&!t.test(r.name))return;let a=e.bones.findIndex(l=>l.name===r.bone[0]&&(l.side||"")===(r.bone[1]||""));if(a<0)throw Error("muscles: no bone "+r.bone.join(" "));s.has(a)||s.set(a,[]),s.get(a).push([o,n.sheetMesh(r)])}),[...s].map(([r,o])=>{let a=o.reduce((_,[,y])=>_+y.n,0),l=new Float32Array(a*3),c=new Float32Array(a*3),h=[],u=[],d=0;for(let[_,y]of o){l.set(y.pos,d*3),c.set(y.nor,d*3);for(let m of y.idx)h.push(m+d);for(let m=0;m<y.idx.length/3;m++)u.push(_);d+=y.n}let p=new ot;return p.setAttribute("position",new qe(l,3)),p.setAttribute("normal",new qe(c,3)),p.setIndex(a>65535?new ui(h,1):new hi(h,1)),{bone:r,geo:p,owner:u}})}function _f(i){let e=new ht;e.name="muscles",e.visible=!1,i.add(e);let t=null,n=null,s=null,r=null,o=null,a=null,l=null,c=null,h=0,u=[],d=null,p=null;function _(S,v){for(let E of u)e.remove(E.mesh),E.geo.dispose();p||(p=new Xt({color:qr,roughness:.55,metalness:0})),u=ax(S.muscles,S.skeleton,v).map(E=>{let P=new et(E.geo,p);return P.name="muscle-sheets",P.matrixAutoUpdate=!1,P.frustumCulled=!1,P.castShadow=!1,P.receiveShadow=!1,e.add(P),{...E,mesh:P}})}function y(S){for(let v of u){let E=v.bone*12,P=O=>S[E+O];v.mesh.matrix.set(P(0)/100,P(1)/100,P(2)/100,P(3)/100,-P(4)/100,-P(5)/100,-P(6)/100,(ix-P(7))/100,P(8)/100,P(9)/100,P(10)/100,P(11)/100,0,0,0,1),v.mesh.matrixWorldNeedsUpdate=!0}}let m=new Ge;function f(){let S=globalThis.Muscles;h=S.SIDES,l=S.ringStarts(r);let v=l[r.length]*h,E=[];c=[];for(let O=0;O<r.length;O++)for(let Y=l[O];Y<l[O+1]-1;Y++)for(let z=0;z<h;z++){let H=Y*h+z,Z=Y*h+(z+1)%h,q=H+h,ge=Z+h;E.push(H,Z,q,Z,ge,q),c.push(O,O)}n?.dispose(),n=new ot,n.setAttribute("position",new qe(new Float32Array(v*3),3).setUsage(As)),n.setAttribute("normal",new qe(new Float32Array(v*3),3).setUsage(As)),n.setAttribute("color",new qe(new Float32Array(v*3),3));let P=new Float32Array(v);for(let O=0;O<r.length;O++)sx.has(r[O].part)&&P.fill(1,l[O]*h,l[O+1]*h);n.setAttribute("layer",new qe(P,1)),n.setIndex(v>65535?new ui(E,1):new hi(E,1)),s||(s=ox(new Xt({roughness:.55,metalness:0,vertexColors:!0}))),t&&e.remove(t),t=new et(n,s),t.name="muscle-bodies",t.frustumCulled=!1,t.castShadow=!1,t.receiveShadow=!1,e.add(t),a=new Array(r.length).fill(null)}function b(S,v,E){let P=n.attributes.color.array,O=!1;r.forEach((Y,z)=>{let H=K_(Y,S,v,E);if(a[z]!==H){a[z]=H,O=!0,m.set(H);for(let Z=l[z]*h;Z<l[z+1]*h;Z++)P[Z*3]=m.r,P[Z*3+1]=m.g,P[Z*3+2]=m.b}}),O&&(n.attributes.color.needsUpdate=!0)}function x(S,v,E,P=null,O=null){let Y=globalThis.Muscles,z=S.muscles;(o!==z||r?.skel!==S.skeleton)&&(r=Y.bind(z,S.skeleton),r.skel=S.skeleton,o=z,f()),b(S.level,P,E);let H=n.attributes.position.array,Z=n.attributes.normal.array,q=S.only||null,ge=[z,S.skeleton,q?q.source:""];if((!d||d.some((we,We)=>we!==ge[We]))&&(_(S,q),d=ge),y(v),Kt.muscles===z&&!q&&!Kt.only&&Kt.pos?.length===H.length&&j_(Kt.frames,v)){H.set(Kt.pos),Z.set(Kt.nor),g();return}let me=O&&O.key&&r.tapeN&&O.t>=0&&O.t<=1?nx(ex(O.key,r),O.t,r.tapeN):null;O&&(!me||me.rec)&&mf++,Y.surfaceAll(r,Y.layoutDrawn(r,v,Z_),v,H,Z,l,me?me.memo:null),me&&me.rec&&tx(me.e,me.b,O.t,me.rec);for(let we=0;we<H.length;we+=3)H[we]/=100,H[we+1]=(186-H[we+1])/100,H[we+2]/=100,Z[we+1]=-Z[we+1];if(q)for(let we=0;we<r.length;we++)q.test(r[we].name)||H.fill(0,l[we]*h*3,l[we+1]*h*3);let Me=(we,We)=>we&&we.length===We.length?(we.set(We),we):Float32Array.from(We);Kt.muscles=z,Kt.only=q,Kt.frames=Me(Kt.frames,v),Kt.pos=Me(Kt.pos,H),Kt.nor=Me(Kt.nor,Z),g()}function g(){n.attributes.position.needsUpdate=!0,n.attributes.normal.needsUpdate=!0,n.boundingSphere=null,n.boundingBox=null,e.visible=!0}function R(){e.visible=!1}function T(){t&&e.remove(t),n?.dispose(),s?.dispose(),t=n=s=null,r=null,o=null;for(let S of u)e.remove(S.mesh),S.geo.dispose();u=[],d=null,p?.dispose(),p=null}function w(S){if(!e.visible||!t)return-1;n.computeBoundingSphere();let v=S.intersectObject(t,!1)[0];return v?c[v.faceIndex]:-1}function C(S){if(!e.visible||!t)return null;n.computeBoundingSphere();let v=null,E=S.intersectObject(t,!1)[0];E&&(v={muscle:c[E.faceIndex],distance:E.distance});for(let P of u){P.geo.boundingSphere||P.geo.computeBoundingSphere();let O=S.intersectObject(P.mesh,!1)[0];O&&(!v||O.distance<v.distance)&&(v={sheet:P.owner[O.faceIndex],distance:O.distance})}return v}return{group:e,update:x,hide:R,dispose:T,pick:w,pickAny:C,get mesh(){return t},get sheets(){return u.map(S=>S.mesh)}}}var il=186,lx=37,vf=4,cx=24,hx={ao:[.85,.35],relief:[.6,6],roughness:.72},ux=()=>({...hx,...globalThis.ANNY_LOOK||{}});function fx(i,e,t){let n=Math.atan2(i,t),s=97.5-Math.cos(n),r=i>=0?1:-1,o=Math.atan2((i-8.8*r)*r,t),a=85+1.5*Math.cos(o)+8*Math.sin(o);return Math.min(s-e,e-a)}var dx=new Set(["pelvis","lumbar","thorax","thL","thR"]);function px(i,e,t,n,s){if(!(n>0))return;let r=i.attributes.normal.array,o=Array.from({length:t},()=>new Set);for(let l=0;l<e.length;l+=3){let c=e[l],h=e[l+1],u=e[l+2];o[c].add(h).add(u),o[h].add(c).add(u),o[u].add(c).add(h)}let a=Float32Array.from(r);for(let l=0;l<s;l++){let c=new Float32Array(a.length);for(let h=0;h<t;h++){let u=a[h*3],d=a[h*3+1],p=a[h*3+2];for(let y of o[h])u+=a[y*3],d+=a[y*3+1],p+=a[y*3+2];let _=Math.hypot(u,d,p)||1;c[h*3]=u/_,c[h*3+1]=d/_,c[h*3+2]=p/_}a=c}for(let l=0;l<t;l++){let c=r[l*3]+n*(r[l*3]-a[l*3]),h=r[l*3+1]+n*(r[l*3+1]-a[l*3+1]),u=r[l*3+2]+n*(r[l*3+2]-a[l*3+2]),d=Math.hypot(c,h,u)||1;r[l*3]=c/d,r[l*3+1]=h/d,r[l*3+2]=u/d}i.attributes.normal.needsUpdate=!0}function mx(i,e,t){let n=o=>{let a=new Float32Array(o.length);for(let l=0;l<e.length;l+=3){let c=e[l]*3,h=e[l+1]*3,u=e[l+2]*3,d=o[u]-o[h],p=o[u+1]-o[h+1],_=o[u+2]-o[h+2],y=o[c]-o[h],m=o[c+1]-o[h+1],f=o[c+2]-o[h+2],b=p*f-_*m,x=_*y-d*f,g=d*m-p*y;a[c]+=b,a[c+1]+=x,a[c+2]+=g,a[h]+=b,a[h+1]+=x,a[h+2]+=g,a[u]+=b,a[u+1]+=x,a[u+2]+=g}for(let l=0;l<a.length;l+=3){let c=Math.hypot(a[l],a[l+1],a[l+2])||1;a[l]/=c,a[l+1]/=c,a[l+2]/=c}return a},s=n(i),r=new Float32Array(i.length);return t.map(o=>{for(let l=0;l<r.length;l++)r[l]=i[l]+o.array[l];let a=n(r);for(let l=0;l<a.length;l++)a[l]-=s[l];return new qe(a,3)})}var xf=`
uniform vec4 annyDQ[ANNY_FRAMES*2];
#define ANNY_FLOOR ${il.toFixed(1)}
#define ANNY_SUP ${vf}
attribute vec4 annyIndex;
attribute vec4 annyWeight;
/* \u0440\u0430\u043C\u043A\u0430 \u0437\u0430\u043A\u0440\u0443\u0442\u043A\u0438 \u043F\u043B\u0435\u0447\u0430 (AnnySkin.slotDQ): [\u044F\u0447\u0435\u0439\u043A\u0430 \u043F\u043B\u0435\u0447\u0430 (0\u20133), \u0435\u0433\u043E \u0440\u0430\u043C\u043A\u0430 \u0437\u0430\u043A\u0440\u0443\u0442\u043A\u0438, \u0434\u043E\u043B\u044F \u0437\u0430\u043A\u0440\u0443\u0442\u043A\u0438 \u0432 \u044F\u0447\u0435\u0439\u043A\u0435]; \u0434\u043E\u043B\u044F 0 \u2014 \u043D\u0435\u0442.
   \u0421\u043C\u0435\u0448\u0430\u043D\u043D\u044B\u0439 \u043A\u0432\u0430\u0442\u0435\u0440\u043D\u0438\u043E\u043D \u044F\u0447\u0435\u0439\u043A\u0438 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043E\u0434\u0438\u043D \u0440\u0430\u0437 \u043D\u0430 \u0432\u0435\u0440\u0448\u0438\u043D\u0443 \u0434\u043E \u0446\u0438\u043A\u043B\u0430 (\u0432 \u0446\u0438\u043A\u043B\u0435 \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u0434\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430): \u0432\u0435\u0442\u0432\u043B\u0435\u043D\u0438\u0435 \u0438 \u0432\u044B\u0431\u043E\u0440\u043A\u0438 \u0438\u0437
   uniform-\u043C\u0430\u0441\u0441\u0438\u0432\u0430 \u0432 \u043A\u0430\u0436\u0434\u043E\u0439 \u044F\u0447\u0435\u0439\u043A\u0435 \u0441\u0442\u043E\u0438\u043B\u0438 \u0440\u0430\u0441\u0442\u0440\u0443 SwiftShader \u043E\u043A\u043E\u043B\u043E 10 % */
attribute vec3 annyRoll;
int annyRollSlot(ivec4 ix,out vec4 mr,out vec4 md){
 mr=vec4(0.);md=vec4(0.);if(annyRoll.z<=0.)return -1;
 int s=int(annyRoll.x+.5),i=ix[s],j=int(annyRoll.y+.5);vec4 ur=annyDQ[i*2],ud=annyDQ[i*2+1],rr=annyDQ[j*2],rd=annyDQ[j*2+1];
 float sg=dot(ur,rr)<0.?-1.:1.;mr=mix(ur,sg*rr,annyRoll.z);md=mix(ud,sg*rd,annyRoll.z);return s;
}
void annyBlend(out vec4 r,out vec4 d){
 ivec4 ix=ivec4(annyIndex+.5);
 vec4 mr,md;int rs=annyRollSlot(ix,mr,md);
 vec4 r0=rs==0?mr:annyDQ[ix.x*2];r=vec4(0.);d=vec4(0.);
 for(int k=0;k<4;k++){
  float w=annyWeight[k];if(w<=0.)continue;
  vec4 qr=annyDQ[ix[k]*2],qd=annyDQ[ix[k]*2+1];
  if(k==rs){qr=mr;qd=md;}
  if(dot(qr,r0)<0.)w=-w;
  r+=w*qr;d+=w*qd;
 }
 float l=length(r);r/=l;d/=l;
}
vec3 annyRotate(vec4 q,vec3 p){return p+2.*cross(q.xyz,cross(q.xyz,p)+q.w*p);}
vec3 annyMove(vec4 r,vec4 d,vec3 p){return annyRotate(r,p)+2.*(r.w*d.xyz-d.w*r.xyz+cross(r.xyz,d.xyz));}
/* \u043E\u043F\u043E\u0440\u044B (AnnySkin.supports, supportMove \u2014 \u0442\u043E\u0442 \u0436\u0435 \u0440\u0430\u0441\u0447\u0451\u0442): \u043A\u043E\u0436\u0430 \u0447\u0430\u0441\u0442\u0438 \u0442\u0435\u043B\u0430 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u0430 \u0443 \u043E\u043F\u043E\u0440\u044B \u043B\u043E\u0436\u0438\u0442\u0441\u044F \u043D\u0430 \u043D\u0435\u0451. \u041D\u0430 \u043E\u043F\u043E\u0440\u0443 6 vec4:
   \u0446\u0435\u043D\u0442\u0440 \u0438 \u0442\u0438\u043F (0 \u2014 \u043A\u043E\u0440\u043E\u0431\u043A\u0430 \u0441\u043E \u0441\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435\u043C, 1 \u2014 \u0446\u0438\u043B\u0438\u043D\u0434\u0440 \u043F\u043E \u043E\u0441\u0438 y), \u0442\u0440\u0438 \u043E\u0441\u0438 \u0441 \u043F\u043E\u043B\u0443\u0440\u0430\u0437\u043C\u0435\u0440\u0430\u043C\u0438, [\u0441\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435, a, \u043F\u0435\u0440\u0435\u0445\u043E\u0434, \u0441\u0438\u043B\u0430],
   [\u0431\u0438\u0442\u044B \u0440\u0430\u043C\u043E\u043A \u0447\u0430\u0441\u0442\u0438 \u0442\u0435\u043B\u0430 (\u043F\u043E 19 \u0432 \u0447\u0438\u0441\u043B\u0435), \u043F\u044F\u0442\u043A\u0430: 1000 + \u043F\u043E\u0440\u043E\u0433 z \u0432 \u0441\u0442\u043E\u0439\u043A\u0435 (0 \u2014 \u0432\u0441\u044F \u0447\u0430\u0441\u0442\u044C \u0442\u0435\u043B\u0430)]; st \u2014 \u0432\u0435\u0440\u0448\u0438\u043D\u0430 \u0432 \u0441\u0442\u043E\u0439\u043A\u0435 */
uniform vec4 annySup[ANNY_SUP*6];
uniform int annySupN;
float annySupBit(vec4 m,int i){int c=i/19;float v=c==0?m.x:c==1?m.y:m.z;return float((int(v+.5)>>(i-c*19))&1);}
vec3 annySupport(vec3 p,vec3 st){
 if(annySupN==0)return p;
 ivec4 ix=ivec4(annyIndex+.5);
 for(int k=0;k<ANNY_SUP;k++){
  if(k>=annySupN)break;
  vec4 c0=annySup[k*6],X=annySup[k*6+1],Y=annySup[k*6+2],Z=annySup[k*6+3],pr=annySup[k*6+4],mk=annySup[k*6+5];
  float m=0.;for(int j=0;j<4;j++){float w=annyWeight[j];if(w>0.)m+=w*annySupBit(mk,ix[j]);}
  if(mk.w>0.){float u=clamp((mk.w-1000.+1.-st.z)*.5,0.,1.);m*=u*u*(3.-2.*u);}
  if(m<=0.)continue;
  vec3 d=p-c0.xyz,l=vec3(dot(d,X.xyz),dot(d,Y.xyz),dot(d,Z.xyz)),g;float h;
  if(c0.w<.5){vec3 q=abs(l)-vec3(X.w,Y.w,Z.w)+pr.x,qp=max(q,0.);float lo=length(qp);h=lo+min(max(q.x,max(q.y,q.z)),0.)-pr.x;
   g=lo>0.?qp/lo*sign(l):q.x>=q.y&&q.x>=q.z?vec3(sign(l.x),0.,0.):q.y>=q.z?vec3(0.,sign(l.y),0.):vec3(0.,0.,sign(l.z));}
  else{float rd=length(l.xz);vec2 e=vec2(rd-X.w,abs(l.y)-Y.w),ep=max(e,0.);float lo=length(ep);h=min(max(e.x,e.y),0.)+lo;
   vec3 rv=rd>1e-6?vec3(l.x/rd,0.,l.z/rd):vec3(1.,0.,0.),yv=vec3(0.,sign(l.y),0.);g=lo>0.?(rv*ep.x+yv*ep.y)/lo:e.x>=e.y?rv:yv;}
  float a=pr.y,H=pr.z,b=a+H;if(h<0.||h>=b)continue;
  float t=clamp((h-a)/H,0.,1.),f=h<=a?0.:b*t*t*(3.-2.*t)+H*t*t*(t-1.);
  p+=(X.xyz*g.x+Y.xyz*g.y+Z.xyz*g.z)*((f-h)*m*pr.w);
 }
 return p;
}
#ifdef ANNY_LBS
/* \u043B\u0438\u043D\u0435\u0439\u043D\u043E\u0435 \u0441\u043C\u0435\u0448\u0435\u043D\u0438\u0435 \u0442\u0435\u0445 \u0436\u0435 \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0439 (\u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u044F \u043D\u0430 \u043B\u0438\u0441\u0442\u0430\u0445: globalThis.ANNY_METHOD = 'lbs') */
vec3 annyLinear(vec3 p,bool dir){
 ivec4 ix=ivec4(annyIndex+.5);vec3 o=vec3(0.);vec4 mr,md;int rs=annyRollSlot(ix,mr,md);
 for(int k=0;k<4;k++){float w=annyWeight[k];if(w<=0.)continue;vec4 r=annyDQ[ix[k]*2],d=annyDQ[ix[k]*2+1];if(k==rs){r=mr;d=md;}o+=w*(dir?annyRotate(r,p):annyMove(r,d,p));}
 return o;
}
#endif
`,gx=`attribute vec4 annyColor;
varying vec4 vAnnyColor;
`,_x=`
vAnnyColor=annyColor;`,Gc=i=>i===2?"vec2":"float",xx=i=>i?"attribute "+Gc(i)+` annyLook;
varying `+Gc(i)+` vAnnyLook;
`:"",yx=i=>i?"vAnnyLook=annyLook;":"";function yf(i,e,{normals:t=!0,color:n=!1,lookN:s=0}={}){let r=(n?gx:"")+xx(s),o=(n?_x:"")+yx(s);if(globalThis.ANNY_METHOD==="lbs"){i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
#define ANNY_LBS
#define ANNY_FRAMES `+e+`
`+xf+r),t&&(i.vertexShader=i.vertexShader.replace("#include <skinnormal_vertex>","objectNormal=normalize(annyLinear(objectNormal,true));")),i.vertexShader=i.vertexShader.replace("#include <skinning_vertex>","transformed=annySupport(annyLinear(transformed,false),transformed);transformed.y=min(transformed.y,ANNY_FLOOR);"+o);return}i.vertexShader=i.vertexShader.replace("#include <common>",`#include <common>
#define ANNY_FRAMES `+e+`
`+xf+r),t&&(i.vertexShader=i.vertexShader.replace("#include <skinnormal_vertex>",`vec4 annyR,annyD;annyBlend(annyR,annyD);objectNormal=annyRotate(annyR,objectNormal);
#ifdef USE_TANGENT
objectTangent=annyRotate(annyR,objectTangent);
#endif`)),i.vertexShader=i.vertexShader.replace("#include <skinning_vertex>",(t?"":`vec4 annyR,annyD;annyBlend(annyR,annyD);
`)+"transformed=annySupport(annyMove(annyR,annyD,transformed),transformed);transformed.y=min(transformed.y,ANNY_FLOOR);"+o)}function Mf(i,e){let t=new ht;t.name="anny",t.visible=!1,i.add(t);let n=null,s=null,r=null,o=null,a=null,l=null,c="",h=null,u={value:.28};function d(f){m();let b=new ot;b.setAttribute("position",new qe(f.pos,3));let x=new Uint16Array(f.idx.length);for(let E=0;E<x.length;E+=3)x[E]=f.idx[E],x[E+1]=f.idx[E+2],x[E+2]=f.idx[E+1];b.setIndex(new qe(x,1)),b.computeVertexNormals();let g=ux();px(b,x,f.nv,g.relief?.[0]??0,g.relief?.[1]??6);let R=new Ge(g.trunks?.color||"#000"),T=g.trunks?.alpha||0,w=(g.ao?.[0]||0)>0||(g.ao?.[1]||0)>0,C=T>0?2:w?1:0,S=C===2?"vAnnyLook.x":"vAnnyLook";b.setAttribute("annyIndex",new qe(Float32Array.from(f.wi),4)),b.setAttribute("annyWeight",new qe(f.ww,4));let v=new Float32Array(f.nv*3);if(f.roll)for(let E=0;E<f.nv;E++){let P=f.roll.share[E];if(P>0)for(let O=0;O<4;O++){let Y=f.wi[E*4+O],z=f.roll.map[Y];if(z>=0&&f.ww[E*4+O]>0){v[E*3]=O,v[E*3+1]=z,v[E*3+2]=P;break}}}if(b.setAttribute("annyRoll",new qe(v,3)),l=new qe(new Uint8Array(f.nv*4),4,!0),l.setUsage(As),b.setAttribute("annyColor",l),C){let E=new Float32Array(f.nv*C);for(let P=0;P<f.nv;P++)if(E[P*C]=f.shade?f.shade[P]:1,C===2){let O=f.frames[f.wi[P*4]];E[P*2+1]=dx.has(O)?Math.max(-8,Math.min(8,fx(f.pos[P*3],il-f.pos[P*3+1],f.pos[P*3+2]))):-8}b.setAttribute("annyLook",new qe(E,C))}f.correctives.length&&(b.morphAttributes.position=f.correctives.map(E=>{let P=new Float32Array(f.nv*3);for(let O=0;O<E.n;O++){let Y=E.i[O];P[Y*3]=E.d[O*3],P[Y*3+1]=E.d[O*3+1],P[Y*3+2]=E.d[O*3+2]}return new qe(P,3)}),b.morphTargetsRelative=!0,b.morphAttributes.normal=mx(f.pos,x,b.morphAttributes.position)),b.boundingSphere=new wn(new U,1e3),b.boundingBox=new kt(new U(-1e3,-1e3,-1e3),new U(1e3,1e3,1e3)),a={annyDQ:{value:new Float32Array(f.frames.length*8)},annySup:{value:new Float32Array(vf*cx)},annySupN:{value:0}},r=e.clone(),r.name="anny-skin",r.side=Zt,r.roughness=g.roughness??e.roughness,a.annyAO={value:new ve(g.ao?.[0]??0,g.ao?.[1]??0)},a.annyTrunk={value:new ct(R.r,R.g,R.b,T)},r.onBeforeCompile=E=>{E.uniforms.annyDQ=a.annyDQ,E.uniforms.annySup=a.annySup,E.uniforms.annySupN=a.annySupN,E.uniforms.annyGlow=u,E.uniforms.annyAO=a.annyAO,E.uniforms.annyTrunk=a.annyTrunk,yf(E,f.frames.length,{color:!0,lookN:C}),E.fragmentShader=E.fragmentShader.replace("#include <common>",`#include <common>
varying vec4 vAnnyColor;
`+(C?"varying "+Gc(C)+` vAnnyLook;
`:"")+`uniform float annyGlow;
uniform vec2 annyAO;
uniform vec4 annyTrunk;
vec3 annyLinear(vec3 c){return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(.04045,c));}`).replace("#include <color_fragment>",`#include <color_fragment>
`+(T>0?`float annyFw=max(fwidth(vAnnyLook.y)*.75,1e-3);if(vAnnyLook.y>-annyFw)diffuseColor.rgb=mix(diffuseColor.rgb,annyTrunk.rgb,smoothstep(-annyFw,annyFw,vAnnyLook.y)*annyTrunk.a);
`:"")+"vec3 annyZone=vec3(0.);if(vAnnyColor.a>0.){annyZone=annyLinear(vAnnyColor.rgb);diffuseColor.rgb=mix(diffuseColor.rgb,annyZone,vAnnyColor.a);}").replace("#include <aomap_fragment>",`#include <aomap_fragment>
`+(w?"reflectedLight.indirectDiffuse*=mix(1.,"+S+",annyAO.x);float annyDir=mix(1.,"+S+",annyAO.y);reflectedLight.directDiffuse*=annyDir;reflectedLight.directSpecular*=annyDir;":"")).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance+=annyZone*annyGlow*vAnnyColor.a;`)},r.customProgramCacheKey=()=>"anny-skin-"+f.frames.length+(T>0?"-trunks":"")+(w?"-ao":"")+(globalThis.ANNY_METHOD||""),o=new di({depthPacking:Ts}),o.onBeforeCompile=E=>{E.uniforms.annyDQ=a.annyDQ,E.uniforms.annySup=a.annySup,E.uniforms.annySupN=a.annySupN,yf(E,f.frames.length,{normals:!1})},o.customProgramCacheKey=()=>"anny-depth-"+f.frames.length+(globalThis.ANNY_METHOD||""),s=new et(b,r),s.name="anny-skin",s.customDepthMaterial=o,s.castShadow=!0,s.receiveShadow=!1,s.frustumCulled=!1,s.matrixAutoUpdate=!1,s.matrix.set(.01,0,0,0,0,-.01,0,il/100,0,0,.01,0,0,0,0,1),f.correctives.length&&(s.morphTargetInfluences=new Array(f.correctives.length).fill(0)),t.add(s),n=f,c="",h=[];for(let E=0;E<f.nv;E+=lx)h.push(E)}function p(f,b,x){n!==f&&d(f);let g=globalThis.AnnySkin,R=b.pose,T=g.skinMats(R,f),w=g.correctiveWeights(R,f),C=g.dualQuats(T,f.frames.length);a.annyDQ.value.set(C),s.morphTargetInfluences&&w.forEach((P,O)=>{s.morphTargetInfluences[O]=P});let S=g.supports?g.supports(R,f,b.props||null,w,{S:T,DQ:C}):null;S?(a.annySup.value.set(S.u),a.annySupN.value=S.n):a.annySupN.value=0,_(f,x);let v=g.skin(R,{d:f,only:h,corr:w,mats:{S:T,DQ:C},sup:S}),E=[];for(let P=0;P<h.length;P++)E.push(new U(v[P*3]/100,(il-v[P*3+1])/100,v[P*3+2]/100));return s.userData.boundsPoints=E,t.visible=!0,s}function _(f,b){let x=b?.on?globalThis.AnnySkin.regions(f):null,g=x?x.ids:[],R=[],T="";for(let E of g)for(let P of["L","R"]){let O=b.regions?.[E],Y=!!O?.visible,z=Y&&(!b.selected||b.selected==="all"||b.selected===E||b.selected===O.parent),H=b.sideValues?.[P]?.[E]??b.values?.[E]??.28,Z=z&&H>0?b.color(H):null;R.push(Z),T+=(Z||"-")+"|"}if(T===c)return;c=T;let w=new Ge,C={},S=R.map(E=>E?(w.set(E).getRGB(C,At),[Math.round(C.r*255),Math.round(C.g*255),Math.round(C.b*255),255]):[0,0,0,0]),v=l.array;if(v.fill(0),x)for(let E=0;E<f.nv;E++){let P=x.rid[E];if(!P)continue;let O=S[(P-1)*2+f.region.side[E]];O[3]&&(v[E*4]=O[0],v[E*4+1]=O[1],v[E*4+2]=O[2],v[E*4+3]=255)}l.needsUpdate=!0}function y(){t.visible=!1}function m(){s&&(s.geometry.dispose(),t.remove(s)),r?.dispose(),o?.dispose(),s=r=o=null,n=null}return{group:t,update:p,hide:y,dispose:m,setGlow(f){u.value=f},get mesh(){return s}}}var jt=i=>[i[0]/100,(186-i[1])/100,i[2]/100],Bs=i=>[i[0],-i[1],i[2]],Zi=i=>new U(...i),yi=(i,e)=>[i[0]-e[0],i[1]-e[1],i[2]-e[2]],Os=(i,e,t=1)=>[i[0]+e[0]*t,i[1]+e[1]*t,i[2]+e[2]*t],Wc=i=>Math.hypot(...i),Qt=i=>{let e=Wc(i)||1;return i.map(t=>t/e)},Sf=(i,e)=>i[0]*e[0]+i[1]*e[1]+i[2]*e[2],sl=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],vx=new Set(["beam","obox","cyl","sphere","cable","prism"]),Zr=i=>vx.has(i.kind)||i.kind==="barbell"&&i.len||i.kind==="dumbbell"&&i.handle||i.kind==="kettlebell"&&i.handleAxis;function Xc(i){return i.kind+(i.kind==="barbell"?JSON.stringify(i.plates||[]):"")+(i.kind==="cable"?":"+i.pts.length+(i.joints?":j":"")+(i.flat?":f":""):"")+(i.kind==="beam"?i.r?":r":":w":"")+(i.kind==="cyl"?":"+(i.sides||24):"")+(i.kind==="prism"?":"+Mx(i):"")}var Mx=i=>i.pts.length+":"+i.len+":"+i.pts.reduce((e,t)=>e+t[0]*1.7+t[1]*2.3,0).toFixed(3);function Sx(i){let e=new ys(i.pts.map(n=>new ve(n[0]/100,n[1]/100))),t=new Rr(e,{depth:i.len/100,bevelEnabled:!1,curveSegments:1});return t.translate(0,0,-i.len/200),t.computeVertexNormals(),t}function Yr(i,e,t){let n=Qt(Bs(i)),s=Qt(Bs(e)),r=sl(n,s);return new Ut().setFromRotationMatrix(new nt().makeBasis(Zi(n),Zi(s),Zi(r)))}var rl=new U(0,1,0);function bf(i,e,t){let n=yi(t,e),s=Wc(n);return i.visible=s>1e-4,i.visible?(i.position.fromArray(jt(Os(e,n,.5))),i.quaternion.setFromUnitVectors(rl,Zi(Qt(Bs(n)))),s):0}var Ef=i=>i.size.map(e=>e.toFixed(2)).join(",")+":"+(i.round??.6);function wf(i){let[e,t,n]=i.size.map(r=>Math.max(.05,r)/100),s=Math.min((i.round??.6)/100,Math.min(e,t,n)*.45);return new Zn(e,t,n,s>.004?3:1,Math.max(1e-4,s))}function Tf(i,e,t,n){let s=new ht;s.name="prop-"+e.kind+(e.id?":"+e.id:""),i.add(s);let r=t[e.tone]||t.frame||t.steel;if(e.kind==="beam")e.r?n(s,new bt(1,1,1,16),r,"beam"):n(s,new Zn(1,1,1,2,.08),r,"beam");else if(e.kind==="obox"){let o=n(s,wf(e),r,"box");o.userData.size=Ef(e)}else if(e.kind==="cyl")n(s,new bt(1,1,1,e.sides||24),r,"cyl");else if(e.kind==="sphere")n(s,new Nt(1,18,12),r,"sphere");else if(e.kind==="prism")n(s,Sx(e),r,"prism");else if(e.kind==="cable"){for(let o=1;o<e.pts.length;o++)n(s,e.flat?new yn(1,1,1):new bt(1,1,1,e.joints?12:8),r,"cable");if(e.joints&&!e.flat)for(let o=1;o<e.pts.length-1;o++)n(s,new Nt(1,12,8),r,"joint")}else if(e.kind==="barbell"){n(s,new bt(1,1,1,18),t.chrome,"shaft");for(let o of[-1,1])n(s,new bt(1,1,1,18),t.chrome,"sleeve").userData.sign=o,n(s,new bt(1,1,1,18),t.chrome,"collar").userData.sign=o,(e.plates||[]).forEach((a,l)=>{let c=n(s,new bt(1,1,1,32),t.plate,"plate");c.userData={sign:o,i:l}})}else if(e.kind==="kettlebell"){let o=e.radius||10.5,a=(e.bottom??7.83*o/10.5)/o,l=Math.acos(-a),c=[];for(let d=0;d<=24;d++){let p=l*d/24;c.push(new ve(Math.sin(p),Math.cos(p)))}c.push(new ve(0,-a)),n(s,new Cr(c.reverse(),32),t.plate,"bell");let h=(e.handleUp??15.6*(e.radius||10.5)/10.5)/(e.radius||10.5)*10.5,u=[[-7.2,6.5],[-9.2,h-4.6],[-8.4,h-1],[-5,h],[5,h],[8.4,h-1],[9.2,h-4.6],[7.2,6.5]].map(([d,p])=>new U(d/10.5,p/10.5,0));n(s,new Pn(new An(u),40,.16,10,!1),t.plate,"handle")}else if(e.kind==="dumbbell"){n(s,new bt(1,1,1,14),t.chrome,"handle");for(let o of[-1,1])n(s,new bt(1,1,1,6),t.plate,"head").userData.sign=o,n(s,new bt(1,1,1,14),t.chrome,"inner").userData.sign=o}return{group:s,kind:e.kind,key:Xc(e)}}function Af(i,e){let t=i.group,n=t.children;if(t.visible=!0,e.kind==="beam"){let s=n[0],r=bf(s,e.a,e.b);if(e.r)s.scale.set(e.r/100,r/100,e.r/100);else{let o=Qt(yi(e.b,e.a)),a=yi(e.up||[0,-1,0],o.map(c=>c*Sf(e.up||[0,-1,0],o)));Wc(a)<1e-6&&(a=Math.abs(o[2])<.9?yi([0,0,1],o.map(c=>c*o[2])):yi([1,0,0],o.map(c=>c*o[0]))),a=Qt(a);let l=sl(o,a);s.quaternion.copy(Yr(l,o,a)),s.scale.set(e.w/100,r/100,e.h/100)}}else if(e.kind==="obox"){let s=n[0],r=Ef(e);s.userData.size!==r&&(s.geometry.dispose(),s.geometry=wf(e),s.userData.size=r),s.position.fromArray(jt(e.c)),s.quaternion.copy(Yr(e.x,e.y,e.z)),s.scale.set(1,1,1)}else if(e.kind==="cyl"){let s=n[0];s.position.fromArray(jt(e.c)),s.quaternion.setFromUnitVectors(rl,Zi(Qt(Bs(e.axis)))),s.scale.set(e.r/100,e.len/100,e.r/100)}else if(e.kind==="sphere"){let s=n[0];s.position.fromArray(jt(e.c)),s.scale.setScalar(e.r/100)}else if(e.kind==="prism"){let s=n[0];s.position.fromArray(jt(e.c)),s.quaternion.copy(Yr(e.u,e.v,e.w))}else if(e.kind==="cable"){let s=e.pts.length-1;for(let r=1;r<=s;r++){let o=n[r-1],a=bf(o,e.pts[r-1],e.pts[r]),l=e.rs?e.rs[r-1]:e.r;if(e.flat&&a>1e-4){let c=Qt(yi(e.pts[r],e.pts[r-1])),h=e.nrm?.[r-1]||[0,-1,0],u=Qt(yi(h,c.map(p=>p*Sf(h,c)))),d=sl(c,u);o.quaternion.copy(Yr(d,c,u)),o.scale.set(e.flat[0]/100,a/100,e.flat[1]/100)}else o.scale.set(l/100,a/100,l/100)}if(e.joints&&!e.flat)for(let r=1;r<s;r++){let o=n[s+r-1],a=e.rs?Math.max(e.rs[r-1],e.rs[r]):e.r;o.position.fromArray(jt(e.pts[r])),o.scale.setScalar(a/100)}}else if(e.kind==="barbell"){let s=Qt(e.axis),r=e.c,o=new Ut().setFromUnitVectors(rl,Zi(Qt(Bs(s))));for(let a of n){a.quaternion.copy(o);let l=a.userData.sign;if(a.name==="shaft")a.position.fromArray(jt(r)),a.scale.set(e.shaftR/100,2*e.inner/100,e.shaftR/100);else if(a.name==="collar")a.position.fromArray(jt(Os(r,s,l*(e.inner+1)))),a.scale.set(3.6/100,2/100,3.6/100);else if(a.name==="sleeve"){let c=e.inner+2,h=e.len/2;a.position.fromArray(jt(Os(r,s,l*(c+h)/2))),a.scale.set(e.sleeveR/100,(h-c)/100,e.sleeveR/100)}else if(a.name==="plate"){let c=e.inner+2.4;for(let d=0;d<a.userData.i;d++)c+=e.plates[d][1]+.3;let[h,u]=e.plates[a.userData.i];a.position.fromArray(jt(Os(r,s,l*(c+u/2)))),a.scale.set(h/100,u/100,h/100)}}}else if(e.kind==="kettlebell"){let s=Qt(yi(e.grip,e.c)),r=Qt(e.handleAxis),o=sl(r,s);t.position.fromArray(jt(e.c)),t.quaternion.copy(Yr(r,s,o)),t.scale.setScalar(e.radius/100)}else if(e.kind==="dumbbell"){let s=Qt(e.axis),r=e.c,o=new Ut().setFromUnitVectors(rl,Zi(Qt(Bs(s))));for(let a of n){a.quaternion.copy(o);let l=a.userData.sign;a.name==="handle"?(a.position.fromArray(jt(r)),a.scale.set(1.6/100,(e.handle+2)/100,1.6/100)):a.name==="inner"?(a.position.fromArray(jt(Os(r,s,l*(e.handle/2+.6)))),a.scale.set(2.6/100,1.2/100,2.6/100)):(a.position.fromArray(jt(Os(r,s,l*(e.handle/2+1.2+e.headLen/2)))),a.scale.set(e.headR/100,e.headLen/100,e.headR/100))}}}var Jn=(i,e,t=1)=>i.map((n,s)=>n+e[s]*t),ks=(i,e)=>i.map((t,n)=>t-e[n]),bx=(i,e)=>i.reduce((t,n,s)=>t+n*e[s],0),ol=i=>Math.hypot(...i),vi=i=>{let e=ol(i);if(e<1e-8)throw Error("Degenerate scene direction");return i.map(t=>t/e)},Yc=(i,e)=>[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]],Vt=i=>[i[0]/100,(186-i[1])/100,i[2]/100],$n=i=>[i[0],-i[1],i[2]],$i=i=>new U(...i),Hs={above:[35,-55],angle:[55,-15],side:[90,0],front:[0,0],back:[180,0],rear:[235,-15]};function Ex(i){let e=i?.chestN;if(!e||Math.hypot(e[0],e[2])<.5)return 0;let n=Math.atan2(-e[0],e[2])*180/Math.PI,s=Math.round(n/90)*90;return s===-180?180:s||0}function wx(i=0){return i?Object.fromEntries(Object.entries(Hs).map(([e,[t,n]])=>[e,[t+i,n]])):Hs}function Tx(i,e,t){let n=vi(ks(e,i)),s=ks(t,n.map(r=>r*bx(t,n)));return ol(s)<1e-5&&(s=Yc(n,Math.abs(n[0])<.8?[1,0,0]:[0,0,1])),s=vi(s),{x:s,y:vi(Yc(n,s)),z:n}}function Rf(i,e,t){return new Ut().setFromRotationMatrix(new nt().makeBasis($i(i),$i(e),$i(t)))}function It(i,{roughness:e=.6,metalness:t=0}={}){return new Xt({color:i,roughness:e,metalness:t,side:Ft})}function en(i,e,t,n){let s=new et(e,t);return s.name=n,s.castShadow=!0,s.receiveShadow=!0,i.add(s),s}var Dt={background:["#1b2636","#0b1119"],floor:["#44536b","#111925"],hemi:[15002871,3818066,2.1],key:[16773600,1.9,[-2.2,5.2,3.2]],fill:[12374783,.9,[3.4,1.6,2.4]],rim:[14214911,1.5,[1.2,3.2,-4.6]],environment:0,shadow:"pcf",exposure:.93,muscleGlow:.28},Ji={core:.03,rim:.62,power:2.2,color:"#cfdbec",order:4};function Ax(){let i=new Xt({color:Ji.color,roughness:.7,metalness:0,transparent:!0,depthWrite:!1,side:Ft}),e=t=>t.toFixed(4);return i.onBeforeCompile=t=>{t.fragmentShader=t.fragmentShader.replace("#include <opaque_fragment>",`
   vec3 ghostView=isOrthographic?vec3(0.,0.,1.):normalize(vViewPosition);
   float ghostRim=pow(1.-clamp(abs(dot(normalize(normal),ghostView)),0.,1.),${e(Ji.power)});
   gl_FragColor=vec4(outgoingLight,${e(Ji.core)}+${e(Ji.rim-Ji.core)}*ghostRim);`)},i.name="ghost-skin",i.customProgramCacheKey=()=>"ghost-skin",i.forceSinglePass=!0,i}function Rx(i,e,t=128){let n=new Ge(i),s=new Ge(e),r=new Uint8Array(t*t*4),o=new Ge;for(let l=0;l<t;l++)for(let c=0;c<t;c++){let h=Math.min(1,Math.hypot(c/(t-1)-.5,l/(t-1)-.5)*2),u=h*h*(3-2*h);o.copy(n).lerp(s,u);let d=(l*t+c)*4;r[d]=Math.round(o.r*255),r[d+1]=Math.round(o.g*255),r[d+2]=Math.round(o.b*255),r[d+3]=255}let a=new fi(r,t,t);return a.colorSpace=At,a.magFilter=Jt,a.minFilter=Jt,a.needsUpdate=!0,a}function Cx(i,e,t,n){let s=[],r=[],o=i/2,a=i/e,l=new Ge(t),c=(d,p)=>Math.max(0,1-Math.hypot(d,p)/o)**1.6;for(let d=0;d<=e;d++){let p=-o+d*a;for(let _=0;_<e;_++){let y=-o+_*a,m=y+a;s.push(p,0,y,p,0,m,y,0,p,m,0,p);for(let[f,b]of[[p,y],[p,m],[y,p],[m,p]])r.push(l.r,l.g,l.b,c(f,b))}}let h=new ot;h.setAttribute("position",new ut(s,3)),h.setAttribute("color",new ut(r,4));let u=new mr(h,new Gn({vertexColors:!0,transparent:!0,opacity:.55,depthWrite:!1}));return u.name="floor-grid",u.position.set(...n),u}function Ix(i,e,t){i.position.fromArray(Vt(e)),i.scale.set(...t.map(n=>n/100))}function qc(i,e,t,n){let s=ks(t,e),r=ol(s);i.visible=r>1e-5,i.visible&&(i.position.fromArray(Vt(Jn(e,t).map(o=>o/2))),i.scale.set(n/200,r/100,n/200),i.quaternion.setFromUnitVectors(new U(0,1,0),$i($n(vi(s)))))}var zs=i=>!i.dyn&&Zr(i);function Zc(i,e){if(i===e)return!0;if(Array.isArray(i)){if(!Array.isArray(e)||i.length!==e.length)return!1;for(let n=0;n<i.length;n++)if(!Zc(i[n],e[n]))return!1;return!0}if(!i||!e||typeof i!="object"||typeof e!="object"||Array.isArray(e))return!1;let t=Object.keys(i);if(t.length!==Object.keys(e).length)return!1;for(let n of t)if(!Zc(i[n],e[n]))return!1;return!0}function Px(i){let e=0,t=0;for(let u of i){let d=u.geometry;e+=d.attributes.position.count,t+=d.index?d.index.count:d.attributes.position.count}let n=new Float32Array(e*3),s=new Float32Array(e*3),r=e>65535?new Uint32Array(t):new Uint16Array(t),o=new U,a=new Ke,l=0,c=0;for(let u of i){let d=u.geometry,p=d.attributes.position,_=d.attributes.normal,y=u.matrixWorld,m=y.determinant()<0,f=d.index;a.getNormalMatrix(y);for(let g=0;g<p.count;g++)o.fromBufferAttribute(p,g).applyMatrix4(y),n[(l+g)*3]=o.x,n[(l+g)*3+1]=o.y,n[(l+g)*3+2]=o.z,o.fromBufferAttribute(_,g).applyMatrix3(a).normalize(),s[(l+g)*3]=o.x,s[(l+g)*3+1]=o.y,s[(l+g)*3+2]=o.z;let b=f?f.count:p.count,x=g=>l+(f?f.getX(g):g);for(let g=0;g+2<b;g+=3)r[c++]=x(g),m?(r[c++]=x(g+2),r[c++]=x(g+1)):(r[c++]=x(g+1),r[c++]=x(g+2));l+=p.count}let h=new ot;return h.setAttribute("position",new qe(n,3)),h.setAttribute("normal",new qe(s,3)),h.setIndex(new qe(r.subarray(0,c),1)),h.computeBoundingSphere(),h.computeBoundingBox(),h}function al(i){let e=new Vn;e.background=new Ge(Dt.background[1]);let t=It("#a0adc0",{roughness:.62}),n=It("#96a4b8",{roughness:.6}),s=It("#323c4c",{roughness:.78}),r={steel:It("#6a7fa2",{roughness:.42,metalness:.25}),bar:It("#d3dbe6",{roughness:.26,metalness:.5}),pad:It("#3c4a62",{roughness:.66}),plate:It("#3d506b",{roughness:.5,metalness:.15}),cable:It("#8494aa",{roughness:.35,metalness:.4}),band:It("#6f9fc7",{roughness:.7}),mat:It("#2a3a52",{roughness:.95}),frame:It("#7186a7",{roughness:.45,metalness:.25}),chrome:It("#dde4ee",{roughness:.24,metalness:.5}),rubber:It("#2b3341",{roughness:.95}),wood:It("#7a6450",{roughness:.78}),wall:It("#2a3546",{roughness:.92}),stack:It("#53668a",{roughness:.4,metalness:.3}),rope:It("#b8a07a",{roughness:.92}),towel:It("#c9cfd8",{roughness:1})},o=new Dr(Dt.hemi[0],Dt.hemi[1],Dt.hemi[2]);e.add(o);let a=(D,k,F)=>{let Q=new Ur(D,k);return Q.position.set(...F),e.add(Q),e.add(Q.target),Q},l=a(...Dt.key),c=a(...Dt.fill),h=a(...Dt.rim);l.name="key-light",c.name="fill-light",h.name="rim-light";let u=Rx(...Dt.floor),d=en(e,new Oi(12,12),new Xt({map:u,roughness:.94,metalness:0}),"floor");d.rotation.x=-Math.PI/2,d.position.y=-.014,d.castShadow=!1,d.position.z=.6;let p=Cx(5,20,4742006,[0,-.01,1]);e.add(p);let _=cf(e,i,{skin:t,joint:n,sole:s,mesh:en}),y=_.parts,m=_.parts.torso.mesh,f=_.parts.head.mesh,b=Mf(e,t),x=!1,g=uf(e),R=_f(e),T=!1,w=Ax(),C=new on({name:"ghost-depth",colorWrite:!1,depthWrite:!0,transparent:!0,side:Ft,forceSinglePass:!0});function S(D){T=D;let k=[];_.group.traverse(F=>{F.isMesh&&!F.userData.ghostTwin&&k.push(F)});for(let F of k){F.userData.skin||(F.userData.skin=F.material),F.material=D?w:F.userData.skin,F.castShadow=!D,F.renderOrder=D?Ji.order+1:0;let Q=F.userData.twin;D&&!Q&&(Q=new et(F.geometry,C),Q.name="ghost-depth",Q.userData.ghostTwin=!0,Q.castShadow=Q.receiveShadow=!1,Q.renderOrder=Ji.order,F.add(Q),F.userData.twin=Q),Q&&(Q.visible=D,Q.geometry=F.geometry,Q.frustumCulled=F.frustumCulled)}}let v=new Map,E=new ht;E.name="regions",e.add(E);let P=new ht;P.name="equipment",e.add(P);let O=[],Y,z={},H=new ht;H.name="equipment-static-parts",H.visible=!1,H.userData.drawnMerged=!0,e.add(H);let Z=new ht;Z.name="equipment-static",e.add(Z);let q=null;function ge(D){Z.traverse(F=>F.geometry?.dispose()),Z.clear();let k=new Map;O.forEach((F,Q)=>{zs(D[Q])&&F.group.traverse(V=>{V.isMesh&&V.visible&&(k.has(V.material)||k.set(V.material,[]),k.get(V.material).push(V))})});for(let[F,Q]of k){let V=en(Z,Px(Q),F,"static-"+Q.length);V.userData.merged=!0,V.userData.sources=Q}q=D.map(F=>zs(F)?F:null)}let me=new ht;me.name="joint-stress",e.add(me);let Me=new Nt(1,18,12),we=new on({color:"#ff3b30",transparent:!0,opacity:.36,depthTest:!1,depthWrite:!1,toneMapped:!1}),We=new on({color:"#ff453a",depthTest:!1,depthWrite:!1,toneMapped:!1}),je=[],Je=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;function te(D){for(;je.length<=D;){let k=new ht;k.name="stress-mark";let F=new et(Me,we),Q=new et(Me,We);F.renderOrder=20,Q.renderOrder=21,Q.scale.setScalar(.03),k.add(F,Q),me.add(k),je.push(k)}return je[D]}function ne(D){let k=Je?1:1+.18*Math.sin((typeof performance<"u"?performance.now():0)/170);D.forEach((F,Q)=>{let V=te(Q);V.visible=!0,V.position.fromArray(Vt(F.p)),V.children[0].scale.setScalar(.078*k)});for(let F=D.length;F<je.length;F++)je[F].visible=!1}function Ie(D,k){if(Zr(D))return Tf(zs(D)?H:P,D,r,en);let F=new ht;F.name="prop-"+k+"-"+D.kind,P.add(F);let Q=r[D.tone]||r.steel;if(D.kind==="box"||D.kind==="panel")en(F,new Zn(1,1,1,2,.012),Q,"pad");else if(D.kind==="line")en(F,new bt(1,1,1,12),Q,"beam");else if(["wheel","roller","weight"].includes(D.kind))en(F,new bt(1,1,1,18),D.kind==="weight"?r.plate:Q,"cylinder");else if(["barbell","dumbbell"].includes(D.kind)){en(F,new bt(1,1,1,18),r.bar,"shaft");for(let V of[-1,1]){let ae=en(F,new bt(1,1,1,20),r.plate,"plate");ae.userData.sign=V;let pe=en(F,new bt(1,1,1,12),r.bar,"collar");if(pe.userData.sign=V,D.kind==="barbell"){let ee=en(F,new bt(1,1,1,16),r.bar,"sleeve");ee.userData.sign=V}}}else if(D.kind==="kettlebell"){let V=en(F,new Nt(1,18,12),r.plate,"kettlebell-body"),ae=Array.from({length:13},(pe,ee)=>new U(-.055+ee/12*.11,.042*Math.sin(Math.PI*ee/12),0));en(F,new Pn(new An(ae),14,.008,7,!1),r.bar,"kettlebell-handle")}else throw Error("Unknown scene prop "+D.kind);return{group:F,kind:D.kind,key:D.kind}}function Ue(D,k){if(Zr(k))return Af(D,k);let F=D.group,Q=k.c,V=k.axis||[1,0,0];if(F.visible=!0,k.kind==="box"){let ae=F.children[0],pe=ks(k.hi,k.lo);ae.position.fromArray(Vt(Jn(k.lo,k.hi).map(ee=>ee/2))),ae.scale.set(...pe.map(ee=>Math.max(.002,ee/100)))}else if(k.kind==="line")qc(F.children[0],k.a,k.b,k.width);else if(k.kind==="panel"){let ae=F.children[0],pe=Tx(k.a,k.b,[1,0,0]);ae.position.fromArray(Vt(Jn(k.a,k.b).map(ee=>ee/2))),ae.quaternion.copy(Rf($n(pe.x),$n(pe.y),$n(pe.z).map(ee=>-ee))),ae.scale.set(k.width/100,k.thickness/100,ol(ks(k.b,k.a))/100)}else if(["wheel","roller","weight"].includes(k.kind)){let ae=F.children[0];ae.position.fromArray(Vt(Q)),ae.quaternion.setFromUnitVectors(new U(0,1,0),$i($n(vi(V))));let pe=(k.radius||6)/100;ae.scale.set(pe,k.kind==="roller"?.36:.055,pe)}else if(["barbell","dumbbell"].includes(k.kind)){let ae=k.kind==="barbell",pe=ae?61:12,ee=ae?48:9,fe=ae?k.radius||17:6,Le=F.children[0];qc(Le,Jn(Q,V,-pe),Jn(Q,V,pe),ae?2.8:2.4);for(let Ee of F.children.slice(1)){if(Ee.name==="sleeve"){qc(Ee,Jn(Q,V,34*Ee.userData.sign),Jn(Q,V,61*Ee.userData.sign),5);continue}let Se=Ee.name==="collar",Xe=ee+(Se?3:0);Ee.position.fromArray(Vt(Jn(Q,V,Xe*Ee.userData.sign))),Ee.quaternion.setFromUnitVectors(new U(0,1,0),$i($n(vi(V)))),Ee.scale.set((Se?3.5:fe)/100,Se?.018:ae?.05:.035,(Se?3.5:fe)/100)}}else if(k.kind==="kettlebell"){Ix(F.children[0],Q,[k.radius||8.5,k.radius||8.5,k.radius||8.5]);let ae=F.children[1],pe=vi(ks(Q,k.grip)),ee=[1,0,0],fe=vi(Yc(ee,pe));ae.position.fromArray(Vt(Jn(k.grip,pe,3))),ae.quaternion.copy(Rf($n(ee),$n(pe).map(Le=>-Le),$n(fe)))}}function Ae(D,k={},F={}){Y=D,z={...z,...k};let Q=D.pose,V=!!F.shape,ae=!!(z.skeleton&&D.body),pe=!!(z.anatomy&&D.body),ee=ae||pe,fe=!ee&&z.anny!==!1&&D.pose?.frames?globalThis.AnnySkin?.data:null;x=!!fe,_.group.visible=!fe,fe?_.dots(D,z):_.apply(D,z,V),fe?b.update(fe,D,{on:z.muscles!==!1,color:z.color,values:D.values,sideValues:D.sideValues,regions:D.regions,selected:z.selected}):b?.hide();let Le=pe?D.boneFrames||globalThis.Skeleton.frames(Q,D.body,z.anatomy.skeleton.bones):null;ae?g.update(z.skeleton,Q,D.body,Le&&z.anatomy.skeleton===z.skeleton?Le:D.boneFrames||void 0):g.hide(),pe?R.update(z.anatomy,Le,z.color,{values:D.values,sideValues:D.sideValues,regions:D.regions,phases:z.muscles!==!1,selected:z.selected},D.poseKey&&typeof D.phase=="number"?{t:D.phase,key:D.poseKey}:null):R.hide(),(ee||T)&&S(ee);let Ee=fe?[]:D.surfaces;if(ee||!Ee.length)for(let B of v.values())B.visible=!1;let Se=new Map;for(let B of Ee){let le=B.id+":"+B.side;Se.has(le)||Se.set(le,[]),Se.get(le).push(B)}for(let[B,le]of Se){let de=v.get(B);if(!de){let Re=new ot;Re.setAttribute("position",new qe(new Float32Array(le.length*6*3),3));let Fe=It("#a7b3c6",{roughness:.82});Fe.polygonOffset=!0,Fe.polygonOffsetFactor=-1,Fe.polygonOffsetUnits=-1,de=en(E,Re,Fe,B),de.receiveShadow=!1,de.userData={region:le[0].id,side:le[0].side},v.set(B,de)}de.geometry.attributes.position.count!==le.length*6&&(de.geometry.dispose(),de.geometry=new ot,de.geometry.setAttribute("position",new qe(new Float32Array(le.length*6*3),3)));let Pe=0,_e=de.geometry.attributes.position;for(let Re of le)for(let Fe of[0,1,2,0,2,3])_e.setXYZ(Pe++,...Vt(Re.points[Fe]));_e.needsUpdate=!0,V||(de.geometry.computeVertexNormals(),de.geometry.computeBoundingSphere()),de.geometry.computeBoundingBox();let he=le[0].id,L=le[0].side,j=z.muscles!==!1&&!ee,ce=j&&(!z.selected||z.selected==="all"||z.selected===he||z.selected===le[0].parent);de.visible=j;let $=D.sideValues?.[L]?.[he]??D.values[he]??.28;de.material.color.set(ce&&$>0?z.color($):"#a0adc0"),ce?de.material.emissive.copy(de.material.color).multiplyScalar(Dt.muscleGlow):de.material.emissive.setRGB(0,0,0)}if(O.length!==D.props.length||O.some((B,le)=>B.key!==(Zr(D.props[le])?Xc(D.props[le]):D.props[le].kind)||B.group.parent!==(zs(D.props[le])?H:P))){for(let B of[P,H,Z])B.traverse(le=>le.geometry?.dispose()),B.clear();O=D.props.map(Ie),q=null}let Xe=!!q&&D.props.every((B,le)=>!zs(B)||Zc(q[le],B));D.props.forEach((B,le)=>{(!Xe||!zs(B))&&Ue(O[le],B)}),ne(z.stress?D.stress||[]:[]),e.updateMatrixWorld(!0),Xe||ge(D.props)}let $e=wx(Ex(i?.pose)),st=Object.fromEntries(Object.entries($e).map(([D,[k,F]])=>{let Q=k*Math.PI/180,V=F*Math.PI/180,ae=[-Math.sin(Q)*Math.cos(V),-Math.sin(V),Math.cos(Q)*Math.cos(V)],pe=new Wn(-1,1,1,-1,.01,30);return pe.position.fromArray(ae.map(ee=>ee*8)),pe.lookAt(0,0,0),pe.updateMatrixWorld(!0),[D,pe]})),N=Object.fromEntries(Object.keys(st).map(D=>[D,{minX:1/0,maxX:-1/0,minY:1/0,maxY:-1/0}])),se=(D,k)=>{for(let F=D;F;F=F.parent)if(F===k)return!0;return!1},re=D=>x?se(D,_.group):se(D,b.group);function oe(D,k){let F=D==="body"?x?b.group:_.group:e,Q=V=>{k?.(V.x,V.y,V.z);for(let[ae,pe]of Object.entries(st)){let ee=V.clone().applyMatrix4(pe.matrixWorldInverse),fe=N[ae];fe.minX=Math.min(fe.minX,ee.x),fe.maxX=Math.max(fe.maxX,ee.x),fe.minY=Math.min(fe.minY,ee.y),fe.maxY=Math.max(fe.maxY,ee.y)}};F.traverse(V=>{if(!V.isMesh||!V.visible||V===d||V.name==="dot-ring"||V.parent?.name==="joint-dots"||V.parent?.parent===me||V.userData.merged||V.userData.ghostTwin||re(V))return;if(V.userData.boundsPoints){for(let pe of V.userData.boundsPoints)Q(pe);return}V.geometry.boundingBox||V.geometry.computeBoundingBox();let ae=V.geometry.boundingBox;for(let pe of[ae.min.x,ae.max.x])for(let ee of[ae.min.y,ae.max.y])for(let fe of[ae.min.z,ae.max.z])Q($i([pe,ee,fe]).applyMatrix4(V.matrixWorld))})}function ie(D,k,F=1.13){for(let[Q,V]of Object.entries(st)){let ae=N[Q],pe=(ae.minX+ae.maxX)/2,ee=(ae.minY+ae.maxY)/2,fe=(ae.maxX-ae.minX)*F,Le=(ae.maxY-ae.minY)*F,Ee=D/k;fe/Le<Ee?fe=Le*Ee:Le=fe/Ee,V.left=pe-fe/2,V.right=pe+fe/2,V.top=ee+Le/2,V.bottom=ee-Le/2,V.updateProjectionMatrix()}}let ye=[],ue=null;function be(D){if(!D?.isWebGLRenderer)return!1;if(Be=D,D.toneMapping=ha,D.toneMappingExposure=Dt.exposure,D.outputColorSpace=At,D.shadowMap.enabled=!!Dt.shadow,D.shadowMap.type=Dt.shadow==="soft"?ta:Fr,Dt.environment)try{let k=new Ds(D),F=new el,Q=k.fromScene(F,.04);ye.push(Q),F.dispose?.(),k.dispose(),ue=Q.texture;for(let V of Object.values(r))V.metalness>=.3&&(V.envMap=ue,V.envMapIntensity=Dt.environment,V.needsUpdate=!0)}catch{ue=null}if(typeof document<"u"){let k=document.createElement("canvas");k.width=k.height=256;let F=k.getContext("2d");if(F){let Q=F.createRadialGradient(128,112,10,128,128,190);Q.addColorStop(0,Dt.background[0]),Q.addColorStop(1,Dt.background[1]),F.fillStyle=Q,F.fillRect(0,0,256,256);let V=new gr(k);V.colorSpace=At,e.background=V,ye.push(V)}}return l.castShadow=!!Dt.shadow,l.shadow.mapSize.set(1024,1024),l.shadow.bias=-4e-4,l.shadow.normalBias=.02,l.shadow.radius=4,e.getObjectByName("joint-dots")?.traverse(k=>{k.castShadow=!1,k.receiveShadow=!1}),I(),!0}let Be=null;function ke(D){Be&&(D=!!D&&!!Dt.shadow,Be.shadowMap.enabled!==D&&(Be.shadowMap.enabled=D,l.castShadow=D,e.traverse(k=>{if(k.material)for(let F of[].concat(k.material))F.needsUpdate=!0})))}function I(){let D=new kt;e.traverse(V=>{if(!(!V.isMesh||!V.visible||V===d||V.name==="dot-ring"||V.parent?.name==="joint-dots"||V.parent?.parent===me||V.userData.merged||re(V))){if(V.userData.boundsPoints){for(let ae of V.userData.boundsPoints)D.expandByPoint(ae);return}D.expandByObject(V)}}),D.isEmpty()&&D.set(new U(-1,0,-1),new U(1,2,2)),D.expandByScalar(.7);let k=D.getCenter(new U),F=D.getSize(new U).length()/2;for(let V of[l,c,h])V.target.position.copy(k),V.position.copy(k).add(V.userData.dir||(V.userData.dir=V.position.clone().normalize().multiplyScalar(8))),V.target.updateMatrixWorld();let Q=l.shadow.camera;Q.left=-F,Q.right=F,Q.top=F,Q.bottom=-F,Q.near=.1,Q.far=8+F*2,Q.updateProjectionMatrix(),l.shadow.needsUpdate=!0}return Ae(i,{color:()=>"#a7b3c6"}),{scene:e,cameras:st,settings:$e,apply:Ae,includeBounds:oe,resize:ie,bounds:N,regionMeshes:v,parts:y,body:m,head:f,mannequin:_,skeleton:g,muscleLayer:R,propNodes:()=>O,staticMeshes:()=>Z.children,studio:be,fitShadow:I,setShadows:ke,anny:b,dispose(){M(),X()},disposeGeometry:M,disposeMaterials:X};function M(){e.traverse(D=>{if(D.geometry?.dispose(),D.isLight&&D.shadow?.map&&D.shadow.dispose(),D.material)for(let k of[].concat(D.material))k.map?.dispose()});for(let D of ye)D.dispose();ye=[],g.disposeTexture()}function X(){let D=new Set([w,C]);e.traverse(k=>{if(k.material)for(let F of[].concat(k.material))D.add(F);k.customDepthMaterial&&D.add(k.customDepthMaterial)});for(let k of D)k.dispose()}}var Jc=[.6,.8,1,1.25,1.6,2,2.6,3.4],$c=400,Cf=160,If=15,Pf=10,Kc=1.25,Mi=Math.PI/180,Dx=12,Lx=.3,Vs=(i,e)=>i[0]*e[0]+i[1]*e[1]+i[2]*e[2],jc=(i,e,t)=>Math.min(t,Math.max(e,i)),Jr=i=>(i=(i+Math.PI)%(2*Math.PI),i<0&&(i+=2*Math.PI),i-Math.PI),$r=(i={})=>({fov:i.fov??28,pad:i.pad??1.13,settings:i.settings});function cl(i,e){let t=Math.cos(i),n=Math.sin(i),s=Math.cos(e),r=Math.sin(e);return{right:[t,0,n],up:[n*r,s,-t*r],back:[-n*s,r,t*s]}}function hl(i,e){let t=i[e];return{yaw:Jr(t[0]*Mi),pitch:-t[1]*Mi}}var Qc=i=>[(i[0]+i[3])/2,(i[1]+i[4])/2,(i[2]+i[5])/2],Df=i=>[(i[3]-i[0])/2,(i[4]-i[1])/2,(i[5]-i[2])/2],Lf=i=>Math.hypot(...Df(i));function Uf(i,e={}){let{fov:t,pad:n}=$r(e),s=t>0?Math.tan(t*Mi/2)/n:0,r=s?Jc.map(d=>d*s):[],o=r.length,a=Object.keys(i).map(d=>{let p=hl(i,d),_=cl(p.yaw,p.pitch);return{id:d,R:_.right,U:_.up,B:_.back,r:[1/0,-1/0,1/0,-1/0],x:new Array(2*o).fill(-1/0),y:s?[-1/0,-1/0]:[]}}),l=[1/0,1/0,1/0,-1/0,-1/0,-1/0],c=0;function h(d,p,_){if(!(!Number.isFinite(d)||!Number.isFinite(p)||!Number.isFinite(_))){c++,d<l[0]&&(l[0]=d),p<l[1]&&(l[1]=p),_<l[2]&&(l[2]=_),d>l[3]&&(l[3]=d),p>l[4]&&(l[4]=p),_>l[5]&&(l[5]=_);for(let y of a){let m=y.R[0]*d+y.R[2]*_,f=y.U[0]*d+y.U[1]*p+y.U[2]*_,b=y.B[0]*d+y.B[1]*p+y.B[2]*_,x=y.r;m<x[0]&&(x[0]=m),m>x[1]&&(x[1]=m),f<x[2]&&(x[2]=f),f>x[3]&&(x[3]=f);for(let g=0;g<o;g++){let R=r[g],T=m+R*b,w=R*b-m;T>y.x[g]&&(y.x[g]=T),w>y.x[o+g]&&(y.x[o+g]=w)}if(s){let g=f+s*b,R=s*b-f;g>y.y[0]&&(y.y[0]=g),R>y.y[1]&&(y.y[1]=R)}}}}function u(){if(!c)return null;let d=_=>Math.ceil(_*1e4)/1e4,p=_=>Math.floor(_*1e4)/1e4;return{fov:t,pad:n,box:[...l.slice(0,3).map(p),...l.slice(3).map(d)],cams:Object.fromEntries(a.map(_=>[_.id,{r:[p(_.r[0]),d(_.r[1]),p(_.r[2]),d(_.r[3])],x:_.x.map(d),y:_.y.map(d)}]))}}return{add:h,data:u,get count(){return c}}}function Nf(i,e={}){let{fov:t,pad:n,settings:s}=$r(e),r=t>0?Jc.length:0,o=a=>Array.isArray(a)&&a.every(Number.isFinite);return!i||typeof i!="object"||i.fov!==t||i.pad!==n||!o(i.box)||i.box.length!==6||!i.cams?!1:Object.keys(s).every(a=>{let l=i.cams[a];return l&&o(l.r)&&l.r.length===4&&o(l.x)&&l.x.length===2*r&&o(l.y)&&l.y.length===(r?2:0)})}function Ux(i,e,t){let n=Jc.map(c=>c*t),s=n.length,r=c=>i.x[c],o=c=>i.x[s+c];if(e>=n[s-1])return[r(s-1),o(s-1),n[s-1]];if(e<=n[0]){let c=e/n[0];return[i.r[1]+(r(0)-i.r[1])*c,-i.r[0]+(o(0)+i.r[0])*c,e]}let a=0;for(;e>n[a+1];)a++;let l=(e-n[a])/(n[a+1]-n[a]);return[r(a)+(r(a+1)-r(a))*l,o(a)+(o(a+1)-o(a))*l,e]}function Ff(i,e,t,n={}){let{fov:s,pad:r,settings:o}=$r(n),{yaw:a,pitch:l}=hl(o,e),c=cl(a,l),h=i.cams[e],u=Qc(i.box);t=t>0?t:1;let d,p,_,y;if(s>0){let b=Math.tan(s*Mi/2),x=b/r,[g,R,T]=Ux(h,x*t,x),w=Math.max((g+R)/(2*T),(h.y[0]+h.y[1])/(2*x));d=(g-R)/2,p=(h.y[0]-h.y[1])/2,_=Math.max(Lx,w-Vs(c.back,u)),y=_*b}else{let b=h.r;d=(b[0]+b[1])/2,p=(b[2]+b[3])/2;let x=Math.max(.001,(b[1]-b[0])*r),g=Math.max(.001,(b[3]-b[2])*r);x/g<t?x=g*t:g=x/t,y=g/2,_=Dx+Lf(i.box)}let m=d-Vs(c.right,u),f=p-Vs(c.up,u);return{yaw:a,pitch:l,d:_,s:y,ox:m,oy:f,zoom:1,px:m,py:f}}function eh(i,e,t,n={}){let{fov:s}=$r(n),r=cl(e.yaw,e.pitch),o=Qc(i.box),a=Lf(i.box),l=[0,1,2].map(h=>o[h]+e.d*r.back[h]+e.ox*r.right[h]+e.oy*r.up[h]),c={...r,position:l,zoom:e.zoom,far:e.d+a+20};return s>0?{...c,fov:s,near:Math.max(.05,(e.d-a)*.5)}:{...c,half:[e.s*t,e.s],near:.01}}function Of(i,e,t,n,s={}){let r=eh(i,e,t,s),o=[n[0]-r.position[0],n[1]-r.position[1],n[2]-r.position[2]],a=Vs(r.right,o),l=Vs(r.up,o),c=-Vs(r.back,o);if(r.fov){let h=Math.tan(r.fov*Mi/2)/e.zoom;return[a/(c*h*t),l/(c*h),c]}return[a*e.zoom/r.half[0],l*e.zoom/r.half[1],c]}function Bf(i,e,t,n={}){let{fov:s,pad:r}=$r(n),o=Qc(i.box),a=Df(i.box),l=Math.max(.001,Math.hypot(...a)),c=cl(e.yaw,e.pitch),h=Math.min(1,t>0?t:1),u=Math.abs(c.right[0])*a[0]+Math.abs(c.right[2])*a[2],d=Math.abs(c.up[0])*a[0]+Math.abs(c.up[1])*a[1]+Math.abs(c.up[2])*a[2],p,_=0;if(s>0){let y=Math.tan(s*Mi/2);p=e.d>l*1.01?y*h*Math.sqrt(e.d*e.d-l*l)/(r*l):.3,_=Math.asin(jc((.25-o[1]-e.oy)/e.d,-1,1))}else p=e.s*h/(r*l);return{zMin:Math.min(1,Math.max(.3,p)),zMax:4,ex:u,ey:d,pitchMin:Math.max(-8*Mi,_),pitchMax:85*Mi}}var zf=i=>Math.max(.3,1-.7/i);function ll(i,e,t,n=1){let s=Math.max(t,Math.abs(i)*n);return Math.abs(e)<=s?e:Math.sign(e)*s}function ul(i,e,t,n){let s=Math.min(n.pitchMin,i.pitch),r=Math.max(n.pitchMax,i.pitch);return{...i,yaw:Jr(i.yaw+e),pitch:jc(i.pitch+t,s,r)}}function kf(i,e,t,n,s){let r=zf(i.zoom),o=i.s*n/i.zoom,a=i.s/i.zoom;return{...i,ox:ll(i.ox,i.ox-e*o,Math.max(s.ex*r,Math.abs(i.px))),oy:ll(i.oy,i.oy-t*a,Math.max(s.ey*r,Math.abs(i.py)))}}function th(i,e,t,n,s,r){let o=jc(i.zoom*e,Math.min(r.zMin,i.zoom),Math.max(r.zMax,i.zoom));if(Math.abs(o-i.zoom)<1e-9)return i;let a=1/i.zoom-1/o,l=zf(o),c=Math.min(1,o/i.zoom);return{...i,zoom:o,ox:ll(i.ox,i.ox+t*i.s*s*a,Math.max(r.ex*l,Math.abs(i.px)),c),oy:ll(i.oy,i.oy+n*i.s*a,Math.max(r.ey*l,Math.abs(i.py)),c)}}var Nx=i=>i<.5?4*i*i*i:1-Math.pow(2-2*i,3)/2;function Hf(i,e,t){if(t>=1)return e;if(t<=0)return i;let n=Nx(t),s=(r,o)=>r+(o-r)*n;return{yaw:Jr(i.yaw+Jr(e.yaw-i.yaw)*n),pitch:s(i.pitch,e.pitch),d:s(i.d,e.d),s:s(i.s,e.s),ox:s(i.ox,e.ox),oy:s(i.oy,e.oy),zoom:Math.exp(s(Math.log(i.zoom),Math.log(e.zoom))),px:e.px,py:e.py}}var nh=(i,e,t=1e-4)=>Math.abs(Jr(i.yaw-e.yaw))<t&&Math.abs(i.pitch-e.pitch)<t,ih=(i,e,t=1e-6)=>nh(i,e,t)&&["d","s","ox","oy","zoom"].every(n=>Math.abs(i[n]-e[n])<t),sh=(i,e)=>i*Math.PI/Math.max(320,e||0);var Fx={ArrowLeft:"left",ArrowRight:"right",ArrowUp:"up",ArrowDown:"down","+":"in","=":"in","-":"out",_:"out",0:"reset"};function Vf(i,e){let t=new Map,n=null,s=null,r=null,o=null,a="",l=()=>i.getBoundingClientRect(),c=()=>{let[x,g]=[...t.values()];return{x:(x.x+g.x)/2,y:(x.y+g.y)/2,dist:Math.hypot(x.x-g.x,x.y-g.y)}};function h(x){if(a=x.pointerType,x.pointerType==="mouse"){if(x.button!==0&&x.button!==2)return;s={id:x.pointerId,x:x.clientX,y:x.clientY,pan:x.button===2};try{i.setPointerCapture(x.pointerId)}catch{}i.dataset.drag="",e.start();return}t.set(x.pointerId,{x:x.clientX,y:x.clientY,x0:x.clientX,y0:x.clientY,t0:x.timeStamp}),t.size===1?n="wait":t.size===2&&n!=="done"&&(n="pinch",r=c(),e.start())}function u(x){if(x.pointerType==="mouse"){if(!s||x.pointerId!==s.id)return;let w=x.clientX-s.x,C=x.clientY-s.y;s.x=x.clientX,s.y=x.clientY,(w||C)&&(s.pan||x.shiftKey?e.pan(w,C):e.rotate(w,C));return}let g=t.get(x.pointerId);if(!g)return;let R=g.x,T=g.y;if(g.x=x.clientX,g.y=x.clientY,n==="wait"){let w=g.x-g.x0,C=g.y-g.y0;if(Math.hypot(w,C)<8)return;Math.abs(w)>Math.abs(C)?(n="rotate",e.start(),e.rotate(w,C)):n="scroll";return}if(n==="rotate"&&t.size===1)e.rotate(g.x-R,g.y-T);else if(n==="pinch"&&t.size===2){let w=c(),C=l();w.dist>0&&r.dist>0&&e.zoom(w.dist/r.dist,w.x-C.left,w.y-C.top),e.pan(w.x-r.x,w.y-r.y),r=w}}function d(x){if(x.pointerType==="mouse"){s&&x.pointerId===s.id&&(s=null,delete i.dataset.drag);return}let g=t.get(x.pointerId);g&&(t.delete(x.pointerId),x.type==="pointerup"&&n==="wait"&&!t.size&&x.timeStamp-g.t0<350&&(o&&x.timeStamp-o.t<400&&Math.hypot(g.x-o.x,g.y-o.y)<30?(o=null,e.start(),e.reset()):o={t:x.timeStamp,x:g.x,y:g.y}),t.size?(n==="pinch"||n==="rotate")&&(n="done"):(n=null,r=null))}let p=x=>{x.cancelable&&(x.touches.length>=2||n==="rotate"||n==="pinch"||n==="done")&&x.preventDefault()};function _(x){let g=x.deltaY*(x.deltaMode===1?16:x.deltaMode===2?400:1),R=l();(g!==0&&e.zoom(Math.exp(-g*(x.ctrlKey?.01:.0015)),x.clientX-R.left,x.clientY-R.top)||x.ctrlKey)&&x.preventDefault()}let y=x=>{a==="mouse"&&(x.preventDefault(),e.start(),e.reset())},m=x=>x.preventDefault();function f(x){if(x.altKey||x.ctrlKey||x.metaKey)return;let g=Fx[x.key];g&&(x.preventDefault(),e.key(g))}let b=[["pointerdown",h],["pointermove",u],["pointerup",d],["pointercancel",d],["lostpointercapture",d],["dblclick",y],["contextmenu",m],["keydown",f]];for(let[x,g]of b)i.addEventListener(x,g);return i.addEventListener("touchmove",p,{passive:!1}),i.addEventListener("wheel",_,{passive:!1}),()=>{for(let[x,g]of b)i.removeEventListener(x,g);i.removeEventListener("touchmove",p,{passive:!1}),i.removeEventListener("wheel",_,{passive:!1}),t.clear(),s=null}}var un=!1,Gs=!1,Bx=40,zx=48,kx=3,Ws=[],fl={antialias:!0,alpha:!1,powerPreference:"low-power"};function pl(i){try{i.release?.()}catch{}i.renderer.dispose?.(),i.renderer.forceContextLoss?.()}function $f(){for(;Ws.length;){let n=Ws.pop();if(!n.renderer.getContext?.()?.isContextLost?.())return n;pl(n)}let i=document.createElement("canvas"),e=null,t=null;try{t=i.getContext("webgl2",fl),t&&(e=new Wr({canvas:i,context:t,...fl}),e.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)))}catch{e=null}return e?{renderer:e,canvas:i,release:null}:(t?.getExtension("WEBGL_lose_context")?.loseContext(),null)}function Kf(i){Ws.length>=kx?pl(i):Ws.push(i)}var dl=12,Kn=new Map,jf="podhod.volume-bounds.v1",Hx=256,Gf=!1,Wf=0,lh=()=>window.PODHOD_BUILD||null;function Qf(i){let e=2166136261,t=16777619;for(let n=0;n<i.length;n++){let s=i.charCodeAt(n);e=Math.imul(e^s,16777619),t=Math.imul(t^s,1540483477)^t>>>15}return(e>>>0).toString(36)+(t>>>0).toString(36)}var Vx=i=>i&&typeof i=="object"&&Object.entries(i).every(([e,t])=>e==="_view"||t&&["minX","maxX","minY","maxY"].every(n=>Number.isFinite(t[n])));function ed(i){if(!Gf){Gf=!0;try{let e=JSON.parse(localStorage.getItem(jf)||"null");if(e&&e.build&&e.build===lh())for(let[t,n]of Object.entries(e.bounds||{}))!Kn.has(t)&&Vx(n)&&Kn.set(t,n)}catch{}}return Kn.get(i)||null}function td(i,e){for(Kn.delete(i),Kn.set(i,e);Kn.size>Hx;)Kn.delete(Kn.keys().next().value);lh()&&(clearTimeout(Wf),Wf=setTimeout(()=>{try{localStorage.setItem(jf,JSON.stringify({build:lh(),bounds:Object.fromEntries(Kn)}))}catch{}},1500))}var Si=i=>Math.round(i*1e4)/1e4,rh=()=>typeof performance<"u"?performance.now():Date.now(),Gx=()=>typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches,Xf=null,qf=()=>Xf||(Xf={fov:28,pad:1.13,settings:Hs}),Wx=240,nd=0;function id(i,e,t,n){if(!e||!n.body||!globalThis.Skeleton?.frames)return;i.data!==e&&(i.map.clear(),i.data=e);let s=i.map.get(t);s||(nd++,s=globalThis.Skeleton.frames(n.pose,n.body,e.bones),i.map.size>=Wx&&i.map.delete(i.map.keys().next().value),i.map.set(t,s)),n.boneFrames=s}function Yf(i,e){if(i===e)return!0;if(!i||!e||i.skeleton!==e.skeleton||i.muscles!==e.muscles)return!1;let t=i.level||{},n=e.level||{},s=Object.keys(t);return s.length!==Object.keys(n).length?!1:s.every(r=>t[r]===n[r])}function Xx(i){if(i.share?.linkView){let L=i.share.linkView(i);if(L)return L}if(un)return null;if(typeof window.WebGL2RenderingContext>"u")return un=!0,null;let e=document.createElement("div");e.className="fig volume-figure",e.setAttribute("role","img"),e.setAttribute("aria-label",i.label),e.dataset.camera=i.camera||"above";let t=$f();if(!t)return un=!0,null;e.dataset.renderer="webgl";let{renderer:n,canvas:s}=t,r=t.release;t.release=null;let o=(L,j,ce=!1)=>i.data(L,j,!1,ce),a=o(0,0),l=al(a),c=l.cameras,h=l.settings||Hs,u=h===Hs?qf():{...qf(),settings:h};e.append(n.domElement);let d=!1,p=i.t||0,_=0,y="all",m=i.muscles!==!1,f=!!i.joints,b=i.stress!==!1,x=null,g=null;if(!c[i.camera||"above"])throw Error("Unknown volume camera "+i.camera);let R=()=>{},T=i.memoBones?{map:new Map,data:null}:null,w=!1,C=!1,S=()=>{let L=globalThis.AnnySkin;w||!L||L.data||(w=!0,L.load().then(()=>{d||(!x&&!g?k(p,{index:_}):E())},()=>{}))},v=L=>typeof requestIdleCallback=="function"?requestIdleCallback(L,{timeout:3e3}):setTimeout(L,200);function E(){let L=globalThis.AnnySkin;if(C||d||!L?.data||!(x||g)||!n.compileAsync||!l.anny)return;C=!0;let j=()=>!d&&(x||g)&&!n.getContext?.()?.isContextLost?.();v(()=>{if(j()){try{let ce=o(p,_,!1);l.anny.update(L.data,ce,{on:m,color:i.color,values:ce.values,sideValues:ce.sideValues,regions:ce.regions,selected:y}),l.anny.hide()}catch{return}Promise.all([n.compileAsync(l.scene,c.angle),P(l.anny.mesh)]).then(()=>v(()=>{if(!j()||!n.setViewport)return;let ce=l.anny.group,$=n.render.perfOrig||n.render;ce.visible=!0;try{n.setViewport(0,0,1,1),n.setScissor(0,0,1,1),n.setScissorTest(!0),$.call(n,l.scene,c.angle)}catch{}finally{n.setScissorTest(!1),ce.visible=!1,re||n.setViewport(0,0,F.w,F.h)}ue()}),()=>{})}})}function P(L){let j=L?.customDepthMaterial;if(!j||!L.castShadow||!n.shadowMap?.enabled||!n.setRenderTarget||!n.compileAsync)return Promise.resolve();let ce={[Zt]:Tt,[Tt]:Zt,[Ft]:Ft};j.side=L.material.shadowSide??ce[L.material.side];let $=new Vn,Re=new et(L.geometry,j);Re.frustumCulled=!1,Re.receiveShadow=L.receiveShadow,Re.morphTargetInfluences=L.morphTargetInfluences,$.add(Re);let Fe=new _n(1,1),pt=n.getRenderTarget(),mt;try{n.setRenderTarget(Fe),mt=n.compileAsync($,c.angle,l.scene)}catch{mt=Promise.resolve()}finally{n.setRenderTarget(pt)}return mt.catch(()=>{}).then(()=>Fe.dispose())}let O=()=>{!x&&!g&&S()},Y=null,z=/^(barbell|dumbbell|kettlebell|cable|line)$/,H=.002,Z=new Map,q=new kt,ge=new Ui,me=new U,Me=new U,we=new U,We=L=>{let j=Z.get(L);return j||(j=L.clone(),j.transparent=!0,j.opacity=.22,j.depthWrite=!1,j.name=(L.name||"")+"-fade",Z.set(L,j)),j};function je(L){let j=Y;if(!j||!l.propNodes)return;let ce=[j.head,j.sh,j.waist,j.hip,j.elL,j.elR,j.knL,j.knR].filter(Boolean).map(Fe=>new U(...Vt(Fe)));L.getWorldPosition(we);let $=[];for(let Fe of l.propNodes())!Fe.group||!Fe.group.parent?.visible||z.test(Fe.kind||"")||Fe.group.traverse(pt=>{pt.isMesh&&pt.visible&&$.push([pt,[pt]])});for(let Fe of l.staticMeshes?.()||[])Fe.isMesh&&Fe.visible&&$.push([Fe,Fe.userData.sources||[Fe]]);let Re=Fe=>{q.setFromObject(Fe);let pt=q.getSize(me);if(pt.x*pt.y*pt.z<H)return!1;for(let mt of ce){if(q.containsPoint(mt))continue;Me.copy(mt).sub(we);let fn=Me.length();if(ge.set(we,Me.normalize()),ge.intersectBox(q,me)&&me.distanceTo(we)<fn-.05)return!0}return!1};for(let[Fe,pt]of $){let mt=Fe.userData.fadeOrig||Fe.material;pt.some(Re)?(Fe.userData.fadeOrig||(Fe.userData.fadeOrig=mt),Fe.material=Array.isArray(mt)?mt.map(We):We(mt)):Fe.userData.fadeOrig&&(Fe.material=Fe.userData.fadeOrig,delete Fe.userData.fadeOrig)}}let Je=(L,j,ce=!1)=>{let $=o(L,j,!!(x||g));Y=$.pose,T&&id(T,g?.skeleton||x,L,$),l.apply($,{color:i.color,selected:y,muscles:m,joints:f,stress:b,skeleton:x,anatomy:g},{shape:ce}),R(L,j,$.pose),O()},te=new Ni(new ot().setFromPoints(i.trace.map(L=>new U(...Vt(L)))),new Gn({color:"#b4c3d9",transparent:!0,opacity:.7}));te.visible=!1,l.scene.add(te);let ne=new ht;ne.name="movement-vectors",ne.visible=!1,l.scene.add(ne);for(let L of i.vectors){let j=new U(...Vt(L.a)),ce=new U(...Vt(L.b)),$=ce.clone().sub(j);ne.add(new Nr($.clone().normalize(),j,$.length(),/^(sh|hip)$/.test(L.key)?7842259:15298901,.075,.035))}R=(L,j,ce)=>{i.vectors.forEach(($,Re)=>{let Fe=i.vectorFrame?i.vectorFrame($,L,j,ce):$,pt=ne.children[Re];if(pt.visible=!!Fe,!Fe)return;let mt=new U(...Vt(Fe.a)),fn=new U(...Vt(Fe.b)),jn=fn.sub(mt);pt.position.copy(mt),pt.setDirection(jn.clone().normalize()),pt.setLength(jn.length(),.06,.03)}),ne.updateMatrixWorld(!0)};let Ie=a.exerciseId+"|"+Qf(JSON.stringify([a.props,i.vectors])),Ue=ed(Ie),Ae=null;if(Ue&&Object.keys(l.bounds).every(L=>Ue[L])&&Nf(Ue._view,u)){for(let L of Object.keys(l.bounds))Object.assign(l.bounds[L],Ue[L]);Ae=Ue._view}else{let L=Uf(h,u);for(let j=0;j<=dl;j++)Je(j/dl,0,!0),l.includeBounds(void 0,L.add);Ae=L.data(),td(Ie,{...Object.fromEntries(Object.entries(l.bounds).map(([j,ce])=>[j,{minX:Si(ce.minX),maxX:Si(ce.maxX),minY:Si(ce.minY),maxY:Si(ce.maxY)}])),...Ae?{_view:Ae}:{}})}i.layers?(Je(p,0,!0),l.studio?.(n),x=i.layers.bones||null,g=i.layers.body||null,e.dataset.skeleton=x?"on":"off",e.dataset.anatomy=g?"on":"off",S(),Je(p,0)):(Je(p,0),l.studio?.(n)),Gs&&l.setShadows?.(!1),globalThis.GymPerf?.volume({scene:l,renderer:n,options:i,root:e,low:()=>Gs});let $e=[],st=0;function N(){let L=typeof performance<"u"?performance.now():Date.now(),j=L-st;if(st=L,Gs||!(j>0&&j<200)||($e.push(j),$e.length<Bx))return;let ce=$e.sort(($,Re)=>$-Re)[$e.length>>1];if($e.length=0,ce>zx){Gs=!0,l.setShadows?.(!1);for(let $ of se)$.root.dataset.quality="low"}}let se=[],re=!1;function oe(L,j,ce){let $=ce.interactive&&Ae?{cam:new Lt(28,1,.05,40),aspect:ce.ratio||1.15,v:null,go:null,free:!1,user:!1,basis:new nt,R:new U,U:new U,B:new U}:null,Re={root:L,camera:j,o:ce,orbit:$,canvas:null,ctx:null,w:0,h:0,stale:!0,pending:0,dirty:!1,drawnAt:-1,closed:!1,detach:null,observer:null},Fe=He=>Ff(Ae,He,$.aspect,u);$&&($.v=Fe(j),L.dataset.orbit="",L.dataset.free="0",L.tabIndex=0),Re.viewNow=()=>{let He=$.go;if(!He)return $.v;let Ye=(rh()-He.t0)/He.ms;return Ye<1?Hf(He.from,He.to,Ye):($.v=He.to,$.go=null,$.v)};let pt=()=>{$?.go&&($.v=Re.viewNow(),$.go=null)};Re.place=()=>{let He=Re.viewNow(),Ye=eh(Ae,He,$.aspect,u),at=$.cam;at.position.fromArray(Ye.position),at.quaternion.setFromRotationMatrix($.basis.makeBasis($.R.fromArray(Ye.right),$.U.fromArray(Ye.up),$.B.fromArray(Ye.back))),at.isPerspectiveCamera?(at.fov=Ye.fov,at.aspect=$.aspect):(at.left=-Ye.half[0],at.right=Ye.half[0],at.top=Ye.half[1],at.bottom=-Ye.half[1]),at.near=Ye.near,at.far=Ye.far,at.zoom=Ye.zoom,at.updateProjectionMatrix()},Re.schedule=()=>{!d&&!Re.closed&&!Re.pending&&typeof requestAnimationFrame=="function"&&(Re.pending=requestAnimationFrame(mt))};function mt(He){Re.pending=0,!(d||Re.closed)&&(Re.dirty||$?.go&&Re.drawnAt<He?ye(Re):$?.go&&Re.schedule())}let fn=()=>{Re.dirty=!0,Re.schedule()};function jn(){let He=$.go?$.go.to:$.v,Ye=!nh(He,hl(h,Re.camera));if(Ye!==$.free){$.free=Ye,L.dataset.free=Ye?"1":"0";try{ce.onCamera?.({camera:Re.camera,free:Ye})}catch(at){console.error(at)}}}let bi=He=>Bf(Ae,He,$.aspect,u);function Qn(He){if(d||Re.closed||!$)return!1;pt();let Ye=$.v,at=He(Ye);if(at===Ye||ih(at,Ye))return!1;$.v=at,$.user=!0,jn(),fn();try{ce.onGesture?.()}catch{}return!0}function Ki(He,Ye){pt(),Ye>0&&!Gx()?$.go={from:$.v,to:He,t0:rh(),ms:Ye}:$.v=He,jn(),fn()}Re.reset=()=>{!$||d||Re.closed||($.user=!1,Ki(Fe(Re.camera),$c))},Re.aspect=He=>{if($&&($.aspect=He,!$.user)){let Ye=Fe(Re.camera);$.go?$.go.to=Ye:$.v=Ye}},Re.setCamera=(He,Ye={})=>d||Re.closed||!c[He]?!1:(Re.camera=He,L.dataset.camera=He,$?($.user=!1,Ki(Fe(He),Ye.instant?0:$c),!0):(ye(Re),!0));let ei=()=>{let He=L.getBoundingClientRect();return[Math.max(1,He.width),Math.max(1,He.height)]};return Re.detach=$?Vf(L,{start:pt,rotate:(He,Ye)=>{let[at]=ei();return Qn(dn=>ul(dn,sh(He,at),sh(Ye,at)*.8,bi(dn)))},pan:(He,Ye)=>{let[at,dn]=ei();return Qn(Un=>kf(Un,2*He/at,-2*Ye/dn,$.aspect,bi(Un)))},zoom:(He,Ye,at)=>{let[dn,Un]=ei();return Qn(Xs=>th(Xs,He,2*Ye/dn-1,1-2*at/Un,$.aspect,bi(Xs)))},reset:()=>{Re.reset();try{ce.onGesture?.()}catch{}},key(He){if(He==="reset"){Re.reset();return}let Ye=$.go?$.go.to:$.v,at=bi(Ye),dn=Math.PI/180,Un=He==="left"||He==="right"?ul(Ye,(He==="left"?-1:1)*If*dn,0,at):He==="up"||He==="down"?ul(Ye,0,(He==="up"?1:-1)*Pf*dn,at):th(Ye,He==="in"?Kc:1/Kc,0,0,$.aspect,at);if(!ih(Un,Ye)){$.user=!0,Ki(Un,Cf);try{ce.onGesture?.()}catch{}}}}):null,Re.close=()=>{Re.closed||(Re.closed=!0,Re.pending&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(Re.pending),Re.pending=0,Re.detach?.(),Re.observer?.disconnect())},Re}let ie=!1;function ye(L){if(d||L.closed)return;if(L.stale&&V){if(!L.root.isConnected){L.dirty=!0;return}I()}L.dirty=!1,L.drawnAt=rh();let j=L.orbit;j&&(L.place(),j.go&&L.schedule());let ce=j?j.cam:c[L.camera];try{je(ce)}catch{}if(!re)n.render(l.scene,ce);else{if(n.getContext?.()?.isContextLost?.())return;n.setViewport(0,0,L.w,L.h),n.setScissor(0,0,L.w,L.h),n.setScissorTest(!0);try{n.render(l.scene,ce)}finally{n.setScissorTest(!1)}let $=L.canvas;L.ctx&&$.width&&$.height&&L.ctx.drawImage(s,0,s.height-$.height,$.width,$.height,0,0,$.width,$.height)}if(!ie){ie=!0;try{r?.()}catch{}}}function ue(){let L=n.shadowMap,j=L?.autoUpdate,ce=!0;try{for(let $ of se)$.closed||(!ce&&L?.enabled&&(L.autoUpdate=!1,L.needsUpdate=!1),ye($),ce=!1)}finally{L&&(L.autoUpdate=j)}}function be(L){let j=L.root.getBoundingClientRect(),ce=Math.max(1,Math.min(1100,j.width||620)),$=Math.max(1,Math.round(j.height||ce/(L.o.ratio||1.15))),Re=L.stale;if(L.stale=!L.root.isConnected,L.w===ce&&L.h===$)return Re&&!L.stale;if(L.w=ce,L.h=$,L.aspect(ce/$),L.canvas){let Fe=n.getPixelRatio?.()||1,pt=Math.floor(ce*Fe),mt=Math.floor($*Fe);L.canvas.width!==pt&&(L.canvas.width=pt),L.canvas.height!==mt&&(L.canvas.height=mt)}return!0}let Be=new ve,ke=!1;function I(){let L=!ke;ke=!0;for(let ce of se)!ce.closed&&be(ce)&&(L=!0);let j=se[0];if(!re)(L||!n.getSize)&&n.setSize(j.w,j.h);else{let ce=1,$=1;for(let Re of se)Re.closed||(ce=Math.max(ce,Re.w),$=Math.max($,Re.h));n.getSize?.(Be),(Be.x!==ce||Be.y!==$)&&(n.setSize(ce,$,!1),L=!0)}return(L||!n.getSize)&&l.resize(j.w,j.h),L}function M(L){d||(I()||L===!0||!n.getSize)&&ue()}function X(){if(re)return;re=!0;let L=se[0];L.canvas=document.createElement("canvas"),L.ctx=L.canvas.getContext?.("2d",{alpha:!1})||null,s.parentNode===e?e.replaceChild(L.canvas,s):e.append(L.canvas),L.w=L.h=0}let D=()=>{for(let L of se)L.closed||(L.root.dataset.pose=String(p),L.root.dataset.phase=String(_))};function k(L,j){d||(p=L,_=j?.index||0,Je(L,_),D(),ue(),N())}let F=oe(e,i.camera||"above",i);se.push(F);let Q=()=>{d||(Je(p,_),M(!0))};s.addEventListener("webglcontextrestored",Q);let V=typeof ResizeObserver=="function";F.observer=V?new ResizeObserver(M):null,F.observer?.observe(e),M();let ae=()=>k(p,{index:_}),pe=L=>{m!==!!L&&(m=!!L,ae())},ee=L=>{y!==L&&(y=L,ae())},fe=L=>{f!==!!L&&(f=!!L,ae())},Le=L=>{b!==!!L&&(b=!!L,ae())},Ee=()=>{for(let L of se)L.root.dataset.skeleton=x?"on":"off",L.root.dataset.anatomy=g?"on":"off"},Se=L=>{L=L||null,!(x===L&&F.root.dataset.skeleton)&&(x=L,Ee(),ae())},Xe=L=>{L=L||null,!(Yf(g,L)&&F.root.dataset.anatomy)&&(g=L,Ee(),ae())},B=(L,j)=>{L=L||null,j=j||null,!(x===L&&Yf(g,j)&&F.root.dataset.skeleton&&F.root.dataset.anatomy)&&(x=L,g=j,Ee(),ae())},le=L=>{te.visible!==!!L&&(te.visible=!!L,ue())},de=L=>{ne.visible!==!!L&&(ne.visible=!!L,ue())};k(p,{index:_}),(x||g)&&E();function Pe(){if(d)return;d=!0;for(let ce of se)ce.close();s.removeEventListener("webglcontextrestored",Q),l.scene.traverse(ce=>{ce.userData?.fadeOrig&&(ce.material=ce.userData.fadeOrig,delete ce.userData.fadeOrig)});let L=[...Z.values()];Z.clear();let j=()=>{l.disposeMaterials();for(let ce of L)ce.dispose()};l.disposeGeometry(),t.release=ie||!r?j:()=>{try{r()}catch{}j()},Kf(t)}function _e(L,j){return{svg:L.root,at:j?(ce,$)=>{d||L.closed||ce===p&&($?.index||0)===_||k(ce,$)}:k,get camera(){return L.camera},setCamera:(ce,$)=>L.setCamera(ce,$),setMuscles:pe,setRegion:ee,setJoints:fe,setStress:Le,setSkeleton:Se,setAnatomy:Xe,setLayers:B,setTrace:le,setVectors:de,get orbit(){return!!L.orbit},get free(){return!!L.orbit?.free},resetCamera:()=>L.reset(),cameraState:()=>L.orbit?{...L.viewNow(),aspect:L.orbit.aspect,free:L.orbit.free,moving:!!L.orbit.go,camera:L.camera}:null,projectWorld:ce=>L.orbit?Of(Ae,L.viewNow(),L.orbit.aspect,ce,u):null,dispose:j?()=>{L.close();let ce=se.indexOf(L);ce>0&&se.splice(ce,1)}:Pe,...j?{linked:!0}:{linkView:he}}}function he(L){if(d||!Ae||!L.interactive||!c[L.camera||"above"])return null;let j=document.createElement("div");j.className="fig volume-figure",j.setAttribute("role","img"),j.setAttribute("aria-label",L.label),j.dataset.camera=L.camera||"above",j.dataset.renderer="webgl",X();let ce=oe(j,L.camera||"above",L);return ce.canvas=document.createElement("canvas"),ce.ctx=ce.canvas.getContext?.("2d",{alpha:!1})||null,j.append(ce.canvas),se.push(ce),D(),F.root.dataset.skeleton&&Ee(),Gs&&(j.dataset.quality="low"),ce.observer=V?new ResizeObserver(M):null,ce.observer?.observe(j),M(!0),_e(ce,!0)}return _e(F,!1)}var qx=3,Yx=!1,Zf=1.1;function Zx(){let i=null,e=0,t=0,n=0,s=0,r=new Map,o=[],a={apply:0,render:0,copy:0},l=()=>typeof performance<"u"?performance.now():Date.now();function c(){for(let m of r.values())p(m,!0);r.clear();for(let m of o.splice(0))try{m()}catch{}i&&(i.canvas.removeEventListener("webglcontextrestored",h),pl(i),i=null),e=t=0}function h(){for(let m of r.values())p(m,!0);r.clear(),e=t=0}function u(){if(i)return i;if(un)return null;if(typeof window.WebGL2RenderingContext>"u")return un=!0,null;let m=document.createElement("canvas"),f=null,b=null;try{b=m.getContext("webgl2",fl),b&&(f=new Wr({canvas:m,context:b,...fl}),f.setPixelRatio(1))}catch{f=null}return f?(i={renderer:f,canvas:m,release:null},m.addEventListener("webglcontextrestored",h),i):(b?.getExtension?.("WEBGL_lose_context")?.loseContext(),un=!0,null)}function d(m,f){let b=(S,v,E)=>f.data(S,v,!1,E),x=b(0,0,!0),g=al(x),R=f.fit==="body"?"body":"all",T=!!f.still,w=x.exerciseId+"|"+Qf(JSON.stringify([x.props,[]]))+"|"+R,C=T?null:ed(w);if(!T)if(C&&Object.keys(g.bounds).every(S=>C[S]))for(let S of Object.keys(g.bounds))Object.assign(g.bounds[S],C[S]);else{for(let S=0;S<=dl;S++)g.apply(b(S/dl,0,!0),{color:f.color}),g.includeBounds(R==="body"?"body":void 0);td(w,Object.fromEntries(Object.entries(g.bounds).map(([S,v])=>[S,{minX:Si(v.minX),maxX:Si(v.maxX),minY:Si(v.minY),maxY:Si(v.maxY)}])))}return g.studio?.(i.renderer),Yx||g.setShadows?.(!1),s++,globalThis.GymPerf?.volume({scene:g,renderer:i.renderer,options:f,root:null,card:!0}),{key:m,scene:g,data:b,color:f.color,applied:null,aspect:0,bones:{map:new Map,data:null},still:T,fit:R,framed:null}}function p(m,f){try{m.scene.disposeGeometry()}catch{}if(f)try{m.scene.disposeMaterials()}catch{}else o.push(m.scene.disposeMaterials)}function _(m,f){let b=r.get(m);if(b)return r.delete(m),r.set(m,b),b;b=d(m,f),r.set(m,b);for(let[x,g]of r){if(r.size<=qx)break;g!==b&&(r.delete(x),p(g,!1))}return b}function y(m){let f=null,b=null,x=m.muscles!==!1,g=m.stress!==!1,R=!1,T=()=>(f?"b":"")+(b?"a"+Object.entries(b.level||{}).map(([w,C])=>w+C).join(","):"")+(x?"m":"")+(g?"s":"");return{key:m.key,setLayers(w,C){f=w||null,b=C||null},setLook(w){"muscles"in w&&(x=!!w.muscles),"stress"in w&&(g=!!w.stress)},paint(w,C,S,v="above"){if(R||!w?.width||!w?.height)return!1;let E=u();if(!E||E.renderer.getContext?.()?.isContextLost?.())return!1;let P=_(m.key,m),O=P.scene.cameras[v]||P.scene.cameras.above;(e!==w.width||t!==w.height)&&(e=w.width,t=w.height,E.renderer.setSize(e,t,!1)),!P.still&&P.aspect!==e/t&&(P.aspect=e/t,P.scene.resize(e,t,Zf));let Y=C+"|"+(S||0)+"|"+T(),z=l();if(P.applied!==Y){let Me=P.data(C,S||0,!!(f||b));id(P.bones,b?.skeleton||f,C,Me),P.scene.apply(Me,{color:P.color,selected:"all",muscles:x,joints:!1,stress:g,skeleton:f,anatomy:b}),P.applied=Y}let H=Y+"|"+e/t;if(P.still&&P.framed!==H){for(let Me of Object.values(P.scene.bounds))Object.assign(Me,{minX:1/0,maxX:-1/0,minY:1/0,maxY:-1/0});P.scene.includeBounds(P.fit==="body"?"body":void 0),P.scene.resize(e,t,Zf),P.framed=H,P.aspect=e/t}let Z=l();E.renderer.render(P.scene.scene,O),n++;let q=l(),ge=w.getContext("2d");if(!ge)return!1;ge.drawImage(E.canvas,0,0,e,t),a.apply=Z-z,a.render=q-Z,a.copy=l()-q;let me=globalThis.GymPerf;me&&!P.still&&me.card?.(a.apply+a.render+a.copy,a.copy);for(let Me of o.splice(0))try{Me()}catch{}return!0},prepare(){if(R)return!1;let w=u();return!w||w.renderer.getContext?.()?.isContextLost?.()?!1:(_(m.key,m),!0)},forget(){R=!0;let w=r.get(m.key);w&&(r.delete(m.key),p(w,!1))},release(){R=!0}}}return{figure:y,dispose:c,stats:()=>({scenes:r.size,renders:n,builds:s,context:!!i,size:[e,t],timing:{...a}}),get builds(){return s},get available(){return!un}}}var oh=null;function Jx(){return!un&&typeof window.WebGL2RenderingContext>"u"&&(un=!0),un?null:(oh||(oh=Zx()),oh)}var Jf=!1;function $x(i){if(Jf||un||Ws.length)return Promise.resolve(!1);if(typeof window.WebGL2RenderingContext>"u")return un=!0,Promise.resolve(!1);Jf=!0;let e=$f();if(!e)return un=!0,Promise.resolve(!1);let{renderer:t}=e,n=i.layers||null,s;try{s=al(i.data(0,0,!1,!1));let l={color:i.color,selected:"all",muscles:i.muscles!==!1,joints:!!i.joints,stress:i.stress!==!1},c=h=>{let u=i.data(i.t||0,0,!1,h);return u.poseKey=null,u};n&&globalThis.AnnySkin?.data&&s.apply(c(!1),{...l,skeleton:null,anatomy:null}),s.apply(c(!!n),{...l,skeleton:n?.bones||null,anatomy:n?.body||null}),s.studio?.(t),Gs&&s.setShadows?.(!1)}catch{return pl(e),Promise.resolve(!1)}let r=s.cameras.angle;s.resize(1,1),t.setSize(1,1,!1),e.release=s.dispose,Kf(e);let o=l=>typeof requestIdleCallback=="function"?requestIdleCallback(l,{timeout:2e3}):setTimeout(l,50),a=()=>Ws.includes(e)&&!t.getContext?.()?.isContextLost?.();return new Promise(l=>o(()=>{if(!a()){l(!1);return}(t.compileAsync?t.compileAsync(s.scene,r):Promise.resolve()).then(()=>o(()=>{if(a())try{t.render(s.scene,r)}catch{}l(a())}),()=>l(!1))}))}window.GymVolume={create:Xx,cards:Jx,prewarm:$x,get boneMisses(){return nd+gf().misses}};})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/

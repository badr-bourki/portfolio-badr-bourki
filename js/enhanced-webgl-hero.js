/**
 * Enhanced WebGL Hero - Vanilla JS Implementation
 * Advanced shader effects with pointer interactions
 * Converts React/WebGL component to pure vanilla JavaScript
 */

class WebGLRenderer {
  constructor(canvas, scale = 1) {
    this.canvas = canvas;
    this.scale = scale;
    this.gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!this.gl) {
      console.error('WebGL2 not supported');
      return;
    }
    
    this.program = null;
    this.vs = null;
    this.fs = null;
    this.buffer = null;
    this.shaderSource = this.getDefaultShader();
    
    this.mouseMove = [0, 0];
    this.mouseCoords = [0, 0];
    this.pointerCoords = [0, 0];
    this.nbrOfPointers = 0;
    
    this.vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;
    
    this.vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
    
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale);
  }

  getDefaultShader() {
    return `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform vec2 move;
uniform vec2 touch;
uniform int pointerCount;
uniform vec2 pointers[10];

#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)

float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}

float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float a=rnd(i), b=rnd(i+vec2(1,0)), c=rnd(i+vec2(0,1)), d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}

float fbm(vec2 p) {
  float t=.0, a=1.; 
  mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}

float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}

void main(void) {
  vec2 uv=(FC-.5*R)/MN;
  vec2 st=uv*vec2(2.,1.);
  
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y+move.y*.001));
  
  uv+=.1*touch/MN;
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  
  for (int i=0; i<pointerCount; i++) {
    vec2 pcoord = pointers[i];
    float dist = distance(FC, pcoord);
    col += vec3(.5,.3,.1) * 0.1 / (dist + 1.);
  }
  
  O=vec4(col,1);
}`;
  }

  compile(shader, source) {
    const gl = this.gl;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      console.error('Shader compilation error:', error);
    }
  }

  test(source) {
    let result = null;
    const gl = this.gl;
    const shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader);
    }
    gl.deleteShader(shader);
    return result;
  }

  reset() {
    const gl = this.gl;
    if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs);
        gl.deleteShader(this.vs);
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs);
        gl.deleteShader(this.fs);
      }
      gl.deleteProgram(this.program);
    }
  }

  setup() {
    const gl = this.gl;
    this.vs = gl.createShader(gl.VERTEX_SHADER);
    this.fs = gl.createShader(gl.FRAGMENT_SHADER);
    this.compile(this.vs, this.vertexSrc);
    this.compile(this.fs, this.shaderSource);
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vs);
    gl.attachShader(this.program, this.fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program));
    }
  }

  init() {
    const gl = this.gl;
    const program = this.program;
    
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    program.resolution = gl.getUniformLocation(program, 'resolution');
    program.time = gl.getUniformLocation(program, 'time');
    program.move = gl.getUniformLocation(program, 'move');
    program.touch = gl.getUniformLocation(program, 'touch');
    program.pointerCount = gl.getUniformLocation(program, 'pointerCount');
    program.pointers = gl.getUniformLocation(program, 'pointers');
  }

  updateMouse(coords) {
    this.mouseCoords = coords;
  }

  updateMove(deltas) {
    this.mouseMove = deltas;
  }

  updatePointerCoords(coords) {
    this.pointerCoords = coords;
  }

  updatePointerCount(nbr) {
    this.nbrOfPointers = nbr;
  }

  updateScale(scale) {
    this.scale = scale;
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale);
  }

  render(now = 0) {
    const gl = this.gl;
    const program = this.program;
    
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return;

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    
    gl.uniform2f(program.resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(program.time, now * 1e-3);
    gl.uniform2f(program.move, this.mouseMove[0], this.mouseMove[1]);
    gl.uniform2f(program.touch, this.mouseCoords[0], this.mouseCoords[1]);
    gl.uniform1i(program.pointerCount, this.nbrOfPointers);
    
    if (this.pointerCoords.length > 0) {
      gl.uniform2fv(program.pointers, new Float32Array(this.pointerCoords));
    }
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

class PointerHandler {
  constructor(element, scale = 1) {
    this.scale = scale;
    this.active = false;
    this.pointers = new Map();
    this.lastCoords = [0, 0];
    this.moves = [0, 0];

    const map = (x, y) => [x * this.scale, element.height - y * this.scale];

    element.addEventListener('pointerdown', (e) => {
      this.active = true;
      this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
    });

    element.addEventListener('pointerup', (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener('pointerleave', (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first;
      }
      this.pointers.delete(e.pointerId);
      this.active = this.pointers.size > 0;
    });

    element.addEventListener('pointermove', (e) => {
      if (!this.active) return;
      this.lastCoords = [e.clientX, e.clientY];
      this.pointers.set(e.pointerId, map(e.clientX, e.clientY));
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY];
    });

    element.addEventListener('mousemove', (e) => {
      if (!this.active) return;
      this.lastCoords = [e.clientX, e.clientY];
    });
  }

  get count() {
    return this.pointers.size;
  }

  get move() {
    return this.moves;
  }

  get coords() {
    return this.pointers.size > 0 
      ? Array.from(this.pointers.values()).flat() 
      : [0, 0];
  }

  get first() {
    const firstPointer = this.pointers.values().next().value;
    return firstPointer || this.lastCoords;
  }

  updateScale(scale) {
    this.scale = scale;
  }
}

class EnhancedWebGLHero {
  constructor() {
    this.canvasRef = null;
    this.rendererRef = null;
    this.pointersRef = null;
    this.animationFrameRef = null;
    this.init();
  }

  init() {
    const heroSection = document.querySelector('#home');
    if (!heroSection) {
      console.error('Hero section #home not found');
      return;
    }

    // Create or get canvas
    let canvas = heroSection.querySelector('canvas.webgl-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'webgl-canvas absolute inset-0 w-full h-full object-contain touch-none';
      canvas.style.background = 'black';
      heroSection.insertBefore(canvas, heroSection.firstChild);
    }

    this.canvasRef = canvas;
    this.setupRenderer();
    this.setupAnimationLoop();
    this.setupResizeListener();
  }

  setupRenderer() {
    const canvas = this.canvasRef;
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    this.rendererRef = new WebGLRenderer(canvas, dpr);
    this.pointersRef = new PointerHandler(canvas, dpr);

    this.rendererRef.setup();
    this.rendererRef.init();

    if (this.rendererRef.test(this.rendererRef.shaderSource) === null) {
      // Shader is valid
    }
  }

  setupAnimationLoop() {
    const loop = (now) => {
      if (!this.rendererRef || !this.pointersRef) return;

      this.rendererRef.updateMouse(this.pointersRef.first);
      this.rendererRef.updatePointerCount(this.pointersRef.count);
      this.rendererRef.updatePointerCoords(this.pointersRef.coords);
      this.rendererRef.updateMove(this.pointersRef.move);
      this.rendererRef.render(now);
      
      this.animationFrameRef = requestAnimationFrame(loop);
    };

    this.animationFrameRef = requestAnimationFrame(loop);
  }

  setupResizeListener() {
    const resize = () => {
      if (!this.canvasRef) return;

      const canvas = this.canvasRef;
      const dpr = Math.max(1, 0.5 * window.devicePixelRatio);

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      if (this.rendererRef) {
        this.rendererRef.updateScale(dpr);
      }
      if (this.pointersRef) {
        this.pointersRef.updateScale(dpr);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
  }

  destroy() {
    if (this.animationFrameRef) {
      cancelAnimationFrame(this.animationFrameRef);
    }
    if (this.rendererRef) {
      this.rendererRef.reset();
    }
  }
}

// Add CSS animations
const webglAnimationsStyle = document.createElement('style');
webglAnimationsStyle.textContent = `
  @keyframes fade-in-down {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in-down {
    animation: fade-in-down 0.8s ease-out forwards;
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
    opacity: 0;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  .animation-delay-600 {
    animation-delay: 0.6s;
  }

  .animation-delay-800 {
    animation-delay: 0.8s;
  }

  .webgl-canvas {
    will-change: transform;
    display: block;
  }

  #home {
    position: relative;
    overflow: hidden;
  }

  .hero-content-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .trust-badge {
    margin-bottom: 2rem;
  }

  .trust-badge-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: rgba(255, 140, 0, 0.1);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 180, 0, 0.3);
    border-radius: 9999px;
    font-size: 0.875rem;
    color: rgb(255, 200, 124);
  }

  .hero-heading {
    text-align: center;
    margin: 1.5rem 0;
  }

  .hero-headline {
    font-size: clamp(2.5rem, 10vw, 7rem);
    font-weight: 700;
    background: linear-gradient(90deg, rgb(255, 200, 124), rgb(255, 200, 0), rgb(217, 119, 6));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    margin: 0.5rem 0;
  }

  .hero-headline:nth-of-type(2) {
    background: linear-gradient(90deg, rgb(255, 200, 0), rgb(255, 140, 0), rgb(220, 38, 38));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero-subtitle {
    max-width: 48rem;
    margin: 0 auto;
    font-size: clamp(1rem, 3vw, 1.5rem);
    color: rgba(255, 200, 124, 0.9);
    font-weight: 300;
    line-height: 1.6;
  }

  .hero-buttons {
    display: flex !important;
    flex-direction: column !important;
    gap: 1rem !important;
    justify-content: center !important;
    margin-top: 2.5rem !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    z-index: 100 !important;
  }

  @media (max-width: 768px) {
    .hero-buttons {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .hero-button {
      width: 100% !important;
      max-width: 280px !important;
    }
  }

  @media (min-width: 769px) {
    .hero-buttons {
      flex-direction: row !important;
      gap: 1.5rem !important;
    }
    
    .hero-button {
      min-width: 150px !important;
    }
  }

  .hero-button {
    padding: 1rem 2rem !important;
    border-radius: 9999px !important;
    font-weight: 600 !important;
    font-size: 1.125rem !important;
    transition: all 0.3s ease !important;
    cursor: pointer !important;
    border: none !important;
    display: inline-block !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }

  .hero-button-primary {
    background: linear-gradient(135deg, rgb(255, 140, 0), rgb(255, 200, 0));
    color: rgb(15, 15, 15);
  }

  .hero-button-primary:hover {
    background: linear-gradient(135deg, rgb(255, 120, 0), rgb(255, 180, 0));
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(255, 140, 0, 0.25);
  }

  .hero-button-primary:active {
    transform: scale(0.95);
  }

  .hero-button-secondary {
    background: rgba(255, 140, 0, 0.1);
    border: 2px solid rgba(255, 180, 0, 0.3);
    color: rgb(255, 200, 124);
    backdrop-filter: blur(12px);
  }

  .hero-button-secondary:hover {
    background: rgba(255, 140, 0, 0.2);
    border-color: rgba(255, 180, 0, 0.5);
    transform: scale(1.05);
  }

  .hero-button-secondary:active {
    transform: scale(0.95);
  }

  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  .px-8 { padding-left: 2rem; padding-right: 2rem; }
  .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
  .mb-8 { margin-bottom: 2rem; }
  .mb-2 { margin-bottom: 0.5rem; }
  .mt-10 { margin-top: 2.5rem; }
  .sm\:flex-row { flex-direction: row; }
`;

document.head.appendChild(webglAnimationsStyle);

// ====================================
// ENHANCED HERO ANIMATIONS (formerly enhanced-hero.js)
// ====================================

class EnhancedHeroAnimation {
    constructor() {
        this.hero = document.querySelector('#home');
        this.init();
    }

    init() {
        if (!this.hero) return;
        
        this.createSplitTextAnimation();
        this.createMorphingBlob();
        this.createParallaxEffect();
        this.createGlowRing();
    }

    // Split text animation (letter by letter)
    createSplitTextAnimation() {
        const titleElement = document.querySelector('h1');
        if (!titleElement) return;

        const originalText = titleElement.textContent;
        titleElement.innerHTML = '';

        const letters = originalText.split('');
        letters.forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            span.style.animation = `letterFade 0.6s ease-out forwards`;
            span.style.animationDelay = `${index * 0.03}s`;
            titleElement.appendChild(span);
        });
    }

    // Morphing blob animation
    createMorphingBlob() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes morphing {
                0% {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    transform: translate(0, 0) rotate(0deg);
                }
                33% {
                    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                    transform: translate(30px, -50px) rotate(120deg);
                }
                66% {
                    border-radius: 70% 30% 40% 60% / 40% 70% 60% 30%;
                    transform: translate(-20px, 20px) rotate(240deg);
                }
                100% {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    transform: translate(0, 0) rotate(360deg);
                }
            }

            @keyframes letterFade {
                from {
                    opacity: 0;
                    transform: translateY(100px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes glowPulse {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(79, 70, 229, 0.3), 
                                0 0 40px rgba(79, 70, 229, 0.1);
                }
                50% {
                    box-shadow: 0 0 40px rgba(79, 70, 229, 0.5), 
                                0 0 60px rgba(79, 70, 229, 0.2);
                }
            }

            @keyframes scanLine {
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(100%);
                }
            }

            @keyframes dotPulse {
                0%, 100% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.8;
                }
            }

            .morphing-blob {
                animation: morphing 20s infinite linear;
            }

            .glow-ring {
                animation: glowPulse 3s ease-in-out infinite;
            }

            .hero-image {
                transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .hero-image:hover {
                filter: grayscale(0%);
                transform: scale(1.02);
            }

            .scan-effect {
                animation: scanLine 0.8s ease-in-out;
            }

            .pulse-dot {
                animation: dotPulse 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);

        // Create morphing blob
        const blob = document.createElement('div');
        blob.className = 'absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/5 blur-3xl morphing-blob rounded-full';
        blob.style.pointerEvents = 'none';
        
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            heroSection.appendChild(blob);
        }
    }

    // Parallax effect on scroll
    createParallaxEffect() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                
                if (scrollProgress > 0 && scrollProgress < 1) {
                    const yMove = scrollProgress * 30;
                    const opacity = Math.max(0, 1 - scrollProgress * 0.2);
                    
                    element.style.transform = `translateY(${yMove}%)`;
                    element.style.opacity = opacity;
                }
            });
        });

        // Add data-parallax to hero content
        const heroContent = document.querySelector('#home .max-w-6xl');
        if (heroContent) {
            heroContent.setAttribute('data-parallax', 'true');
        }
    }

    // Glow ring animation around image
    createGlowRing() {
        const images = document.querySelectorAll('img[alt*="Photo"], img[alt*="Profile"]');
        
        images.forEach(img => {
            const parent = img.parentElement;
            if (parent) {
                const glowRing = document.createElement('div');
                glowRing.className = 'glow-ring absolute -inset-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 opacity-20 blur-2xl';
                glowRing.style.pointerEvents = 'none';
                parent.style.position = 'relative';
                parent.insertBefore(glowRing, img);

                // Add hover scan effect
                img.addEventListener('mouseenter', () => {
                    const scanLine = document.createElement('div');
                    scanLine.className = 'scan-effect absolute inset-0 bg-gradient-to-b from-indigo-400/0 via-indigo-400/10 to-indigo-400/0';
                    parent.appendChild(scanLine);
                    
                    setTimeout(() => scanLine.remove(), 800);
                });

                // Add grayscale filter by default
                img.classList.add('hero-image');
            }
        });
    }
}

// ====================================
// MAGNETIC BUTTON EFFECT
// ====================================

class MagneticButton {
    constructor(button) {
        this.button = button;
        this.x = 0;
        this.y = 0;
        this.init();
    }

    init() {
        this.button.addEventListener('mousemove', (e) => this.magnetize(e));
        this.button.addEventListener('mouseenter', () => this.startMagnetize());
        this.button.addEventListener('mouseleave', () => this.resetButton());
    }

    magnetize(e) {
        const rect = this.button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = 100;
        const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX);
        
        this.x = Math.cos(angle) * distance;
        this.y = Math.sin(angle) * distance;
        
        this.button.style.transform = `translate(${this.x * 0.1}px, ${this.y * 0.1}px)`;
    }

    startMagnetize() {
        this.button.style.transition = 'transform 0.3s cubic-bezier(0.6, 0.05, 0.01, 0.99)';
    }

    resetButton() {
        this.button.style.transform = 'translate(0, 0)';
    }
}

// ====================================
// FLOATING PARTICLES
// ====================================

class FloatingParticles {
    constructor(containerId = 'home', particleCount = 20) {
        this.container = document.getElementById(containerId);
        this.particleCount = particleCount;
        this.init();
    }

    init() {
        if (!this.container) return;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px) translateX(0px);
                    opacity: 0;
                }
                10% {
                    opacity: 0.5;
                }
                90% {
                    opacity: 0.5;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }

            .floating-particle {
                position: absolute;
                pointer-events: none;
                mix-blend-mode: screen;
            }
        `;
        document.head.appendChild(style);

        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const duration = Math.random() * 10 + 15;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}%`;
            particle.style.bottom = '-10px';
            particle.style.backgroundColor = '#4f46e5';
            particle.style.borderRadius = '50%';
            particle.style.boxShadow = `0 0 ${size * 2}px #4f46e5`;
            particle.style.animation = `float ${duration}s ease-in infinite`;
            particle.style.animationDelay = `${delay}s`;
            
            this.container.appendChild(particle);
        }
    }
}

// ====================================
// GRID PATTERN BACKGROUND
// ====================================

class GridPattern {
    constructor(containerId = 'home') {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;

        const grid = document.createElement('div');
        grid.className = 'absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]';
        grid.style.pointerEvents = 'none';
        
        // Insert at the beginning (before other content)
        this.container.insertBefore(grid, this.container.firstChild);
    }
}

// ====================================
// ENHANCED BUTTON GRADIENT ANIMATION
// ====================================

class GradientButton {
    constructor(button) {
        this.button = button;
        this.init();
    }

    init() {
        this.button.addEventListener('mouseenter', () => this.animateGradient());
        this.button.addEventListener('mouseleave', () => this.resetGradient());
    }

    animateGradient() {
        if (!this.button.style.background) {
            this.button.style.background = 'linear-gradient(90deg, #4f46e5, #ec4899, #4f46e5)';
            this.button.style.backgroundSize = '200% 100%';
        }
        
        this.button.style.animation = 'gradientShift 1s ease-in-out';
    }

    resetGradient() {
        this.button.style.animation = 'none';
        this.button.style.background = '';
    }
}

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Enhanced Hero Initialized (WebGL + Animations)');
    
    // Initialize WebGL hero
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new EnhancedWebGLHero();
        });
    } else {
        new EnhancedWebGLHero();
    }
    
    // Initialize enhanced hero animations
    new EnhancedHeroAnimation();
    
    // Initialize floating particles
    new FloatingParticles('home', 30);
    
    // Initialize grid pattern
    new GridPattern('home');
    
    // Initialize magnetic buttons
    const ctaButtons = document.querySelectorAll('a[href="#projects"], a[href="#contact"], a[href="#skills"]');
    ctaButtons.forEach(button => {
        new MagneticButton(button);
        new GradientButton(button);
    });

    // Add scroll event for additional effects
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('#home');
        
        if (hero && scrollY < hero.offsetHeight) {
            hero.style.opacity = Math.max(0, 1 - scrollY / 1000);
        }
    });
});

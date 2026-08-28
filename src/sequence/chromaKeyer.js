/**
 * GPU-accelerated Video Chroma Keyer
 * Replaces per-frame getImageData/putImageData with a WebGL fragment shader.
 * Removes gray/white checkerboard-pattern pixels from the preloader video
 * by sampling an RGB luminance + saturation test in the fragment shader.
 */

export class ChromaKeyer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', {
      premultipliedAlpha: false,
      alpha: true,
      preserveDrawingBuffer: false,
    });
    this.ready = false;
    this._init();
  }

  _init() {
    if (!this.gl) return;
    const gl = this.gl;

    // Vertex shader — full-screen quad
    const vsSource = `
      attribute vec2 aPosition;
      attribute vec2 aTexCoord;
      varying vec2 vTexCoord;
      void main() {
        vTexCoord = aTexCoord;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Fragment shader — keys out gray/white checkerboard pixels
    const fsSource = `
      precision mediump float;
      varying vec2 vTexCoord;
      uniform sampler2D uTexture;

      void main() {
        vec4 color = texture2D(uTexture, vTexCoord);
        float r = color.r;
        float g = color.g;
        float b = color.b;

        // Gray/white checkerboard detection:
        // All channels > 0.72 and differences between channels < 0.086
        float maxC = max(r, max(g, b));
        float minC = min(r, min(g, b));
        float diff1 = abs(r - g);
        float diff2 = abs(g - b);

        if (maxC > 0.72 && diff1 < 0.086 && diff2 < 0.086) {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // fully transparent
        } else {
          gl_FragColor = color;
        }
      }
    `;

    const vs = this._compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = this._compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[ChromaKeyer] Program link failed:', gl.getProgramInfoLog(program));
      return;
    }
    this.program = program;

    // Full-screen quad: position + texcoord
    const positions = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const texCoords = new Float32Array([0,1, 1,1, 0,0, 1,0]);

    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    this.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    this.aPosition = gl.getAttribLocation(program, 'aPosition');
    this.aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
    this.uTexture = gl.getUniformLocation(program, 'uTexture');

    // Create video texture
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.ready = true;
  }

  _compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[ChromaKeyer] Shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  render(video) {
    if (!this.ready || !video || video.readyState < 2 || video.paused || video.ended) return;

    const gl = this.gl;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h) return;

    // Resize canvas to match video
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    gl.useProgram(this.program);

    // Upload video frame as texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.uniform1i(this.uTexture, 0);

    // Draw quad
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.enableVertexAttribArray(this.aPosition);
    gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.enableVertexAttribArray(this.aTexCoord);
    gl.vertexAttribPointer(this.aTexCoord, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

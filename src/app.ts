
export default class App {
    private canvas: HTMLCanvasElement
    private gl: WebGLRenderingContext
    private program: WebGLProgram

    constructor(canvas : HTMLCanvasElement){
        this.canvas = canvas
        this.gl = canvas.getContext('webgl2') as WebGLRenderingContext
    }

    public run(){
        this.initShader()
        this.initVertexBuffer()
        this.draw()
    }

    private initShader(){
        const vertexShaderSource = `#version 300 es
        in vec3 inPosition;
        in vec4 inColor;

        out vec4 vColor;

        void main(){
            vColor = inColor;
            gl_Position = vec4(inPosition, 1.0);
        }
        `
        const fragmentShaderSource = `#version 300 es
        precision highp float;

        in vec4 vColor;

        out vec4 fColor;

        void main(){
            fColor = vColor;
        }
        `

        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(vertexShader, vertexShaderSource)
        this.gl.compileShader(vertexShader)
        if(!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)){
            const info = this.gl.getShaderInfoLog(vertexShader)
            console.log(info)
        }

        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(fragmentShader, fragmentShaderSource)
        this.gl.compileShader(fragmentShader)
        if(!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)){
            const info = this.gl.getShaderInfoLog(fragmentShader)
            console.log(info)
        }

        this.program = this.gl.createProgram()
        this.gl.attachShader(this.program, vertexShader)
        this.gl.attachShader(this.program, fragmentShader)
        this.gl.linkProgram(this.program)
        if(!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)){
            const info = this.gl.getProgramInfoLog(this.program)
            console.log(info)
        }
    }

    private initVertexBuffer(){
        const vertexBuffer = this.gl.createBuffer()
        const colorBuffer = this.gl.createBuffer()

        const vertexAttribLocation = this.gl.getAttribLocation(this.program, 'inPosition')
        const colorAttribLocation = this.gl.getAttribLocation(this.program, 'inColor')

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
        this.gl.enableVertexAttribArray(vertexAttribLocation)
        this.gl.vertexAttribPointer(vertexAttribLocation, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.enableVertexAttribArray(colorAttribLocation)
        this.gl.vertexAttribPointer(colorAttribLocation, 4, this.gl.FLOAT, false, 0, 0)

        const vertices = new Float32Array([
            -0.5,  0.5, 0.0,
            -0.5, -0.5, 0.0,
             0.5,  0.5, 0.0,
            -0.5, -0.5, 0.0,
             0.5, -0.5, 0.0,
             0.5,  0.5, 0.0
        ])

        const colors = new Float32Array([
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ])

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, colors, this.gl.STATIC_DRAW)
    }

    public draw(){
        this.gl.useProgram(this.program)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6)
        this.gl.flush()
    }
}
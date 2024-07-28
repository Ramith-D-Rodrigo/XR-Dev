
window.mat4 = glMatrix.mat4;

main();


function main() {
    /* Create WebGL context */
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }
    /* Define and store the geometry */

    /* Define front face vertices */
    const squares = [
        //front face
        -0.4, -0.4, -0.4,
        0.4, -0.4, -0.4,
        0.4, 0.4, -0.4,

        -0.4, -0.4, -0.4,
        -0.4, 0.4, -0.4,
        0.4, 0.4, -0.4,

        //back face
        -0.2, -0.2, 0.5,
        0.6, -0.2, 0.5,
        0.6, 0.6, 0.5,

        -0.2, -0.2, 0.5,
        -0.2, 0.6, 0.5,
        0.6, 0.6, 0.5,

        //top face
        -0.4, 0.4, -0.4,
        0.4, 0.4, -0.4,
        0.6, 0.6, 0.5,

        -0.4, 0.4, -0.4,
        -0.2, 0.6, 0.5,
        0.6, 0.6, 0.5,
    ];
    /* Define front face buffer */

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squares), gl.STATIC_DRAW);

    /* Define colors */

    const squareColors = [
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
    ];

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareColors), gl.STATIC_DRAW);

    /* Shaders */
    
    /* Define shader sources */
    const vsSource = `
        attribute vec4 aPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
            vColor = aVertexColor;
        }
    `;

    const fsSource = `
        varying lowp vec4 vColor;

        void main() {
            gl_FragColor = vColor;
        }
    `;

    /* Create shaders */
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);

    /* Compile shaders */
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
        gl.deleteShader(fragmentShader);
        return;
    }
    /* create shader program */
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    /* Link shader program */
    gl.linkProgram(program);
    gl.useProgram(program);

    let then = 0;
    let cubeRotation = 0.0;

    function render(now) {
        now *= 0.001; 
        let deltaTime = now - then;
        then = now;

        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 1, 0]);

        const projectionMatrx = mat4.create();
        const fieldOfView = 45 * Math.PI / 180;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        mat4.perspective(projectionMatrx, fieldOfView, aspect, zNear, zFar);

        /* Connect the attribute with the vertex shader */
        const modelViewMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
        gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

        const projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrx);

        const positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttributeLocation);

        const colorAttributeLocation = gl.getAttribLocation(program, "aVertexColor");
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttributeLocation);

        /* Drawing */
        gl.clearColor(1,1,1,1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        /* Draw the points to the screen */
        const mode = gl.TRIANGLES;
        const first = 0;
        const count = 18;
        gl.drawArrays(mode, first, count);
        cubeRotation += deltaTime;
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

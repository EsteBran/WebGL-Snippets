"use strict";

//vertex shader in glsl
var vertexShaderSource = `#version 300 es
in vec4 a_position;
 
void main() {
 
  gl_Position = a_position;
}
`;
 
//fragment shader in glsl
var fragmentShaderSource = `#version 300 es
 
precision highp float;
 
out vec4 outColor;
 
void main() {
  outColor = vec4(1, 0, 0.5, 1);
}
`;

//compiles glsl shader given source and context
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

//links fragment and vertex shader into a program
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}


function main() {
    //get a webgl context (which is webgl 2.0 here)
    var canvas = document.querySelector("#c");
    var gl = canvas.getContext("webgl2");

    if (!gl) {
        return;
    }
    
    //create shaders
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    //create program
    var program = createProgram(gl, vertexShader, fragmentShader);    

    //set up state to supply data to glsl programs
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position")

    //set up buffer and bind it to webgl
    //binding the buffer lets us put data into the buffer, which gets used
    //inside webgl, like a webgl global variable
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //now we can put data into the buffer by referincing it
    var position = [
        -1.0, 0,
        0, 0.5,
        1.0, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position),  gl.STATIC_DRAW);

    //after putting data in buffer we can tell the attribute how to get data
    //out of it
    var vao = gl.createVertexArray();

    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    //resizes canvas to display size and then convert from clip space to pixels
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    //gl.bindVertexArray(vao);

    //draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);

    console.log("is it working?")
}

main();

<script lang="ts">
    console.log('starting at ' + new Date().toLocaleTimeString());

    import { mode } from "../../store";
    import { page } from "$app/stores";
 
    mode.subscribe((value) => {
        console.log('RECOGNIZER- mode changed to: ', value);
        if(value != "recognize") {
            //clearInterval(recognitionInterval);
            //startCaptureLoop();
        }
    });

    function toggleMode() {
        mode.update((value) => {
            if (value === 'recognize') {
                return 'enroll';
            } else {
                return 'recognize';
            }
        });
    }


    import { onMount } from 'svelte';
    //import '@tensorflow/tfjs-node';
    //import * as canvas from 'canvas';
    import * as faceapi from 'face-api.js';

    let canvas: HTMLCanvasElement;
    let video: HTMLVideoElement;
    let recognitionInterval: NodeJS.Timeout;
    let caputureInterval: NodeJS.Timeout;
    let snapshot: number = 0;

    onMount(async () => {
        console.log('mounting and loading models at ' + new Date().toLocaleTimeString());
        await loadModels();
        console.log('finished loading models at ' + new Date().toLocaleTimeString());
        await startCamera()
        console.log('video: '+ video);
        await startUp();
    });

    async function loadModels() {
        await faceapi.loadSsdMobilenetv1Model('/models');
        await faceapi.loadFaceLandmarkModel('/models');
        await faceapi.loadFaceRecognitionModel('/models');
    }

    async function startCamera() {
        await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: false 
            }).then(stream => {
                video = document.getElementById('video') as HTMLVideoElement;
                video.srcObject = stream;
                console.log('start camera video: ', video);
            }).catch(err => {
                console.error('getUserMedia() failed: ', err)
            });
    }

    async function startUp() {
        console.log('starting video listener at ' + new Date().toLocaleTimeString());
        console.log('video: ', video);
        video.addEventListener('play', async () => {
            //initiateForm();
            canvas = faceapi.createCanvasFromMedia(video);
            canvas.style.position = 'absolute';
            canvas.style.left = '10px';
            //canvas.getContext('2d', { willReadFrequently: true });
            document.getElementById('container')?.append(canvas);
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
            startRecognitionLoop();
        });
    }

    function startRecognitionLoop() {
        console.log('starting recognition loop at ' + new Date().toLocaleTimeString());
        const displaySize = { width: video.width, height: video.height };

        recognitionInterval = setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                //const results = resizedDetections;
                ////console.log(results)
                canvas.getContext('2d', {willReadFrequently: true})?.clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            }, 100);
    }

    function startCaptureLoop() {
        console.log('starting capture loop at ' + new Date().toLocaleTimeString());
        const descriptors: any = [];
        snapshot = 0

        // could potentially time out if no face is detected
        // consider adding a check on the interval to stop after a certain time
        caputureInterval = setInterval(async () => {
            if(snapshot < 3) {
                const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                if(detections) {
                    console.log('captured: ', detections);
                    descriptors.push(detections[0].descriptor);
                    snapshot++;
                } else {
                    console.log('No face detected');
                }
            } else {
                clearInterval(caputureInterval);
                const newFace = new faceapi.LabeledFaceDescriptors('new', descriptors);
                //knownStudents.push(newFace);
                console.log("new face: ", newFace);
                toggleMode();
                startRecognitionLoop();
            }
        }, 500);
    }



</script>

<div id="container">
    <video id="video" width="600" height="450" autoplay></video>
</div>

<style>
    #container {
    position: relative;
    }

    canvas {
        position: absolute;
        top: 10px;
        left: 10px;
        border: 1px solid black;
    }

    #video {
        border: 10px solid #a35d5d;
    }

    h1 {
        font-size: 2em;
        font-weight: bold;
        margin-bottom: 0.5em;
    }
    p {
        margin-bottom: 1.5em;
}

</style>
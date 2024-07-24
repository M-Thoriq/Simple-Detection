import * as tf from '@tensorflow/tfjs';
import * as tfmodel from '@tensorflow-models/coco-ssd';
import React from 'react';
import Webcam from 'react-webcam';
import { useRef, useState, useEffect } from "react";
// Import client side react



function drawRect(obj, ctx){
    // Loop through each prediction
    obj.forEach(prediction => {
        // Extract boxes and classes
        const [x, y, width, height] = prediction['bbox']; 
        const text = prediction['class']; 

        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        // Set styling
        ctx.strokeStyle = color
        ctx.font = '18px Arial';
        ctx.fillStyle = color

        // Draw rectangles and text
        ctx.beginPath()
        // rectMode(RADIUS);
        ctx.fillText(text, x, y-5);
        ctx.rect(x, y, width, height, 50);
        ctx.stroke()
    });
}

export default function WebcamML(className) {
    const webcamRef = React.useRef(null);
    const canvasRef = React.useRef(null);
    
    const runModel = async () => {
        const net = await tfmodel.load();

        setInterval(() => {
            detect(net);
        }, 200);     
    }

    
    async function addPredictionsDiv(obj) {
      const predictionsContainer = document.getElementById('predictions');
      // Clear previous predictions
      // predictionsContainer.innerHTML = '';
    
      obj.forEach(prediction => {
        const predictionClass = prediction['class'];
        const predictionScore = prediction['score'];
        const predictionDiv = document.createElement('div');
        // Score Bar Color if >=85% bg-green-500 and if >=70% bg-yellow-500 else bg-red-500
        const scoreBarColor = predictionScore >= 0.85 ? 'bg-green-500' : predictionScore >= 0.70 ? 'bg-yellow-500' : 'bg-red-500';
        predictionDiv.className = 'w-full h-fit last:outline-dashed last:outline-4 outline-blue-400 last:scale-105 scale-90 bg-white bg-opacity-70 rounded-md p-2';
        predictionDiv.innerHTML = `

          <p class='first-letter:uppercase'><b>${predictionClass}</b></p>
          <p>Accuracy: ${predictionScore.toFixed(2) * 100}%</p>
          <span id='progress' class='w-[${(predictionScore.toFixed(2) * 100)}%] h-2 ${scoreBarColor} block rounded-md'></span>
 
        `;

        predictionsContainer.appendChild(predictionDiv);

      });
    }

    const detect = async (net) => {
        // Check data is available
        if (
          typeof webcamRef.current !== "undefined" &&
          webcamRef.current !== null &&
          webcamRef.current.video.readyState === 4
        ) {
          // Get Video Properties
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;
    
          // Set video width
          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;
    
          // Set canvas height and width
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
    
          // 4. TODO - Make Detections
          const obj = await net.detect(video);
        //   console.log(obj);
          
          const ctx = canvasRef.current.getContext("2d");
          drawRect(obj, ctx);
          
          addPredictionsDiv(obj);
        }
        else {
          const webcamDiv = document.getElementById('webcamvideo');
          webcamDiv.innerHTML = `
          <div
              class='absolute top-1/2 h-[480px] w-[640px] -translate-y-1/2 left-1/2 -translate-x-1/2 mx-auto rounded-xl bg-black'
          > 
            <div class='grid place-content-center h-full'>
              <h1 class='text-white text-xl'>No Camera Found! :(</h1>
            </div>
          </div>
          `;

          return 0;
        }
      };
    
      useEffect(()=>{runModel()},[]);
      
    
      return (
        <>
        <div className='h-screen flex justify-center place-content-center bg-blur bg-cover'>
          <div id='webcamvideo' className={'relative h-full w-full items-center' + className}>
              <Webcam
              ref={webcamRef}
              muted={true} 
              className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mx-auto rounded-xl'
              />

              <canvas
              ref={canvasRef}
              className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 mx-auto rounded-xl'
              />
          </div>
          <div className='fixed max-h-[480px] min-h-[480px] noscroll w-60 overflow-y-scroll p-4 rounded-xl z-50 top-1/2 -translate-y-1/2 right-[10%]'>
              <h1 className='text-black font-bold text-xl text-center'></h1>
              <div className='flex flex-col-reverse gap-1.5' id='predictions'>

              </div>  
          </div>
        </div>
    </>
    );
}

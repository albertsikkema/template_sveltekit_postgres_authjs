<script>
    import { onMount } from "svelte";
  
    let videoRef;
    let canvasRef;
    let imgRef;
    let stream;
  
    async function startWebcam() {
      try {
        // **🔹 Polyfill for older iOS Safari versions**
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices = navigator.mediaDevices || {};
          navigator.mediaDevices.getUserMedia = function (constraints) {
            let getUserMedia =
              navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            if (!getUserMedia) {
              return Promise.reject(new Error("getUserMedia is not supported"));
            }
            return new Promise((resolve, reject) => {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
  
        const constraints = {
          video: {
            facingMode: { ideal: "user" }, // **🔹 "user" = Front Camera**
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
  
        stream = await navigator.mediaDevices.getUserMedia(constraints);
  
        if (videoRef) {
          videoRef.srcObject = stream;
          await new Promise(resolve => (videoRef.onloadedmetadata = resolve));
        }
  
        console.log("🎥 Webcam started successfully.");
      } catch (error) {
        console.error("❌ Error accessing webcam:", error.message);
  
        if (error.name === "NotAllowedError") {
          alert("🚨 Camera permission denied. Please enable access.");
        } else if (error.name === "NotFoundError") {
          alert("❌ No webcam found.");
        } else if (error.name === "NotReadableError") {
          alert("⚠️ Camera may be in use by another app.");
        } else if (error.name === "SecurityError") {
          alert("🔐 Camera access requires HTTPS.");
        } else {
          alert("⚠️ Unexpected webcam error: " + error.message);
        }
      }
    }
  
    function stopWebcam() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log("🛑 Webcam stopped.");
      }
    }
  
    function capturePhoto() {
      if (!videoRef || !canvasRef || !imgRef) {
        console.error("❌ Required elements not found!");
        return;
      }
  
      if (videoRef.videoWidth === 0 || videoRef.videoHeight === 0) {
        console.error("❌ Video feed not ready! Waiting...");
        setTimeout(capturePhoto, 200);
        return;
      }
  
      const ctx = canvasRef.getContext("2d");
  
      if (!ctx) {
        console.error("❌ Canvas 2D context is not available!");
        return;
      }
  
      canvasRef.width = videoRef.videoWidth;
      canvasRef.height = videoRef.videoHeight;
  
      requestAnimationFrame(() => {
        try {
          ctx.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
  
          // 🔹 iOS Fix: Force Canvas Change
          ctx.fillStyle = "rgba(0,0,0,0.1)";
          ctx.fillRect(0, 0, 1, 1);
  
          const imageData = ctx.getImageData(0, 0, canvasRef.width, canvasRef.height);
          const allBlank = imageData.data.every((pixel) => pixel === 0);
  
          if (allBlank) {
            console.error("❌ Captured image is blank! Trying again...");
            setTimeout(capturePhoto, 150);
            return;
          }
  
          const imageBase64 = canvasRef.toDataURL("image/png");
          imgRef.src = imageBase64;
          console.log("📸 Photo successfully captured!");
        } catch (error) {
          console.error("❌ Error capturing frame:", error);
        }
      });
    }
  
    // **🔹 Fix iPhone Bug: Camera Only Starts on First Click**
    onMount(() => {
      document.addEventListener(
        "click",
        () => {
          if (!stream) {
            console.log("🔹 First user interaction: Starting Camera...");
            startWebcam();
          }
        },
        { once: true }
      );
    });
  </script>
  
  <section>
    <video bind:this={videoRef} autoplay width="300"></video>
    <canvas bind:this={canvasRef} width="500" height="375" class="hidden"></canvas>
  
    <button on:click={capturePhoto}>📸 Capture</button>
  
    <h2>Captured Image:</h2>
    <img bind:this={imgRef} alt="Captured Photo" width="500" />
  </section>
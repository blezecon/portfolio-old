import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// Import the model directly
import modelPath from '../assets/modelEX.glb';

// Fixed dimensions for the model viewer
const FIXED_SIZE = 500;

const SimpleModelViewer = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const [dimensions] = useState({ width: FIXED_SIZE, height: FIXED_SIZE });



  useEffect(() => {
    if (!containerRef.current) return;

    const size = FIXED_SIZE;
    const modelOffset = 0.0;

    // Create a scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Use a wider field of view for a more dramatic appearance
    const camera = new THREE.PerspectiveCamera(85, 1, 0.1, 1000);
    cameraRef.current = camera;

    // Create renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance' // Request dedicated GPU if available
    });
    rendererRef.current = renderer;

    // Set initial size - will be updated on resize
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0); // Completely transparent background
    containerRef.current.appendChild(renderer.domElement);

    // Enhanced lighting for better visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(0, 5, 5); // Light from front-top
    scene.add(directionalLight);

    // Add a soft blue/purple light to match your site's aesthetic
    const blueLight = new THREE.PointLight(0x4f46e5, 3, 10);
    blueLight.position.set(0, 0, 5); // Light from front for face highlighting
    scene.add(blueLight);

    // Add a soft teal accent light for better depth
    const tealLight = new THREE.PointLight(0x06b6d4, 2, 10);
    tealLight.position.set(-3, -1, 3);
    scene.add(tealLight);

    // Create a group to hold the model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    // Move the entire model group horizontally - responsive offset
    modelGroup.position.x = modelOffset;
    scene.add(modelGroup);

    // Position camera to view from the front
    camera.position.z = 4;

    // Throttling variables for mouse movement
    let lastMoveTime = 0;
    const throttleMs = 16; // ~60 fps

    // Variables for mouse tracking
    let targetRotationY = -Math.PI / 5; // Default rotation
    let targetRotationX = 0;
    let currentRotationY = targetRotationY;
    let currentRotationX = targetRotationX;

    // Get element position for accurate mouse tracking
    const getElementPosition = () => {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      };
    };

    // Mouse move handler with throttling
    const onMouseMove = (event) => {
      // Add throttling to limit processing
      const now = Date.now();
      if (now - lastMoveTime < throttleMs) return;
      lastMoveTime = now;

      if (!containerRef.current) return;

      const elementPos = getElementPosition();

      // Calculate the center of the container
      const centerX = elementPos.left + elementPos.width / 2;
      const centerY = elementPos.top + elementPos.height / 2;

      // Calculate normalized mouse position from -1 to 1
      const divisorX = window.innerWidth / 2;
      const divisorY = window.innerHeight / 2;

      const mouseX = (event.clientX - centerX) / divisorX;
      const mouseY = (event.clientY - centerY) / divisorY;

      // Set target rotations with limits
      targetRotationY = -Math.PI / 5 + mouseX * 0.5; // Base + mouse influence
      targetRotationX = mouseY * 0.3; // Limit vertical rotation

      // Clamp the rotation values to prevent extreme angles
      targetRotationY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationY));
      targetRotationX = Math.max(-Math.PI / 6, Math.min(Math.PI / 6, targetRotationX));
    };



    // Add event listener
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Load the 3D model
    const loader = new GLTFLoader();

    // Setup DRACOLoader for compressed models
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    try {
      // Use the imported model path
      loader.load(
        modelPath,
        (gltf) => {
          // Stop all animations - keep model in idle mode
          if (gltf.animations && gltf.animations.length > 0) {
            // Don't create or start any animation mixer
            console.log('Model has animations, but keeping it in idle mode');
          }

          // Center and size the model
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Scale model larger
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 4.0 / maxDim;
          gltf.scene.scale.multiplyScalar(scale);

          // Center model
          gltf.scene.position.sub(center.multiplyScalar(scale));

          // Set initial rotation
          gltf.scene.rotation.y = currentRotationY;

          // Add model to group
          modelGroup.add(gltf.scene);

          // Render once the model is loaded
          renderer.render(scene, camera);
        },
        undefined,
        (error) => {
          console.error('An error occurred loading the model:', error);
        }
      );
    } catch (e) {
      console.error('Error in model loading setup:', e);
    }

    // Animation loop with smooth rotation tracking
    const animate = () => {
      const animationId = requestAnimationFrame(animate);

      try {
        // Smoothly interpolate current rotation towards target rotation
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;

        // Apply the rotation to the model group
        if (modelGroup.children.length > 0) {
          modelGroup.children[0].rotation.y = currentRotationY;
          modelGroup.children[0].rotation.x = currentRotationX;
        }

        // Render the scene
        renderer.render(scene, camera);
      } catch (e) {
        console.error('Animation error:', e);
        cancelAnimationFrame(animationId);
      }
    };

    // Start animation loop
    animate();

    // Clean up
    return () => {
      window.removeEventListener('mousemove', onMouseMove);

      if (containerRef.current && rendererRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }

      // Dispose resources
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) object.geometry.dispose();

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Fixed container styles
  const containerStyle = {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    margin: '0 auto',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    boxShadow: 'none'
  };

  return (
    <div
      ref={containerRef}
      style={containerStyle}
    />
  );
};

export default SimpleModelViewer;
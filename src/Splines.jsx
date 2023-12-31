import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useAnimations, useGLTF, Html } from "@react-three/drei";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export default function Splines() {
  const splines = useGLTF("./ExoSpline_v11.glb");
  const group = useRef();

  const [currentSpline, setCurrentSpline] = useState(null);
  const [currentTexture, setCurrentTexture] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const spline01 = splines.scene.getObjectByName("Curve001");
  const spline02 = splines.scene.getObjectByName("Curve002");
  const spline03 = splines.scene.getObjectByName("Curve003");

  const texture01 = useLoader(THREE.TextureLoader, "/splines/spline.png");
  const texture02 = useLoader(THREE.TextureLoader, "/splines/spline02.png");
  const texture03 = useLoader(THREE.TextureLoader, "/splines/spline03.png");

  texture01.repeat.set(1, 0.5);
  texture01.wrapS = THREE.RepeatWrapping;
  texture01.wrapT = THREE.RepeatWrapping;

  texture02.repeat.set(1, 0.5);
  texture02.wrapS = THREE.RepeatWrapping;
  texture02.wrapT = THREE.RepeatWrapping;

  texture03.repeat.set(1, 0.5);
  texture03.wrapS = THREE.RepeatWrapping;
  texture03.wrapT = THREE.RepeatWrapping;

  spline01.material = new THREE.MeshStandardMaterial({
    map: texture01,
    color: 0xff5b00,
    transparent: true,
    side: THREE.DoubleSide,
  });

  spline02.material = new THREE.MeshStandardMaterial({
    map: texture02,
    color: 0xff5b00,
    transparent: true,
    side: THREE.DoubleSide,
  });

  spline03.material = new THREE.MeshStandardMaterial({
    map: texture03,
    color: 0xff5b00,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const startAnimation = () => {
    if (isAnimating) {
      return;
    }

    const randomSplineNumber = Math.floor(Math.random() * 3) + 1;

    let selectedSpline, selectedTexture;
    switch (randomSplineNumber) {
      case 1:
        selectedSpline = spline01;
        selectedTexture = texture01;
        break;
      case 2:
        selectedSpline = spline02;
        selectedTexture = texture02;
        break;
      case 3:
        selectedSpline = spline03;
        selectedTexture = texture03;
        break;
      default:
        return;
    }

    setCurrentSpline(selectedSpline);
    setCurrentTexture(selectedTexture);

    if (selectedSpline) {
      selectedSpline.visible = true;
      gsap.fromTo(
        selectedTexture.offset,
        { x: 0.2 },
        {
          x: 2,
          duration: 3,
          onComplete: () => {
            selectedSpline.visible = false;
            setCurrentSpline(null);
            setCurrentTexture(null);
            setIsAnimating(false); // Set isAnimating to false after the animation completes
          },
        }
      );
    }

    setIsAnimating(true);
  };

  const stopAnimation = () => {
    if (currentSpline) {
      // Stop the animation using GSAP's killTweensOf function
      gsap.killTweensOf(currentTexture.offset);

      // Hide the spline and reset the current spline and texture states
      currentSpline.visible = false;
      setCurrentSpline(null);
      setCurrentTexture(null);

      // Set the isAnimating state to false
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    // Скрыть сплайны при загрузке страницы
    spline01.visible = false;
    spline02.visible = false;
    spline03.visible = false;
  }, []);

  return (
    <>
      <Html>
        <div>
          <button
            className="buttonSpline"
            onClick={startAnimation}
            disabled={isAnimating}
          >
            Start Splines
          </button>
          <button
            className="buttonSplineoff"
            onClick={stopAnimation}
            disabled={!isAnimating}
          >
            Stop Splines
          </button>
        </div>
      </Html>

      <group ref={group}>
        <primitive object={splines.scene} scale={0.75} position-y={0} />
      </group>
    </>
  );
}

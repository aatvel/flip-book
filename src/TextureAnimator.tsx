import React, { useEffect, useRef, useState } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { TextureLoader } from "three";

export type TextureAnimatorProps = {
  tilesHoriz: number;
  tilesVert: number;
  numTiles: number;
  tileDispDuration: number;
  position: THREE.Vector3 | [number, number, number];
} & JSX.IntrinsicElements["mesh"];

const TextureAnimator: React.forwardRef<THREE.Mesh, TextureAnimatorProps> = (
  { tilesHoriz, tilesVert, numTiles, tileDispDuration, position, ...props },
  fref
) => {
  const v = useThree((state) => state.viewport);
  const meshRef = useRef<THREE.Mesh>();
  const [isRunning, setIsRunning] = useState(false);
  const [aspect, setAspect] = useState<[number, number, number]>([1, 1, 1]);
  const currentTile = useRef<number>(0);
  const timerOffset = useRef<number>(0);

  const texture01 = useLoader(TextureLoader, "/flipBook/anim1_front.png");
  const texture02 = useLoader(TextureLoader, "/flipBook/anim2_front.png");
  const texture03 = useLoader(TextureLoader, "/flipBook/anim3_front.png");

  const textureSet = [texture01, texture02, texture03];
  const [randomTextureIndex, setRandomTextureIndex] = useState<number>(0);
  const [randomTexture, setRandomTexture] = useState<THREE.Texture | null>(
    null
  );

  useEffect(() => {
    if (randomTexture) {
      randomTexture.wrapS = randomTexture.wrapT = THREE.RepeatWrapping;
      randomTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert);

      setAspect([v.width, v.height, 1]);
    }
  }, [randomTexture]);

  useEffect(() => {
    if (numTiles === currentTile.current && !props.visible) {
      currentTile.current = 0;
    }
  }, [props.visible]);

  const runAnimation = (): void => {
    const now = window.performance.now();
    const diff = now - timerOffset.current;

    if (diff > tileDispDuration && randomTexture) {
      timerOffset.current = now - (diff % tileDispDuration);
      currentTile.current += 1;
      const currentColumn = currentTile.current % tilesHoriz;
      const currentRow = Math.floor(currentTile.current / tilesHoriz);
      randomTexture.offset.x = currentColumn / tilesHoriz;
      randomTexture.offset.y = 1 - (currentRow + 1) / tilesVert;

      if (currentTile.current >= numTiles) {
        setIsRunning(false);
      }
    }
  };

  useFrame((state, delta) => {
    if (props.visible && isRunning) {
      runAnimation();
    }

    if (meshRef.current) {
      const cameraPosition = new THREE.Vector3();
      state.camera.getWorldPosition(cameraPosition);
      meshRef.current.lookAt(cameraPosition);
    }
  });

  const handleClick = (): void => {
    if (!isRunning) {
      setIsRunning(true);
      currentTile.current = 0;
      timerOffset.current = window.performance.now();

      const newRandomTextureIndex = Math.floor(
        Math.random() * textureSet.length
      );
      setRandomTextureIndex(newRandomTextureIndex);
      setRandomTexture(textureSet[newRandomTextureIndex]);
    } else {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Html>
        <button className="button" onClick={handleClick}>
          {isRunning ? "Stop Animation" : "Start Animation"}
        </button>
      </Html>
      <mesh position={position} {...props} ref={meshRef}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial
          map={randomTexture}
          color={"orange"}
          transparent={true}
          visible={isRunning ? true : false}
        />
      </mesh>
    </>
  );
};

export default TextureAnimator;

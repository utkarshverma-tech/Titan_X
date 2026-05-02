import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function CssBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#080d1a]">
      {/* Animated grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          animation: "gridScroll 20s linear infinite",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,120,255,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Floating particles via pseudo-CSS */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 1 + "px",
            height: Math.random() * 2 + 1 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            background: i % 3 === 0 ? "#00ffff" : i % 3 === 1 ? "#0088ff" : "#39ff14",
            opacity: Math.random() * 0.5 + 0.1,
            animation: `float ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 8}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes gridScroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(${Math.random() > 0.5 ? "" : "-"}${Math.floor(Math.random() * 30 + 10)}px, ${Math.random() > 0.5 ? "" : "-"}${Math.floor(Math.random() * 30 + 10)}px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}

export function SpaceBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationId: number | null = null;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0f1a, 0.001);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 400;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      if (!renderer.getContext()) {
        setWebglFailed(true);
        renderer.dispose();
        return;
      }

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.BufferGeometry();
      const particlesCount = 1500;
      const posArray = new Float32Array(particlesCount * 3);
      const colorsArray = new Float32Array(particlesCount * 3);

      const color1 = new THREE.Color(0x00ffff);
      const color2 = new THREE.Color(0x0088ff);

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 1000;
        posArray[i + 1] = (Math.random() - 0.5) * 1000;
        posArray[i + 2] = (Math.random() - 0.5) * 1000;

        const mixedColor = Math.random() > 0.5 ? color1 : color2;
        colorsArray[i] = mixedColor.r;
        colorsArray[i + 1] = mixedColor.g;
        colorsArray[i + 2] = mixedColor.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colorsArray, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particlesMesh = new THREE.Points(geometry, material);
      scene.add(particlesMesh);

      let mouseX = 0;
      let mouseY = 0;
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      const onMouseMove = (event: MouseEvent) => {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
      };

      document.addEventListener("mousemove", onMouseMove);
      const clock = new THREE.Clock();

      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        material.size = 2 + Math.sin(elapsedTime * 2) * 0.5;
        renderer!.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer!.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("mousemove", onMouseMove);
        if (animationId !== null) cancelAnimationFrame(animationId);
        if (mountRef.current && renderer?.domElement) {
          try { mountRef.current.removeChild(renderer.domElement); } catch {}
        }
        geometry.dispose();
        material.dispose();
        renderer?.dispose();
      };
    } catch {
      setWebglFailed(true);
      if (animationId !== null) cancelAnimationFrame(animationId);
      renderer?.dispose();
      return () => {};
    }
  }, []);

  if (webglFailed) {
    return <CssBackground />;
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[-1] pointer-events-none bg-[#080d1a]"
      style={{ opacity: 0.9 }}
    />
  );
}

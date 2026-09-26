'use client';

import React, { useEffect, useRef } from 'react';

interface SocNetworkBackgroundProps {
  variant?: 'dashboard' | 'landing';
  className?: string;
}

interface Node {
  x: number;
  y: number;
  baseRadius: number;
  phase: number;
  pulseSpeed: number;
  neighbors: number[];
  isCenter: boolean;
}

interface Particle {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

export const SocNetworkBackground: React.FC<SocNetworkBackgroundProps> = ({
  variant = 'dashboard',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Parameters based on variant
    const isLanding = variant === 'landing';
    const nodeCount = isLanding ? Math.floor(width / 30) : Math.floor(width / 45);
    const connectionDist = isLanding ? 185 : 155;
    const maxParticles = isLanding ? 15 : 9;
    const opacityMultiplier = isLanding ? 0.95 : 0.65;

    // Generate network nodes
    const nodes: Node[] = [];
    const centerXMin = width * 0.25;
    const centerXMax = width * 0.75;
    const centerYMin = height * 0.2;
    const centerYMax = height * 0.8;

    for (let i = 0; i < nodeCount; i++) {
      let x = Math.random() * width;
      let y = Math.random() * height;

      // Sparser in center area for dashboard variant to preserve content readability
      if (!isLanding && x > centerXMin && x < centerXMax && y > centerYMin && y < centerYMax) {
        if (Math.random() > 0.3) {
          // Push towards edges
          if (Math.random() > 0.5) {
            x = Math.random() > 0.5 ? Math.random() * centerXMin : centerXMax + Math.random() * (width - centerXMax);
          } else {
            y = Math.random() > 0.5 ? Math.random() * centerYMin : centerYMax + Math.random() * (height - centerYMax);
          }
        }
      }

      const isCenter = x > centerXMin && x < centerXMax && y > centerYMin && y < centerYMax;

      nodes.push({
        x,
        y,
        baseRadius: Math.random() * 1.8 + 1.2,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.012,
        neighbors: [],
        isCenter,
      });
    }

    // Build connection graph (prefer left-to-right connections to indicate unidirectional flow)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDist) {
          nodes[i].neighbors.push(j);
          nodes[j].neighbors.push(i);
        }
      }
    }

    // Unidirectional Data Particles (strictly flow left-to-right)
    const particles: Particle[] = [];

    const spawnParticle = () => {
      if (particles.length >= maxParticles) return;

      // Pick a node with a neighbor further to the right (Tx -> Rx flow direction)
      const validNodes: { from: number; to: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (const nIdx of nodes[i].neighbors) {
          if (nodes[nIdx].x > nodes[i].x + 15) {
            validNodes.push({ from: i, to: nIdx });
          }
        }
      }

      if (validNodes.length === 0) return;

      const choice = validNodes[Math.floor(Math.random() * validNodes.length)];
      // Color scheme: Cyan (telemetry) primary, subtle violet (AI) secondary
      const isViolet = Math.random() > 0.85;
      const color = isViolet
        ? 'rgba(139, 92, 246, ' // Violet
        : 'rgba(6, 182, 212, '; // Cyan

      particles.push({
        fromNode: choice.from,
        toNode: choice.to,
        progress: 0,
        speed: (0.004 + Math.random() * 0.008) * (isLanding ? 1.3 : 1.0),
        color,
        size: Math.random() * 1.4 + 1.5,
      });
    };

    // Initial particles
    for (let i = 0; i < Math.floor(maxParticles / 2); i++) {
      spawnParticle();
    }

    let spawnTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Background Grid Pattern
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Soft Ambient Radial Glows (Cyan left/top, Violet right/bottom)
      const cyanGlow = ctx.createRadialGradient(width * 0.15, height * 0.25, 0, width * 0.15, height * 0.25, width * 0.4);
      cyanGlow.addColorStop(0, `rgba(6, 182, 212, ${0.05 * opacityMultiplier})`);
      cyanGlow.addColorStop(1, 'rgba(8, 11, 18, 0)');
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, width, height);

      const violetGlow = ctx.createRadialGradient(width * 0.85, height * 0.75, 0, width * 0.85, height * 0.75, width * 0.4);
      violetGlow.addColorStop(0, `rgba(139, 92, 246, ${0.04 * opacityMultiplier})`);
      violetGlow.addColorStop(1, 'rgba(8, 11, 18, 0)');
      ctx.fillStyle = violetGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Connection Lines
      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        for (const nIdx of nodeA.neighbors) {
          if (nIdx > i) {
            const nodeB = nodes[nIdx];
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const lineAlpha = (1 - dist / connectionDist) * 0.09 * opacityMultiplier;

            ctx.strokeStyle = `rgba(51, 65, 85, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw Nodes with Breathing Opacity
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.phase += node.pulseSpeed;
        const breath = (Math.sin(node.phase) + 1) / 2; // 0 to 1
        const alpha = (0.22 + breath * 0.35) * opacityMultiplier * (node.isCenter ? 0.4 : 1.0);

        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.baseRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Draw & Update Unidirectional Telemetry Particles (if not reduced motion)
      if (!prefersReducedMotion) {
        spawnTimer++;
        if (spawnTimer > 35) {
          spawnParticle();
          spawnTimer = 0;
        }

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.progress += p.speed;

          if (p.progress >= 1) {
            particles.splice(i, 1);
            continue;
          }

          const nodeA = nodes[p.fromNode];
          const nodeB = nodes[p.toNode];
          const currX = nodeA.x + (nodeB.x - nodeA.x) * p.progress;
          const currY = nodeA.y + (nodeB.y - nodeA.y) * p.progress;

          // Pulse opacity trail
          const pulseAlpha = Math.sin(p.progress * Math.PI) * 0.95 * opacityMultiplier;

          // Directional tail line behind particle indicating unidirectional flow
          const tailVectorX = (nodeB.x - nodeA.x) * 0.09;
          const tailVectorY = (nodeB.y - nodeA.y) * 0.09;
          const tailGradient = ctx.createLinearGradient(
            currX,
            currY,
            currX - tailVectorX,
            currY - tailVectorY
          );
          tailGradient.addColorStop(0, `${p.color}${pulseAlpha * 0.85})`);
          tailGradient.addColorStop(1, `${p.color}0)`);

          ctx.strokeStyle = tailGradient;
          ctx.lineWidth = p.size * 1.1;
          ctx.beginPath();
          ctx.moveTo(currX, currY);
          ctx.lineTo(currX - tailVectorX, currY - tailVectorY);
          ctx.stroke();

          // Glow around particle
          const pGlow = ctx.createRadialGradient(currX, currY, 0, currX, currY, p.size * 4.5);
          pGlow.addColorStop(0, `${p.color}${pulseAlpha})`);
          pGlow.addColorStop(1, `${p.color}0)`);
          ctx.fillStyle = pGlow;
          ctx.beginPath();
          ctx.arc(currX, currY, p.size * 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Particle core
          ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
          ctx.beginPath();
          ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        animFrameId = requestAnimationFrame(render);
      }
    };

    // If reduced motion is requested, render once and stop loop
    render();

    // Resize listener
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      if (prefersReducedMotion) {
        render();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-10 transition-opacity duration-700 ${className}`}
    />
  );
};

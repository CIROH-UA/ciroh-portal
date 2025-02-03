import React, { useEffect } from "react";

const BubbleCursor = () => {
  useEffect(() => {
    if (typeof window === "undefined") return; // Prevent SSR issues

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/sketch.js/1.0/sketch.min.js";
    script.async = true;
    script.onload = () => initializeParticles();
    document.body.appendChild(script);

    function initializeParticles() {
      function Particle(x, y, radius) {
        this.init(x, y, radius);
      }

      Particle.prototype = {
        init: function (x, y, radius) {
          this.alive = true;
          this.radius = radius || 10;
          this.wander = 0.15;
          this.theta = Math.random() * Math.PI * 2;
          this.drag = 0.1;
          this.color = "rgba(255,255,255,0.8)";
          this.x = x || 0.0;
          this.y = y || 0.0;
          this.vx = 0.0;
          this.vy = 0.0;
        },
        move: function () {
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= this.drag;
          this.vy *= this.drag;
          this.theta += (Math.random() - 0.5) * this.wander;
          this.vx += Math.sin(this.theta) * 0.1;
          this.vy += Math.cos(this.theta) * 0.1;
          this.radius *= 0.96;
          this.alive = this.radius > 0.5;
        },
        draw: function (ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        },
      };

      const MAX_PARTICLES = 280;
      let particles = [];
      let pool = [];

      const canvas = document.createElement("canvas");
      canvas.id = "bubbleCanvas";
      canvas.style.position = "fixed";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1000";
      document.body.appendChild(canvas);

      const demo = Sketch.create({
        container: document.body,
        autoclear: false,
        element: canvas,
      });

      demo.spawn = function (x, y) {
        if (particles.length >= MAX_PARTICLES) pool.push(particles.shift());

        let particle = pool.length ? pool.pop() : new Particle();
        particle.init(x, y, Math.random() * 30 + 10);
        particle.wander = Math.random() * 1.5 + 0.5;
        particle.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2})`;
        particle.drag = Math.random() * 0.05 + 0.9;
        let theta = Math.random() * Math.PI * 2;
        let force = Math.random() * 6 + 2;

        particle.vx = Math.sin(theta) * force;
        particle.vy = Math.cos(theta) * force;

        particles.push(particle);
      };

      demo.update = function () {
        for (let i = particles.length - 1; i >= 0; i--) {
          let particle = particles[i];

          if (particle.alive) particle.move();
          else pool.push(particles.splice(i, 1)[0]);
        }
      };

      demo.draw = function () {
        demo.globalCompositeOperation = "lighter";
        for (let i = particles.length - 1; i >= 0; i--) {
          particles[i].draw(demo);
        }
      };

      demo.mousemove = function () {
        for (let i = 0; i < demo.touches.length; i++) {
          let touch = demo.touches[i];
          let max = Math.random() * 3 + 1;

          for (let j = 0; j < max; j++) {
            demo.spawn(touch.x, touch.y);
          }
        }
      };

      window.addEventListener("resize", () => {
        demo.width = window.innerWidth;
        demo.height = window.innerHeight;
      });

      return () => {
        document.body.removeChild(canvas);
        demo.destroy();
      };
    }
  }, []);

  return null; // The effect runs without needing a visible element
};

export default BubbleCursor;

import { useEffect, useRef, useState } from "react";

export function Canvas2D(props) {
  var drawFn = props.draw;
  var ref = useRef(null);
  var animRef = useRef(null);
  var tRef = useRef(0);
  var sizeState = useState(340);
  var size = sizeState[0];
  var setSize = sizeState[1];

  useEffect(function () {
    function updateSize() {
      var next = Math.max(260, Math.min(340, window.innerWidth - 32));
      setSize(next);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return function () {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(
    function () {
      var canvas = ref.current;
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
      var running = true;
      function animate() {
        if (!running) return;
        tRef.current += 0.015;
        ctx.clearRect(0, 0, size, size);
        drawFn(ctx, size, size, tRef.current);
        animRef.current = requestAnimationFrame(animate);
      }
      animate();
      return function () {
        running = false;
        cancelAnimationFrame(animRef.current);
      };
    },
    [drawFn, size],
  );

  return (
    <canvas
      ref={ref}
      style={{
        width: size,
        height: size,
        display: "block",
        borderRadius: 12,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    />
  );
}

"use client";

export function Slider({
  value = [5],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={`w-full accent-primary cursor-pointer ${className}`}
    />
  );
}

export default Slider;

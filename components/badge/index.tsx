import React from "react";

interface BadgeProps {
  type?: "pending" | "negative" | "positive";
  text?: string;
}

function Badge({ type, text }: BadgeProps) {
  return (
    <div
      className={`badge ${
        type === "positive"
          ? "badge-positive"
          : type === "negative"
          ? "badge-negative"
          : "badge-positive"
      }`}
    >
      {text}
    </div>
  );
}

export default Badge;

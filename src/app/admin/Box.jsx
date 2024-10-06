"use client";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import React from "react";


export function BackgroundGradientDemo({ children }) {
  return (
    <div>
      <BackgroundGradient className="w=h">
        {children}
      </BackgroundGradient>
    </div>
  );
}

"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../../../components/ui/3d-card";
import heroImage from "./College-ERP-software.png";

export function ThreeDCardDemo() {
  return (
    (<CardContainer className="inter-var">
      <CardBody
        className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6">
        <CardItem translateZ="100" className="w-full">
          <Image
            src={heroImage}
            height="1000"
            width="1000"
            className="h-full w-full rounded-xl"
            alt="thumbnail" />
        </CardItem>
      </CardBody>
    </CardContainer>)
  );
}

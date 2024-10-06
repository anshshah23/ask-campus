import { HoverEffect } from "../../../components/ui/card-hover-effect";

export function CardHoverEffectDemo() {
  return (
    (<div className="px-4">
      <HoverEffect items={projects} />
    </div>)
  );
}
export const projects = [
  {
    title: "Streamlined College ERP Software",
    description:
      "A technology that streamlines the process of managing a college or university's daily operations.",
  },
  {
    title: "Easy to Use CRM Software",
    description:
        "A software that helps colleges manage their student relationships and interactions.",
  },
  {
    title: "Efficient Student Inquiry Management",
    description:
        "A software that helps colleges manage their student inquiries.",
  },
];

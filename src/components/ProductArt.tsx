import {
  Footprints,
  Shirt,
  Dribbble,
  Dumbbell,
  CupSoda,
  Activity,
} from "lucide-react";
const icons: Record<string, typeof Activity> = {
  "Chạy bộ": Footprints,
  Fitness: Dumbbell,
  "Bóng đá": Dribbble,
  "Cầu lông": Activity,
  "Phụ kiện": CupSoda,
};
export function ProductArt({
  category,
  name = "",
  large = false,
}: {
  category: string;
  name?: string;
  large?: boolean;
}) {
  const Icon = name.includes("Áo") ? Shirt : icons[category] || Activity;
  return (
    <div
      className={"product-art " + (large ? "large" : "")}
      data-category={category}
      aria-hidden="true"
    >
      <div className="art-ring" />
      <Icon strokeWidth={1.1} />
      <span>SPORT / ESSENTIALS</span>
    </div>
  );
}

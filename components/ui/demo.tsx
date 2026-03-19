import { Component } from "@/components/ui/timeline-component";
import { Button } from "@/components/ui/moving-border";

export default function DemoOne() {
  return <Component />;
}

export function MovingBorderDemo() {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-white text-black border-neutral-200"
      >
        Borders are cool
      </Button>
    </div>
  );
}

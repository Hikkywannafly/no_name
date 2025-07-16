"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  className = "",
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  const mergedClassName = `relative ${className}`.trim();
  return (
    <AspectRatioPrimitive.Root
      data-slot="aspect-ratio"
      className={mergedClassName}
      {...props}
    />
  );
}

export { AspectRatio };

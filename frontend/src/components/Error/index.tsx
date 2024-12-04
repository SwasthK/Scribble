import { memo } from "react";
import { cn } from "../../lib/utils";

const ErrorBar = memo(
  ({
    label,
    parentClass = "",
    childClass = "",
  }: {
    label: string | undefined;
    parentClass?: string;
    childClass?: string;
  }) => {
    return label ? (
      <div className={cn("px-10 rounded-md font-semibold", parentClass)}>
        <h1 className={cn(childClass)}>{label}</h1>
      </div>
    ) : null;
  }
);

export default ErrorBar;

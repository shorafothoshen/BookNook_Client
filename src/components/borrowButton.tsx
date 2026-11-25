import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function ReturnButton({
  id,
  returningId,
  onReturn,
  className = "",
  iconClass,
  size,
}: {
  id: string;
  returningId: string;
  onReturn: (id: string) => void;
  className?: string;
  iconClass: string;
  size?: "sm";
}) {
  const isReturning = returningId === id;
  return (
    <Button
      size={size}
      onClick={() => onReturn(id)}
      disabled={!!returningId}
      className={`cursor-pointer gap-1.5 bg-orange-500 text-white hover:bg-orange-600 ${className}`}
    >
      {isReturning ? (
        <Loader2 className={`${iconClass} animate-spin`} />
      ) : (
        <RotateCcw className={iconClass} />
      )}
      {isReturning ? "Returning..." : "Return Book"}
    </Button>
  );
}
export default ReturnButton;
import { calcularEstado, estadoColor, estadoLabel } from "@/lib/db";
import { cn } from "@/lib/utils";

export function EstadoBadge({ estado, fechaVencimiento }: { estado: boolean; fechaVencimiento: string }) {
  const e = calcularEstado(estado, fechaVencimiento);
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", estadoColor[e])}>
      {estadoLabel[e]}
    </span>
  );
}

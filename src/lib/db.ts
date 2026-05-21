import { supabase } from "@/integrations/supabase/client";

export { supabase };

export type EstadoTarjeta = "activa" | "vencida" | "por_vencer" | "desactivada";

export function calcularEstado(estado: boolean, fechaVencimiento: string): EstadoTarjeta {
  if (!estado) return "desactivada";
  const venc = new Date(fechaVencimiento);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (venc < hoy) return "vencida";
  const treintaDias = new Date(hoy);
  treintaDias.setDate(treintaDias.getDate() + 30);
  if (venc <= treintaDias) return "por_vencer";
  return "activa";
}

export const estadoLabel: Record<EstadoTarjeta, string> = {
  activa: "Activa",
  vencida: "Vencida",
  por_vencer: "Por vencer",
  desactivada: "Desactivada",
};

export const estadoColor: Record<EstadoTarjeta, string> = {
  activa: "bg-success/15 text-success border-success/30",
  vencida: "bg-destructive/15 text-destructive border-destructive/30",
  por_vencer: "bg-warning/15 text-warning border-warning/30",
  desactivada: "bg-muted text-muted-foreground border-border",
};

export function formatFecha(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("es-GT", { day: "2-digit", month: "long", year: "numeric" });
}

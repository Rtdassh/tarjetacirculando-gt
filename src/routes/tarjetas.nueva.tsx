import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tarjetas/nueva")({
  component: NuevaTarjeta,
  head: () => ({ meta: [{ title: "Nueva tarjeta — SITC-GT" }] }),
});

function NuevaTarjeta() {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState("");
  const [nit, setNit] = useState("");
  const [idUso, setIdUso] = useState<string>("");
  const [fechaEmision, setFechaEmision] = useState<string>("");
  const [fechaVencimiento, setFechaVencimiento] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const hoy = new Date();
    setFechaEmision(hoy.toISOString().slice(0, 10));
    const v = new Date(); v.setFullYear(v.getFullYear() + 1);
    setFechaVencimiento(v.toISOString().slice(0, 10));
  }, []);

  const usos = useQuery({
    queryKey: ["uso_vehiculo"],
    queryFn: async () => (await supabase.from("uso_vehiculo").select("*").order("nombre")).data ?? [],
  });
  const vehiculos = useQuery({
    queryKey: ["vehiculo_list"],
    queryFn: async () => (await supabase.from("vehiculo").select("placa").order("placa")).data ?? [],
  });
  const propietarios = useQuery({
    queryKey: ["propietario_list"],
    queryFn: async () => (await supabase.from("propietario").select("nit, nombres, apellidos").order("apellidos")).data ?? [],
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!placa || !nit || !idUso) { toast.error("Complete todos los campos."); return; }
    if (new Date(fechaVencimiento) <= new Date(fechaEmision)) {
      toast.error("La fecha de vencimiento debe ser posterior a la emisión.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.from("tarjeta_circulacion").insert({
      placa, nit_propietario: nit, id_uso: Number(idUso),
      fecha_emision: fechaEmision, fecha_vencimiento: fechaVencimiento, estado: true,
    }).select("no_tarjeta").single();
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Tarjeta No. ${data.no_tarjeta} emitida.`);
    navigate({ to: "/tarjetas/$id", params: { id: String(data.no_tarjeta) } });
  }

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm"><Link to="/tarjetas"><ArrowLeft className="size-4" /> Volver</Link></Button>
        <h1 className="mt-2 font-serif text-3xl font-semibold">Emitir nueva tarjeta</h1>
        <p className="text-sm text-muted-foreground">Asocie un vehículo y propietario existentes para emitir la tarjeta.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Datos de la tarjeta</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Vehículo (placa)</Label>
              <Select value={placa} onValueChange={setPlaca}>
                <SelectTrigger><SelectValue placeholder="Seleccionar placa" /></SelectTrigger>
                <SelectContent>
                  {vehiculos.data?.map((v) => <SelectItem key={v.placa} value={v.placa}>{v.placa}</SelectItem>)}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">¿No existe? <Link to="/vehiculos" className="underline">Registrar vehículo</Link>.</p>
            </div>
            <div className="space-y-2">
              <Label>Propietario (NIT)</Label>
              <Select value={nit} onValueChange={setNit}>
                <SelectTrigger><SelectValue placeholder="Seleccionar propietario" /></SelectTrigger>
                <SelectContent>
                  {propietarios.data?.map((p) => (
                    <SelectItem key={p.nit} value={p.nit}>{p.nit} — {p.nombres} {p.apellidos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">¿No existe? <Link to="/propietarios" className="underline">Registrar propietario</Link>.</p>
            </div>
            <div className="space-y-2">
              <Label>Uso del vehículo</Label>
              <Select value={idUso} onValueChange={setIdUso}>
                <SelectTrigger><SelectValue placeholder="Seleccionar uso" /></SelectTrigger>
                <SelectContent>
                  {usos.data?.map((u) => <SelectItem key={u.id_uso} value={String(u.id_uso)}>{u.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Fecha de emisión</Label>
                <Input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fecha de vencimiento</Label>
                <Input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={submitting}>{submitting ? "Emitiendo…" : "Emitir tarjeta"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

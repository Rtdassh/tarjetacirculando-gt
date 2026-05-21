import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase, formatFecha } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoBadge } from "@/components/EstadoBadge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, UserCog, Wrench, Palette, Ban, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/tarjetas/$id")({
  component: TarjetaDetalle,
  head: () => ({ meta: [{ title: "Tarjeta — SITC-GT" }] }),
});

function TarjetaDetalle() {
  const { id } = Route.useParams();
  const router = useRouter();

  const tarjeta = useQuery({
    queryKey: ["tarjeta", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tarjeta_circulacion")
        .select(`*,
          uso_vehiculo(nombre),
          propietario(*),
          vehiculo(*, color(nombre), tipo_vehiculo(nombre), linea(nombre, marca(nombre)))`)
        .eq("no_tarjeta", Number(id))
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (tarjeta.isLoading) return <p className="text-muted-foreground">Cargando…</p>;
  if (!tarjeta.data) return <p>No encontrada.</p>;
  const t = tarjeta.data;
  const v = t.vehiculo;
  const p = t.propietario;

  async function refrescar() { await router.invalidate(); tarjeta.refetch(); }

  async function desactivar(motivo: "Impago" | "Vencimiento") {
    const { error } = await supabase.from("tarjeta_circulacion")
      .update({ estado: false, motivo_desactivacion: motivo })
      .eq("no_tarjeta", Number(id));
    if (error) { toast.error(error.message); return; }
    toast.success(`Tarjeta desactivada por ${motivo.toLowerCase()}.`);
    refrescar();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm"><Link to="/tarjetas"><ArrowLeft className="size-4" /> Listado</Link></Button>

      {/* Ficha visual */}
      <div className="overflow-hidden rounded-xl border-2 border-primary bg-card shadow-md">
        <div className="flex items-center justify-between bg-primary px-6 py-3 text-primary-foreground">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">República de Guatemala</p>
            <p className="font-serif text-lg font-semibold">Tarjeta de Circulación Vehicular</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80">No. Tarjeta</p>
            <p className="font-mono text-2xl font-semibold">{String(t.no_tarjeta).padStart(8, "0")}</p>
          </div>
        </div>
        <div className="ficha-grid grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <section>
            <h3 className="border-b pb-1 font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vehículo</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Field label="Placa" value={v.placa} mono />
              <Field label="Año" value={String(v.anio)} />
              <Field label="Marca" value={v.linea.marca.nombre} />
              <Field label="Línea" value={v.linea.nombre} />
              <Field label="Color" value={v.color.nombre} />
              <Field label="Tipo" value={v.tipo_vehiculo.nombre} />
              <Field label="Asientos" value={String(v.asientos)} />
              <Field label="Chasis" value={v.chasis} mono />
              <Field label="Motor" value={v.motor} mono />
            </dl>
          </section>
          <section>
            <h3 className="border-b pb-1 font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">Propietario</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Field label="NIT" value={p.nit} mono />
              <Field label="CUI" value={p.cui} mono />
              <Field label="Nombres" value={p.nombres} />
              <Field label="Apellidos" value={p.apellidos} />
              <Field label="Dirección" value={p.direccion} colSpan />
            </dl>
            <h3 className="mt-6 border-b pb-1 font-serif text-sm font-semibold uppercase tracking-wider text-muted-foreground">Vigencia</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Field label="Uso" value={t.uso_vehiculo.nombre} />
              <Field label="Estado" value={<EstadoBadge estado={t.estado} fechaVencimiento={t.fecha_vencimiento} />} />
              <Field label="Emisión" value={formatFecha(t.fecha_emision)} />
              <Field label="Vencimiento" value={formatFecha(t.fecha_vencimiento)} />
              {t.motivo_desactivacion && <Field label="Motivo desact." value={t.motivo_desactivacion} colSpan />}
            </dl>
          </section>
        </div>
      </div>

      {/* Acciones de mantenimiento */}
      <Card>
        <CardHeader><CardTitle>Trámites de mantenimiento</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <CambioDuenoDialog tarjeta={t} onDone={refrescar} />
          <CambioMotorDialog placa={v.placa} motorActual={v.motor} onDone={refrescar} />
          <CambioColorDialog placa={v.placa} idColorActual={v.id_color} onDone={refrescar} />
          {t.estado ? (
            <>
              <Button variant="destructive" onClick={() => desactivar("Impago")}><Ban className="size-4" /> Desactivar por impago</Button>
              <Button variant="destructive" onClick={() => desactivar("Vencimiento")}><Ban className="size-4" /> Desactivar por vencimiento</Button>
            </>
          ) : (
            <ReactivarButton noTarjeta={t.no_tarjeta} onDone={refrescar} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReactivarButton({ noTarjeta, onDone }: { noTarjeta: number; onDone: () => void }) {
  async function reactivar() {
    const venc = new Date(); venc.setFullYear(venc.getFullYear() + 1);
    const { error } = await supabase.from("tarjeta_circulacion")
      .update({ estado: true, motivo_desactivacion: null, fecha_vencimiento: venc.toISOString().slice(0, 10) })
      .eq("no_tarjeta", noTarjeta);
    if (error) { toast.error(error.message); return; }
    toast.success("Tarjeta marcada como vigente.");
    onDone();
  }
  return <Button onClick={reactivar}><RefreshCw className="size-4" /> Marcar como vigente</Button>;
}

function Field({ label, value, mono, colSpan }: { label: string; value: React.ReactNode; mono?: boolean; colSpan?: boolean }) {
  return (
    <div className={colSpan ? "col-span-2" : ""}>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={`mt-0.5 font-medium text-foreground ${mono ? "font-mono text-sm" : ""}`}>{value}</dd>
    </div>
  );
}

function CambioDuenoDialog({ tarjeta, onDone }: { tarjeta: any; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [nuevoNit, setNuevoNit] = useState("");
  const propietarios = useQuery({
    queryKey: ["propietario_list_dialog"],
    queryFn: async () => (await supabase.from("propietario").select("nit, nombres, apellidos").order("apellidos")).data ?? [],
    enabled: open,
  });

  async function aplicar() {
    if (!nuevoNit) { toast.error("Seleccione un propietario."); return; }
    const hoy = new Date();
    const venc = new Date(); venc.setFullYear(venc.getFullYear() + 1);
    // Desactivar tarjeta actual
    const d = await supabase.from("tarjeta_circulacion").update({ estado: false, motivo_desactivacion: "Cambio de dueño" }).eq("no_tarjeta", tarjeta.no_tarjeta);
    if (d.error) { toast.error(d.error.message); return; }
    // Emitir nueva
    const { error } = await supabase.from("tarjeta_circulacion").insert({
      placa: tarjeta.placa, nit_propietario: nuevoNit, id_uso: tarjeta.id_uso,
      fecha_emision: hoy.toISOString().slice(0, 10), fecha_vencimiento: venc.toISOString().slice(0, 10), estado: true,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Cambio de dueño aplicado. Nueva tarjeta emitida.");
    setOpen(false); onDone();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline"><UserCog className="size-4" /> Cambio de dueño</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Cambio de dueño</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">Se desactivará la tarjeta actual y se emitirá una nueva al nuevo propietario.</p>
        <div className="space-y-2">
          <Label>Nuevo propietario</Label>
          <Select value={nuevoNit} onValueChange={setNuevoNit}>
            <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
            <SelectContent>
              {propietarios.data?.filter((p) => p.nit !== tarjeta.nit_propietario).map((p) => (
                <SelectItem key={p.nit} value={p.nit}>{p.nit} — {p.nombres} {p.apellidos}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter><Button onClick={aplicar}>Aplicar cambio</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CambioMotorDialog({ placa, motorActual, onDone }: { placa: string; motorActual: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [motor, setMotor] = useState(motorActual);
  async function aplicar() {
    if (!motor.trim()) return;
    const { error } = await supabase.from("vehiculo").update({ motor }).eq("placa", placa);
    if (error) { toast.error(error.message); return; }
    toast.success("Motor actualizado."); setOpen(false); onDone();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline"><Wrench className="size-4" /> Cambio de motor</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Cambio de motor</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <Label>Nuevo número de motor</Label>
          <Input value={motor} onChange={(e) => setMotor(e.target.value)} />
        </div>
        <DialogFooter><Button onClick={aplicar}>Guardar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CambioColorDialog({ placa, idColorActual, onDone }: { placa: string; idColorActual: number; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [idColor, setIdColor] = useState<string>(String(idColorActual));
  const colores = useQuery({
    queryKey: ["colores_dialog"],
    queryFn: async () => (await supabase.from("color").select("*").order("nombre")).data ?? [],
    enabled: open,
  });
  async function aplicar() {
    const { error } = await supabase.from("vehiculo").update({ id_color: Number(idColor) }).eq("placa", placa);
    if (error) { toast.error(error.message); return; }
    toast.success("Color actualizado."); setOpen(false); onDone();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline"><Palette className="size-4" /> Cambio de color</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Trámite de cambio de color</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <Label>Nuevo color</Label>
          <Select value={idColor} onValueChange={setIdColor}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {colores.data?.map((c) => <SelectItem key={c.id_color} value={String(c.id_color)}>{c.nombre}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter><Button onClick={aplicar}>Guardar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

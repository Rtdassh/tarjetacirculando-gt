import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/vehiculos")({
  component: VehiculosPage,
  head: () => ({ meta: [{ title: "Vehículos — SITC-GT" }] }),
});

function VehiculosPage() {
  const qc = useQueryClient();
  const vehiculos = useQuery({
    queryKey: ["vehiculos_full"],
    queryFn: async () => (await supabase.from("vehiculo")
      .select("*, color(nombre), tipo_vehiculo(nombre), linea(nombre, marca(nombre))")
      .order("placa")).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Vehículos</h1>
          <p className="text-sm text-muted-foreground">Registro de vehículos en el sistema.</p>
        </div>
        <NuevoVehiculoDialog onDone={() => qc.invalidateQueries({ queryKey: ["vehiculos_full"] })} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Marca / Línea</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Asientos</TableHead>
                <TableHead>Chasis</TableHead>
                <TableHead>Motor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehiculos.data?.map((v: any) => (
                <TableRow key={v.placa}>
                  <TableCell className="font-medium">{v.placa}</TableCell>
                  <TableCell>{v.linea.marca.nombre} {v.linea.nombre}</TableCell>
                  <TableCell>{v.anio}</TableCell>
                  <TableCell>{v.color.nombre}</TableCell>
                  <TableCell>{v.tipo_vehiculo.nombre}</TableCell>
                  <TableCell>{v.asientos}</TableCell>
                  <TableCell className="font-mono text-xs">{v.chasis}</TableCell>
                  <TableCell className="font-mono text-xs">{v.motor}</TableCell>
                </TableRow>
              ))}
              {vehiculos.data && vehiculos.data.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground">Sin vehículos.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NuevoVehiculoDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [placa, setPlaca] = useState("");
  const [chasis, setChasis] = useState("");
  const [motor, setMotor] = useState("");
  const [anio, setAnio] = useState<string>(String(new Date().getFullYear()));
  const [asientos, setAsientos] = useState("5");
  const [idMarca, setIdMarca] = useState("");
  const [idLinea, setIdLinea] = useState("");
  const [idColor, setIdColor] = useState("");
  const [idTipo, setIdTipo] = useState("");

  const marcas = useQuery({ queryKey: ["marcas"], queryFn: async () => (await supabase.from("marca").select("*").order("nombre")).data ?? [], enabled: open });
  const lineas = useQuery({ queryKey: ["lineas"], queryFn: async () => (await supabase.from("linea").select("*").order("nombre")).data ?? [], enabled: open });
  const colores = useQuery({ queryKey: ["colores"], queryFn: async () => (await supabase.from("color").select("*").order("nombre")).data ?? [], enabled: open });
  const tipos = useQuery({ queryKey: ["tipos"], queryFn: async () => (await supabase.from("tipo_vehiculo").select("*").order("nombre")).data ?? [], enabled: open });

  const lineasFiltradas = useMemo(
    () => (lineas.data ?? []).filter((l: any) => !idMarca || l.id_marca === Number(idMarca)),
    [lineas.data, idMarca]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!placa || !chasis || !motor || !idLinea || !idColor || !idTipo) { toast.error("Complete todos los campos."); return; }
    const { error } = await supabase.from("vehiculo").insert({
      placa: placa.toUpperCase(), chasis, motor, anio: Number(anio), asientos: Number(asientos),
      id_linea: Number(idLinea), id_color: Number(idColor), id_tipo: Number(idTipo),
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Vehículo registrado.");
    setOpen(false); onDone();
    setPlaca(""); setChasis(""); setMotor(""); setIdMarca(""); setIdLinea(""); setIdColor(""); setIdTipo("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="size-4" /> Nuevo vehículo</Button></DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Registrar vehículo</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <Field label="Placa"><Input value={placa} onChange={(e) => setPlaca(e.target.value)} maxLength={8} placeholder="P123ABC" /></Field>
          <Field label="Año"><Input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} /></Field>
          <Field label="Chasis"><Input value={chasis} onChange={(e) => setChasis(e.target.value)} /></Field>
          <Field label="Motor"><Input value={motor} onChange={(e) => setMotor(e.target.value)} /></Field>
          <Field label="Asientos"><Input type="number" value={asientos} onChange={(e) => setAsientos(e.target.value)} /></Field>
          <Field label="Tipo">
            <Select value={idTipo} onValueChange={setIdTipo}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>{tipos.data?.map((t: any) => <SelectItem key={t.id_tipo} value={String(t.id_tipo)}>{t.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Marca">
            <Select value={idMarca} onValueChange={(v) => { setIdMarca(v); setIdLinea(""); }}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>{marcas.data?.map((m: any) => <SelectItem key={m.id_marca} value={String(m.id_marca)}>{m.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Línea">
            <Select value={idLinea} onValueChange={setIdLinea} disabled={!idMarca}>
              <SelectTrigger><SelectValue placeholder={idMarca ? "Seleccionar" : "Elija marca primero"} /></SelectTrigger>
              <SelectContent>{lineasFiltradas.map((l: any) => <SelectItem key={l.id_linea} value={String(l.id_linea)}>{l.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Color">
            <Select value={idColor} onValueChange={setIdColor}>
              <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
              <SelectContent>{colores.data?.map((c: any) => <SelectItem key={c.id_color} value={String(c.id_color)}>{c.nombre}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <DialogFooter className="col-span-2"><Button type="submit">Registrar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

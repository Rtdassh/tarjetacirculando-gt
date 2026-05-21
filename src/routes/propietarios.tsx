import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/propietarios")({
  component: PropietariosPage,
  head: () => ({ meta: [{ title: "Propietarios — SITC-GT" }] }),
});

function PropietariosPage() {
  const qc = useQueryClient();
  const propietarios = useQuery({
    queryKey: ["propietarios_full"],
    queryFn: async () => (await supabase.from("propietario").select("*").order("apellidos")).data ?? [],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Propietarios</h1>
          <p className="text-sm text-muted-foreground">Personas titulares de tarjetas de circulación.</p>
        </div>
        <NuevoPropietarioDialog onDone={() => qc.invalidateQueries({ queryKey: ["propietarios_full"] })} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIT</TableHead>
                <TableHead>CUI</TableHead>
                <TableHead>Nombres</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Dirección</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propietarios.data?.map((p: any) => (
                <TableRow key={p.nit}>
                  <TableCell className="font-mono">{p.nit}</TableCell>
                  <TableCell className="font-mono text-xs">{p.cui}</TableCell>
                  <TableCell>{p.nombres}</TableCell>
                  <TableCell>{p.apellidos}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.direccion}</TableCell>
                </TableRow>
              ))}
              {propietarios.data && propietarios.data.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin propietarios.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function NuevoPropietarioDialog({ onDone }: { onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [nit, setNit] = useState("");
  const [cui, setCui] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [direccion, setDireccion] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nit || !cui || !nombres || !apellidos || !direccion) { toast.error("Complete todos los campos."); return; }
    if (cui.length !== 13) { toast.error("El CUI debe tener 13 dígitos."); return; }
    const { error } = await supabase.from("propietario").insert({ nit, cui, nombres, apellidos, direccion });
    if (error) { toast.error(error.message); return; }
    toast.success("Propietario registrado.");
    setOpen(false); onDone();
    setNit(""); setCui(""); setNombres(""); setApellidos(""); setDireccion("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button><Plus className="size-4" /> Nuevo propietario</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Registrar propietario</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5"><Label>NIT</Label><Input value={nit} onChange={(e) => setNit(e.target.value)} maxLength={15} /></div>
          <div className="space-y-1.5"><Label>CUI (13 dígitos)</Label><Input value={cui} onChange={(e) => setCui(e.target.value)} maxLength={13} /></div>
          <div className="space-y-1.5"><Label>Nombres</Label><Input value={nombres} onChange={(e) => setNombres(e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Apellidos</Label><Input value={apellidos} onChange={(e) => setApellidos(e.target.value)} /></div>
          <div className="col-span-2 space-y-1.5"><Label>Dirección</Label><Input value={direccion} onChange={(e) => setDireccion(e.target.value)} /></div>
          <DialogFooter className="col-span-2"><Button type="submit">Registrar</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/catalogos")({
  component: CatalogosPage,
  head: () => ({ meta: [{ title: "Catálogos — SITC-GT" }] }),
});

function CatalogosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Catálogos</h1>
        <p className="text-sm text-muted-foreground">Mantenimiento de marcas, líneas, colores, tipos y usos.</p>
      </div>
      <Tabs defaultValue="marca">
        <TabsList>
          <TabsTrigger value="marca">Marcas</TabsTrigger>
          <TabsTrigger value="linea">Líneas</TabsTrigger>
          <TabsTrigger value="color">Colores</TabsTrigger>
          <TabsTrigger value="tipo">Tipos</TabsTrigger>
          <TabsTrigger value="uso">Usos</TabsTrigger>
        </TabsList>
        <TabsContent value="marca"><CatalogoSimple table="marca" idCol="id_marca" titulo="Marcas" /></TabsContent>
        <TabsContent value="linea"><CatalogoLineas /></TabsContent>
        <TabsContent value="color"><CatalogoSimple table="color" idCol="id_color" titulo="Colores" /></TabsContent>
        <TabsContent value="tipo"><CatalogoSimple table="tipo_vehiculo" idCol="id_tipo" titulo="Tipos de vehículo" /></TabsContent>
        <TabsContent value="uso"><CatalogoSimple table="uso_vehiculo" idCol="id_uso" titulo="Usos" /></TabsContent>
      </Tabs>
    </div>
  );
}

function CatalogoSimple({ table, idCol, titulo }: { table: any; idCol: string; titulo: string }) {
  const qc = useQueryClient();
  const [nombre, setNombre] = useState("");
  const items = useQuery({
    queryKey: [table, "list"],
    queryFn: async () => (await supabase.from(table).select("*").order("nombre")).data ?? [],
  });
  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    const { error } = await supabase.from(table).insert({ nombre: nombre.trim() });
    if (error) { toast.error(error.message); return; }
    setNombre(""); toast.success("Agregado."); qc.invalidateQueries({ queryKey: [table, "list"] });
  }
  return (
    <Card className="mt-4">
      <CardHeader><CardTitle>{titulo}</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={agregar} className="mb-4 flex gap-2">
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={`Nuevo ${titulo.toLowerCase().slice(0, -1)}`} />
          <Button type="submit"><Plus className="size-4" /> Agregar</Button>
        </form>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {items.data?.map((i: any) => (
            <li key={i[idCol]} className="rounded border border-border bg-secondary/40 px-3 py-2 text-sm">{i.nombre}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CatalogoLineas() {
  const qc = useQueryClient();
  const [nombre, setNombre] = useState("");
  const [idMarca, setIdMarca] = useState("");
  const marcas = useQuery({ queryKey: ["marca", "list"], queryFn: async () => (await supabase.from("marca").select("*").order("nombre")).data ?? [] });
  const lineas = useQuery({
    queryKey: ["linea", "list_full"],
    queryFn: async () => (await supabase.from("linea").select("*, marca(nombre)").order("nombre")).data ?? [],
  });
  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !idMarca) { toast.error("Complete los campos."); return; }
    const { error } = await supabase.from("linea").insert({ nombre: nombre.trim(), id_marca: Number(idMarca) });
    if (error) { toast.error(error.message); return; }
    setNombre(""); toast.success("Línea agregada.");
    qc.invalidateQueries({ queryKey: ["linea", "list_full"] });
  }
  return (
    <Card className="mt-4">
      <CardHeader><CardTitle>Líneas</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={agregar} className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Select value={idMarca} onValueChange={setIdMarca}>
            <SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger>
            <SelectContent>{marcas.data?.map((m: any) => <SelectItem key={m.id_marca} value={String(m.id_marca)}>{m.nombre}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre de la línea" />
          <Button type="submit"><Plus className="size-4" /> Agregar línea</Button>
        </form>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {lineas.data?.map((l: any) => (
            <li key={l.id_linea} className="rounded border border-border bg-secondary/40 px-3 py-2 text-sm">
              <span className="text-muted-foreground">{l.marca.nombre}</span> · <span className="font-medium">{l.nombre}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

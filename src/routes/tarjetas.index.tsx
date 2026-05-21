import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EstadoBadge } from "@/components/EstadoBadge";
import { FilePlus2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatFecha } from "@/lib/db";

export const Route = createFileRoute("/tarjetas/")({
  component: TarjetasList,
  head: () => ({ meta: [{ title: "Tarjetas — SITC-GT" }] }),
});

function TarjetasList() {
  const { data, isLoading } = useQuery({
    queryKey: ["tarjetas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tarjeta_circulacion")
        .select("no_tarjeta, placa, nit_propietario, fecha_emision, fecha_vencimiento, estado")
        .order("no_tarjeta", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Tarjetas de circulación</h1>
          <p className="text-sm text-muted-foreground">Listado completo de tarjetas emitidas.</p>
        </div>
        <Button asChild>
          <Link to="/tarjetas/nueva"><FilePlus2 className="size-4" /> Nueva tarjeta</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>NIT Propietario</TableHead>
                <TableHead>Emisión</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Cargando…</TableCell></TableRow>
              )}
              {data?.map((t) => (
                <TableRow key={t.no_tarjeta}>
                  <TableCell className="font-mono">{t.no_tarjeta}</TableCell>
                  <TableCell className="font-medium">{t.placa}</TableCell>
                  <TableCell>{t.nit_propietario}</TableCell>
                  <TableCell>{formatFecha(t.fecha_emision)}</TableCell>
                  <TableCell>{formatFecha(t.fecha_vencimiento)}</TableCell>
                  <TableCell><EstadoBadge estado={t.estado} fechaVencimiento={t.fecha_vencimiento} /></TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/tarjetas/$id" params={{ id: String(t.no_tarjeta) }}>Ver</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data && data.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Sin tarjetas registradas.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

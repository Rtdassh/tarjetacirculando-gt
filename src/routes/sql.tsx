import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Database } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sql")({
  component: SQLPage,
  head: () => ({ meta: [{ title: "Consultas SQL — SITC-GT" }] }),
});

const EJEMPLOS = [
  { label: "Tarjetas vigentes", sql: "SELECT no_tarjeta, placa, nit_propietario, fecha_vencimiento FROM tarjeta_circulacion WHERE estado = true ORDER BY no_tarjeta DESC LIMIT 50" },
  { label: "Vehículos por marca", sql: "SELECT m.nombre AS marca, COUNT(*) AS total FROM vehiculo v JOIN linea l ON v.id_linea = l.id_linea JOIN marca m ON l.id_marca = m.id_marca GROUP BY m.nombre ORDER BY total DESC" },
  { label: "Tarjetas próximas a vencer (30 días)", sql: "SELECT no_tarjeta, placa, fecha_vencimiento FROM tarjeta_circulacion WHERE estado = true AND fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days' ORDER BY fecha_vencimiento" },
  { label: "Propietarios con más vehículos", sql: "SELECT p.nit, p.nombres || ' ' || p.apellidos AS propietario, COUNT(DISTINCT t.placa) AS vehiculos FROM propietario p JOIN tarjeta_circulacion t ON t.nit_propietario = p.nit GROUP BY p.nit, propietario ORDER BY vehiculos DESC LIMIT 20" },
];

function SQLPage() {
  const [sql, setSql] = useState("SELECT * FROM tarjeta_circulacion LIMIT 10;");
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiempo, setTiempo] = useState<number | null>(null);

  async function ejecutar() {
    const q = sql.trim().replace(/;\s*$/, "");
    if (!q) return;
    setLoading(true); setError(null); setRows(null);
    const t0 = performance.now();
    const { data, error } = await supabase.rpc("exec_sql", { sql: q });
    setTiempo(Math.round(performance.now() - t0));
    setLoading(false);
    if (error) { setError(error.message); toast.error("Error en la consulta"); return; }
    const arr = (data as Record<string, unknown>[]) ?? [];
    setRows(arr);
    toast.success(`${arr.length} fila(s) en ${Math.round(performance.now() - t0)} ms`);
  }

  const cols = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Consultas SQL</h1>
        <p className="text-sm text-muted-foreground">Ejecute consultas SELECT directamente contra la base de datos del sistema.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Database className="size-4" /> Editor SQL</CardTitle>
          <div className="flex flex-wrap gap-1">
            {EJEMPLOS.map((e) => (
              <Button key={e.label} variant="outline" size="sm" onClick={() => setSql(e.sql)}>{e.label}</Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={8}
            className="font-mono text-sm"
            placeholder="SELECT * FROM tarjeta_circulacion;"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">Solo consultas SELECT. Use ; opcional al final.</p>
            <Button onClick={ejecutar} disabled={loading}>
              <Play className="size-4" /> {loading ? "Ejecutando…" : "Ejecutar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="font-mono text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {rows && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Resultados — {rows.length} fila(s){tiempo !== null && ` · ${tiempo} ms`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin resultados.</p>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {cols.map((c) => <TableHead key={c} className="font-mono text-xs">{c}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r, i) => (
                      <TableRow key={i}>
                        {cols.map((c) => (
                          <TableCell key={c} className="font-mono text-xs">
                            {r[c] === null ? <span className="text-muted-foreground">NULL</span> : String(r[c])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

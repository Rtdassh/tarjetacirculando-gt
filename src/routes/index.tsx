import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase, calcularEstado } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarFront, IdCard, AlertTriangle, CheckCircle2, FilePlus2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Inicio — SITC-GT" }] }),
});

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [tarjetas, vehiculos, propietarios] = await Promise.all([
        supabase.from("tarjeta_circulacion").select("no_tarjeta, estado, fecha_vencimiento"),
        supabase.from("vehiculo").select("placa", { count: "exact", head: true }),
        supabase.from("propietario").select("nit", { count: "exact", head: true }),
      ]);
      const list = tarjetas.data ?? [];
      let activas = 0, vencidas = 0, porVencer = 0, desactivadas = 0;
      for (const t of list) {
        const e = calcularEstado(t.estado, t.fecha_vencimiento);
        if (e === "activa") activas++;
        else if (e === "vencida") vencidas++;
        else if (e === "por_vencer") porVencer++;
        else desactivadas++;
      }
      return {
        activas, vencidas, porVencer, desactivadas,
        totalVehiculos: vehiculos.count ?? 0,
        totalPropietarios: propietarios.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Tarjetas activas", value: data?.activas ?? 0, icon: CheckCircle2, color: "text-success" },
    { label: "Por vencer (30 días)", value: data?.porVencer ?? 0, icon: AlertTriangle, color: "text-warning" },
    { label: "Vencidas", value: data?.vencidas ?? 0, icon: AlertTriangle, color: "text-destructive" },
    { label: "Desactivadas", value: data?.desactivadas ?? 0, icon: IdCard, color: "text-muted-foreground" },
    { label: "Vehículos registrados", value: data?.totalVehiculos ?? 0, icon: CarFront, color: "text-primary" },
    { label: "Propietarios", value: data?.totalPropietarios ?? 0, icon: IdCard, color: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-widest text-accent-foreground/70">República de Guatemala</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
          Sistema de Tarjetas de Circulación Vehicular
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Consulte, emita y administre las tarjetas de circulación de los vehículos que circulan a diario en el país.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/tarjetas/nueva"><FilePlus2 className="size-4" /> Emitir nueva tarjeta</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/consulta"><Search className="size-4" /> Consultar tarjeta</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <s.icon className={`size-4 ${s.color}`} /> {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-serif text-3xl font-semibold tabular-nums">{isLoading ? "—" : s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

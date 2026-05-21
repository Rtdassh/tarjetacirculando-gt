import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EstadoBadge } from "@/components/EstadoBadge";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/consulta")({
  component: ConsultaPage,
  head: () => ({ meta: [{ title: "Consulta — SITC-GT" }] }),
});

type Resultado = {
  no_tarjeta: number;
  placa: string;
  nit_propietario: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  estado: boolean;
};

function ConsultaPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Resultado[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    setLoading(true);
    const numero = Number(term);
    let query = supabase.from("tarjeta_circulacion").select("no_tarjeta, placa, nit_propietario, fecha_emision, fecha_vencimiento, estado");
    if (!Number.isNaN(numero) && term.match(/^\d+$/)) {
      query = query.eq("no_tarjeta", numero);
    } else if (term.includes("-")) {
      query = query.eq("nit_propietario", term);
    } else {
      query = query.ilike("placa", `%${term.toUpperCase()}%`);
    }
    const { data, error } = await query.order("no_tarjeta", { ascending: false }).limit(20);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setResults(data ?? []);
    if (!data?.length) toast.info("No se encontraron tarjetas con ese criterio.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Consulta de tarjeta</h1>
        <p className="text-sm text-muted-foreground">Busque por número de tarjeta, placa o NIT del propietario.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={buscar} className="flex gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="P123ABC, 1234567-8 o número de tarjeta"
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              <Search className="size-4" /> Buscar
            </Button>
          </form>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{results.length} resultado(s)</p>
          {results.map((r) => (
            <Link
              key={r.no_tarjeta}
              to="/tarjetas/$id"
              params={{ id: String(r.no_tarjeta) }}
              className="block"
            >
              <Card className="transition-colors hover:border-primary">
                <CardContent className="flex items-center justify-between gap-4 pt-6">
                  <div>
                    <p className="font-serif text-lg font-semibold">Tarjeta No. {r.no_tarjeta}</p>
                    <p className="text-sm text-muted-foreground">
                      Placa <span className="font-medium text-foreground">{r.placa}</span> · NIT {r.nit_propietario}
                    </p>
                  </div>
                  <EstadoBadge estado={r.estado} fechaVencimiento={r.fecha_vencimiento} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

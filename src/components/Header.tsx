import { Link } from "@tanstack/react-router";
import { CarFront, FileSearch, IdCard, Users, Tag, LayoutDashboard, Terminal } from "lucide-react";

const links = [
  { to: "/", label: "Inicio", icon: LayoutDashboard },
  { to: "/consulta", label: "Consulta", icon: FileSearch },
  { to: "/tarjetas", label: "Tarjetas", icon: IdCard },
  { to: "/vehiculos", label: "Vehículos", icon: CarFront },
  { to: "/propietarios", label: "Propietarios", icon: Users },
  { to: "/catalogos", label: "Catálogos", icon: Tag },
  { to: "/sql", label: "SQL", icon: Terminal },
] as const;

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded bg-primary text-primary-foreground">
            <IdCard className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">SITC-GT</p>
            <p className="text-xs text-muted-foreground">Tarjetas de Circulación</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

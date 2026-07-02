import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <p className="text-sm uppercase tracking-wider text-cobalt mb-2">404</p>
      <h1 className="font-display text-3xl text-ink mb-4">Página no encontrada</h1>
      <p className="text-muted mb-6">El canal que buscas no está en nuestra guía.</p>
      <Link href="/" className="text-cobalt">Volver al inicio</Link>
    </div>
  );
}

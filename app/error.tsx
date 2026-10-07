"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="section">
      <div className="container empty">
        <h1>Não foi possível abrir esta página</h1>
        <p>O servidor ou o banco ainda pode estar subindo. Tente de novo.</p>
        <button className="btn btn-solid" type="button" onClick={() => reset()}>
          Tentar de novo
        </button>
      </div>
    </section>
  );
}

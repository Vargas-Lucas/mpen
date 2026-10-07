import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty">
        <h1>Página não encontrada</h1>
        <p>Esse endereço não existe no site da MPEN.</p>
        <Link className="btn btn-solid" href="/">
          Voltar para a home
        </Link>
      </div>
    </section>
  );
}

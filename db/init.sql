CREATE TABLE developments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('lancamento', 'construcao', 'entregue')),
  neighborhood TEXT NOT NULL DEFAULT 'Sul da Ilha',
  city TEXT NOT NULL DEFAULT 'Florianópolis',
  typology TEXT NOT NULL DEFAULT '',
  area TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  delivery TEXT NOT NULL DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'MPEN',
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT 'contato',
  development_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO developments
  (name, slug, status, neighborhood, city, summary, delivery, featured, sort_order)
VALUES
  ('Sunset Village', 'sunset-village', 'lancamento', 'Loteamento Portal do Ribeirão - Ribeirão da Ilha', 'Florianópolis', '', '2029', TRUE, 1),
  ('Village du Soleil', 'village-du-soleil', 'entregue', 'Campeche', 'Florianópolis', '', '2023', TRUE, 2),
  ('Iconic', 'iconic', 'entregue', 'Morro das Pedras', 'Florianópolis', '', '', TRUE, 3),
  ('Chez Soleil', 'chez-soleil', 'entregue', 'Campeche', 'Florianópolis', '', '2019', FALSE, 4),
  ('Vivace', 'vivace', 'entregue', 'Campeche', 'Florianópolis', '', '2018', FALSE, 5),
  ('Moana', 'moana', 'entregue', 'Campeche', 'Florianópolis', '', '2017', FALSE, 6),
  ('Carpe Diem', 'carpe-diem', 'entregue', 'Campeche', 'Florianópolis', '', '2017', FALSE, 7),
  ('Sanct', 'sanct', 'entregue', 'Rio Tavares', 'Florianópolis', '', '2014', FALSE, 8),
  ('Jai', 'jai', 'entregue', 'Loteamento Novo Campeche - Campeche', 'Florianópolis', '', '2014', FALSE, 9),
  ('Riozinho O2', 'riozinho-o2', 'entregue', 'Campeche', 'Florianópolis', '', '2013', FALSE, 10),
  ('Sanctuary', 'sanctuary', 'entregue', 'Rio Tavares', 'Florianópolis', '', '2011', FALSE, 11),
  ('Riozinho Style', 'riozinho-style', 'entregue', 'Campeche', 'Florianópolis', '', '2009', FALSE, 12),
  ('Porto das Marés', 'porto-das-mares', 'entregue', 'Morro das Pedras', 'Florianópolis', '', '2003', FALSE, 13),
  ('Island', 'island', 'entregue', 'Morro das Pedras', 'Florianópolis', '', '2004', FALSE, 14);

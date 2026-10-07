# Guia do projeto

Site novo da MPEN Incorporadora. A estrutura vem da Melnick. A marca vem da MPEN.

## Ambiente local

O esqueleto já roda em Docker.

- Site: http://localhost:8080
- Postgres: `localhost:5432`, usuário `mpen`, senha `mpen`, banco `mpen`
- Subir de novo: `docker compose up -d` na pasta do projeto
- Parar: `docker compose down`
- Alterar um arquivo do projeto recarrega o site. O banco guarda o volume `pgdata`; `docker compose down` não apaga os dados. `docker compose down -v` apaga.

Páginas no ar: home, empreendimentos, blog, quem somos, contato, seja parceiro, FAQ, compliance, privacidade e termos. Formulários gravam na tabela `leads`. A Área do Cliente continua o link do Expert System.

- Esqueleto: [melnick.com.br](https://www.melnick.com.br/) e [blog](https://www.melnick.com.br/blog/)
- Marca, textos, fotos e empreendimentos: [mpen.com.br](https://mpen.com.br/)
- Domínio que já está no ar: `mpen.com.br` (WordPress atual, a ser substituído)

A referência anterior (GT Building) sai deste guia. Código, imagens e textos da Melnick ficam de fora. O site deles é o mapa de páginas e seções.

Nada de código, pasta de aplicação ou schema até os itens em aberto do passo 1 estarem confirmados.

## Marca MPEN

Lida no site atual em 6 de outubro de 2026. Confirmar antes de fixar no layout.

| Uso | Cor |
|---|---|
| Header, faixas escuras | `#0C0E2B` |
| Botões e abas escuras | `#1F2245` |
| Azul de ação | `#1E73BE` |
| Destaque / links | `#3489A8` |
| Azul claro | `#6EC1E4` |
| Texto | `#33373D` |

Logo com fundo transparente já publicada em:

`https://mpen.com.br/wp-content/uploads/2025/02/LogoMPEN_fundo_transparente.png`

Guardar uma cópia no repositório quando o projeto começar. Cores e logo entram como configuração, para ajuste sem reescrever o layout.

Contatos que já aparecem no site atual:

- Comercial: comercial@mpen.net.br e (048) 99105-0594
- Engenharia: iorhan.wagner@mpen.net.br e (048) 99931-1323
- Área do Cliente (sistema externo, Expert System): `https://portaldocliente.expertsystem.com.br/entrar/mpen`

## O que a home da Melnick ensina

Ordem das seções, com conteúdo da MPEN:

1. Header fixo: logo, busca, atalhos e Área do Cliente.
2. Hero em tela cheia, com slides de empreendimentos (foto, nome, frase, tipologia e metragem).
3. Busca por cidade e por bairro ou zona. No caso da MPEN, o recorte é Florianópolis, sul da Ilha.
4. Três cartões de oferta. Na Melnick: Para Morar, Para Trabalhar, Para Construir. Na MPEN, os cartões acompanham o que a empresa vende de fato.
5. Grade de empreendimentos com abas de tipo e filtro de status (em obras / pronto na Melnick; entregue, lançamento e construção no site atual da MPEN).
6. Card do empreendimento: imagem, status, nome, bairro, frase, dormitórios ou suítes, metragem e ação de consulta.
7. Chamada para o blog.
8. Bloco institucional (iniciativas, na Melnick; “Transformando vidas” e depoimentos, no site atual da MPEN).
9. Rodapé em colunas: institucional, empreendimentos, canais, contato, redes e política de privacidade.
10. Atalho flutuante de contato (e-mail, telefone, mensagem).

Página de um empreendimento, no mesmo domínio: `/enterprise/nome`. Sem subdomínio por produto na primeira entrega.

## Blog

Espelho do layout em [melnick.com.br/blog](https://www.melnick.com.br/blog/), com posts da MPEN.

- Título e texto de abertura
- Destaque: um post grande e dois ao lado
- Lista das últimas publicações
- Filtro por categoria e busca por texto
- Página do post, com capa, data, categoria e corpo
- Newsletter no fim da listagem
- Categorias próprias da MPEN. Os nomes da Melnick (I Love POA, Destinos Fantásticos, etc.) não entram

O blog que está hoje em mpen.com.br mostra posts de exemplo em inglês. Esse conteúdo não vai para o site novo.

## O que entra no lançamento

Páginas do site público:

- Home
- Empreendimentos, com listagem, filtro e página de cada um
- Quem somos
- Blog, listagem e post
- Contato
- Seja parceiro
- FAQ
- Compliance
- Política de privacidade
- Termos de uso
- Aviso de cookies (LGPD)

Formulários (contato, consulta de empreendimento, seja parceiro, newsletter) gravam no banco e disparam e-mail.

A Área do Cliente é um link para o Expert System. O portal em si não faz parte deste site.

Ficam de fora da primeira entrega, porque são canais da Melnick e não aparecem como produto no site atual da MPEN: comercial, hotéis, terrenos, locação reversível, investidores, portal do corretor, tramitações, imprensa, acessibilidade avançada (alto contraste, fonte, Libras) e um site por empreendimento. Se algum desses for da MPEN, entra no passo 1 e passa a fazer parte do escopo.

## Como o projeto fica organizado

Três peças, ligadas ao GitHub:

1. **Código** no GitHub: site público e um painel interno para cadastrar empreendimentos, posts e ler os leads.
2. **Banco PostgreSQL** com o conteúdo e os contatos. O site lê daí.
3. **Hospedagem** que publica a cada push na `main`. O DNS de `mpen.com.br` aponta para ela quando o site novo estiver pronto para substituir o WordPress atual.

Fluxo do dia a dia: branch, alteração, pull request, merge, produção atualizada. Preview por branch antes de ir ao ar.

Stack: Next.js para o site e o painel, PostgreSQL (Neon ou Supabase), armazenamento de imagens (S3 ou o storage do mesmo provedor) e Vercel para publicar. Variáveis de ambiente (banco, e-mail, domínio) ficam fora do Git.

## O que o banco guarda

| Grupo | O que guarda |
|---|---|
| Empreendimentos | Nome, status (lançamento, em construção, entregue), cidade, bairro, tipologia, metragem, texto, endereço, imagens, ordem na home, destaque no hero |
| Blog | Título, resumo, corpo, capa, categoria, data, destaque, publicado ou rascunho |
| Páginas institucionais | Quem somos, seja parceiro, FAQ, compliance, privacidade, termos |
| Leads | Nome, telefone, e-mail, origem do formulário, empreendimento, data |
| Configuração | Logo, cores, telefones, e-mails, endereço, WhatsApp, redes, textos do rodapé |
| Usuários do painel | Login de quem edita o site |

## Ordem em que vamos resolver

### 1. Fechar o que ainda está em aberto

Já sabemos: empresa MPEN, domínio `mpen.com.br`, logo, cores acima, Área do Cliente no Expert System.

Ainda precisamos confirmar:

- Se a paleta da tabela está aprovada
- Lista real de empreendimentos que entram no ar, com status
- Se a primeira versão é só residencial, ou se comercial / hotel / terreno também existem
- E-mail que recebe os leads
- Onde o DNS de `mpen.com.br` é administrado (Registro.br, Cloudflare, hospedagem do WordPress atual)
- Quem aprova a troca do site atual pelo novo

### 2. Inventário

Lista fechada de páginas e de cada formulário, com os campos. Isso vira o contrato do lançamento. O que ficar de fora continua escrito neste guia.

### 3. Repositório e ambientes

Repositório no GitHub, branch `main` protegida, preview por pull request e produção. Banco separado para preview e produção.

### 4. Banco e painel

Tabelas e login interno. Dá para cadastrar um empreendimento, publicar um post e ver um lead de teste.

### 5. Site público

Home, listagem, página do empreendimento, institucionais, blog e formulários, com a logo e as cores da MPEN. Formulário enviado aparece no banco e no e-mail.

### 6. Domínio

Apontar o DNS de `mpen.com.br` para a hospedagem nova, com HTTPS, só quando o conteúdo real estiver no ar. Testar páginas, formulário, mobile e um lead chegando no e-mail. O WordPress atual sai do ar nessa troca.

### 7. Conteúdo real

Empreendimentos, textos e imagens entram pelo painel. O blog começa vazio ou com posts reais da MPEN, sem os textos de exemplo que estão no site hoje.

## Decisões deste guia

- Esqueleto: home e blog da Melnick
- Marca: logo e cores da MPEN
- Entrega: site e painel no GitHub, conteúdo e leads num PostgreSQL, `mpen.com.br` no ar no lugar do WordPress atual
- Área do Cliente: link para `portaldocliente.expertsystem.com.br/entrar/mpen`
- Fora da primeira entrega: portais logados, produtos que a MPEN não tiver e site separado por empreendimento
- Estrutura do repositório só começa depois da confirmação do passo 1

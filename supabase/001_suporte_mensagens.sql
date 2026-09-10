-- ═══════════════════════════════════════════════════════════════════════
-- Nitro · Alcohol Intelligence — tabela do formulário "Fale com o suporte"
-- Rode este script UMA VEZ no SQL Editor do Supabase.
--
-- Colunas espelham 1:1 os campos do form em Dashboards/index.html
-- (#supportForm: nome, email, assunto, mensagem) + a data de envio.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.suporte_mensagens (
  id          uuid        primary key default gen_random_uuid(),

  -- <input name="nome" required>
  nome        text        not null
              check (char_length(btrim(nome)) between 2 and 120),

  -- <input type="email" name="email" required>
  email       text        not null
              check (char_length(email) <= 254
                     and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),

  -- <select name="assunto"> — mesmos 4 valores do HTML
  assunto     text        not null default 'duvida'
              check (assunto in ('duvida','bug','sugestao','outro')),

  -- <textarea name="mensagem" required>
  mensagem    text        not null
              check (char_length(btrim(mensagem)) between 5 and 5000),

  -- data/hora de envio, gravada pelo banco (nunca pelo cliente)
  enviado_em  timestamptz not null default now()
);

comment on table  public.suporte_mensagens is 'Mensagens do formulário de suporte do dashboard Nitro.';
comment on column public.suporte_mensagens.enviado_em is 'Preenchido pelo servidor (now()); o cliente não envia esta coluna.';

-- Triagem por data (mais recentes primeiro) e por assunto.
create index if not exists suporte_mensagens_enviado_em_idx on public.suporte_mensagens (enviado_em desc);
create index if not exists suporte_mensagens_assunto_idx    on public.suporte_mensagens (assunto);

-- ─────────────────────────── RLS ───────────────────────────
-- O navegador usa a publishable/anon key. Com RLS ligada e APENAS
-- a policy de INSERT, o público consegue gravar e NÃO consegue ler,
-- editar ou apagar nada (nem as mensagens de terceiros).
-- A leitura fica para o painel do Supabase / service_role.
alter table public.suporte_mensagens enable row level security;

drop policy if exists "suporte: qualquer um pode enviar" on public.suporte_mensagens;
create policy "suporte: qualquer um pode enviar"
  on public.suporte_mensagens
  for insert
  to anon, authenticated
  with check (true);

-- Sem policy de SELECT/UPDATE/DELETE de propósito.
revoke select, update, delete on public.suporte_mensagens from anon, authenticated;
grant  insert                 on public.suporte_mensagens to anon, authenticated;

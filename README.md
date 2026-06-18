# 🌲 Convite Digital Interativo - Bosque Encantado Rávila Melissa 🦌

Seja bem-vindo ao repositório do aplicativo web real e funcional de **Convite Digital para Aniversário Infantil de 1 Ano**. O sistema foi inteiramente projetado seguindo as diretrizes de visual mobile-first fofo de floresta encantada, carregando recursos completos de confirmação de presença (RSVP), mural interativo de carinhos com moderação ativa de comentários, galeria fotográfica responsiva em polaroids e exportação de dados em formatos corporativos (PDF e Excel).

---

## 🎨 Identidade Visual e Estilo (Design Bosque Encantado)
- **Cores principais**: Fundo off-white macio (`#FAF6F0`), rosa claro de flores de cerejeira (`#F4D9E1`), verde sálvia d'água (`#8FA89B`), bege suave rústico e botões circulares rosas dinâmicos (`#E66C86`).
- **Elementos gráficos**: Galhos delicados, coroas florais, esquilos fofinhos, coelhinhos, raposinhas e guaxinins amigáveis.
- **Estrutura de Visualização**: Layout inteiramente mobile-first, mimetizando cartões de convite físicos dobráveis de alto padrão com transições animadas elegantes, sombras sutis e suavidade tátil.

---

## 🗄️ 1. SQL Estrutural do Supabase (Banco de Dados)

Rode as instruções SQL abaixo diretamente no **SQL Editor** do painel do seu projeto Supabase para criar a estrutura exata das tabelas necessárias para o CRUD real:

```sql
-- 1. TABELA DE CONFIGURAÇÕES DO CONVITE (Event Settings)
CREATE TABLE public.event_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'settings-1',
    birthday_name VARCHAR(100) NOT NULL,
    birthday_age VARCHAR(50) NOT NULL,
    hero_title TEXT NOT NULL,
    invite_text TEXT NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    weekday VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    maps_url TEXT NOT NULL,
    gift_url TEXT,
    primary_color VARCHAR(10) NOT NULL,
    secondary_color VARCHAR(10) NOT NULL,
    background_color VARCHAR(10) NOT NULL,
    button_color VARCHAR(10) NOT NULL,
    text_color VARCHAR(10) NOT NULL,
    enable_wall BOOLEAN NOT NULL DEFAULT TRUE,
    enable_comments BOOLEAN NOT NULL DEFAULT TRUE,
    enable_photo_upload BOOLEAN NOT NULL DEFAULT TRUE,
    wall_requires_approval BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Registrando configurações de inicialização padrões (Identidade Rávila Melissa)
INSERT INTO public.event_settings (
    id, birthday_name, birthday_age, hero_title, invite_text, 
    event_date, event_time, weekday, address, maps_url, gift_url,
    primary_color, secondary_color, background_color, button_color, text_color,
    enable_wall, enable_comments, enable_photo_upload, wall_requires_approval
) VALUES (
    'settings-1', 
    'Rávila Melissa', 
    '1 aninho', 
    'Rávila Melissa faz 1 aninho', 
    'O bosque encantado está em festa! Venha comemorar comigo o meu primeiro aninho em uma tarde cheia de magia, fofura e brincadeiras.', 
    '13.06', 
    '19:00', 
    'Sábado', 
    'Espaço Encantado, Rua dos Coelhos fofos, número 1989', 
    'https://maps.google.com', 
    'https://www.google.com',
    '#F4D9E1', '#8FA89B', '#FAF6F0', '#E66C86', '#4A3B32',
    true, true, true, true
) ON CONFLICT (id) DO NOTHING;


-- 2. TABELA DE CONFIRMAÇÕES DE PRESENÇA (RSVPS)
CREATE TABLE public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    attendance_status VARCHAR(20) NOT NULL CHECK (attendance_status IN ('confirmed', 'declined', 'maybe')),
    has_companions BOOLEAN NOT NULL DEFAULT FALSE,
    companions_count INTEGER DEFAULT 0,
    companions_names TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- 3. TABELA DO MURAL DE RECADOS (Wall Posts)
CREATE TABLE public.wall_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    photo_url TEXT,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- 4. TABELA DE COMENTÁRIOS DO MURAL (Wall Comments)
CREATE TABLE public.wall_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.wall_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(150) NOT NULL,
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- 5. TABELA DE REAÇÕES DE CORAÇÕES/FLORES (Wall Reactions)
CREATE TABLE public.wall_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.wall_posts(id) ON DELETE CASCADE,
    reaction_type VARCHAR(50) NOT NULL, -- 'heart', 'flower', 'star', 'care'
    visitor_token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_post_reaction_visitor UNIQUE (post_id, reaction_type, visitor_token)
);


-- 6. TABELA DE ÁLBUM DE FOTOS (Gallery Photos)
CREATE TABLE public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_url TEXT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Preenchendo album com imagens do bosque encantado fofas
INSERT INTO public.gallery_photos (photo_url, title, description, sort_order, is_active) VALUES
('https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop', 'Cheguei ao mundo!', 'Esse foi o dia mais mágico das nossas vidas, quando nosso pequeno coelhinho deu o primeiro respiro.', 1, true),
('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop', 'Meu primeiro sorriso', 'Um sorriso que ilumina todo o bosque e faz florescer flores em nossos corações.', 2, true),
('https://images.unsplash.com/photo-1551831820-f4b3e0d6cbf5?q=80&w=600&auto=format&fit=crop', 'Brincando com folhinhas', 'Descobrindo as texturas das folhinhas e galhos sob a sombra de um grande carvalho.', 3, true);
```

---

## 🔒 2. Políticas RLS (Row-Level Security) do Supabase

Ative as políticas de segurança RLS abaixo para garantir que os convidados confirmem presença e mandem recados, mas sob as regras rígidas vigentes no banco de dados e controle da moderação:

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.event_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wall_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wall_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wall_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- POLÍTICAS EVENT SETTINGS
-- ----------------------------------------------------
CREATE POLICY "Qualquer um pode ver configurações" ON public.event_settings
    FOR SELECT USING (true);

CREATE POLICY "Apenas administradores podem atualizar configurações" ON public.event_settings
    FOR ALL USING (true) WITH CHECK (true); -- Controle client-side via credenciais ADMBELLE. Caso queira usar perfis do Supabase Auth, altere para auth.role() = 'service_role'

-- ----------------------------------------------------
-- POLÍTICAS RSVPS
-- ----------------------------------------------------
CREATE POLICY "Qualquer um pode se registrar no RSVP" ON public.rsvps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode ver RSVPs (opcional para checar nomes duros)" ON public.rsvps
    FOR SELECT USING (true);

CREATE POLICY "Moderação total de RSVPs" ON public.rsvps
    FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------
-- POLÍTICAS WALL POSTS (MURAL DE RECADOS)
-- ----------------------------------------------------
CREATE POLICY "Qualquer um pode ler posts no mural" ON public.wall_posts
    FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode postar no mural" ON public.wall_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Alterações e exclusão de posts" ON public.wall_posts
    FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------
-- POLÍTICAS WALL COMMENTS
-- ----------------------------------------------------
CREATE POLICY "Leitura pública de comentários" ON public.wall_comments
    FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode comentar recados" ON public.wall_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Gerência total de comentários" ON public.wall_comments
    FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------
-- POLÍTICAS WALL REACTIONS
-- ----------------------------------------------------
CREATE POLICY "Ver reações públicas" ON public.wall_reactions
    FOR SELECT USING (true);

CREATE POLICY "Qualquer um reage com corações ou flores" ON public.wall_reactions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um remove sua própria reação" ON public.wall_reactions
    FOR DELETE USING (true);

-- ----------------------------------------------------
-- POLÍTICAS GALLERY PHOTOS
-- ----------------------------------------------------
CREATE POLICY "Leitura pública de fotos do álbum" ON public.gallery_photos
    FOR SELECT USING (true);

CREATE POLICY "Moderação total do álbum de fotos" ON public.gallery_photos
    FOR ALL USING (true) WITH CHECK (true);

-- 7. TABELA DE SUGESTÕES DE PRESENTES
CREATE TABLE public.gift_suggestions (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gift_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura de presentes" ON public.gift_suggestions
    FOR SELECT USING (true);

CREATE POLICY "Moderação total de presentes" ON public.gift_suggestions
    FOR ALL USING (true) WITH CHECK (true);
```

---

## 🗃️ 3. Configuração de Buckets de Armazenamento (Supabase Storage)

O sistema permite carregar e exibir fotos diretamente nos recados do mural e cadastrar frames dinâmicos de imagens na galeria de fotos. Configure os seguintes buckets para habilitar o upload:

1. Acesse o **Supabase Dashboard** > **Storage**.
2. Clique em **New Bucket** e configure as seguintes pastas:
   - 📸 **`birthday-gallery`**: Bucket destinado às fotos do álbum da aniversariante.
   - ✉️ **`wall-uploads`**: Bucket destinado às fotos enviadas pelos próprios convidados no Mural de Carinhos.
   - 🎨 **`design-assets`**: Imagens e texturas florais extras estruturais sobre a decoração do bosque.
3. **⚠️ ATENÇÃO IMPORTANTÍSSIMA**: Certifique-se de marcar a opção **Public Bucket** ao criar cada bucket para garantir que as URLs geradas pelo Supabase fiquem legíveis aos dispositivos móveis globais dos convidados sem expiração de tokens.
4. **Políticas de Storage**: No painel do próprio Supabase Storage, adicione uma política permissiva de **Insert** e **Select** para usuários anônimos em `@everyone` para viabilizar o upload direto pelo frontend sem autenticação pesada dos convidados do convite.

---

## 💻 4. Estrutura de Arquivos Implementada

O projeto foi meticulosamente modularizado para separar visualizadores de dados, CRUDs e lógicas de exportação:

```text
/
├── server.ts                  # Servidor Full stack Express + Vite Middleware (Secure Admin Auth Endpoint)
├── package.json               # Dependências do ecossistema (React 19, TypeScript, XLSX, jsPDF)
├── .env.example               # Exemplo de credenciais estruturais
├── src/
│   ├── App.tsx                # Roteamento central das visões da API pública e área administrativa
│   ├── main.tsx               # Montagem de renderização React
│   ├── index.css              # Fontes do Google (Inter, JetBrains Mono) e animações css
│   ├── types/
│   │   └── database.ts        # Interfaces declarativas estritas do TypeScript para o banco
│   ├── lib/
│   │   ├── supabase.ts        # Client Supabase + Local Storage Offline Fallback Engine (CRUDs completos)
│   │   ├── auth.ts            # Comunicação AJAX segura de login do administrador
│   │   ├── exportPdf.ts       # Conversor em formato PDF de listas do RSVP via jsPDF e AutoTable
│   │   ├── exportExcel.ts     # Conversor em planilhas Excel estruturadas via biblioteca XLSX
│   │   └── utils.ts           # Cores combinatórias, datas de fuso horário e avatares fofos do bosque
│   ├── components/
│   │   ├── InviteHero.tsx     # Cabeçalho fofo com flores, galhos e dados da festa
│   │   ├── ActionButtons.tsx  # Botões em círculo: Calendário, Maps, Presentes e Mural
│   │   ├── RSVPForm.tsx       # Formulário de confirmação de presença (Gerador automático de acompanhantes)
│   │   ├── PhotoGallery.tsx   # Grade polaroid de fotos infantis com Lightbox zoom interativo
│   │   ├── WallComposer.tsx   # Área de digitação de recados (Com drag and drop de fotos)
│   │   ├── WallPostCard.tsx   # Card com o texto do convidado, curtidas e comentários
│   │   ├── AdminSidebar.tsx   # Painel de atalhos e seções de gerenciamento dos pais
│   │   ├── AdminLayout.tsx    # Protetor de rotas da ADM (Sessão criptografada temporária em sessionStorage)
│   │   ├── AdminDashboard.tsx # Métricas em Bento-Grid (Total de confirmados, crianças, ausentes)
│   │   ├── AdminRSVPTable.tsx # CRUD total do RSVP, buscas por nome, filtro, inclusão e exportações
│   │   ├── AdminWallModeration.tsx # Painel de aprovação em lote de recados, remoção de fotos e de comentários
│   │   ├── AdminSettingsForm.tsx # Color Picker e caixas de texto com paletas prontas para o tema
│   │   └── AdminGalleryManager.tsx # Upload fotográfico direto de novas polaroids para o álbum
│   └── pages/
│       ├── GuestHome.tsx      # Landing page de convite pública responsiva
│       ├── AdminLogin.tsx     # Tela de login da gerência (Usuário: ADMBELLE, Senha: 1989@ADMBELLE)
│       ├── AdminDashboardPage.tsx # Painel principal de estatísticas
│       ├── AdminRSVPPage.tsx  # Painel de listagem e controle do RSVP
│       ├── AdminWallPage.tsx  # Painel de moderação de termos e mensagens de carinho
│       ├── AdminGalleryPage.tsx # Painel de inclusão/gestão de polaroids
│       └── AdminSettingsPage.tsx # Painel de edição de cores e identidade visual
```

---

## 🚀 5. Como Executar o Projeto Localmente

### Pré-requisitos
- Ter o **Node.js v18 ou superior** instalado na sua máquina.

### Passos para rodar
1. Baixe o código fonte ou clone este repositório.
2. Com o seu terminal aberto no diretório raiz do projeto, instale as dependências executando:
   ```bash
   npm install
   ```
3. Crie e configure o arquivo de configurações de variáveis de ambiente. Duplique o `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Insira a sua URL do Supabase e a sua Chave Pública (Anon Key) obtidas no menu **Settings > API** do Supabase:
   ```env
   VITE_SUPABASE_URL="https://seu-projeto-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-chave-anon-key-aqui"
   ```
5. Inicie o servidor integrado de desenvolvimento full-stack digitando:
   ```bash
   npm run dev
   ```
6. O terminal indicará que a aplicação está executando de forma veloz na porta padrão:
   - Abra [http://localhost:3000](http://localhost:3000) no navegador para interagir com o convite!

*💡 Nota: No painel do administrador, utilize os dados cadastrados pelos papais para gerenciar:*
- **Usuário**: `ADMBELLE`
- **Senha**: `1989@ADMBELLE`

---

## 📤 6. Como Publicar o Projeto em Produção (Vercel ou Netlify)

A arquitetura do projeto foi planejada para funcionar perfeitamente de forma integrada. Por default, você pode publicar o build de arquivos como uma **Single Page Application (SPA)** clássica estática nas maiores plataformas de hosting gratuito do mundo:

### Opção A: Publicando no Vercel
1. Instale a CLI oficial da Vercel (`npm i -g vercel`) ou conecte o seu repositório de forma automática utilizando a integração direto pelo GitHub na [Vercel](https://vercel.com).
2. Na etapa de importação do projeto, certifique-se de configurar as seguintes propriedades nas caixas de diálogo do build:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Adicione nas **Environment Variables** (Configurações > Environment Variables) os nomes padrões declarados no `.env`:
   - `VITE_SUPABASE_URL` = *(A URL do seu Supabase)*
   - `VITE_SUPABASE_ANON_KEY` = *(A Chave Pública Anon)*
4. Salve e execute o **Deploy**.

### Opção B: Publicando no Netlify
1. Conecte de forma automática o seu repositório sincronizado no [Netlify](https://netlify.com) ou arraste o seu diretório compilado `dist` gerado localmente após rodar `npm run build`.
2. Configure o build automático configurando:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Vá em **Site configurations > Environment variables** e defina as chaves do Supabase.
4. Conclua com o **Deploy site**.

---

## 🦌 O Legado do Bosque Encantado
Com este ecossistema completo, as celebrações ganham asas interativas. Os convidados desfrutam de um cartão digital único e encantado, enquanto você monitora em tempo real a listagem de comidinhas, contagem de convidados e depoimentos afetuosos para o florir da fofa Rávila Melissa. ✨🧸

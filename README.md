# Innova Imobiliária - Website

Site institucional da Innova Imobiliária desenvolvido com Next.js 15, TypeScript e Tailwind CSS, integrado com a API do Properfy CRM.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Properfy API** - Integração com CRM imobiliário

## 📋 Funcionalidades

- ✅ Home com hero section
- ✅ Listagem de imóveis com filtros avançados
- ✅ Filtros por tipo (venda/aluguel), categoria, localização, preço, quartos, etc.
- ✅ Cards responsivos de imóveis
- ✅ Sistema de cores personalizado (Innova branding)
- ✅ Layout responsivo com Header e Footer
- 🔄 Integração com API Properfy (preparado)

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e adicione suas credenciais da API Properfy:

```env
NEXT_PUBLIC_PROPERFY_API_URL=https://dev.properfy.com.br/api
NEXT_PUBLIC_PROPERFY_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_PROPERFY_CLIENT_ID=seu_client_id_aqui
```

> **Nota:** O projeto atualmente usa dados mockados para demonstração. Para usar dados reais, você precisa configurar as credenciais da API Properfy.

### 3. Executar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### 4. Build para produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
innova/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página home
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── Header.tsx        # Cabeçalho
│   ├── Footer.tsx        # Rodapé
│   ├── PropertyCard.tsx  # Card de imóvel
│   └── PropertyFilters.tsx # Filtros de busca
├── types/                # Tipos TypeScript
│   └── property.ts       # Tipos de imóveis
├── services/             # Serviços de API
│   └── properfy.ts       # Integração Properfy
├── lib/                  # Utilitários
│   ├── env.ts           # Variáveis de ambiente
│   └── mockData.ts      # Dados mockados
└── public/              # Arquivos estáticos
```

## 🎨 Cores do Tema

- **Primary:** `#1e40af` (Azul principal)
- **Primary Dark:** `#1e3a8a`
- **Primary Light:** `#3b82f6`
- **Secondary:** `#0891b2` (Ciano)
- **Accent:** `#f59e0b` (Laranja/Amarelo)

## 🔌 Integração com Properfy

O serviço de integração com a API Properfy está em `/services/properfy.ts`. Atualmente suporta:

- `getProperties(filters)` - Buscar imóveis com filtros
- `getPropertyById(id)` - Buscar imóvel por ID
- `getPropertyByCode(code)` - Buscar imóvel por código
- `getHighlightedProperties(limit)` - Buscar imóveis em destaque
- `getCities()` - Listar cidades disponíveis
- `getNeighborhoods(city)` - Listar bairros de uma cidade

Para ativar a integração real, configure as variáveis de ambiente e ajuste a página `app/page.tsx` para usar `properfyService` ao invés de `mockProperties`.

## 📝 Próximos Passos

- [ ] Adicionar página de detalhes do imóvel
- [ ] Implementar página de contato
- [ ] Adicionar página "Sobre"
- [ ] Implementar formulário de anúncio
- [ ] Adicionar galeria de imagens
- [ ] Implementar tour virtual
- [ ] SEO e meta tags dinâmicas
- [ ] Implementar paginação
- [ ] Adicionar mapa de localização

## 📄 Licença

© 2025 Innova Imobiliária. Todos os direitos reservados.

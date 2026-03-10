# ❤️ LoveQuest — Your Couple’s Journey

LoveQuest é uma aplicação interativa que transforma o relacionamento de um casal em uma jornada gamificada de desafios, recompensas e experiências compartilhadas.

A plataforma combina **gamificação, personalização com IA e uma arquitetura backend modular** para gerar experiências românticas personalizadas para cada casal.

O objetivo do projeto é demonstrar como **um backend inteligente pode orquestrar experiências emocionais e interativas**, utilizando geração de conteúdo dinâmico e lógica de progressão.

---

# ✨ Visão Geral

LoveQuest funciona como um **motor de geração de experiências para casais**, onde:

- desafios românticos são gerados dinamicamente
- o progresso do relacionamento é representado por missões
- recompensas podem ser desbloqueadas
- a experiência é personalizada com IA

O backend atua como o **núcleo lógico do sistema**, responsável por gerar conteúdo, validar progresso e gerenciar a progressão da jornada do casal.

---

# 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para demonstrar:

- Arquitetura backend modular
- Integração com IA para geração de conteúdo
- Design de sistemas gamificados
- APIs para aplicações interativas
- Estrutura escalável para aplicações sociais

Além disso, o projeto explora como **tecnologia pode ser utilizada para fortalecer relações humanas através de experiências digitais personalizadas**.

---

# 🏗️ Arquitetura do Sistema

O projeto é dividido em duas camadas principais.

## Frontend

Responsável pela interface do usuário.

### Tecnologias

- React
- TypeScript
- TailwindCSS
- Framer Motion
- Zustand (gerenciamento de estado)

### Responsabilidades

- exibir quests
- mostrar progresso do casal
- apresentar recompensas
- gerenciar a interação do usuário

---

## Backend (Core do Projeto)

O backend é o **coração da aplicação**, responsável por toda a lógica do sistema.

### Tecnologias

- Python
- FastAPI

### Responsabilidades

- geração dinâmica de quests
- personalização da experiência
- gerenciamento de progressão
- controle de recompensas
- integração com modelos de IA
- fornecimento de API para o frontend

O backend funciona como um **motor de experiência gamificada**, permitindo que o frontend consuma missões geradas dinamicamente.

---

# ⚙️ Componentes do Backend

## 1️⃣ Quest Generation Engine

O sistema de geração de quests cria desafios românticos baseados em contexto.

Ele pode considerar fatores como:

- histórico de quests completadas
- estágio do relacionamento
- preferências do casal
- frequência de interação

### Exemplo de quest

```
Prepare um jantar surpresa para seu parceiro(a).
```

Outro exemplo:

```
Escreva uma carta contando três coisas que você ama na pessoa.
```

Esse sistema permite **geração praticamente infinita de conteúdo**, mantendo a experiência sempre nova.

---

## 2️⃣ Personalization Engine

O backend possui um motor de personalização que pode integrar com modelos de IA.

### Objetivos

- adaptar quests ao estilo do casal
- gerar mensagens românticas personalizadas
- criar experiências únicas

### Possíveis integrações

- OpenAI
- Gemini
- LLMs locais

Isso permite que cada casal tenha **uma jornada única e personalizada**.

---

## 3️⃣ Relationship Progression System

O sistema de progressão funciona como um **RPG de relacionamento**.

Usuários completam quests e recebem recompensas.

### Fluxo de progressão

```
Completar missão
↓
Ganhar moedas
↓
Desbloquear recompensa
↓
Avançar na jornada
```

Esse sistema cria **engajamento contínuo e incentivo para novas interações**.

---

## 4️⃣ Reward System

O sistema de recompensas incentiva a participação nas quests.

### Exemplos de recompensas

- escolher o próximo filme
- escolher o restaurante do próximo encontro
- ganhar um jantar especial
- planejar uma atividade surpresa

---

# 📡 API Backend

O backend fornece endpoints que permitem ao frontend acessar o sistema de quests.

### Exemplo de endpoints

```
GET /quests
```

Retorna as quests disponíveis.

```
POST /quests/complete
```

Marca uma quest como concluída.

```
GET /rewards
```

Retorna recompensas disponíveis.

---

# 📂 Estrutura do Projeto

```
lovequest/
│
├── src/
│   ├── pages/
│   │   └── Home.tsx
│   │
│   ├── store/
│   │   ├── questStore.ts
│   │   └── currencyStore.ts
│
├── kat_engine/
│   ├── api_server.py
│   └── final_complete_kat_engine.py
│
└── README.md
```

---

# 🚀 Como Executar o Projeto

## Backend

Instale as dependências:

```bash
pip install fastapi uvicorn
```

Execute o servidor:

```bash
uvicorn api_server:app --reload
```

O servidor estará disponível em:

```
http://localhost:8000
```

---

## Frontend

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

---

# 🧪 Possíveis Melhorias Futuras

Algumas melhorias planejadas incluem:

- autenticação de usuários
- suporte para múltiplos casais
- banco de dados (Supabase / PostgreSQL)
- notificações push
- geração de quests com IA
- sistema de memórias do casal
- analytics de relacionamento

---

# 💡 Ideia do Projeto

LoveQuest explora um conceito emergente chamado **Relationship Tech**, onde tecnologia é usada para melhorar relações humanas.

A ideia é criar uma experiência digital que incentive:

- comunicação
- carinho
- momentos especiais
- crescimento do relacionamento

---

# 📜 Licença

Este projeto é open-source e pode ser utilizado para fins educacionais e experimentais.

---

# ❤️ Contribuições

Contribuições são bem-vindas!

Se você quiser melhorar o projeto:

- abra uma issue
- sugira melhorias
- envie um pull request

---

**LoveQuest — transformando relacionamentos em jornadas inesquecíveis.**

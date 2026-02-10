# 🎮 Game Randomizer

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> **Não sabe o que jogar? Deixe o destino decidir!**

Este é um web app moderno construído com **Next.js** que consome a [RAWG Video Games Database API](https://rawg.io/apidocs) para sugerir jogos aleatórios com base em filtros de gênero e plataforma.

---

## ✨ Funcionalidades

* 🎲 **Sorteio Inteligente:** Algoritmo que busca páginas aleatórias para garantir variedade (não apenas os jogos mais populares).
* 🏷️ **Filtros Dinâmicos:** Filtre por **Gênero** (Ação, RPG, Indie, etc.) e **Plataforma** (PC, PlayStation, Xbox, Switch).
* 💾 **Histórico Local:** O app "lembra" os últimos 5 jogos sorteados usando `localStorage` do navegador.
* 🛒 **Lojas:** Mostra links diretos para comprar/baixar o jogo (Steam, PS Store, etc.).
* 📱 **Compartilhamento:** Botão integrado para enviar o jogo sugerido via **WhatsApp**.
* 🎨 **UI Responsiva:** Interface moderna e adaptável para celular e desktop (Dark Mode nativo).

---

## 🚀 Tecnologias Utilizadas

* [Next.js 14](https://nextjs.org/) (App Router)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [RAWG API](https://rawg.io/apidocs)

---

## 📦 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
* Uma chave de API gratuita da [RAWG.io](https://rawg.io/apidocs).

---

## 🔧 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU_USUARIO/game-randomizer.git](https://github.com/SEU_USUARIO/game-randomizer.git)
    cd game-randomizer
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure a API Key:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave:
    ```env
    NEXT_PUBLIC_RAWG_API_KEY=sua_chave_da_api_aqui
    ```

4.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse:**
    Abra `http://localhost:3000` no seu navegador.

---

## 📂 Estrutura de Pastas

```bash
├── app/
│   ├── page.tsx       # Lógica principal e UI
│   ├── globals.css    # Estilos globais do Tailwind
├── public/                # Imagens estáticas
├── .env.local             # Variáveis de ambiente (não comitar!)
└── package.json
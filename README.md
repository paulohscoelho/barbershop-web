# Barbershop Web (Interface de Validação)

> **Nota de Contexto do Projeto**: Este repositório contém o Frontend do sistema de barbearia. O foco principal e a complexidade arquitetural deste ecossistema estão concentrados no [Backend (barbershop-api)](https://github.com/paulohscoelho/barbershop-api). Esta interface foi construída como um **Proof of Concept (PoC)** para consumir e validar visualmente os endpoints da API, garantindo uma demonstração completa e interativa do sistema final.

## 🎯 O Propósito da Aplicação

Sistemas de backend robustos (com regras complexas de concorrência, segurança e agendamento) precisam de uma interface para serem validados em um cenário real. Esta aplicação tem como objetivo:
- Prover uma visão clara e estilo "Google Calendar" para que o cliente possa visualizar e testar a reserva de horários.
- Demonstrar visualmente o funcionamento do dashboard administrativo do barbeiro (gestão de agenda, catálogo e clientes).
- Servir como peça de portfólio, mostrando a integração ponta a ponta (Angular consumindo Spring Boot).

## 🧑‍💻 Metodologia de Desenvolvimento (Frontend)

Como o objetivo central deste projeto de portfólio é demonstrar competências sólidas em **Arquitetura Backend (Java/Spring Boot)**, a construção deste frontend adotou uma abordagem de **prototipagem ágil (Rapid Prototyping) assistida por IA**.

- **Agilidade**: O código Angular, os componentes visuais e o layout responsivo foram gerados com forte auxílio de ferramentas de IA (como ChatGPT e GitHub Copilot) e refinados manualmente. 
- **Foco**: Essa estratégia permitiu que o tempo de estudo e desenvolvimento fosse direcionado para o que realmente importa na vaga almejada: regras de negócio complexas no backend, prevenção de *Double Booking* com transações `SERIALIZABLE`, segurança com JWT e integridade do banco de dados.
- **Qualidade Visual**: Apesar da prototipagem rápida, utilizou-se o **Tailwind CSS** para garantir um design moderno, responsivo e com excelente experiência de usuário (UX).

## ✨ Funcionalidades Implementadas

- **Área do Cliente**:
  - Login e visualização do Cartão Fidelidade dinâmico.
  - Novo agendamento com seleção de serviços e grade de horários disponíveis (consumindo a "máquina de horários" do backend).
  - Histórico de agendamentos com opção de cancelamento.
- **Área do Barbeiro (Admin)**:
  - **Agenda**: Listagem paginada com filtros por data, status e nome do cliente.
  - **Catálogo de Serviços**: CRUD completo com opção de reordenação (setas) e filtro para visualizar serviços inativos.
  - **Horários**: Configuração de horário de funcionamento semanal e datas de exceção (férias).
- **Segurança e Arquitetura**:
  - Interceptor HTTP para injeção automática do Token JWT.
  - Rotas protegidas com `AuthGuard` (baseado em Roles).
  - Componentes Standalone (padrão moderno do Angular).

## 🛠️ Stack Tecnológico

- **Framework**: Angular 20
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **Comunicação HTTP**: HttpClient e RxJS
- **Deploy**: Vercel

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 20 ou superior)
- Angular CLI (`npm install -g @angular/cli`)
- O backend (`barbershop-api`) rodando localmente ou a URL da API em produção configurada.

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/paulohscoelho/barbershop-web.git
    cd barbershop-web
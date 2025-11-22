# CSI606-2025-01---Remoto---Proposta-Trabalho-Final

# Resumo
Será um sistema de gestão especializado para vendedores e lapidadores de pedras preciosas, focado em rastrear o ciclo de vida completo da gema, desde a aquisição bruta até a venda final, integrando estoque, processo de produção (lapidação) e controle financeiro.

# Escopo
### 1. Módulo de Inventário (Estoque)
Cadastrar Pedras Brutas: Registrar a entrada de material (ex: lote de esmeraldas brutas), incluindo peso (em gramas ou quilates), custo de aquisição, fornecedor e data.

Cadastrar Pedras Lapidadas: Registrar o produto final (ex: alexandrita lapidada), com novas especificações: peso final (quilates), tipo de lapidação (corte), dimensões, pureza, cor e preço de venda sugerido.

Gerenciar Estoque: Ter uma visão clara de quantas pedras (brutas e lapidadas) estão disponíveis, em processo de lapidação ou vendidas.

Rastreabilidade: Vincular uma pedra lapidada à sua pedra bruta de origem.

### 2. Módulo de Lapidação (Produção)
Enviar para Lapidação: Marcar uma pedra bruta como "em processo", tirando-a do estoque de "brutos" e movendo-a para o estoque de "em lapidação".

Registrar Custos de Processo: Adicionar os custos associados à lapidação (ex: custo do serviço do lapidador, insumos).

Finalizar Processo: Registrar o resultado da lapidação.

Dar baixa na pedra bruta (ex: 10g de esmeralda bruta).

Dar entrada na pedra lapidada (ex: 3.5g de esmeralda lapidada).

O custo da pedra lapidada será automaticamente calculado como: Custo da Bruta + Custo da Lapidação.

### 3. Módulo Financeiro e Vendas
Controle de Vendas: Registrar uma venda, associando-a a uma pedra lapidada do inventário (dando baixa nela) e registrando o cliente e o valor da venda.

Contas a Pagar: Lançar custos de aquisição (compra de brutas) e custos de lapidação.

Contas a Receber: Gerenciar vendas feitas a prazo.

Fluxo de Caixa: Um painel simples para ver entradas (vendas) e saídas (custos).

Relatório de Lucratividade: O "coração" do sistema. Calcular o lucro real de cada venda: (Valor da Venda) - (Custo da Pedra Lapidada).

### 4. Gerenciamento Básico
Cadastro de Clientes e Fornecedores.

# Restrições 

# Protótipo
No processo de criação das interfaces esta sendo usado ferramentas como Figma, Canva e etc.
https://www.figma.com/design/aEwVzZA8nvFKdNlozeMVuv/Sem-t%C3%ADtulo?node-id=0-1&t=qdEqJjdEOCfulAKl-1

# Referências 

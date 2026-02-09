# ASPNetCore

Whitelabel básico de ASP.Net Core 10 que será utilizado para o desenvolvimento de backends.

## Sobre o projeto

Até o presente momento, ele conta com endpoints apenas referentes às operações em usuários, como criar, deletar e atualizar usuários, autenticar, habilitar autenticação em dois fatores, listar usuários, buscar usuários pelo nome e atribuir e remover papéis dentro do sistema. Em todo início de execução, a aplicação irá verificar a existência do usuário admin e das roles definidas em uma lista na classe IdentitySeeder, portanto, caso queiram testar a aplicação com novas roles, alterar o nome e a senha do primeiro administrador criado, bastam acessar esta classe que está na pasta Services.

## Codando no projeto

Para codar em cima deste projeto, recomenda-se o uso do Visual Studio Community 2026, visto que este conta com uma interface facilitada para navegar pelo projeto, um gerenciador de pacotes visual com funcionalidades de buscas e atualizações, controle de versionamento a partir de caixas de textos e botões (apesar que não costumo utilizar esse método e sempre recorro aos bom e velho CLI).

## Preparando o banco de dados

Abrindo o Visual Studio Community, ele dará a opção de abrir um projeto ou uma solução (normalmente, o ideal é abrir sempre a solução, que será o arquivo com extensão .slnx). Feito isso, o Visual Studio irá carregar o projeto inteiro já com todas suas classes e estará pronto para iniciar a execução. Entretanto, o projeto requer um banco de dados Postgres executando para fazer a persistência dos dados da aplicação. Caso tenham um Postgres executando na sua máquina, é necessário somente editar a string de conexão presente no arquivo appsettings.json. Do contrário, dentro do Docker-Compose fornecido já possui um service para o banco de dados, sendo assim, basta executar o comando:
```
docker compose -p whitelabel up -d database
```
Já com o Postgres rodando e com a string de conexão apontando corretamente para o banco de dados. Ainda com o projeto parado, clique em _Ferramentas > Gerenciador de Pacotes do NuGet > Console do Gerenciador de Pacotes_ e execute o seguinte comando para que as migrations sejam aplicadas no banco de dados:
```
Update-Database
```

## Executando o projeto

### No Visual Studio Community

Basta executar a aplicação em http. O servidor será iniciado na porta 5059 (caso queiram alterar a porta, ela fica guardada no arquivo launchSettings.json dentro da pasta Properties) e, caso não tenham alterado o ambiente para Release (i.e. estando em Debug), o Swagger estará disponível podendo ser acessado em [http://localhost:5059/swagger/index.html](http://localhost:5059/swagger/index.html). Apesar de ter o Swagger para referência e documentação de quais endpoints existem, o que cada endpoint retornará em cada caso e payloads exemplos para cada endpoint, recomenda-se o uso do Postman para testes.

### No Docker Desktop

Na raiz do projeto existe um arquivo docker-compose.yml, portanto, a partir da raiz do projeto, no terminal, basta executar o seguinte comando para que o projeto seja executado:
```
docker compose -p whitelabel up -d --build
```
Com isso, tanto o banco de dados quanto a API em si serão executadas em contêineres e estarão disponíveis para qualquer conexão. O service backend contido no Docker-Compose, conta com algumas variáveis de ambiente e configuram aspectos sobre os tokens JWTs gerados para autenticação, informações para o OTP (e.g. Google Authenticator), string de conexão do banco de dados e se a aplicação rodará como ambiente de desenvolvimento ou produção (o que afetará se a interface do Swagger será exposta no endereço citado acima, com a ressalva de que a porta pode ser alterada, ou não). Através do Docker-Compose, a porta 8080 (padrão do ASP.Net) foi mapeada para a portas 8080, o que faz com que a API, em HTTP, responda na porta 8080, entretanto, vocês podem alterar para qualquer outra porta que sintam-se mais à vontade.


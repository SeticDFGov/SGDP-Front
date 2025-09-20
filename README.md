# SGPD Frontend

Repositório para hospedar o código da interface de usuário do Sistema de Gestão de Demandas e Projetos.

### Pré-requisitos

- [Node.js v18+](https://nodejs.org/en/download)
- [Docker Compose](https://docs.docker.com/compose/install/) (instale na versão plugin como recomendado)

## Executar a aplicação nativamente

```sh
git clone https://github.com/SeticDFGov/SGDP-Front.git
cd SGDP-Front
```


```sh
npm
```

Inicie o servidor de desenvolvimento

```sh
npm install
npm run dev
```

No seu navegador, acesse o endereço: http://localhost:3000.

Para encerrar a aplicação, use Ctrl + C.

## Executar a aplicação em container Docker

Na primeira vez que for usar, ou após instalar uma nova dependencia.
No terminal, dentro da raíz do projeto:

- Rodar o comando `npm`
- Rodar o comando `docker compose build`
- Rodar o comando `docker compose up`
   
Nas vezes subsequentes, caso não tenha adicionado novas dependencias:
- Rodar o comando `docker compose up`

No seu navegador, acesse o endereço: http://localhost:3000.

Para encerrar a aplicação, use Ctrl + C.


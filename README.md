# Arthur Oliveiro — Portfólio e site de serviços

Site estático (HTML5, CSS3 e JavaScript puro), sem dependências, pronto para o GitHub Pages.

## Estrutura
```text
index.html            conteúdo e estrutura
favicon.ico
assets/css/style.css  estilos (cores em :root)
assets/js/script.js   menu, validação e formulário (dados de contato em CONFIG)
assets/images/        profile.jpg, og-image.jpg, projects/
assets/images/branding/  logos com transparência (+ originals/ intactos)
assets/icons/         favicons e apple-touch-icon
```

## Executar localmente
Abra `index.html` no navegador. Ou, com Python: `python3 -m http.server 8000` e acesse http://localhost:8000.

## Alterar textos e contatos
- Textos: edite `index.html` (cada seção tem um `id`: sobre, competencias, projetos, servicos, contratar, contato).
- Número de WhatsApp: procure `wa.me/5535991672959` no `index.html` (vários links) e `CONFIG.whatsapp` em `assets/js/script.js`.
- E-mail: `index.html` e `CONFIG.email` em `script.js`.
- Mensagens iniciais do WhatsApp ficam depois de `?text=` e precisam estar codificadas para URL (use https://wa.me ou um codificador de URL).

## Trocar a fotografia
Substitua `assets/images/profile.jpg` por uma imagem quadrada (ideal 800x800, até 200 KB), mantendo o mesmo nome.

## Adicionar projetos
Em `index.html`, na seção `#projetos`, copie um bloco `<article class="project">` e altere nome, descrição, tecnologias e link.
Para usar uma imagem de prévia, salve em `assets/images/projects/` e troque o `<div class="thumb">` por:
`<img class="thumb" src="assets/images/projects/nome.jpg" alt="Prévia do projeto" loading="lazy">`

## Atualizar serviços
Edite os blocos `<article class="service">` na seção `#servicos`. Ajuste também a mensagem do botão.

## Publicar no GitHub Pages
1. Crie um repositório (ex.: `arthur-oliveiro`) e envie todos os arquivos da pasta.
2. Em Settings > Pages, escolha "Deploy from a branch", branch `main`, pasta `/ (root)`.
3. O site ficará em `https://ArthurOliveiro.github.io/arthur-oliveiro/`.
4. Ajuste as URLs `og:url` e `og:image` no `<head>` do `index.html` para o endereço final.

### Domínio próprio
Em Settings > Pages > Custom domain, informe o domínio e configure o DNS conforme a documentação do GitHub. Depois atualize `og:url` e `og:image`.

## Observação sobre o formulário
Não há servidor. O formulário valida os campos e abre o WhatsApp ou o app de e-mail com a mensagem pronta; nada é enviado sem a confirmação do visitante.

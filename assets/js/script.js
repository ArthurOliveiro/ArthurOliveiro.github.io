/* =========================================================
   Arthur Oliveiro — comportamento do site
   Edite CONFIG para alterar os dados de contato do formulário.
   ========================================================= */
(function () {
  'use strict';

  const CONFIG = {
    whatsapp: '5535991672959',
    email: 'arthuroliveiroribeirodesouza@gmail.com'
  };

  // Ano do rodapé
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Menu mobile
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('open', open);
  }
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Link ativo conforme a seção visível
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
  }

  // Formulário: validação + encaminhamento transparente (sem servidor)
  const form = document.getElementById('form');
  const status = form.querySelector('.status');
  const rules = {
    nome: (v) => v.trim().length >= 2 || 'Informe seu nome.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Informe um e-mail válido, como nome@exemplo.com.',
    servico: (v) => v !== '' || 'Selecione o tipo de serviço.',
    descricao: (v) => v.trim().length >= 10 || 'Descreva o projeto em pelo menos 10 caracteres.'
  };

  function validate(name) {
    const field = form.elements[name];
    const out = form.querySelector('[data-for="' + name + '"]');
    const res = rules[name](field.value);
    const ok = res === true;
    field.setAttribute('aria-invalid', String(!ok));
    if (!ok) field.setAttribute('aria-describedby', out.id = 'err-' + name); else field.removeAttribute('aria-describedby');
    out.textContent = ok ? '' : res;
    return ok;
  }
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener('blur', () => validate(n)));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validate);
    if (results.includes(false)) {
      status.textContent = 'Corrija os campos destacados e tente novamente.';
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    const via = (e.submitter && e.submitter.dataset.via) || 'whatsapp';
    const texto = 'Olá, Arthur! Meu nome é ' + d.nome.trim() + '.\n' +
      'Serviço de interesse: ' + d.servico + '\n' +
      'Sobre o projeto: ' + d.descricao.trim() + '\n' +
      'Meu e-mail: ' + d.email.trim();

    if (via === 'email') {
      const assunto = 'Contato pelo site: ' + d.servico;
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(texto);
      status.textContent = 'Abrimos seu app de e-mail com a mensagem pronta. Ela só é enviada quando você confirmar por lá.';
    } else {
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
      status.textContent = 'Abrimos o WhatsApp com a mensagem pronta. Ela só é enviada quando você confirmar por lá.';
    }
  });
})();

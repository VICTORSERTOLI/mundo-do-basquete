document.addEventListener("DOMContentLoaded", () => {
  /* 1. Ano atual no rodapé */
  document.getElementById("ano").textContent = new Date().getFullYear();

  /* 2. Navbar encolhe e botão "topo" aparece ao rolar */
  const navbar = document.getElementById("navbar");
  const btnTopo = document.getElementById("btnTopo");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("encolhido", window.scrollY > 50);
    btnTopo.classList.toggle("mostrar", window.scrollY > 400);
  });
  btnTopo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* 3. Fecha o menu mobile ao clicar em um link */
  const menu = document.getElementById("menuPrincipal");
  menu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });

  /* 4. Textos e elementos com transição ao entrar na tela */
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        e.target.querySelectorAll(".contador").forEach(animarContador);
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

  function animarContador(el) {
    const alvo = +el.dataset.alvo;
    const inicio = alvo > 1000 ? alvo - 100 : 0;
    let atual = inicio;
    const passo = Math.max(1, Math.ceil((alvo - inicio) / 60));
    const timer = setInterval(() => {
      atual = Math.min(atual + passo, alvo);
      el.textContent = atual;
      if (atual === alvo) clearInterval(timer);
    }, 25);
  }

  /* 5. Botões "Detalhes" dos cards */
  document.querySelectorAll(".btn-detalhe").forEach((btn) => {
    btn.addEventListener("click", () => {
      const detalhe = btn.parentElement.querySelector(".detalhe");
      const aberto = !detalhe.classList.toggle("d-none");
      btn.textContent = aberto ? "Ocultar" : "Detalhes";
    });
  });

  /* 6. Galeria: amplia a imagem em um modal */
  const modalImagem = new bootstrap.Modal(document.getElementById("modalImagem"));
  const imgAmpliada = document.getElementById("imagemAmpliada");
  document.querySelectorAll(".img-galeria").forEach((img) => {
    img.addEventListener("click", () => {
      imgAmpliada.src = img.src;
      imgAmpliada.alt = img.alt;
      modalImagem.show();
    });
  });

  /* 7. Formulários: validação + modal de sucesso */
  const modalSucesso = new bootstrap.Modal(document.getElementById("modalSucesso"));
  const modalCadastroEl = document.getElementById("modalCadastro");

  function mostrarSucesso(titulo, texto) {
    document.getElementById("sucessoTitulo").textContent = titulo;
    document.getElementById("sucessoTexto").textContent = texto;
    modalSucesso.show();
  }

  function configurarFormulario(id, aoEnviar) {
    const form = document.getElementById(id);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      aoEnviar(form);
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  configurarFormulario("formContato", (form) => {
    const nome = form.querySelector("#nome").value.split(" ")[0];
    mostrarSucesso("Mensagem enviada!", `Obrigado, ${nome}! Responderemos em breve.`);
  });

  configurarFormulario("formCadastro", (form) => {
    const nome = form.querySelector("#cadNome").value.split(" ")[0];
    bootstrap.Modal.getInstance(modalCadastroEl).hide();
    modalCadastroEl.addEventListener("hidden.bs.modal", () => {
      mostrarSucesso("Cadastro realizado!", `Bem-vindo(a) à escolinha, ${nome}!`);
    }, { once: true });
  });

  /* Máscara simples de telefone */
  document.getElementById("cadTelefone").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    e.target.value = v;
  });
});

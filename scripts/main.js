/**
 * ============================================================
 * MAIN.JS — Agência Municipal de Regulação (AMR)
 * Site institucional governamental
 * Acessibilidade WCAG 2.1 AA/AAA
 * ============================================================
 */

$(document).ready(function () {
  'use strict';

  /* -------------------------------------------
     1. ANO DINÂMICO NO FOOTER
     ------------------------------------------- */
  (function atualizarAno() {
    var anoAtual = new Date().getFullYear();
    $('#ano-atual').text(anoAtual);
  })();

  /* -------------------------------------------
     2. SCROLL SUAVE (âncoras do menu)
     ------------------------------------------- */
  $('a[href^="#"]').on('click', function (e) {
    var destino = $(this.getAttribute('href'));
    if (destino.length) {
      e.preventDefault();
      var offset = 80; // Altura do header fixo
      $('html, body').animate(
        { scrollTop: destino.offset().top - offset },
        600,
        'swing'
      );
      // Fechar menu mobile se aberto
      var navbarCollapse = $('#navbarNav');
      if (navbarCollapse.hasClass('show')) {
        navbarCollapse.collapse('hide');
      }
      // Mover foco para a seção de destino
      destino.attr('tabindex', '-1').focus();
    }
  });

  /* -------------------------------------------
     3. NAVBAR SCROLL (efeito sombra)
     ------------------------------------------- */
  var $navbar = $('.navbar');
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 50) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }
  });

  /* -------------------------------------------
     4. ATIVAR LINK DO MENU CONFORME SCROLL
     ------------------------------------------- */
  var $sections = $('section[id]');
  var $navLinks = $('.navbar .nav-link');

  function ativarLinkMenu() {
    var scrollPos = $(window).scrollTop() + 120;

    $sections.each(function () {
      var $section = $(this);
      var sectionTop = $section.offset().top;
      var sectionBottom = sectionTop + $section.outerHeight();
      var sectionId = $section.attr('id');

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $navLinks
          .removeClass('active')
          .attr('aria-current', false);
        $navLinks
          .filter('[href="#' + sectionId + '"]')
          .addClass('active')
          .attr('aria-current', 'true');
      }
    });
  }

  $(window).on('scroll', ativarLinkMenu);
  ativarLinkMenu();

  /* -------------------------------------------
     5. BOTÃO VOLTAR AO TOPO
     ------------------------------------------- */
  var $btnTopo = $('#btn-voltar-topo');

  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 400) {
      $btnTopo.addClass('visivel');
    } else {
      $btnTopo.removeClass('visivel');
    }
  });

  $btnTopo.on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
    // Retornar foco para o topo
    $('#inicio').attr('tabindex', '-1').focus();
  });

  /* -------------------------------------------
     6. ANIMAÇÃO FADE-IN NO SCROLL
     ------------------------------------------- */
  function verificarFadeIn() {
    var windowHeight = $(window).height();
    var scrollTop = $(window).scrollTop();

    $('.fade-in').each(function () {
      var elementTop = $(this).offset().top;
      var triggerPoint = scrollTop + windowHeight - 80;

      if (elementTop < triggerPoint) {
        $(this).addClass('visivel');
      }
    });
  }

  $(window).on('scroll', verificarFadeIn);
  verificarFadeIn(); // Verificar elementos já visíveis

  /* -------------------------------------------
     7. ACESSIBILIDADE — CONTROLE DE FONTE
     ------------------------------------------- */
  var fontScale = 1;
  var FONT_MIN = 0.8;
  var FONT_MAX = 1.4;
  var FONT_STEP = 0.1;

  /**
   * Atualiza a escala de fonte do site
   * @param {number} novaEscala - Nova escala de fonte
   */
  function atualizarFonte(novaEscala) {
    fontScale = Math.max(FONT_MIN, Math.min(FONT_MAX, novaEscala));
    document.documentElement.style.setProperty('--fonte-escala', fontScale);
    // Salvar preferência
    try {
      localStorage.setItem('amr-font-scale', fontScale);
    } catch (e) {
      // localStorage indisponível
    }
    // Anunciar para leitores de tela
    anunciarParaLeitor('Tamanho da fonte alterado para ' + Math.round(fontScale * 100) + ' por cento');
  }

  // Botão aumentar fonte
  $('#btn-aumentar-fonte').on('click', function () {
    atualizarFonte(fontScale + FONT_STEP);
  });

  // Botão diminuir fonte
  $('#btn-diminuir-fonte').on('click', function () {
    atualizarFonte(fontScale - FONT_STEP);
  });

  // Botão reset (restaurar padrão)
  $('#btn-reset-fonte').on('click', function () {
    // Resetar fonte
    fontScale = 1;
    document.documentElement.style.setProperty('--fonte-escala', 1);
    try {
      localStorage.removeItem('amr-font-scale');
    } catch (e) {}

    // Resetar alto contraste
    if ($body.hasClass('alto-contraste')) {
      $body.removeClass('alto-contraste');
      $('#btn-alto-contraste').attr('aria-pressed', 'false');
      $('#btn-alto-contraste .btn-text').text('Alto Contraste');
      var $btnSecao = $('#btn-contraste-secao');
      if ($btnSecao.length) {
        $btnSecao.find('.btn-text-contraste') || $btnSecao.html('<i class="fas fa-adjust me-2" aria-hidden="true"></i>Ativar Alto Contraste');
        $btnSecao.attr('aria-pressed', 'false');
      }
      try {
        localStorage.removeItem('amr-alto-contraste');
      } catch (e) {}
    }

    anunciarParaLeitor('Configurações de acessibilidade restauradas ao padrão');
  });

  // Restaurar preferência salva
  try {
    var savedScale = localStorage.getItem('amr-font-scale');
    if (savedScale) {
      atualizarFonte(parseFloat(savedScale));
    }
  } catch (e) {
    // localStorage indisponível
  }

  /* -------------------------------------------
     8. ACESSIBILIDADE — ALTO CONTRASTE
     ------------------------------------------- */
  var $body = $('body');

  /**
   * Alterna o modo alto contraste
   */
  function alternarAltoContraste() {
    $body.toggleClass('alto-contraste');
    var ativo = $body.hasClass('alto-contraste');

    // Atualizar botão
    var $btn = $('#btn-alto-contraste');
    $btn.attr('aria-pressed', ativo);
    $btn.find('.btn-text').text(ativo ? 'Contraste Normal' : 'Alto Contraste');

    // Atualizar botão da seção de acessibilidade
    var $btnSecao = $('#btn-contraste-secao');
    if ($btnSecao.length) {
      $btnSecao.text(ativo ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste');
      $btnSecao.attr('aria-pressed', ativo);
    }

    // Salvar preferência
    try {
      localStorage.setItem('amr-alto-contraste', ativo);
    } catch (e) {
      // localStorage indisponível
    }

    // Anunciar para leitores de tela
    anunciarParaLeitor(ativo ? 'Modo alto contraste ativado' : 'Modo alto contraste desativado');
  }

  $('#btn-alto-contraste, #btn-contraste-secao').on('click', alternarAltoContraste);

  // Restaurar preferência salva
  try {
    var savedContraste = localStorage.getItem('amr-alto-contraste');
    if (savedContraste === 'true') {
      $body.addClass('alto-contraste');
      $('#btn-alto-contraste').attr('aria-pressed', 'true');
      $('#btn-alto-contraste .btn-text').text('Contraste Normal');
      var $btnSecao = $('#btn-contraste-secao');
      if ($btnSecao.length) {
        $btnSecao.text('Desativar Alto Contraste');
        $btnSecao.attr('aria-pressed', 'true');
      }
    }
  } catch (e) {
    // localStorage indisponível
  }

  /* -------------------------------------------
     9. LIVE REGION PARA LEITORES DE TELA
     ------------------------------------------- */
  var $liveRegion = $('#aria-live-region');

  /**
   * Anuncia uma mensagem para leitores de tela via aria-live
   * @param {string} mensagem - Mensagem a ser anunciada
   */
  function anunciarParaLeitor(mensagem) {
    $liveRegion.text('');
    setTimeout(function () {
      $liveRegion.text(mensagem);
    }, 100);
  }

  /* -------------------------------------------
     10. TECLADO — ACESSIBILIDADE EXTRA
     ------------------------------------------- */
  // Atalhos de teclado
  $(document).on('keydown', function (e) {
    // Alt + 1 → Ir para conteúdo principal
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      var $main = $('#conteudo-principal');
      $main.attr('tabindex', '-1').focus();
      $('html, body').animate({ scrollTop: $main.offset().top - 80 }, 400);
    }
    // Alt + 2 → Ir para navegação
    if (e.altKey && e.key === '2') {
      e.preventDefault();
      $('.navbar .nav-link:first').focus();
    }
    // Alt + 3 → Ir para contato
    if (e.altKey && e.key === '3') {
      e.preventDefault();
      var $contato = $('#contato');
      $contato.attr('tabindex', '-1').focus();
      $('html, body').animate({ scrollTop: $contato.offset().top - 80 }, 400);
    }
  });

  /* -------------------------------------------
     11. PERFORMANCE — THROTTLE DE SCROLL
     ------------------------------------------- */
  // Aplicar throttle mínimo para evitar sobrecarga
  var scrollHandlers = $.Callbacks();
  var scrollThrottled = false;

  $(window).on('scroll.throttled', function () {
    if (!scrollThrottled) {
      scrollThrottled = true;
      requestAnimationFrame(function () {
        scrollThrottled = false;
      });
    }
  });
});

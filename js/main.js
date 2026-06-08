/* 
========================================================================
   TERAPEUTA DOUGLAS OLIVER - JAVASCRIPT PRINCIPAL (INTERAÇÃO & ANIMAÇÃO)
========================================================================
   Este arquivo controla toda a lógica de comportamento e dinamismo da 
   página, incluindo:
     1. Comportamento do Cabeçalho ao Rolar (Header Scroll)
     2. Menu Lateral Responsivo (Mobile Nav Drawer)
     3. Animações de Aparição Suave ao Rolar (Scroll Reveal)
     4. Filtro em Tempo Real do Catálogo de Serviços
     5. Botão Flutuante de WhatsApp dinâmico
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os comportamentos globais e de layout do site
    initHeaderScroll();
    initMobileMenu();
    initScrollAnimations();
    injectFloatingWhatsApp();
    
    // 2. Inicializa o filtro de serviços caso o usuário esteja na página de serviços
    if (document.querySelector('.filter-btn')) {
        initServicesFilter();
    }
});

/**
 * 1. COMPORTAMENTO DO CABEÇALHO AO ROLAR (HEADER SCROLL)
 * ---------------------------------------------------------------------
 * Esta função monitora a posição de rolagem vertical (scroll) da página.
 * Quando o usuário rola mais de 50 pixels, ela adiciona a classe CSS
 * 'header-scrolled' ao cabeçalho. Isso reduz a sua altura e aumenta a
 * opacidade do fundo (efeito glassmorphism), otimizando a leitura do site.
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return; // Aborta se o cabeçalho não existir na página

    const scrollThreshold = 50; // Quantidade em pixels para ativar a redução do menu

    const toggleHeaderClass = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    };

    // Escuta o evento de rolagem e também executa uma vez ao carregar a página
    window.addEventListener('scroll', toggleHeaderClass);
    toggleHeaderClass(); 
}

/**
 * 2. MENU LATERAL RESPONSIVO (MOBILE NAVIGATION DRAWER)
 * ---------------------------------------------------------------------
 * Gerencia a abertura e o fechamento do menu em dispositivos móveis.
 * - Ao clicar no botão de menu (hambúrguer), ativa ou desativa as classes.
 * - Impede a rolagem do fundo (body) enquanto o menu móvel estiver ativo.
 * - Fecha o menu automaticamente quando qualquer link interno for clicado.
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuToggle || !mobileNav) return;

    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Impede a rolagem da página quando o menu móvel estiver aberto
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha o menu quando o usuário clica em algum link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * 3. ANIMAÇÕES DE APARIÇÃO SUAVE AO ROLAR (SCROLL REVEAL)
 * ---------------------------------------------------------------------
 * Utiliza a API nativa 'IntersectionObserver' do navegador para detectar
 * quando os elementos com a classe '.reveal' estão visíveis na tela.
 * - Quando visíveis, adiciona a classe '.active', que aciona transições CSS
 *   de opacidade e deslocamento (transform).
 * - Uma vez revelado, o elemento deixa de ser observado para otimizar 
 *   a performance do navegador.
 */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    // Verifica se o navegador suporta a API de observação de interseção
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null, // Usa a viewport (janela do navegador) como referência
            threshold: 0.08, // Ativa a animação quando pelo menos 8% do elemento estiver visível
            rootMargin: '0px 0px -30px 0px' // Margem na parte inferior para adiantar o gatilho
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Para de observar o elemento após a animação rodar uma vez
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(element => observer.observe(element));
    } else {
        // Fallback: caso o navegador seja muito antigo, exibe os elementos imediatamente
        reveals.forEach(element => element.classList.add('active'));
    }
}

/**
 * 4. FILTRO DE SERVIÇOS EM TEMPO REAL (PÁGINA DE SERVIÇOS)
 * ---------------------------------------------------------------------
 * Permite filtrar o catálogo de serviços por categorias sem recarregar a página.
 * - Aplica transições de opacidade e escala suave (scale) ao ocultar/exibir.
 * - Oculta via 'display: none' apenas após a finalização da transição suave.
 */
function initServicesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.services-grid .service-card');

    if (!filterButtons.length || !serviceCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe ativa de todos os botões e aplica ao botão clicado
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Configura transição de suavização
                card.style.transition = 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    // Força um reflow para o navegador aplicar o 'display' antes da opacidade iniciar
                    card.offsetHeight; 
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    // Aguarda a animação de fade-out acabar para remover do fluxo com display: none
                    setTimeout(() => {
                        const currentActiveFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                        if (currentActiveFilter !== 'all' && cardCategory !== currentActiveFilter) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

/**
 * 5. BOTÃO FLUTUANTE DE WHATSAPP DINÂMICO
 * ---------------------------------------------------------------------
 * Injeta dinamicamente um botão flutuante verde do WhatsApp no canto inferior
 * direito em todas as páginas do site. Garante alta taxa de conversão para
 * tráfego pago.
 */
function injectFloatingWhatsApp() {
    if (document.querySelector('.whatsapp-floating')) return; // Evita injeções duplicadas

    const floatingBtn = document.createElement('a');
    floatingBtn.className = 'whatsapp-floating flex-center';
    floatingBtn.href = getWhatsAppLink('Botão Flutuante');
    floatingBtn.target = '_blank';
    floatingBtn.rel = 'noopener noreferrer';
    floatingBtn.setAttribute('aria-label', 'Falar com o terapeuta no WhatsApp');
    
    // Injeta o ícone SVG oficial do WhatsApp
    floatingBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.03 2.16c-5.43 0-9.85 4.42-9.85 9.85 0 1.73.45 3.42 1.3 4.92l-1.38 5.06 5.18-1.36c1.44.78 3.06 1.19 4.7 1.19 5.43 0 9.85-4.42 9.85-9.85 0-2.63-1.02-5.1-2.88-6.96s-4.33-2.85-6.92-2.85zm5.32 13.9c-.22.62-1.27 1.21-1.76 1.26-.47.05-.93.22-2.92-.57-2.55-1.01-4.18-3.6-4.31-3.77-.13-.17-1.05-1.4-1.05-2.67s.66-1.89.89-2.15c.23-.26.5-.32.67-.32.17 0 .34.01.48.01.15 0 .34-.06.53.39.2.49.68 1.66.74 1.78.06.12.1.26.02.42-.08.17-.12.27-.24.41-.12.14-.26.31-.37.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.92.81 1.69 1.06 1.93 1.18.24.12.38.1.52-.06.14-.17.61-.71.78-.95.17-.24.34-.2.58-.11.24.09 1.52.72 1.78.85.26.13.43.2.49.3.06.1.06.59-.16 1.21z"/>
        </svg>
    `;

    document.body.appendChild(floatingBtn);
}

/**
 * 6. GERADOR DE LINK DO WHATSAPP COM TEXTO DINÂMICO
 * ---------------------------------------------------------------------
 * Cria o link de redirecionamento parametrizado para o WhatsApp.
 * @param {string} trackingSource - Indica a seção do site onde a conversão ocorreu
 * @returns {string} Link final formatado para o WhatsApp com mensagens contextualizadas
 */
function getWhatsAppLink(trackingSource) {
    const phoneNumber = '554892224058'; // Número de Santa Catarina (DDD 48) solicitado pelo cliente
    const text = encodeURIComponent(
        `Olá, Douglas Oliver! Gostaria de obter mais informações sobre os tratamentos e agendar uma sessão. (Origem: ${trackingSource})`
    );
    return `https://wa.me/${phoneNumber}?text=${text}`;
}

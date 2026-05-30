/* 
========================================================================
   TERAPEUTA DOUGLAS OLIVER - TRACKING SYSTEM (TRAFFIC CONVERSION HELPER)
========================================================================
This script simulates analytics event dispatching (e.g. Meta Pixel, Google Tags).
It helps check if buttons and CTAs are correctly firing tracking hooks, crucial
for paid traffic landing pages.
*/

document.addEventListener('DOMContentLoaded', () => {
    initTrafficTracking();
});

/**
 * Main tracking initializer
 */
function initTrafficTracking() {
    console.log('%c🎯 Douglas Oliver Pixel: Ativado e Monitorando Tráfego Pago.', 'color: #2D3E32; font-weight: bold; font-size: 11px; background-color: #FAF9F6; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(45, 62, 50, 0.1);');

    // 1. Track WhatsApp Conversions
    document.body.addEventListener('click', (e) => {
        const ctaElement = e.target.closest('a[href*="wa.me"], a[href*="whatsapp.com"], .btn-whatsapp, .whatsapp-floating');
        
        if (ctaElement) {
            let eventLabel = 'Geral';
            
            // Deduce source based on element classes or text
            if (ctaElement.classList.contains('whatsapp-floating')) {
                eventLabel = 'Botão Flutuante (Flutuador)';
            } else if (ctaElement.closest('.hero')) {
                eventLabel = 'Hero Section (Página Principal)';
            } else if (ctaElement.closest('.service-card')) {
                const titleElement = ctaElement.closest('.service-card').querySelector('.service-card-title');
                const titleText = titleElement ? titleElement.innerText : 'Serviço Desconhecido';
                eventLabel = `Catálogo - ${titleText}`;
            } else if (ctaElement.closest('.pricing-banner')) {
                eventLabel = 'Banner Promocional de Pacotes';
            } else if (ctaElement.closest('.footer')) {
                eventLabel = 'Rodapé da Página';
            }

            dispatchTrackingEvent('Lead', {
                method: 'WhatsApp',
                position: eventLabel,
                url: window.location.href,
                time: new Date().toISOString()
            });
        }
    });

    // 2. Track "Ver Detalhes" Click on Service Modalities (InitiateCheckout Sim)
    document.body.addEventListener('click', (e) => {
        const detailsBtn = e.target.closest('a[href*="servicos.html"]');
        if (detailsBtn && !detailsBtn.href.includes('#')) {
            dispatchTrackingEvent('InitiateCheckout', {
                destination: 'Página de Serviços',
                triggerText: detailsBtn.innerText.trim(),
                url: window.location.href
            });
        }
    });

    // 3. Track Articles Click (ViewContent)
    document.body.addEventListener('click', (e) => {
        const articleLink = e.target.closest('.post-card-link, .post-card-title a');
        if (articleLink) {
            const card = articleLink.closest('.post-card');
            const title = card ? card.querySelector('.post-card-title').innerText.trim() : 'Artigo';
            
            dispatchTrackingEvent('ViewContent', {
                contentType: 'Artigo do Blog',
                contentName: title,
                url: window.location.href
            });
        }
    });
}

/**
 * Fires custom stylized telemetry signal to console.
 * In a real environment, this connects to `fbq('track', eventName, params)` or `gtag('event', ...)`
 * @param {string} eventName - Standard Pixel event name (e.g. Lead, ViewContent, InitiateCheckout)
 * @param {object} params - Custom key-value pairs representing context
 */
function dispatchTrackingEvent(eventName, params) {
    const eventStyles = {
        Lead: 'background: #25D366; color: white;',
        InitiateCheckout: 'background: #A99260; color: white;',
        ViewContent: 'background: #2D3E32; color: white;',
        Contact: 'background: #4A5F51; color: white;'
    };

    const style = eventStyles[eventName] || 'background: #637267; color: white;';

    console.groupCollapsed(
        `%c TELEMETRIA %c Evento disparado: ${eventName}`,
        'background: #1E221F; color: #FAF9F6; font-weight: bold; padding: 2px 5px; border-radius: 3px 0 0 3px;',
        `${style} font-weight: bold; padding: 2px 5px; border-radius: 0 3px 3px 0;`
    );
    console.log('Parâmetros do Rastreamento:', params);
    console.log('Instrução de Integração: Para enviar ao Meta Pixel real, integre com fbq("track", "' + eventName + '", ' + JSON.stringify(params) + ');');
    console.groupEnd();
}

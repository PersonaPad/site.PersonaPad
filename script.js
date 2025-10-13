// Variáveis globais
let currentClientType = 'cpf';

// Mensagens personalizadas para WhatsApp
const whatsappMessages = {
    cpf: "Olá, quero conhecer os modelos de mousepads da Personapad e fazer minha primeira compra. Pode me mostrar as opções disponíveis e me explicar as vantagens?",
    cnpj: "Olá, sou de uma empresa e gostaria de conhecer os modelos de mousepads da Personapad para avaliar um pedido corporativo. Pode me mostrar as opções e condições especiais para empresas?"
};

// Número do WhatsApp
const whatsappNumber = "5511988527514";

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function() {
    initializeClientSelector();
    initializeWhatsAppButtons();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeVideoPlayer();
    initializeVideoCta();
});

// Inicializar seletor de cliente (CPF/CNPJ)
function initializeClientSelector() {
    const clientButtons = document.querySelectorAll('.client-btn');
    
    clientButtons.forEach(button => {
        button.addEventListener('click', function() {
            clientButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentClientType = this.dataset.client;
            updateButtonsForClientType();
        });
    });
}

// Atualizar botões baseado no tipo de cliente
function updateButtonsForClientType() {
    const cpfActions = document.querySelectorAll('.cpf-action');
    const cnpjActions = document.querySelectorAll('.cnpj-action');
    
    if (currentClientType === 'cpf') {
        cpfActions.forEach(btn => {
            btn.style.display = 'flex';
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Comprar';
        });
        cnpjActions.forEach(btn => btn.style.display = 'none');
    } else {
        cpfActions.forEach(btn => btn.style.display = 'none');
        cnpjActions.forEach(btn => {
            btn.style.display = 'flex';
            btn.innerHTML = '<i class="fas fa-calculator"></i> Orçar';
        });
    }
}

// Inicializar botões do WhatsApp
function initializeWhatsAppButtons() {
    // Botão flutuante do WhatsApp
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            openWhatsApp();
        });
    }
    
    // Botões de ação nos produtos
    const productButtons = document.querySelectorAll('.btn-produto');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.produto-card');
            const productName = productCard.querySelector('h3').textContent;
            openWhatsApp(productName);
        });
    });

    // Botão específico da seção "Nossas Linhas"
    const nossasLinhasBtn = document.querySelector('.btn-nossas-linhas');
    if (nossasLinhasBtn) {
        nossasLinhasBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp(); // usa a mensagem do tipo de cliente atual
        });
    }

    // Botões CTA no hero (exceto o do vídeo)
    const ctaButtons = document.querySelectorAll(".hero-cta .cta-btn");
    ctaButtons.forEach(button => {
        if (button.classList.contains("primary") || button.classList.contains("secondary") || button.classList.contains("outline")) {
            button.addEventListener("click", function() {
                openWhatsApp();
            });
        }
    });
    
    // Botões de contato
    const contactButtons = document.querySelectorAll('.contato-btn');
    contactButtons.forEach(button => {
        if (button.href && button.href.includes('wa.me')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openWhatsApp();
            });
        }
    });
    
    // Links do WhatsApp no header e outros locais
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openWhatsApp();
        });
    });
}

// Abrir WhatsApp com mensagem personalizada
function openWhatsApp(productName = '') {
    let message = whatsappMessages[currentClientType];
    
    if (productName) {
        if (currentClientType === 'cpf') {
            message = `Olá 👋, tenho interesse no produto "${productName}" para uso pessoal. Pode me ajudar com mais informações?`;
        } else {
            message = `Olá 👋, sou de uma empresa e gostaria de fazer um orçamento do produto "${productName}". Pode me ajudar?`;
        }
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Inicializar efeitos de scroll
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll para links de navegação
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Inicializar menu mobile
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Animações de entrada
function initializeAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    const animateElements = document.querySelectorAll('.produto-card, .diferencial, .avaliacao-card, .logistica-item');
    animateElements.forEach(el => observer.observe(el));
}

window.addEventListener('load', initializeAnimations);

// Player de vídeo com thumbnail
function initializeVideoPlayer() {
    const videoThumbnailWrapper = document.querySelector(".video-thumbnail-wrapper");
    const playButton = document.querySelector(".play-button");
    const youtubePlayerDiv = document.querySelector(".youtube-player");
    const videoId = youtubePlayerDiv ? youtubePlayerDiv.dataset.videoid : null;

    if (videoThumbnailWrapper && playButton && youtubePlayerDiv && videoId) {
        playButton.addEventListener("click", function() {
            videoThumbnailWrapper.style.display = "none";
            
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute("title", "PersonaPad - Processo de Fabricação");
            
            youtubePlayerDiv.appendChild(iframe);
            youtubePlayerDiv.style.display = "block";
        });
    }
}

// CTA do vídeo
function initializeVideoCta() {
    const whatsappVideoCta = document.querySelector(".whatsapp-video-cta");
    if (whatsappVideoCta) {
        whatsappVideoCta.addEventListener("click", function() {
            openWhatsApp();
        });
    }
}

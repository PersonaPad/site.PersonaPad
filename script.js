// PersonaPad Website JavaScript - Versão com Carrinho Completo

document.addEventListener("DOMContentLoaded", function() {
    // Client Type Selector
    const clientButtons = document.querySelectorAll(".client-btn");
    const cpfActions = document.querySelectorAll(".cpf-action");
    const cnpjActions = document.querySelectorAll(".cnpj-action");
    
    // Cart Elements
    const cartIcon = document.querySelector(".cart-icon");
    const cartModal = document.getElementById("cartModal");
    const closeCartBtn = document.getElementById("closeCart");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElement = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCart");
    const checkoutCartBtn = document.getElementById("checkoutCart");
    const cartCountElement = document.querySelector(".cart-count");
    
    // Initialize client type and cart
    let currentClientType = "cpf";
    let cart = JSON.parse(localStorage.getItem("personapadCart")) || [];
    
    // Product data
    const products = {
        "mousepad-22x20": {
            id: "mousepad-22x20",
            name: "Mousepad 22 x 20 cm",
            price: 15.90,
            image: "small"
        },
        "mousepad-70x30": {
            id: "mousepad-70x30",
            name: "Mousepad 70 x 30 cm",
            price: 39.90,
            image: "large"
        },
        "hero-mousepad": {
            id: "hero-mousepad",
            name: "Mousepad Padrão",
            price: 29.90,
            image: "default"
        }
    };
    
    // Cart Functions
    function saveCart() {
        localStorage.setItem("personapadCart", JSON.stringify(cart));
        updateCartCount();
        updateCartDisplay();
    }
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? "flex" : "none";
        }
    }
    
    function addToCart(productId) {
        const product = products[productId];
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        saveCart();
        showNotification(`${product.name} adicionado ao carrinho!`, "success");
        
        // Animate cart icon
        if (cartIcon) {
            cartIcon.style.transform = "scale(1.2)";
            setTimeout(() => {
                cartIcon.style.transform = "scale(1)";
            }, 200);
        }
    }
    
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const item = cart[itemIndex];
            cart.splice(itemIndex, 1);
            saveCart();
            showNotification(`${item.name} removido do carrinho.`, "info");
        }
    }
    
    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                saveCart();
            }
        }
    }
    
    function clearCart() {
        cart = [];
        saveCart();
        showNotification("Carrinho limpo!", "info");
    }
    
    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function formatPrice(price) {
        return `R$ ${price.toFixed(2).replace(".", ",")}`;
    }
    
    function updateCartDisplay() {
        if (!cartItemsContainer || !cartTotalElement) return;
        
        cartItemsContainer.innerHTML = "";
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                    <p>Seu carrinho está vazio</p>
                    <p style="font-size: 14px; margin-top: 8px;">Adicione produtos para começar suas compras!</p>
                </div>
            `;
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement("div");
                cartItem.className = "cart-item";
                cartItem.innerHTML = `
                    <div class="cart-item-image"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${formatPrice(item.price)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        
        cartTotalElement.textContent = formatPrice(calculateTotal());
    }
    
    function openCart() {
        updateCartDisplay();
        cartModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
    
    function closeCart() {
        cartModal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
    
    // Make functions global for onclick handlers
    window.updateQuantity = updateQuantity;
    window.removeFromCart = removeFromCart;
    
    // Event Listeners
    
    // Client type switching
    clientButtons.forEach(button => {
        button.addEventListener("click", function() {
            const clientType = this.dataset.client;
            
            // Update active button
            clientButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Update current client type
            currentClientType = clientType;
            
            // Show/hide appropriate actions
            if (clientType === "cpf") {
                cpfActions.forEach(action => action.style.display = "flex");
                cnpjActions.forEach(action => action.style.display = "none");
            } else {
                cpfActions.forEach(action => action.style.display = "none");
                cnpjActions.forEach(action => action.style.display = "flex");
            }
        });
    });
    
    // Cart icon click
    if (cartIcon) {
        cartIcon.addEventListener("click", openCart);
    }
    
    // Close cart
    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCart);
    }
    
    // Close cart when clicking outside
    if (cartModal) {
        cartModal.addEventListener("click", function(e) {
            if (e.target === cartModal) {
                closeCart();
            }
        });
    }
    
    // Clear cart
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function() {
            if (confirm("Tem certeza que deseja limpar o carrinho?")) {
                clearCart();
            }
        });
    }
    
    // Checkout
    if (checkoutCartBtn) {
        checkoutCartBtn.addEventListener("click", function() {
            if (cart.length === 0) {
                showNotification("Adicione produtos ao carrinho primeiro!", "warning");
                return;
            }
            
            // Create WhatsApp message with cart items
            let message = "Olá! Gostaria de finalizar minha compra:\\n\\n";
            message += "*Itens do Carrinho:*\\n";
            
            cart.forEach(item => {
                message += `• ${item.name} - Qtd: ${item.quantity} - ${formatPrice(item.price * item.quantity)}\\n`;
            });
            
            message += `\\n*Total: ${formatPrice(calculateTotal())}*\\n\\n`;
            message += "Aguardo informações sobre pagamento e entrega. Obrigado!";
            
            const whatsappUrl = `https://wa.me/5511973497047?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, "_blank");
            
            closeCart();
        });
    }
    
    // Buy buttons (CPF)
    const buyButtons = document.querySelectorAll(".cpf-action .btn-produto, .hero-cta .cpf-action");
    buyButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            
            const productCard = this.closest(".produto-card");
            let productId;
            
            if (productCard) {
                productId = productCard.dataset.productId;
            } else {
                // Hero section button
                productId = "hero-mousepad";
            }
            
            if (productId && products[productId]) {
                addToCart(productId);
            }
        });
    });
    
    // Quote buttons (CNPJ)
    const quoteButtons = document.querySelectorAll(".cnpj-action .btn-produto, .hero-cta .cnpj-action");
    quoteButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            
            const productCard = this.closest(".produto-card");
            const productName = productCard ? 
                productCard.querySelector("h3").textContent : 
                "Mousepad Padrão";
            
            const whatsappUrl = `https://wa.me/5511973497047?text=Olá! Gostaria de solicitar um orçamento para: ${encodeURIComponent(productName)}`;
            window.open(whatsappUrl, "_blank");
        });
    });
    
    // Custom product consultation
    const consultButtons = document.querySelectorAll(".produto-card.custom .btn-produto");
    consultButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();
            const whatsappUrl = "https://wa.me/5511973497047?text=Olá! Gostaria de consultar sobre tamanhos personalizados de mousepad.";
            window.open(whatsappUrl, "_blank");
        });
    });
    
    // WhatsApp buttons
    const whatsappButtons = document.querySelectorAll("[href*=\"wa.me\"], .cta-btn.outline");
    whatsappButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            if (this.classList.contains("outline")) {
                e.preventDefault();
                const whatsappUrl = "https://wa.me/5511973497047?text=Olá! Gostaria de saber mais sobre os mousepads da PersonaPad.";
                window.open(whatsappUrl, "_blank");
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("click", function() {
            navMenu.classList.toggle("active");
            this.classList.toggle("active");
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll("a[href^=\"#\"]");
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector(".header").offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains("active")) {
                    navMenu.classList.remove("active");
                    mobileMenuToggle.classList.remove("active");
                }
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector(".header");
    let lastScrollTop = 0;
    
    window.addEventListener("scroll", function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                entry.target.classList.add("fade-in-up");
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(".produto-card, .diferencial, .logistica-item, .contato-item");
    
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(element);
    });
    
    // Product card hover effects
    const productCards = document.querySelectorAll(".produto-card");
    
    productCards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-8px)";
        });
        
        card.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(-4px)";
        });
    });
    
    // Utility functions
    function showNotification(message, type = "info") {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll(".notification");
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: "#2ed573",
            error: "#ff4757",
            warning: "#ffa502",
            info: "#00d4ff"
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = "translateX(0)";
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = "translateX(400px)";
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimized scroll handler
    const optimizedScrollHandler = debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }, 10);
    
    window.addEventListener("scroll", optimizedScrollHandler);
    
    // Accessibility improvements
    document.addEventListener("keydown", function(e) {
        // ESC key closes mobile menu and cart
        if (e.key === "Escape") {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                mobileMenuToggle.classList.remove("active");
            }
            if (cartModal && cartModal.classList.contains("active")) {
                closeCart();
            }
        }
    });
    
    // Focus management for mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Initialize cart on page load
    updateCartCount();
    
    console.log("PersonaPad website loaded successfully!");
    console.log(`Cart initialized with ${cart.length} items`);
});

// Additional CSS animations via JavaScript
const additionalStyles = `
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media print {
        .header, .footer, .cart-modal {
            display: none !important;
        }
        
        .section {
            page-break-inside: avoid;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


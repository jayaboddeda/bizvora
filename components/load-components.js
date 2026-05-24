/**
 * Component Loader
 * Loads HTML components and inserts them into the page
 */
(function() {
  'use strict';

  /**
   * Load a component file and insert it into the target element
   * @param {string} componentPath - Path to the component HTML file
   * @param {string} targetSelector - CSS selector for the target element
   * @param {Function} callback - Optional callback function after loading
   */
  function loadComponent(componentPath, targetSelector, callback) {
    const target = document.querySelector(targetSelector);
    
    if (!target) {
      console.warn('Target element not found:', targetSelector);
      return;
    }

    fetch(componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        target.innerHTML = html;
        
        // Execute scripts in the loaded HTML
        const scripts = target.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        if (callback && typeof callback === 'function') {
          callback();
        }
      })
      .catch(error => {
        console.error('Error loading component:', componentPath, error);
      });
  }

  /**
   * Set active menu item based on current page
   */
  function setActiveMenuItem() {
    // Get current page as an extensionless name (clean URLs).
    // '/about' -> 'about', '/about.html' -> 'about', '/' or '' -> 'index'
    const currentPage = (window.location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';

    // Define solution detail pages (extensionless to match clean URLs)
    const solutionDetailPages = [
      'strategic-documentation',
      'political-strategy-research',
      'digital-traditional-marketing',
      'marketing-branding-solutions',
      'organizational-analysis-development',
      'strategic-consulting-excellence',
      'manufacturing-business-setup',
      'supply-chain-management-systems'
    ];
    
    // Check if current page is a solution detail page
    const isSolutionDetailPage = solutionDetailPages.includes(currentPage);
    
    // Find all navigation menus (desktop and mobile)
    const navMenus = document.querySelectorAll('.mainmenu ul, .mobile_menu ul');
    
    navMenus.forEach(menu => {
      const menuItems = menu.querySelectorAll('li');
      
      menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Remove any existing active classes
        item.classList.remove('current-menu-item', 'current-menu-ancestor');
        
        // If on a solution detail page, highlight Solutions menu as ancestor
        if (isSolutionDetailPage && href === 'solutions') {
          item.classList.add('current-menu-ancestor');
        }
        // If on the solutions page itself, highlight as current item
        else if (currentPage === 'solutions' && href === 'solutions') {
          item.classList.add('current-menu-item');
        }
        // Check if this link matches current page exactly (for other pages)
        else if (href === currentPage ||
            (currentPage === 'index' && href === 'index')) {
          item.classList.add('current-menu-item');
        }
      });
    });
  }

  /**
   * Load header component
   */
  function loadHeader() {
    loadComponent('components/header.html', '#header-placeholder', function() {
      console.log('Header loaded successfully');
      
      // Add h9-header class only on the homepage
      const currentPage = (window.location.pathname.split('/').pop() || 'index').replace(/\.html$/, '') || 'index';
      if (currentPage === 'index') {
        const mainHeader = document.querySelector('.header-area:not(.header-duplicate)');
        if (mainHeader) {
          mainHeader.classList.add('h9-header');
        }
      }
      
      // Set active menu item after header is loaded
      setActiveMenuItem();
      
      // Initialize mobile menu after header is loaded
      if (window.initMobileMenu && typeof window.initMobileMenu === 'function') {
        // Use setTimeout to ensure DOM is fully updated
        setTimeout(function() {
          window.initMobileMenu();
          // Set active menu item again after mobile menu is initialized
          setTimeout(function() {
            setActiveMenuItem();
          }, 200);
        }, 100);
      } else {
        // If meanmenu initializes automatically, set active menu after a delay
        setTimeout(function() {
          setActiveMenuItem();
        }, 500);
      }
    });
  }

  /**
   * Load footer component
   */
  function loadFooter() {
    loadComponent('components/footer.html', '#footer-placeholder', function() {
      console.log('Footer loaded successfully');
    });
  }

  /**
   * Load contact section component
   */
  function loadContactSection() {
    loadComponent('components/contact-section.html', '#contact-section-placeholder', function() {
      console.log('Contact section loaded successfully');
    });
  }

  /**
   * Load contact modal component
   */
  function loadContactModal() {
    loadComponent('components/contact-modal.html', '#contact-modal-placeholder', function() {
      console.log('Contact modal loaded successfully');
    });
  }

  /**
   * Inject a floating WhatsApp button directly into <body>.
   * Appending to body (not a component placeholder) ensures position:fixed
   * is relative to the viewport, not a transformed ancestor.
   */
  function loadWhatsAppButton() {
    if (document.querySelector('.whatsapp-float')) {
      return;
    }

    var style = document.createElement('style');
    style.textContent =
      '.whatsapp-float{position:fixed;right:25px;bottom:25px;width:56px;height:56px;' +
      'background:#25D366;color:#fff;border-radius:50%;display:flex;align-items:center;' +
      'justify-content:center;font-size:30px;z-index:9999;' +
      'box-shadow:0 4px 14px rgba(0,0,0,.25);' +
      'transition:transform .25s ease,box-shadow .25s ease;' +
      'animation:whatsapp-pulse 2s infinite;}' +
      '.whatsapp-float:hover{color:#fff;transform:scale(1.1);' +
      'box-shadow:0 6px 20px rgba(0,0,0,.35);}' +
      '@keyframes whatsapp-pulse{' +
      '0%{box-shadow:0 4px 14px rgba(0,0,0,.25),0 0 0 0 rgba(37,211,102,.6);}' +
      '70%{box-shadow:0 4px 14px rgba(0,0,0,.25),0 0 0 16px rgba(37,211,102,0);}' +
      '100%{box-shadow:0 4px 14px rgba(0,0,0,.25),0 0 0 0 rgba(37,211,102,0);}}' +
      '@media (max-width:575px){.whatsapp-float{right:16px;bottom:16px;' +
      'width:50px;height:50px;font-size:26px;}}';
    document.head.appendChild(style);

    var link = document.createElement('a');
    link.href = 'https://wa.me/918500888238';
    link.className = 'whatsapp-float';
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', 'Chat with us on WhatsApp');
    link.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(link);
  }

  // Auto-load components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadHeader();
      loadFooter();
      loadWhatsAppButton();

      // Auto-load contact section if placeholder exists
      if (document.querySelector('#contact-section-placeholder')) {
        loadContactSection();
      }
      
      // Auto-load contact modal if placeholder exists
      if (document.querySelector('#contact-modal-placeholder')) {
        loadContactModal();
      }
    });
  } else {
    // DOM is already ready
    loadHeader();
    loadFooter();
    loadWhatsAppButton();

    // Auto-load contact section if placeholder exists
    if (document.querySelector('#contact-section-placeholder')) {
      loadContactSection();
    }
    
    // Auto-load contact modal if placeholder exists
    if (document.querySelector('#contact-modal-placeholder')) {
      loadContactModal();
    }
  }

  // Export functions for manual loading if needed
  window.ComponentLoader = {
    loadComponent: loadComponent,
    loadHeader: loadHeader,
    loadFooter: loadFooter,
    loadContactSection: loadContactSection,
    loadContactModal: loadContactModal,
    loadWhatsAppButton: loadWhatsAppButton,
    setActiveMenuItem: setActiveMenuItem
  };

})();


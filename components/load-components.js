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
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Define solution detail pages
    const solutionDetailPages = [
      'strategic-documentation.html',
      'political-strategy-research.html',
      'digital-traditional-marketing.html',
      'marketing-branding-solutions.html',
      'organizational-analysis-development.html',
      'strategic-consulting-excellence.html',
      'manufacturing-business-setup.html',
      'supply-chain-management-systems.html'
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
        if (isSolutionDetailPage && href === 'solutions.html') {
          item.classList.add('current-menu-ancestor');
        }
        // If on solutions.html itself, highlight as current item
        else if (currentPage === 'solutions.html' && href === 'solutions.html') {
          item.classList.add('current-menu-item');
        }
        // Check if this link matches current page exactly (for other pages)
        else if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage.includes('index') && href === 'index.html')) {
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
      
      // Add h9-header class only on index.html
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (currentPage === 'index.html' || currentPage === '') {
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

  // Auto-load components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadHeader();
      loadFooter();
      
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
    setActiveMenuItem: setActiveMenuItem
  };

})();


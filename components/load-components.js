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
    
    // Find all navigation menus
    const navMenus = document.querySelectorAll('.mainmenu ul');
    
    navMenus.forEach(menu => {
      const menuItems = menu.querySelectorAll('li');
      
      menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Remove any existing active classes
        item.classList.remove('current-menu-item', 'current-menu-ancestor');
        
        // Check if this link matches current page
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage.includes('index') && href === 'index.html')) {
          item.classList.add('current-menu-ancestor');
        } else if (href === currentPage) {
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

  // Auto-load components when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      loadHeader();
      loadFooter();
    });
  } else {
    // DOM is already ready
    loadHeader();
    loadFooter();
  }

  // Export functions for manual loading if needed
  window.ComponentLoader = {
    loadComponent: loadComponent,
    loadHeader: loadHeader,
    loadFooter: loadFooter,
    setActiveMenuItem: setActiveMenuItem
  };

})();


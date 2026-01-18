/**
 * Waheim SDK - Standalone Mode Detection & Drawer with Theme Support
 * Automatically opens drawer when app is not in standalone mode
 * Adapts to device light/dark theme preference
 */

((window) => {
  // Utility functions
  const utils = {
    // Check if app is in standalone mode
    isStandalone: () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      (window.navigator.userAgent &&
        window.navigator.userAgent.includes('wv')) === false,

    // Check if running on mobile
    isMobile: () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        window.navigator.userAgent,
      ),

    // Check if device prefers dark mode
    isDarkMode: () => window.matchMedia('(prefers-color-scheme: dark)').matches,

    // Get theme colors based on device preference
    getThemeColors: function () {
      const isDark = this.isDarkMode();
      return {
        background: isDark ? 'hsl(0 0% 3.9%)' : 'hsl(0 0% 100%)',
        foreground: isDark ? 'hsl(0 0% 98%)' : 'hsl(0 0% 3.9%)',
        muted: isDark ? 'hsl(0 0% 15%)' : 'hsl(0 0% 98%)',
        mutedForeground: isDark ? 'hsl(0 0% 64%)' : 'hsl(0 0% 46%)',
        border: isDark ? 'hsl(0 0% 15%)' : 'hsl(0 0% 89.8%)',
        input: isDark ? 'hsl(0 0% 9%)' : 'hsl(0 0% 98%)',
        ring: isDark ? 'hsl(0 0% 64%)' : 'hsl(0 0% 46%)',
        overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
        handle: isDark ? 'hsl(0 0% 25%)' : 'hsl(0 0% 88%)',
        gradient: isDark
          ? 'linear-gradient(135deg, hsl(262.1 83.3% 57.8%) 0%, hsl(262.1 83.3% 57.8% / 0.6) 100%)'
          : 'linear-gradient(135deg, hsl(262.1 83.3% 57.8%) 0%, hsl(262.1 83.3% 57.8% / 0.8) 100%)',
      };
    },

    // Load manifest and get app info
    loadManifest: async () => {
      try {
        const response = await fetch('/manifest.json');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const manifest = await response.json();
        console.log('[Waheim SDK] Manifest loaded:', manifest);
        return manifest;
      } catch (error) {
        console.warn('[Waheim SDK] Could not load manifest:', error);
        // Return default manifest
        return {
          name: 'React PWA',
          short_name: 'ReactPWA',
          icons: [{ src: '/favicon.png', sizes: '192x192', type: 'image/png' }],
        };
      }
    },

    // Get app icon URL from manifest
    getAppIcon: async function (size = 192) {
      try {
        const manifest = await this.loadManifest();
        if (!manifest || !manifest.icons) {
          console.warn('[Waheim SDK] No icons in manifest, using fallback');
          return this.createFallbackIcon();
        }

        // Find best icon size
        let icon = manifest.icons.find(
          (i) => i.sizes && i.sizes.split(' ').includes(`${size}x${size}`),
        );

        if (!icon) {
          // Try to find an icon with the desired size
          icon = manifest.icons.find(
            (i) => i.sizes && i.sizes.includes(size.toString()),
          );
        }

        if (!icon) {
          // Fallback to any available icon
          icon = manifest.icons[0];
        }

        if (!icon) {
          console.warn('[Waheim SDK] No valid icon found, using fallback');
          return this.createFallbackIcon();
        }

        // Test if icon exists
        const response = await fetch(icon.src, { method: 'HEAD' });
        if (!response.ok) {
          console.warn('[Waheim SDK] Icon not found, using fallback');
          return this.createFallbackIcon();
        }

        return icon.src;
      } catch (error) {
        console.warn('[Waheim SDK] Error loading app icon:', error);
        return this.createFallbackIcon();
      }
    },

    // Create fallback icon
    createFallbackIcon: () => {
      // Create a data URL with a simple icon
      const svgIcon = `
        <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="192" height="192" rx="32"/>
          <path d="M96 48C80 48 64 56 56 68C48 80 48 96 48 112H64C64 96 64 80 72 68C80 56 88 48 96 48V48Z" fill="white"/>
          <circle cx="96" cy="96" r="32" fill="white"/>
          <circle cx="96" cy="96" r="16"/>
        </svg>
      `;

      return 'data:image/svg+xml;base64,' + btoa(svgIcon);
    },

    // Generate unique ID
    generateId: (prefix) =>
      prefix + '_' + Math.random().toString(36).substr(2, 9),

    // Debounce function
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction() {
        const args = arguments;
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  };

  // Drawer Component
  const Drawer = {
    isOpen: false,
    element: null,
    overlay: null,
    content: null,
    themeListener: null,

    // Create drawer HTML with theme support
    create: async function (options = {}) {
      const id = utils.generateId('waheim-drawer');
      const overlayId = utils.generateId('waheim-overlay');
      const colors = utils.getThemeColors();

      // Get app info from manifest
      const manifest = await utils.loadManifest();
      const appIcon = await utils.getAppIcon();
      const appName = manifest
        ? manifest.short_name || manifest.name
        : 'This App';

      // Get app URL from window.location
      const appUrl = window.location.hostname;

      // Default options
      const config = {
        title: `Install ${appName}`,
        description: `Get best experience by installing ${appName} on your device.`,
        buttonText: `Install ${appName}`,
        position: 'bottom',
        ...options,
      };

      // Create drawer HTML with theme colors
      const drawerHTML = `
        <div id="${overlayId}" class="waheim-overlay" style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${colors.overlay};
          z-index: 9998;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
          backdrop-filter: blur(8px);
        "></div>
        
        <div id="${id}" class="waheim-drawer" style="
          position: fixed;
          ${config.position === 'bottom' ? 'bottom: 0; left: 0; right: 0;' : 'top: 0; left: 0; right: 0;'}
          background: ${colors.background};
          z-index: 9999;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 90vh;
          overflow-y: auto;
          border-radius: ${config.position === 'bottom' ? '12px 12px 0 0' : '0 0 12px 12px'};
          box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.12);
          border: 1px solid ${colors.border};
        ">
          <div style="
            padding: 20px 24px 24px;
            max-width: 440px;
            margin: 0 auto;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <!-- Handle -->
            <div style="
              width: 100px;
              height: 8px;
              background: ${colors.handle};
              border-radius: 9999px;
              margin: 0px auto 20px;
              cursor: pointer;
              transition: background 0.2s ease;
            " onclick="window.waheimSDK.closeDrawer()" 
            onmouseover="this.style.background='${colors.mutedForeground}'" 
            onmouseout="this.style.background='${colors.handle}'"></div>
            
            <!-- Apple Store Style App Tag -->
            <div style="
              background: ${colors.background};
              border: 1px solid ${colors.border};
              border-radius: 16px;
              padding: 16px;
              margin-bottom: 32px;
              display: flex;
              align-items: center;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            ">
              <!-- App Icon -->
              <img src="${appIcon}" alt="${appName}" style="
                width: 60px;
                height: 60px;
                border-radius: 12px;
                margin-right: 16px;
                object-fit: cover;
                background: ${colors.muted};
                border: 1px solid ${colors.border};
              " onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHJ4PSIxMiIgZmlsbD0iIzYxZGFmYiIvPgogIDxwYXRoIGQ9Ik0zMCAxNUMyNSAxNSAyMCAxOCAxNy4gMjJDMTQgMjYgMTQgMzAgMTQgMzZIMTlDMTkgMzAgMTkgMjYgMjEgMjJDMjMgMTggMjYgMTUgMzAgMTVWMTVaIiBmaWxsPSJ3aGl0ZSIvPgogIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPgogIDxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjUiIGZpbGw9IiM2MWRhZmIiLz4KPC9zdmc+';">
              
              <!-- App Info -->
              <div style="flex: 1;">
                <span style="
                  display: block;
                  font-size: 16px;
                  font-weight: 600;
                  color: ${colors.foreground};
                  margin-bottom: 2px;
                  line-height: 1.2;
                ">${appName}</span>
                <span style="
                  display: block;
                  font-size: 13px;
                  color: ${colors.mutedForeground};
                  line-height: 1.2;
                ">${appUrl}</span>
              </div>
            </div>
            
            <!-- Installation Steps -->
            <div style="text-align: left; margin-bottom: 24px;">
              
              <!-- Step 1 -->
              <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                <div style="
                  background: ${colors.muted};
                  color: ${colors.foreground};
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 600;
                  margin-right: 12px;
                  flex-shrink: 0;
                ">1</div>
                <div style="flex: 1;">
                  <span style="
                    color: ${colors.foreground};
                    font-size: 14px;
                    line-height: 1.5;
                  ">Click 
                    <svg width="18" height="18" viewBox="0 0 256 256" style="display: inline-block; vertical-align: middle; margin: 0 2px; fill: #007AFF;">
                      <path d="M216,112v96a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V112A16,16,0,0,1,56,96H80a8,8,0,0,1,0,16H56v96H200V112H176a8,8,0,0,1,0-16h24A16,16,0,0,1,216,112ZM93.66,69.66,120,43.31V136a8,8,0,0,0,16,0V43.31l26.34,26.35a8,8,0,0,0,11.32-11.32l-40-40a8,8,0,0,0-11.32,0l-40,40A8,8,0,0,0,93.66,69.66Z"></path>
                    </svg> 
                    on menu of browser
                  </span>
                </div>
              </div>
              
              <!-- Step 2 -->
              <div style="display: flex; align-items: flex-start; margin-bottom: 16px;">
                <div style="
                  background: ${colors.muted};
                  color: ${colors.foreground};
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 600;
                  margin-right: 12px;
                  flex-shrink: 0;
                ">2</div>
                <div style="flex: 1;">
                  <span style="
                    color: ${colors.foreground};
                    font-size: 14px;
                    line-height: 1.5;
                  ">Scroll and select 
                    <code style="
                      background: ${colors.muted};
                      color: ${colors.foreground};
                      padding: 2px 6px;
                      border-radius: 4px;
                      font-size: 13px;
                      font-family: system-ui, -apple-system, sans-serif;
                      display: inline-flex;
                      align-items: center;
                      vertical-align: middle;
                      margin: 0 2px;
                    ">
                      <svg width="14" height="14" viewBox="0 0 256 256" style="margin-right: 4px; fill: #007AFF;">
                        <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Zm-32-80a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>
                      </svg>
                      Add to Home Screen
                    </code>
                  </span>
                </div>
              </div>
              
              <!-- Step 3 -->
              <div style="display: flex; align-items: flex-start;">
                <div style="
                  background: ${colors.muted};
                  color: ${colors.foreground};
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 12px;
                  font-weight: 600;
                  margin-right: 12px;
                  flex-shrink: 0;
                ">3</div>
                <div style="flex: 1;">
                  <span style="
                    color: ${colors.foreground};
                    font-size: 14px;
                    line-height: 1.5;
                  ">Open app 
                    <img src="${appIcon}" alt="${appName}" style="
                      width: 16px;
                      height: 16px;
                      border-radius: 4px;
                      display: inline-block;
                      vertical-align: middle;
                      margin: 0 2px;
                      background: ${colors.muted};
                      border: 1px solid ${colors.border};
                    " onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHJ4PSI0IiBmaWxsPSIjNjFkYWZiIi8+CiAgPHBhdGggZD0iTTggNEM2LjY3IDQgNS42NyA0LjY3IDUuMzMgNi41QzUgOC4zMyA1IDkuMzMgNSAxME44SDYuNjdDNi42NyA5LjMzIDYuNjcgOC4zMyA2LjY3IDYuNUM3IDQuNjcgNy4zMyA0IDggNFY0WiIgZmlsbD0id2hpdGUiLz4KICA8Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iMyIgZmlsbD0id2hpdGUiLz4KICA8Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iMS41IiBmaWxsPSIjNjFkYWZiIi8+Cjwvc3ZnPg==';">
                    from your home screen
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Insert into DOM
      document.body.insertAdjacentHTML('beforeend', drawerHTML);

      // Store references
      this.element = document.getElementById(id);
      this.overlay = document.getElementById(overlayId);
      this.content = this.element;

      // Add theme change listener
      this.addThemeListener();

      // Add event listeners
      this.addEventListeners(config);

      return this;
    },

    // Add theme change listener
    addThemeListener: function () {
      this.themeListener = (e) => {
        if (this.element) {
          this.updateTheme();
        }
      };

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', this.themeListener);
    },

    // Update theme colors
    updateTheme: function () {
      const colors = utils.getThemeColors();

      // Update overlay
      if (this.overlay) {
        this.overlay.style.background = colors.overlay;
      }

      // Update drawer background
      if (this.element) {
        this.element.style.background = colors.background;
        this.element.style.borderColor = colors.border;
      }

      // Update handle
      const handle = this.element.querySelector('div[onclick*="closeDrawer"]');
      if (handle) {
        handle.style.background = colors.handle;
      }

      // Update icon container
      const iconContainer = this.element.querySelector(
        'div[style*="overflow: hidden"]',
      );
      if (iconContainer) {
        iconContainer.style.background = colors.muted;
        iconContainer.style.borderColor = colors.border;
      }

      // Update fallback icon
      const fallbackIcon = iconContainer?.querySelector('svg');
      if (fallbackIcon) {
        fallbackIcon.style.stroke = colors.mutedForeground;
      }

      // Update text colors
      const title = this.element.querySelector('h3');
      if (title) {
        title.style.color = colors.foreground;
      }

      const description = this.element.querySelector('p');
      if (description) {
        description.style.color = colors.mutedForeground;
      }
    },

    // Add event listeners
    addEventListeners: function (config) {
      // Close on overlay click
      this.overlay.addEventListener('click', () => this.close());

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    },

    // Open drawer
    open: async function () {
      if (this.isOpen || !this.element) return;

      this.isOpen = true;

      // Show overlay
      this.overlay.style.opacity = '1';
      this.overlay.style.visibility = 'visible';

      // Show drawer with animation
      setTimeout(() => {
        this.element.style.transform = 'translateY(0)';
      }, 10);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    },

    // Close drawer
    close: function () {
      if (!this.isOpen || !this.element) return;

      this.isOpen = false;

      // Hide drawer
      this.element.style.transform = 'translateY(100%)';

      // Hide overlay
      this.overlay.style.opacity = '0';
      this.overlay.style.visibility = 'hidden';

      // Restore body scroll
      document.body.style.overflow = '';

      // Remove theme listener
      if (this.themeListener) {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', this.themeListener);
        this.themeListener = null;
      }

      // Remove from DOM after animation
      setTimeout(() => {
        if (this.element) {
          this.element.remove();
          this.element = null;
        }
        if (this.overlay) {
          this.overlay.remove();
          this.overlay = null;
        }
      }, 300);
    },
  };

  // Main SDK
  const WaheimSDK = {
    version: '1.0.0',
    drawer: Drawer,
    utils: utils,

    // Initialize SDK
    init: function (options = {}) {
      const config = {
        autoShow: true,
        delay: 2000,
        showOnce: true,
        ...options,
      };

      // Check if should show drawer
      if (config.autoShow && this.shouldShowDrawer(config)) {
        setTimeout(async () => {
          await this.showDrawer(config);
        }, config.delay);
      }

      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
      });

      return this;
    },

    // Check if should show drawer
    shouldShowDrawer: (config) => {
      console.log('[Waheim SDK] shouldShowDrawer check:');
      console.log('  - Standalone mode:', utils.isStandalone());
      console.log('  - Mobile:', utils.isMobile());
      console.log('  - Dark mode:', utils.isDarkMode());
      console.log('  - Mobile only:', config.mobileOnly);
      console.log('  - Show once:', config.showOnce);

      // Don't show if in standalone mode
      if (utils.isStandalone()) {
        console.log('  - ❌ Blocked: Running in standalone mode');
        return false;
      }

      // Don't show if not mobile (optional)
      if (config.mobileOnly && !utils.isMobile()) {
        console.log('  - ❌ Blocked: Not mobile and mobileOnly is true');
        return false;
      }

      // Check if already shown
      if (config.showOnce) {
        const shown = localStorage.getItem('waheim_drawer_shown');
        if (shown) {
          console.log('  - ❌ Blocked: Already shown before');
          return false;
        }
      }

      console.log('  - ✅ Should show drawer');
      return true;
    },

    // Show drawer
    showDrawer: async function (options = {}) {
      const drawerOptions = {
        title: 'Install This App',
        description:
          'Get best experience by installing this app on your device.',
        buttonText: 'Install App',
        ...options,
      };

      await this.drawer.create(drawerOptions);
      this.drawer.open();

      // Mark as shown
      if (options.showOnce !== false) {
        localStorage.setItem('waheim_drawer_shown', 'true');
      }

      return this;
    },

    // Close drawer
    closeDrawer: function () {
      this.drawer.close();
      return this;
    },

    // Force show drawer (for testing)
    forceShowDrawer: async function (options = {}) {
      console.log('[Waheim SDK] Force showing drawer...');
      return this.showDrawer({
        showOnce: false,
        ...options,
      });
    },

    // Check if standalone
    isStandalone: () => utils.isStandalone(),

    // Check if mobile
    isMobile: () => utils.isMobile(),

    // Check if dark mode
    isDarkMode: () => utils.isDarkMode(),
  };

  // Export to global scope
  window.WaheimSDK = WaheimSDK;
  window.waheimSDK = WaheimSDK;

  // Auto-initialize by default
  document.addEventListener('DOMContentLoaded', () => {
    // Debug info
    console.log('[Waheim SDK] Initializing...');
    console.log('[Waheim SDK] Standalone mode:', utils.isStandalone());
    console.log('[Waheim SDK] Mobile:', utils.isMobile());
    console.log('[Waheim SDK] Dark mode:', utils.isDarkMode());
    console.log('[Waheim SDK] User Agent:', window.navigator.userAgent);

    // Auto-initialize
    WaheimSDK.init();
  });

  // Also initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
  } else {
    // DOM is already loaded, initialize immediately
    console.log('[Waheim SDK] DOM already loaded, initializing immediately...');
    console.log('[Waheim SDK] Standalone mode:', utils.isStandalone());
    console.log('[Waheim SDK] Mobile:', utils.isMobile());
    console.log('[Waheim SDK] Dark mode:', utils.isDarkMode());
    WaheimSDK.init();
  }
})(window);

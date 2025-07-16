// src/services/webview/authBridge.ts

export const getAuthBridgeScript = (accessToken: string) => `
  (function() {
    // URL에서 액세스 토큰 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token') || '${accessToken}';

    if (tokenFromUrl) {
      localStorage.setItem('accessToken', tokenFromUrl);

      // fetch 요청에 토큰 자동 추가
      const originalFetch = window.fetch;
      window.fetch = function(url, options = {}) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          options.headers = {
            ...options.headers,
            'Authorization': 'Bearer ' + token
          };
        }
        return originalFetch(url, options);
      };

      // XMLHttpRequest에도 토큰 자동 추가
      const originalXHROpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        const result = originalXHROpen.apply(this, [method, url, ...args]);
        const token = localStorage.getItem('accessToken');
        if (token) {
          this.setRequestHeader('Authorization', 'Bearer ' + token);
        }
        return result;
      };
    }
    true;
  })();
`;

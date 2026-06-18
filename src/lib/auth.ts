/**
 * Admin authentication client-side helpers
 */

export const adminAuth = {
  // Login method that makes a secure server HTTP request
  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('bosque_admin_logged_in', 'true');
        sessionStorage.setItem('bosque_admin_username', data.username || 'Admin');
        sessionStorage.setItem('bosque_admin_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Credenciais inválidas.' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Ocorreu um erro ao comunicar com o servidor.' };
    }
  },

  // Check login state
  isAuthenticated(): boolean {
    return sessionStorage.getItem('bosque_admin_logged_in') === 'true';
  },

  // Logout method
  logout(): void {
    sessionStorage.removeItem('bosque_admin_logged_in');
    sessionStorage.removeItem('bosque_admin_username');
    sessionStorage.removeItem('bosque_admin_token');
  },

  // Retrieve logged-in administrator name
  getUsername(): string {
    return sessionStorage.getItem('bosque_admin_username') || 'Administrador';
  }
};

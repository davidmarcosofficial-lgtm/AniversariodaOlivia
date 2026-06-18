import { supabase, isSupabaseConfigured } from './supabase';

export const adminAuth = {
  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    try {
      if (!isSupabaseConfigured || !supabase) {
        return {
          success: false,
          message: 'Supabase não está configurado corretamente.'
        };
      }

      const email = username.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.session) {
        return {
          success: false,
          message: 'E-mail ou senha incorretos.'
        };
      }

      sessionStorage.setItem('bosque_admin_logged_in', 'true');
      sessionStorage.setItem('bosque_admin_username', data.user.email || 'Admin');
      sessionStorage.setItem('bosque_admin_token', data.session.access_token);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message: 'Ocorreu um erro ao comunicar com o Supabase.'
      };
    }
  },

  isAuthenticated(): boolean {
    return sessionStorage.getItem('bosque_admin_logged_in') === 'true';
  },

  async logout(): Promise<void> {
    sessionStorage.removeItem('bosque_admin_logged_in');
    sessionStorage.removeItem('bosque_admin_username');
    sessionStorage.removeItem('bosque_admin_token');

    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  getUsername(): string {
    return sessionStorage.getItem('bosque_admin_username') || 'Administrador';
  }
};

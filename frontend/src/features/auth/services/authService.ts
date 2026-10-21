import { http, setToken, removeToken, setStoredUser } from '../../common/http';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../domain/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const data = await http.post<AuthResponse>('/auth/login', credentials);
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async register(registrationData: RegisterRequest): Promise<AuthResponse> {
    const data = await http.post<AuthResponse>('/auth/register', registrationData);
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async getProfile(): Promise<{ user: User }> {
    return http.get<{ user: User }>('/auth/me');
  },

  logout(): void {
    removeToken();
  },
};

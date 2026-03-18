// API Configuration for connecting to Laravel backend
// Using relative path - relies on Vite proxy to forward to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Token storage
const TOKEN_KEY = 'videeko_token';
const USER_KEY = 'videeko_user';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Web Admin Login
  async webLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/web/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        // Handle unauthorized
        if (response.status === 401) {
          this.logout();
        }
        return {
          success: false,
          message: data.message || 'Une erreur est survenue',
          errors: data.errors,
        };
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Erreur de connexion au serveur',
      };
    }
  }

  // Producer endpoints
  async getProducers(params?: Record<string, string>): Promise<ApiResponse> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/producers${queryString}`);
  }

  async getProducer(id: number): Promise<ApiResponse> {
    return this.request(`/producers/${id}`);
  }

  async createProducer(data: Record<string, any>): Promise<ApiResponse> {
    return this.request('/producers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProducer(id: number, data: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/producers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProducer(id: number): Promise<ApiResponse> {
    return this.request(`/producers/${id}`, {
      method: 'DELETE',
    });
  }

  async getProducerStatistics(): Promise<ApiResponse> {
    return this.request('/producers/statistics');
  }

  // Inspection endpoints
  async getInspections(params?: Record<string, string>): Promise<ApiResponse> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/inspections${queryString}`);
  }

  async getInspection(id: number): Promise<ApiResponse> {
    return this.request(`/inspections/${id}`);
  }

  async createInspection(data: Record<string, any>): Promise<ApiResponse> {
    return this.request('/inspections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInspection(id: number, data: Record<string, any>): Promise<ApiResponse> {
    return this.request(`/inspections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteInspection(id: number): Promise<ApiResponse> {
    return this.request(`/inspections/${id}`, {
      method: 'DELETE',
    });
  }

  async getInspectionStatistics(): Promise<ApiResponse> {
    return this.request('/inspections/statistics');
  }

  async getInspectionsByProducer(codeProducteur: string): Promise<ApiResponse> {
    return this.request(`/inspections/producer/${codeProducteur}`);
  }

  // Dashboard
  async getDashboard(): Promise<ApiResponse> {
    return this.request('/dashboard');
  }
}

export const api = new ApiService();
export default api;
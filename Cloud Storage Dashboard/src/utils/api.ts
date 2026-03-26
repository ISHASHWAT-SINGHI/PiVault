/**
 * Central API utility for communication with the PiVault backend.
 * Uses relative paths to support deployment behind Nginx.
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

class ApiClient {
    private token: string | null = localStorage.getItem('pivault_token');

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('pivault_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('pivault_token');
    }

    private async request(path: string, options: RequestInit = {}) {
        const url = `${API_BASE}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (response.status === 401) {
                this.clearToken();
                window.location.href = '/login';
                throw new Error('Unauthorized');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error(`API Error (${path}):`, error);
            throw error;
        }
    }

    async get(path: string) {
        return this.request(path, { method: 'GET' });
    }

    async post(path: string, body: any) {
        return this.request(path, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
}

export const api = new ApiClient();

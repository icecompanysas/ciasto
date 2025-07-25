// auth.services.ts
interface User {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    rolesIds: string[];
  }
  
  class AuthService {
    private readonly baseURL = 'https://duvibackend.up.railway.app';
  
    async register(user: User) {
      try {
        const requestBody = {
          name: user.firstName,
          lastname: user.lastName,
          email: user.email,
          phone: user.phone,
          password: user.password,
          rolesIds: ['DRIVER', 'CLIENT']
        };
  
        console.log('URL completa:', `${this.baseURL}/auth/register`);
        console.log('Datos a enviar:', requestBody);
  
        const response = await fetch(`${this.baseURL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });
  
        // Verificar si la respuesta es JSON válido
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          return response.ok
            ? { success: true, ...data }
            : { success: false, error: data.message || 'Error del servidor' };
        } else {
          // Si no es JSON, manejamos el error apropiadamente
          const textResponse = await response.text();
          console.error('Respuesta no JSON:', textResponse);
          return {
            success: false,
            error: 'Respuesta del servidor en formato incorrecto'
          };
        }
      } catch (error) {
        console.error('Error en la petición:', error);
        return {
          success: false,
          error: 'Error de conexión al servidor'
        };
      }
    }
  }
  
  export const authService = new AuthService();
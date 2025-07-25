// services/auth.service.ts
class AuthService {
  
  
    async register(user: User) {
      try {
        console.log('Enviando datos:', user); // Debug
        const baseURL = process.env.API_URL.endsWith('/')
        ? process.env.API_URL.slice(0, -1)
        : process.env.API_URL;
        const requestBody = {
          name: user.firstName,
          lastname: user.lastName,
          email: user.email,
          phone: user.phone,
          password: user.password,
          rolesIds: ['CLIENT', 'DRIVER']
        };
        
        console.log('Request body:', requestBody);
        
        const response = await fetch(`${baseURL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
  
        console.log('Status:', response.status); // Debug
  
        const data = await response.json();
        console.log('Respuesta:', data); // Debug
  
        if (response.ok) {
          return {
            success: true,
            data: data
          };
        } else {
          const errorMessage = typeof data.message === 'string' 
            ? data.message 
            : Array.isArray(data.message) 
              ? data.message.join(', ') 
              : 'Error desconocido';
  
          console.error('Error del servidor:', errorMessage); // Debug
          return {
            success: false,
            error: errorMessage
          };
        }
      } catch (e) {
        console.error('Error completo:', e); // Debug
        return {
          success: false,
          error: e.message || 'Error de conexión'
        };
      }
    }
  }
  
  export const authService = new AuthService();
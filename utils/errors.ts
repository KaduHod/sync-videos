export function tryCatch(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
  
    descriptor.value = async function (...args: any[]) {
        try {
          // Executa o método original
            return await originalMethod.apply(this, args);
        } catch (error) {
            console.error(`Erro capturado no método ${propertyKey}:`, error);
          
            throw error;
        }
    };
  
    return descriptor;
}

// Decorator factory com a callback como argumento
export function Catch(callback: (error: any) => void) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args: any[]) {
            try {
                return await originalMethod.apply(this, args);
            } catch (error) {
                return callback(error);
            }
        };
      
        return descriptor;
    };
  }
  
  
  
  
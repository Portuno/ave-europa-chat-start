import { UpdateIn, UpdateOut, MessageInput, MessageContent, UUID_REGEX } from '../types/mabot';
import mabotAuthService from './mabotAuth';

class MabotChatService {
  private baseUrl: string;
  private botUsername: string;
  private chatId: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_MABOT_API_URL || '';
    this.botUsername = import.meta.env.VITE_MABOT_BOT_USERNAME || 'aveeuropa';
    
    // Debug logging
    console.log('MABOT Chat Service initialized with:', {
      baseUrl: this.baseUrl,
      botUsername: this.botUsername
    });
    
    if (!this.baseUrl) {
      console.error('VITE_MABOT_API_URL is not configured! Please set it in your .env.local file');
    }
    
    this.generateChatId();
  }

  private generateChatId(): void {
    // Generate a unique chat ID using crypto.randomUUID() or fallback
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      this.chatId = crypto.randomUUID();
    } else {
      // Fallback UUID v4 implementation
      this.chatId = this.generateUUIDv4();
    }
    
    // Validate the generated UUID
    if (!this.isValidUUID(this.chatId)) {
      console.error('Generated invalid UUID:', this.chatId);
      // Generate a new one if invalid
      this.chatId = this.generateUUIDv4();
    }
    
    console.log('Generated chat ID (UUID):', this.chatId);
  }

  private generateUUIDv4(): string {
    // Simple UUID v4 implementation as fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private isValidUUID(uuid: string): boolean {
    return UUID_REGEX.test(uuid);
  }

  private createTextMessage(text: string, role: 'user' | 'assistant' = 'user'): MessageInput {
    const content: MessageContent = {
      type: 'text',
      value: text,
    };

    return {
      role,
      contents: [content],
    };
  }

  async sendMessage(messageText: string): Promise<string> {
    try {
      // Ensure we have a valid token
      const token = await mabotAuthService.ensureValidToken();

      // Create the message payload according to OpenAPI schema
      const updateIn: UpdateIn = {
        platform: 'web',
        chat_id: this.chatId,
        platform_chat_id: this.chatId,
        messages: [this.createTextMessage(messageText, 'user')],
        bot_username: this.botUsername, // ✅ Campo requerido para identificar el bot
        prefix_with_bot_name: true,     // ✅ Campo requerido para incluir nombre del bot
      };

      console.log('Sending message to MABOT:', {
        url: `${this.baseUrl}/io/input`,
        payload: updateIn,
        token: token ? 'Present' : 'Missing'
      });

      // Send message to MABOT
      const response = await fetch(`${this.baseUrl}/io/input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateIn),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('MABOT API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(errorData.detail?.[0]?.msg || `Failed to send message: ${response.status}`);
      }

      const updateOut: UpdateOut = await response.json();
      console.log('MABOT API response:', updateOut);
      
      // Extract bot response from the first message
      if (updateOut.messages && updateOut.messages.length > 0) {
        const botMessage = updateOut.messages[0];
        console.log('Bot message:', botMessage);
        
        if (botMessage.contents && botMessage.contents.length > 0) {
          const textContent = botMessage.contents.find(content => content.type === 'text');
          if (textContent) {
            console.log('Text content found:', textContent);
            let responseText = textContent.value;
            
            // Quitar el prefijo "*aveeuropa*:" si existe
            responseText = responseText.replace(/^\*aveeuropa\*:\s*/i, '');
            
            // Mejorar el formato del texto
            responseText = this.formatBotResponse(responseText);
            
            return responseText;
          }
        }
      }

      console.warn('No text content found in bot response');
      // Fallback response if no text content found
      return "I received your message but couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('MABOT chat error:', error);
      
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('Authentication required')) {
        throw new Error('Authentication required. Please login to MABOT first.');
      }
      
      throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private formatBotResponse(text: string): string {
    // Mejorar el formato del texto para mejor legibilidad
    let formattedText = text;
    
    // Asegurar que los números de lista tengan espacios consistentes
    formattedText = formattedText.replace(/(\d+\.)\s*/g, '$1 ');
    
    // Asegurar que los títulos en negrita tengan espacios después
    formattedText = formattedText.replace(/\*\*(.*?)\*\*:/g, '**$1:**');
    
    // Asegurar que haya espacios después de los puntos
    formattedText = formattedText.replace(/\.(\w)/g, '. $1');
    
    // Asegurar que las preguntas al final tengan formato consistente
    formattedText = formattedText.replace(/\?(\s*)$/, '?\n\n¿Te gustaría que profundice en algún aspecto específico?');
    
    return formattedText;
  }

  async getBotInfo(): Promise<any> {
    try {
      const token = await mabotAuthService.ensureValidToken();

      const response = await fetch(`${this.baseUrl}/bot`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get bot info: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get bot info:', error);
      throw error;
    }
  }

  async getBotByUsername(username: string): Promise<any> {
    try {
      const token = await mabotAuthService.ensureValidToken();

      const response = await fetch(`${this.baseUrl}/bot/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get bot: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get bot by username:', error);
      throw error;
    }
  }

  resetChat(): void {
    this.generateChatId();
  }

  getCurrentChatId(): string | null {
    return this.chatId;
  }
}

// Create singleton instance
export const mabotChatService = new MabotChatService();
export default mabotChatService; 
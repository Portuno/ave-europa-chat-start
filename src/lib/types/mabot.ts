// MABOT API Types based on OpenAPI specification

// UUID type for chat IDs
export type UUID = string;

// UUID validation regex
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface MessageContent {
  type: 'text' | 'audio' | 'image' | 'video' | 'document';
  value: string;
  filename?: string;
  mimetype?: string;
  parse_to_text?: boolean;
  parsed_text?: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

export interface MessageInput {
  role: 'developer' | 'system' | 'user' | 'assistant' | 'tool' | 'function';
  contents: MessageContent[];
  reply_to_message?: MessageInput | null;
}

export interface MessageOutput {
  role: 'developer' | 'system' | 'user' | 'assistant' | 'tool' | 'function';
  contents: MessageContent[];
  reply_to_message?: MessageOutput | null;
}

export interface UpdateIn {
  platform: 'web' | 'whatsapp' | 'telegram';
  chat_id?: string | null; // OpenAPI shows string, not UUID
  platform_chat_id?: string | null; // OpenAPI shows string, not UUID
  messages: MessageInput[];
  bot_username?: string | null; // ✅ Campo requerido según OpenAPI
  prefix_with_bot_name?: boolean; // ✅ Campo requerido según OpenAPI
}

export interface UpdateOut {
  chat_id: string; // OpenAPI shows string, not UUID
  platform_chat_id?: string | null; // OpenAPI shows string, not UUID
  messages: MessageOutput[];
}

export interface BotRead {
  id: string;
  name: string;
  username: string;
  description?: string | null;
  instructions?: string | null;
  input_modalities: ModalityRead[];
  output_modalities: ModalityRead[];
  chat_flows?: ChatFlowRead[] | null;
  oai_documents?: OAIDocumentRead[] | null;
  private: boolean;
}

export interface ModalityRead {
  id: string;
  name: string;
  description?: string | null;
}

export interface ChatFlowRead {
  id: string;
  name: string;
  description?: string | null;
  states?: StateRead[] | null;
  initial_state?: string | null;
}

export interface StateRead {
  id: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  tools?: ToolRead[] | null;
  action_links?: StateActionLinkRead[] | null;
}

export interface ToolRead {
  id: string;
  name: string;
  description?: string | null;
  actions?: ActionRead[] | null;
}

export interface ActionRead {
  id: string;
  name: string;
  description?: string | null;
  type: 'built-in' | 'custom';
  params?: ActionParamRead[] | null;
}

export interface ActionParamRead {
  id: string;
  action_id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'object';
  can_be_empty: boolean;
}

export interface StateActionLinkRead {
  action_id: string;
  target_state_id?: string | null;
  action?: ActionRead | null;
  param_values?: ActionParamValueRead[] | null;
}

export interface ActionParamValueRead {
  state_id: string;
  action_id: string;
  param_id: string;
  value: string;
}

export interface OAIDocumentRead {
  id: string;
  oai_id: string;
  filename?: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
} 
export interface ISession {
    id: number;
    category: string;
    title: string;
    text: string;
    systemPrompt: string;
  }
  
  export interface ISessionService {
    createSession(category: string, title: string, text: string, systemPrompt: string): Promise<ISession>;
    findAllSessions(): Promise<ISession[]>;
  }
  
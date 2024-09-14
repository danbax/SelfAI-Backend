export interface LLMCommand {
    execute(): Promise<void>;
}
  
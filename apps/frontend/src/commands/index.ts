export type CommandExecute = (args: string[]) => Promise<string | string[] | void>;

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  hidden?: boolean;
  execute: CommandExecute;
}

export class CommandRegistry {
  private commands = new Map<string, Command>();

  register(command: Command): void {
    this.commands.set(command.name, command);
    command.aliases?.forEach((alias) => this.commands.set(alias, command));
  }

  getAvailable(): Command[] {
    const unique = new Set<Command>();
    for (const cmd of this.commands.values()) {
      if (!cmd.hidden) unique.add(cmd);
    }
    return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async execute(input: string): Promise<string[] | void> {
    const [raw, ...rest] = input.trim().split(/\s+/);
    const name = raw?.toLowerCase() ?? '';
    const args = rest;
    const command = this.commands.get(name);
    if (!command) {
      return [`Command not found: ${name}`];
    }
    const result = await command.execute(args);
    if (typeof result === 'string') return [result];
    return result;
  }
}



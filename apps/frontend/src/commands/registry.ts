import { CommandRegistry } from './index';
import { createBasicCommands } from './basic';
import { createFsCommands } from './fs';
import { createPortfolioCommands } from './portfolio';
import { createGameCommands } from './games';
import { createUnixCommands } from './unix';

let singleton: CommandRegistry | null = null;
let initialized = false;

export function getRegistry(): CommandRegistry {
  if (!singleton) singleton = new CommandRegistry();
  if (!initialized) {
    [
      ...createBasicCommands(),
      ...createFsCommands(),
      ...createPortfolioCommands(),
      ...createUnixCommands(),
      ...createGameCommands(),
    ].forEach((c) => singleton!.register(c));
    initialized = true;
  }
  return singleton;
}



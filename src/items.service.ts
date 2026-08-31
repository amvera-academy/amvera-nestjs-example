import { Injectable, NotFoundException } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";

type Item = { id: number; name: string };

@Injectable()
export class ItemsService {
  readonly dataDir = process.env.DATA_DIR || (process.env.AMVERA ? "/data" : path.join(process.cwd(), "data"));
  readonly dataFile = path.join(this.dataDir, "items.json");

  async read(): Promise<Item[]> {
    await fs.mkdir(this.dataDir, { recursive: true });
    try {
      return JSON.parse(await fs.readFile(this.dataFile, "utf8"));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await fs.writeFile(this.dataFile, "[]");
      return [];
    }
  }

  async create(name: string) {
    const items = await this.read();
    const item = { id: items.reduce((max, value) => Math.max(max, value.id), 0) + 1, name: name.trim() };
    items.push(item);
    await fs.writeFile(this.dataFile, JSON.stringify(items, null, 2));
    return item;
  }

  async remove(id: number) {
    const items = await this.read();
    const next = items.filter(item => item.id !== id);
    if (next.length === items.length) throw new NotFoundException("Item not found");
    await fs.writeFile(this.dataFile, JSON.stringify(next, null, 2));
  }
}

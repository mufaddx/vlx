import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { StorageProvider } from "./types";

export class LocalStorageProvider implements StorageProvider {
  private dir = path.join(process.cwd(), "public", "uploads");

  async put(input: { key: string; bytes: Buffer; mime: string }) {
    const dest = path.join(this.dir, input.key);
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, input.bytes);
    return { key: input.key, url: `/uploads/${input.key.replace(/\\/g, "/")}` };
  }

  async delete(key: string) {
    try {
      await unlink(path.join(this.dir, key));
    } catch {
      /* ignore missing */
    }
  }
}

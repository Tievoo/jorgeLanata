import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export class JsonManager<T> {
    private path: string;
    private data: T;

    constructor(filename: string) {
        this.path = path.resolve(`database/${filename}`);
        this.data = this.read();
    }

    read(): T {
        return JSON.parse(readFileSync(this.path, 'utf-8'));
    }

    write(data: T) {
        writeFileSync(this.path, JSON.stringify(data, null, 4));
    }

    get(): T {
        return this.data;
    }

    set(data: T) {
        this.data = data;
        this.write(data);
    }
}

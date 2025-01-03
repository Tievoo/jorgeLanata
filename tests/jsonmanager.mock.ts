import { Casino } from "../types/db.types.ts";

class JsonManagerMock<T> {
    private data: T;

    constructor(data: T) {
        this.data = data;
    }

    get(): T {
        return this.data;
    }

    set(data: T) {
        this.data = data;
    }

    setKey<K extends keyof T>(key: K, value: T[K]) {
        this.data[key] = value;
    }
}

export async function replaceCasinoWithMock(data: Casino) {
    const casinoDBMock = new JsonManagerMock<Casino>(data);
    const { casinoDB } = await import("../database/manager.ts");

    // Replace the `casinoDB` reference entirely
    Object.defineProperty(casinoDB, "get", { value: casinoDBMock.get.bind(casinoDBMock) });
    Object.defineProperty(casinoDB, "set", { value: casinoDBMock.set.bind(casinoDBMock) });
    Object.defineProperty(casinoDB, "setKey", { value: casinoDBMock.setKey.bind(casinoDBMock) });
}

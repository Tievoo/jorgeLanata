export class Queue<T> {
    private queue: T[] = [];
    private max: number = 100;

    constructor(data: T[] = []) {
        this.queue = data;
    }

    enqueue(item: T) {
        this.queue.push(item);
        if (this.queue.length > this.max) {
            this.queue.shift();
        }
    }

    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    clear() {
        this.queue = [];
    }

    peekAmount(amount: number): T[] {
        // last n elements
        return this.queue.slice(-amount).reverse();
    }

    toArray(): T[] {
        return this.queue;
    }

    static fromArray<K>(array: K[]) {
        const queue = new Queue<K>();
        queue.queue = array;
        return queue;
    }
}

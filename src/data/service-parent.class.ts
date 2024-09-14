export abstract class ParentServiceClass<T> {
  abstract get(id: string): Promise<T>;
}

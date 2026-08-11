export declare const DATE_EFFET: string
export declare const ACTES: Array<[string, string, string, string, number]>
export declare function chargerCatalogue(exec: {
  query: (text: string, params?: unknown[]) => Promise<{ rows: unknown[] }>
}): Promise<number>

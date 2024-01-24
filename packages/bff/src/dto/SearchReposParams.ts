export class SearchReposParams {
  public pageSize = 10;
  public page = 1;
  /** Package IDs */
  public packages: number[] = [];
  public language: 'TypeScript' | 'JavaScript' | null = null;
  public description: string | null = null;
}

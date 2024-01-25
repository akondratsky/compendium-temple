export class FieldSorting {
  public direction: 'ascend' | 'descend' = 'ascend';
  public field: 'stargazersCount' | 'forksCount' | 'openIssuesCount' | 'createdAt' | 'updatedAt' | 'pushedAt' = 'stargazersCount';
}

export class Flags {
  public onlyWithIssuesEnabled = false;
  public onlyWithProjectsEnabled = false;
  public onlyWithWikiEnabled = false;
  public onlyWithPagesEnabled = false;
  public onlyWithDownloads = false;
  public onlyWithDiscussionsEnabled = false;
  public skipDisabled = false;
  public skipArchived = false;
  public forkingOnlyAllowed = false;
}

export class SearchReposParams {
  public pageSize = 10;
  public page = 1;
  /** Package IDs */
  public searchPackages: number[] = [];
  public language: 'TypeScript' | 'JavaScript' | null = null;
  public description: string | null = null;

  public sort: FieldSorting | null = null

  flags: Flags = new Flags();
}

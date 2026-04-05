export interface BasicArgs {
  limit: string;
  after: string;
  filter: {
    orderBy: string;
    sortBy: string;
    search: string;
  };
}

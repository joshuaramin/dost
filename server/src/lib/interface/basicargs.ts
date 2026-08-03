export interface BasicArgs {
  limit: string;
  after: string;
  before: string;
  filter: {
    orderBy: string;
    sortBy: string;
    search: string;
  };
}

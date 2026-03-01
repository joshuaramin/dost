export interface BasicArgs {
  first: number;
  after: string;
  filter: {
    orderBy: string;
    sortBy: string;
    search: string;
  };
}

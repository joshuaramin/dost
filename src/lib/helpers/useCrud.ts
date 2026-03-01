type IdKey<T> = keyof T & string;

type PrismaDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  findFirst: (args?: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
};

type FindManyArgs<M extends PrismaDelegate> = NonNullable<
  Parameters<M["findMany"]>[0]
>;

type FindFirstArgs<M extends PrismaDelegate> = NonNullable<
  Parameters<M["findFirst"]>[0]
>;

type CreateArgs<M extends PrismaDelegate> = Parameters<M["create"]>[0];

type UpdateArgs<M extends PrismaDelegate> = Parameters<M["update"]>[0];

type ReadOptions<M extends PrismaDelegate, TCursor> = {
  cursor?: TCursor;
  limit?: number;
  sortBy?: "asc" | "desc";

  select?: FindManyArgs<M>["select"];
  include?: FindManyArgs<M>["include"];
  where?: FindManyArgs<M>["where"];
  orderBy?: FindManyArgs<M>["orderBy"];
};

interface Result<TNode, TCursor = unknown> {
  edges: { node: TNode; cursor: TCursor }[];
  pageInfo: {
    endCursor: TCursor | null;
    hasNextPage: boolean;
  };
  totalCount: number;
}

const ResultFn = <TNode, TCursor = unknown>(props: Result<TNode, TCursor>) =>
  props;

export class PrismaCRUDManager<
  T extends Record<string, any>,
  TIdKey extends IdKey<T>,
  M extends PrismaDelegate,
> {
  constructor(
    private model: M,
    private idKey: TIdKey,
  ) {}

  async create(data: CreateArgs<M>["data"]): Promise<T> {
    return this.model.create({ data });
  }

  async read(
    options: ReadOptions<M, T[TIdKey]> = {},
  ): Promise<Result<T, T[TIdKey]>> {
    const {
      cursor,
      limit = 10,
      select,
      include,
      where,
      orderBy,
      sortBy = "asc",
    } = options;

    if (select && include) {
      throw new Error("Cannot use select and include together.");
    }

    const mergedWhere = {
      AND: [{ is_deleted: false }, ...(where ? [where] : [])],
    };

    const query: FindManyArgs<M> = {
      where: mergedWhere,
      orderBy: orderBy ?? { [this.idKey]: sortBy },
      take: limit,
      ...(select && { select }),
      ...(include && { include }),
    };

    if (cursor) {
      (query as any).cursor = { [this.idKey]: cursor };
      (query as any).skip = 1;
    }

    const items = await this.model.findMany(query);

    const totalCount = await this.model.count({
      where: mergedWhere,
    });

    return ResultFn({
      edges: items.map((item: any) => ({
        node: item,
        cursor: item[this.idKey],
      })),
      pageInfo: {
        endCursor: items.length ? items[items.length - 1][this.idKey] : null,
        hasNextPage: items.length === limit,
      },
      totalCount,
    });
  }

  async readById(
    value: T[TIdKey] | string,
    key: keyof T = this.idKey,
    options?: Pick<FindFirstArgs<M>, "select" | "include">,
  ): Promise<T | null> {
    if (options?.select && options?.include) {
      throw new Error("Cannot use select and include together.");
    }

    return this.model.findFirst({
      where: {
        AND: [{ [key]: value }, { is_deleted: false }],
      }, 
      ...(options?.select && { select: options.select }),
      ...(options?.include && { include: options.include }),
    });
  }

  async update(id: T[TIdKey], data: UpdateArgs<M>["data"]): Promise<T> {
    return this.model.update({
      where: { [this.idKey]: id },
      data,
    });
  }

  async delete(id: T[TIdKey]): Promise<T> {
    return this.model.update({
      where: { [this.idKey]: id },
      data: { is_deleted: true },
    });
  }

  async restore(id: T[TIdKey]): Promise<T> {
    return this.model.update({
      where: { [this.idKey]: id },
      data: { is_deleted: false },
    });
  }
}

type IdKey<T> = keyof T & string;

type PrismaDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  findFirst: (args?: any) => Promise<any | null>;
  create: (args: any) => Promise<any>;
  findUnique: (args: any) => Promise<any | null>;
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
  limit?: string;
  sortBy?: string;
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
    private hasSoftDelete: boolean = true, // ✅ NEW FLAG
  ) {}

  private buildWhere(where?: any) {
    if (!this.hasSoftDelete) return where || {};

    return {
      AND: [{ is_deleted: false }, ...(where ? [where] : [])],
    };
  }

  async unique<K extends keyof T>(key: K, value: T[K]): Promise<T | null> {
    return this.model.findUnique({
      where: { [key]: value },
    } as any);
  }

  async create(data: CreateArgs<M>["data"]): Promise<T> {
    return this.model.create({ data });
  }

  async read(
    options: ReadOptions<M, T[TIdKey]> = {},
  ): Promise<Result<T, T[TIdKey]>> {
    const { cursor, limit, select, include, where, orderBy, sortBy } = options;

    if (select && include) {
      throw new Error("Cannot use select and include together.");
    }

    const mergedWhere = this.buildWhere(where);

    const query: FindManyArgs<M> = {
      where: mergedWhere,
      orderBy: orderBy ?? { [this.idKey]: sortBy ?? "asc" },
      take: Number(limit) || 10,
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

    const hasNextPage = items.length >= (Number(limit) || 10);

    return ResultFn({
      edges: items.map((item: any) => ({
        node: item,
        cursor: item[this.idKey],
      })),
      pageInfo: {
        endCursor: items.length ? items[items.length - 1][this.idKey] : null,
        hasNextPage,
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

    const where = this.hasSoftDelete
      ? { AND: [{ [key]: value }, { is_deleted: false }] }
      : { [key]: value };

    return this.model.findFirst({
      where,
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
    if (!this.hasSoftDelete) {
      throw new Error("Soft delete not enabled for this model");
    }

    return this.model.update({
      where: { [this.idKey]: id },
      data: { is_deleted: true },
    });
  }

  async restore(id: T[TIdKey]): Promise<T> {
    if (!this.hasSoftDelete) {
      throw new Error("Soft delete not enabled for this model");
    }

    return this.model.update({
      where: { [this.idKey]: id },
      data: { is_deleted: false },
    });
  }
}

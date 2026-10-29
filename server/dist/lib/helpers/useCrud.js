const ResultFn = (props) => props;
export class PrismaCRUDManager {
    model;
    idKey;
    hasSoftDelete;
    constructor(model, idKey, hasSoftDelete = true) {
        this.model = model;
        this.idKey = idKey;
        this.hasSoftDelete = hasSoftDelete;
    }
    buildWhere(where) {
        if (!this.hasSoftDelete) {
            return where || {};
        }
        return {
            AND: [
                {
                    is_deleted: false,
                },
                ...(where ? [where] : []),
            ],
        };
    }
    async unique(key, value, options) {
        return this.model.findUnique({
            where: {
                [key]: value,
            },
            select: options?.select,
            include: options?.include,
            ...options,
        });
    }
    async findFirst(options) {
        if (!options) {
            return this.model.findFirst({
                where: this.buildWhere(),
            });
        }
        return this.model.findFirst({
            ...options,
            where: this.buildWhere(options.where),
        });
    }
    async create(data, select, include) {
        return this.model.create({
            data,
            select,
            include,
        });
    }
    async createMany(data) {
        return this.model.createMany({
            data,
        });
    }
    async deleteMany(where) {
        return this.model.deleteMany({
            where,
        });
    }
    async read(options = {}) {
        const { cursor, limit = "10", select, include, where, orderBy, sortBy, direction = "forward", } = options;
        if (select && include) {
            throw new Error("Cannot use select and include together.");
        }
        const take = Math.abs(Number(limit));
        const mergedWhere = this.buildWhere(where);
        const isBackward = direction === "backward";
        const query = {
            where: mergedWhere,
            orderBy: orderBy ?? {
                [this.idKey]: sortBy ?? "asc",
            },
            take: isBackward ? -(take + 1) : take + 1,
            ...(select && {
                select,
            }),
            ...(include && {
                include,
            }),
        };
        if (cursor) {
            query.cursor = {
                [this.idKey]: cursor,
            };
            query.skip = 1;
        }
        let results = await this.model.findMany(query);
        const hasMore = results.length > take;
        if (isBackward) {
            results = results.slice(0, take);
            results.reverse();
        }
        else {
            results = hasMore ? results.slice(0, take) : results;
        }
        const totalCount = await this.model.count({
            where: mergedWhere,
        });
        const items = results;
        const hasNextPage = isBackward ? Boolean(cursor) : hasMore;
        const hasPrevPage = isBackward ? hasMore : Boolean(cursor);
        return ResultFn({
            edges: items.map((item) => ({
                node: item,
                cursor: item[this.idKey],
            })),
            pageInfo: {
                startCursor: items.length > 0 ? items[0][this.idKey] : null,
                endCursor: items.length > 0 ? items[items.length - 1][this.idKey] : null,
                hasNextPage,
                hasPrevPage,
            },
            totalCount,
        });
    }
    async readById(value, key = this.idKey, options, resolver) {
        const where = {
            [key]: value,
            ...(this.hasSoftDelete && { is_deleted: false }),
        };
        const entity = await this.model.findFirst({
            where,
            ...(options?.select !== undefined && { select: options.select }),
            ...(options?.include !== undefined && { include: options.include }),
        });
        if (!entity) {
            return null;
        }
        if (resolver) {
            return resolver(entity);
        }
        return entity;
    }
    async update(key = this.idKey, value, data) {
        return this.model.update({
            where: {
                [key]: value,
            },
            data,
        });
    }
    async delete(key, value) {
        if (!this.hasSoftDelete) {
            throw new Error("Soft delete not enabled for this model");
        }
        return this.model.update({
            where: {
                [key]: value,
            },
            data: {
                is_deleted: true,
            },
        });
    }
    async restore(id) {
        if (!this.hasSoftDelete) {
            throw new Error("Soft delete not enabled for this model");
        }
        return this.model.update({
            where: {
                [this.idKey]: id,
            },
            data: {
                is_deleted: false,
            },
        });
    }
}

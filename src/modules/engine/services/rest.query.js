import { MongoParser } from '@/modules/engine/services/mongo.parser';
import { TenantService } from '@/modules/engine/services/tenant.service';

export class RestQuery {
  static mongoParser = new MongoParser();

  static toQueryBuilderRules(query) {
    const clonedQuery = JSON.parse(JSON.stringify(query));
    let mongoQuery = clonedQuery.where;
    if (mongoQuery) {
      if (!mongoQuery.$and && !mongoQuery.$or) {
        mongoQuery = { $and: [mongoQuery] };
      }
      clonedQuery.where = this.mongoParser.parseMongoQuery(mongoQuery);
    }
    if (clonedQuery.includes && clonedQuery.includes.length > 0) {
      clonedQuery.includes = clonedQuery.includes.map((query) => {
        return this.toQueryBuilderRules(query);
      });
    }
    return clonedQuery;
  }

  /**
   * This will merge given query array and return a single query
   * Note: queries should be mongo query
   * @return Object
   */
  static merge(queries) {
    const _this = this;
    return queries.slice(1).reduce(function(query, next) {
      if (next.modelAlias !== query.modelAlias) {
        throw new Error('Can not merge querries of different modelAliass "' + query.modelAlias + '" != "' + next.modelAlias + '"');
      }
      /** initializing where*/
      let where = query.where;
      if (!where || Object.keys(where).length === 0) {
        where = { $and: [] };
      } else if (!where.$and) {
        where = { $and: [where] };
      }
      query.where = where;
      /** merging include queries*/
      if (next.include) {
        if (!query.include) {
          query.include = [];
        }
        for (const include of next.include) {
          const index = query.include.findIndex(qinclude => qinclude.modelAlias === include.modelAlias);
          if (index > -1) {
            _this.merge(query.include[index], include);
          } else {
            query.include.push(include);
          }
        }
        delete next.include;
      }
      if (next.where && Object.keys(where).length > 0) {
        query.where.$and.push(next.where);
      }
      return query;
    }, queries[0]);
  }

  constructor(modelAlias) {
    this.modelAlias = modelAlias;
  }

  paginate(query) {
    return this.execute({
      data: { query: query, queryMethod: 'paginate' }
    });
  }

  findOne(query) {
    return this.execute({
      params: {
        query: query,
        queryMethod: 'findOne'
      }
    });
  }

  findById(id) {
    return this.execute({
      method: 'get',
      params: {
        query: { where: { id: id }}, queryMethod: 'findById'
      }
    });
  }

  paginate(query) {
    return this.execute({ method: 'get', params: { query: query, queryMethod: 'paginate' }});
  }

  findAll(query) {
    return this.execute({ method: 'get', params: { query: query, queryMethod: 'findAll' }});
  }

  create(data) {
    return this.execute({
      method: 'get',
      data: {
        queryMethod: 'create',
        data: data
      }
    });
  }

  update(data, query, ajaxOptions) {
    return this.execute({
      method: 'get',
      data: {
        queryMethod: 'update',
        query: query,
        data: data
      }
    });
  }

  delete(query, ajaxOptions) {
    return this.execute({
      method: 'get',
      data: {
        queryMethod: 'delete',
        data: { query: query }
      }
    });
  }

  execute(options) {
    const data = options.data || {};
    if (data.query) {
      data.query = RestQuery.toQueryBuilderRules(data.query);
    }
    data.modelAlias = this.modelAlias.replaceAll('.', '\\');
    return TenantService.request(Object.assign({
      url: '/api/engine/models/' + this.modelAlias + '/query',
      queryMethod: 'get'
    }, options));
  }
}

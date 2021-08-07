import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'nestjs-knexjs';

@Injectable()
export class UserService {
  table_name: string = 'user';
  constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) {}

  async getAllUser() {
    return await this.knex(this.table_name).select('id', 'name', 'email');
  }

  async createUser(requestBody: any): Promise<any> {
    try {
      const result = await this.knex(this.table_name).insert(requestBody);
      return result[0];
    } catch (e) {
      return false;
    }
  }

  async findUser(id: any): Promise<any[]> {
    const res = await this.knex(this.table_name)
      .where({ id: id })
      .select('id', 'name', 'email');
    return res;
  }

  async updateUser(body: any): Promise<Number> {
    const update = await this.knex(this.table_name)
      .where({ id: body.id })
      .update(body);
    return update;
  }

  async deleteUser(id: String): Promise<Number> {
    const del = await this.knex(this.table_name).where({ id }).del();
    return del;
  }
}

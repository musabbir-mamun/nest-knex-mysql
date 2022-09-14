import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'nestjs-knexjs';

export type User = any;
@Injectable()
export class UserService {
    table_name: string = 'user';
    constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) { }

    async findOne(username: string, password: string): Promise<any | undefined> {
        const data = await this.knex(this.table_name)
            .where({ email: username })
            .where({ password: password })
            .select('id', 'name', 'email', 'password', 'user_type_id')
            .first();

        return {
            error: false,
            data: data,
            message: "User data fetched successfully"
        };
    }

    async getAllUser() {
        let data = await this.knex(this.table_name).select('id', 'name', 'email');
        return {
            error: false,
            data: data,
            message: "User data"
        };
    }

    async createUser(requestBody: any): Promise<any> {
        try {
            const result = await this.knex(this.table_name).insert(requestBody);

            return {
                error: false,
                id: result[0],
                message: "User created successfully"
            };
        } catch (e) {
            return {
                error: true,
                message: e.message
            };
        }
    }

    async findUser(id: any): Promise<any> {
        const data = await this.knex(this.table_name)
            .where({ id: id })
            .select('id', 'name', 'email', 'user_type_id');

        return {
            error: false,
            data: data,
            message: "User data"
        };
    }

    async updateUser(body: any): Promise<any> {

        try {
            const update = await this.knex(this.table_name)
                .where({ id: body.id })
                .update(body);

            return {
                error: false,
                updated_row: update,
            };

        } catch (e) {
            return {
                error: true,
                message: e.message
            };
        }
    }

    async deleteUser(id: String): Promise<any> {

        try {
            const del = await this.knex(this.table_name).where({ "id": id }).del();
            return {
                error: false,
                id: del,
                message: "Data deleted successfully"
            };
        } catch (e) {
            return {
                error: true,
                message: e.message
            };
        }

    }
}

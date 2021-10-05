import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX_CONNECTION } from 'nestjs-knexjs';
import { GlobalService } from './global.service';
import { ListDto } from './list.dto';

@Injectable()
export class CurdService {
    constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) { }

    async getData(tableName: string, listDto: ListDto) {
        try {
            let tableColumns: string[];

            if (listDto.whereAny && listDto.whereAny.length > 1) {
                await this.knex(tableName)
                    .columnInfo()
                    .then(function (info) {
                        tableColumns = Object.keys(info);
                    });
            }

            let data = await this.knex(tableName)
                .modify(function (queryBuilder) {
                    if (listDto.requiredFields) {
                        queryBuilder.select(listDto.requiredFields);
                    } else {
                        queryBuilder.select('*');
                    }

                    if (listDto.limit) {
                        queryBuilder.limit(listDto.limit);
                    }
                    if (listDto.offset) {
                        queryBuilder.offset(listDto.offset);
                    }
                    if (listDto.orderBy) {
                        queryBuilder.orderBy(listDto.orderBy, listDto.orderAs);
                    }

                    if (listDto.where) {
                        for (let key in listDto.where) {
                            if (listDto.where.hasOwnProperty(key)) {
                                if (listDto.where[key] != '') {
                                    queryBuilder.orWhere(key, listDto.where[key]);
                                }
                            }
                        }
                    }

                    if (listDto.whereAny && listDto.whereAny.length > 1) {
                        tableColumns.forEach((element) => {
                            queryBuilder.orWhere(`${element}`, 'like', `%${listDto.whereAny}%`);
                        });
                    } else if (listDto.whereLike) {
                        for (let key in listDto.whereLike) {
                            if (listDto.whereLike.hasOwnProperty(key)) {
                                if (listDto.whereLike[key] != '') {
                                    queryBuilder.orWhere(`${key}`, 'like', `%${listDto.whereLike[key]}%`);
                                }
                            }
                        }
                    }
                }).where({ is_active: 1 });

            if (tableName == 'user') {
                data = data.map(function (item) {
                    delete item.password;
                    return item;
                });
            }
            if (Object.keys(data).length > 0) {
                return {
                    error: false,
                    message: 'Data set fetched successfully',
                    data: {
                        dataCount: Object.keys(data).length,
                        data: data,
                    },
                };
            } else {
                return { error: true, message: 'No data found' };
            }
        } catch (e) {
            return { error: true, message: e.message };
        }
    }

    async getById(tableName: string, id: any): Promise<any> {
        let data = await this.knex(tableName).select('*').first().where({ id: id }).where({ is_active: 1 });
        if (tableName == 'user') {
            delete data.password;
        }
        if (data) {
            return { error: false, message: 'Data fetched successfully', data: data };
        } else {
            throw new NotFoundException('No data found');
        };
    }

    async checkDataDuplicacy(tableName: string, columnName: string, compareValue: any) {
        try {
            const dupCheck = await this.knex(tableName)
                .select('id')
                .first()
                .where({ is_active: 1 })
                .where(`${columnName}`, compareValue);

            if (dupCheck) {
                throw new BadRequestException('Duplicate data found for ' + columnName);
            }
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    async insertData(tableName: string, data: any): Promise<any> {
        try {
            data.created_by = GlobalService.userId;
            const result = await this.knex(tableName)
                .insert(data)
                .catch((e) => {
                    throw new InternalServerErrorException(e.message);
                });

            return {
                error: false,
                message: 'Data saved successfully',
                data: {
                    id: result[0],
                },
            };
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    async deleteDataById(tableName: string, id: number): Promise<any> {
        try {
            const res = await this.knex(tableName).where({ id: id }).first().del();

            if (res) {
                return { error: false, message: 'Data deleted completely' };
            } else {
                throw new NotFoundException('No data found');
            }
        } catch (e) {
            if (e.errno == 1451) {
                await this.knex(tableName)
                    .where({ id: id })
                    .first()
                    .update({ is_active: 0 })
                    .catch(async (e) => {
                        throw new InternalServerErrorException(e.message);
                    });
                return { error: false, message: 'Data deleted successfully' };
            } else {
                throw new BadRequestException(e.message);
            }
        }
    }

    async checkDataDuplicacyOnEdit(tableName: string, columnName: string, compareValue: any, id: number): Promise<any> {
        try {
            const dupCheck = await this.knex(tableName)
                .count('id', { as: 'total' })
                .first()
                .where({ is_active: 1 })
                .where(`${columnName}`, compareValue)
                .whereNot({ id: id })
                .catch((e) => {
                    throw new BadRequestException(e.message);
                });

            if (dupCheck.total > 0) {
                throw new BadRequestException('Duplicate data found for ' + columnName);
            }
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async updateData(tableName: string, id: number, data: any): Promise<any> {
        try {
            data.updated_by = GlobalService.userId;
            const res = await this.knex(tableName)
                .where({ id: id })
                .first()
                .update(data)
                .catch(async (e) => {
                    throw new InternalServerErrorException(e.message);
                });
            if (res) {
                return { error: false, message: 'Data updated successfully' };
            } else {
                throw new NotFoundException("Nothing updated");
            }
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    async checkDataDuplicacyFor2Values(tableName: string, columnName1: string, value1: any, columnName2: string, value2: any) {
        try {
            const dupCheck = await this.knex(tableName)
                .select('id')
                .first()
                .where({ is_active: 1 })
                .where(`${columnName1}`, value1)
                .where(`${columnName2}`, value2);

            if (dupCheck) {
                throw new BadRequestException('Duplicate data found for ' + columnName1 + ' & ' + columnName2);
            }
        } catch (e) {
            throw new InternalServerErrorException(e.message);
        }
    }

    async checkDataDuplicacyOnEditFor2Values(tableName: string, columnName1: string, value1: any, columnName2: string, value2: any, id: number) {
        try {
            const dupCheck = await this.knex(tableName)
                .count('id', { as: 'total' })
                .first()
                .where({ is_active: 1 })
                .where(`${columnName1}`, value1)
                .where(`${columnName2}`, value2)
                .whereNot({ id: id })
                .catch((e) => {
                    throw new BadRequestException(e.message);
                });

            if (dupCheck.total > 0) {
                throw new BadRequestException('Duplicate data found for ' + columnName1 + ' & ' + columnName2);
            }
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
}

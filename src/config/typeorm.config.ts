import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '172.24.0.1',
  port: 5432,
  username: 'postgres',
  password: 'Welcome01',
  database: 'taskmanagement',
  entities: [
    __dirname + '/../**/*.entity.{ts,js}'
  ],
  synchronize: true
}
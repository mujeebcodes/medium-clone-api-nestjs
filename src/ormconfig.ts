import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

const config:PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Adewale94',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize:true

}

export default config;
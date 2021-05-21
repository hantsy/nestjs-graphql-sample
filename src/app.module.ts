import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthzModule } from './authz/authz.module';
import { DatabaseModule } from './database/database.module';
// import plugin from 'apollo-server-plugin-operation-registry';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';
import dbConfig from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      useFactory: async (cfg: ConfigType<typeof dbConfig>) =>
        // getConnectionOptions is used to load config from ormconfig.json file.
        //
        // Object.assign(await getConnectionOptions(), {
        //   autoLoadEntities: true,
        //   logging: true,
        // }),

        {
          const options = Boolean(cfg.url)
            ? {
                type: cfg.type,
                url: cfg.url,
              }
            : {
                type: cfg.type,
                host: cfg.host,
                port: cfg.port,
                database: cfg.database,
                username: cfg.username,
                password: cfg.password,
              };

          return Object.assign(options, {
            entities: ['dist/**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: true,
            logging: true,
          }) as any;
        },

      inject: [dbConfig.KEY],
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      debug: true,
      playground: true, //show playgroud
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // in memory
      //autoSchemaFile: true,
      sortSchema: true,

      buildSchemaOptions: {
        //fieldMiddleware: [loggerMiddleware],
        //dateScalarMode: 'timestamp', // by default, GraphQLISODateTime (e.g. 2019-12-03T09:54:33Z)
        numberScalarMode: 'integer', //default, it is float.
      },
      schemaDirectives: {
        //upper: UpperCaseDirective,
      },
      fieldResolverEnhancers: ['interceptors'],
    }),
    DatabaseModule,
    PostsModule,
    UsersModule,
    AuthzModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}

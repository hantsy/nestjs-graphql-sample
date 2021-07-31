import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';
import { AuthzModule } from './authz/authz.module';
import dbConfig from './config/db.config';
import { DatabaseModule } from './database/database.module';
import { GqlApiModule } from './gql/gql-api.module';

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
      // fieldResolverEnhancers: ['guards'],
      context: ({ req, res }) => ({
        req,
        res,
        //batchAuthorsLoader: batchAuthorsLoader(usersService),
      }),
      formatError: (error: GraphQLError) => {
        //console.log('GraphQLError::', JSON.stringify(error));
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            error?.extensions?.exception?.message || error?.message || '',
        };
        return graphQLFormattedError;
      },
    }),
    DatabaseModule,
    AuthzModule,
    GqlApiModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}

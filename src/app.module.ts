import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDatabaseConfig } from "@configs/database.config";

import { Modules } from "@modules/modules.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./core/all-exceptions.filter";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env.dev" }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),

    Modules,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}

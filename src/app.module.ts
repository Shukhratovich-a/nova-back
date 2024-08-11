import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDatabaseConfig } from "@/configs/database.config";

import { Modules as UzModules } from "@modules/uz/modules.module";
import { Modules as EgModules } from "@modules/eg/modules.module";
import { Modules as TrModules } from "@modules/tr/modules.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: "db_uz",
      useFactory: () => getDatabaseConfig("uz"),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: "db_eg",
      useFactory: () => getDatabaseConfig("eg"),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: "db_tr",
      useFactory: () => getDatabaseConfig("tr"),
    }),

    UzModules,
    EgModules,
    TrModules,
  ],
})
export class AppModule {}

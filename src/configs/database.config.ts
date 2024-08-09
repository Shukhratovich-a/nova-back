import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { join } from "path";

export const getDatabaseConfig = async (): Promise<TypeOrmModuleOptions> => {
  return {
    type: "sqlite",
    database: join(process.cwd(), "database", `db.sqlite`),
    ...getDatabaseOptions(),
  };
};

const getDatabaseOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoLoadEntities: true,
  synchronize: true,
});

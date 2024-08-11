import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { join } from "path";

export const getDatabaseConfig = async (region: string): Promise<TypeOrmModuleOptions> => {
  return {
    type: "sqlite",
    database: join(process.cwd(), "database", `db_${region}.sqlite`),
    ...getDatabaseOptions(),
  };
};

const getDatabaseOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoLoadEntities: true,
  synchronize: true,
});

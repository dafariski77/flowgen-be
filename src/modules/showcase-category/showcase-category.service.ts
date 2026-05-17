import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { showcaseCategoryTable } from "../../core/schemas/showcase_category";
import { eq } from "drizzle-orm";
import { CreateShowcaseCategoryDto } from "./dto/create-showcase-category.dto";
import { UpdateShowcaseCategoryDto } from "./dto/update-showcase-category.dto";

@Injectable()
export class ShowcaseCategoryService {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly db: NodePgDatabase<{
      showcaseCategoryTable: typeof showcaseCategoryTable;
    }>,
  ) {}

  async findAll() {
    return this.db.select().from(showcaseCategoryTable);
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(showcaseCategoryTable)
      .where(eq(showcaseCategoryTable.id, id))
      .limit(1);

    if (!result[0]) {
      throw new HttpException(
        "Showcase category not found",
        HttpStatus.NOT_FOUND,
      );
    }

    return result[0];
  }

  async create(dto: CreateShowcaseCategoryDto) {
    const result = await this.db
      .insert(showcaseCategoryTable)
      .values(dto)
      .returning();

    return result[0];
  }

  async update(id: string, dto: UpdateShowcaseCategoryDto) {
    await this.findOne(id);

    const result = await this.db
      .update(showcaseCategoryTable)
      .set(dto)
      .where(eq(showcaseCategoryTable.id, id))
      .returning();

    return result[0];
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db
      .delete(showcaseCategoryTable)
      .where(eq(showcaseCategoryTable.id, id));

    return { message: "Showcase category deleted successfully" };
  }
}

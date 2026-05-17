import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { DRIZZLE_CONNECTION } from "../../core/database/drizzle";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { showcaseTable } from "../../core/schemas/showcase";
import { showcaseCategoryTable } from "../../core/schemas/showcase_category";
import { diagramHistoryTable } from "../../core/schemas/diagram_history";
import { usersTable } from "../../core/schemas/user";
import { eq } from "drizzle-orm";
import { CreateShowcaseDto } from "./dto/create-showcase.dto";
import { UpdateShowcaseDto } from "./dto/update-showcase.dto";

@Injectable()
export class ShowcaseService {
  constructor(
    @Inject(DRIZZLE_CONNECTION)
    private readonly db: NodePgDatabase<{
      showcaseTable: typeof showcaseTable;
      showcaseCategoryTable: typeof showcaseCategoryTable;
      diagramHistoryTable: typeof diagramHistoryTable;
      usersTable: typeof usersTable;
    }>,
  ) {}

  async findAll() {
    const results = await this.db
      .select({
        id: showcaseTable.id,
        title: showcaseTable.title,
        slug: showcaseTable.slug,
        description: showcaseTable.description,
        thumbnail: showcaseTable.thumbnail,
        diagramType: showcaseTable.diagramType,
        nodeCount: showcaseTable.nodeCount,
        complexityLevel: showcaseTable.complexityLevel,
        estimatedCredits: showcaseTable.estimatedCredits,
        createdAt: showcaseTable.createdAt,
        category: {
          id: showcaseCategoryTable.id,
          name: showcaseCategoryTable.name,
          slug: showcaseCategoryTable.slug,
        },
      })
      .from(showcaseTable)
      .leftJoin(
        showcaseCategoryTable,
        eq(showcaseTable.categoryId, showcaseCategoryTable.id),
      );

    return results;
  }

  async findBySlug(slug: string) {
    const results = await this.db
      .select({
        id: showcaseTable.id,
        title: showcaseTable.title,
        slug: showcaseTable.slug,
        description: showcaseTable.description,
        thumbnail: showcaseTable.thumbnail,
        diagramType: showcaseTable.diagramType,
        nodeCount: showcaseTable.nodeCount,
        complexityLevel: showcaseTable.complexityLevel,
        estimatedCredits: showcaseTable.estimatedCredits,
        buildVersion: showcaseTable.buildVersion,
        prompt: showcaseTable.prompt,
        engineVersion: showcaseTable.engineVersion,
        logicFlowDescription: showcaseTable.logicFlowDescription,
        securityLayerDescription: showcaseTable.securityLayerDescription,
        createdBy: showcaseTable.createdBy,
        createdAt: showcaseTable.createdAt,
        updatedAt: showcaseTable.updatedAt,
        category: {
          id: showcaseCategoryTable.id,
          name: showcaseCategoryTable.name,
          slug: showcaseCategoryTable.slug,
        },
        diagramHistory: {
          id: diagramHistoryTable.id,
          title: diagramHistoryTable.title,
          diagramType: diagramHistoryTable.diagramType,
          mermaidCode: diagramHistoryTable.mermaidCode,
        },
      })
      .from(showcaseTable)
      .leftJoin(
        showcaseCategoryTable,
        eq(showcaseTable.categoryId, showcaseCategoryTable.id),
      )
      .leftJoin(
        diagramHistoryTable,
        eq(showcaseTable.diagramHistoryId, diagramHistoryTable.id),
      )
      .where(eq(showcaseTable.slug, slug))
      .limit(1);

    if (!results[0]) {
      throw new HttpException("Showcase not found", HttpStatus.NOT_FOUND);
    }

    return results[0];
  }

  async findOne(id: string) {
    const result = await this.db
      .select()
      .from(showcaseTable)
      .where(eq(showcaseTable.id, id))
      .limit(1);

    if (!result[0]) {
      throw new HttpException("Showcase not found", HttpStatus.NOT_FOUND);
    }

    return result[0];
  }

  async create(dto: CreateShowcaseDto, userId?: string) {
    const result = await this.db
      .insert(showcaseTable)
      .values({
        ...dto,
        createdBy: userId ?? null,
      })
      .returning();

    return result[0];
  }

  async update(id: string, dto: UpdateShowcaseDto) {
    await this.findOne(id);

    const result = await this.db
      .update(showcaseTable)
      .set({
        ...dto,
        updatedAt: new Date(),
      })
      .where(eq(showcaseTable.id, id))
      .returning();

    return result[0];
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.db.delete(showcaseTable).where(eq(showcaseTable.id, id));

    return { message: "Showcase deleted successfully" };
  }
}

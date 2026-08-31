import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CreateItemDto } from "./items.dto";
import { ItemsService } from "./items.service";

@Controller("api")
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get("health")
  health() {
    return { ok: true, framework: "NestJS", storage: this.itemsService.dataFile };
  }

  @Get("items")
  async items() {
    const items = [...await this.itemsService.read()].reverse();
    return { items, count: items.length };
  }

  @Post("items")
  async create(@Body() data: CreateItemDto) {
    return { item: await this.itemsService.create(data.name) };
  }

  @Delete("items/:id")
  @HttpCode(200)
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.itemsService.remove(id);
    return { deleted: true, id };
  }
}

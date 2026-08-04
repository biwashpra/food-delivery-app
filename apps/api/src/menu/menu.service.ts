import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-catergory.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

  private async getRestaurantByOwner(ownerId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (!restaurant)
      throw new NotFoundException(
        'No restaurant associated with this user, Please create restaurant first.',
      );

    return restaurant;
  }

  private async getMenuCategoryById(id: string) {
    const [category] = await this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  private async getMenuItemById(id: string) {
    const [item] = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id));

    if (!item) throw new NotFoundException('Menu item not found');

    return item;
  }

  // Menu Categories Service Starts
  async createMenuCategory(ownerId: string, dto: CreateMenuCategoryDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);

    const [category] = await this.db
      .insert(schema.menuCategories)
      .values({ restaurantId: restaurant.id, name: dto.name })
      .returning();

    return category;
  }

  async getMenuCategories(restaurantId: string) {
    return this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.restaurantId, restaurantId));
  }

  async updateMenuCategory(
    id: string,
    ownerId: string,
    dto: UpdateMenuCategoryDto,
  ) {
    const restaurant = await this.getRestaurantByOwner(ownerId);

    const category = await this.getMenuCategoryById(id);

    if (category.restaurantId !== restaurant.id) {
      throw new ForbiddenException(
        'This category does not belong to your restaurant',
      );
    }

    const [updated] = await this.db
      .update(schema.menuCategories)
      .set({ name: dto.name })
      .where(eq(schema.menuCategories.id, id))
      .returning();

    return updated;
  }

  async deleteMenuCategory(id: string, ownerId: string) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const category = await this.getMenuCategoryById(id);

    if (category.restaurantId !== restaurant.id)
      throw new ForbiddenException(
        'This category does not belong to your restaurant.',
      );

    // cascade delete will remove all items in this category automatically
    await this.db
      .delete(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    return { message: 'Category deleted' };
  }

  // Menu Items Service Starts
  async createMenuItem(ownerId: string, dto: CreateMenuItemDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);

    const [menuItem] = await this.db
      .insert(schema.menuItems)
      .values({
        restaurantId: restaurant.id,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        imageUrl: dto.imageUrl,
      })
      .returning();

    return menuItem;
  }

  async getItemsByRestaurant(restaurantId: string) {
    // returns all items for a restaurant — frontend groups them by category
    return this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.restaurantId, restaurantId));
  }

  async updateMenuItem(id: string, ownerId: string, dto: UpdateMenuItemDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const item = await this.getMenuItemById(id);

    if (restaurant.id !== item.restaurantId)
      throw new ForbiddenException(
        'This item does not belong to your restaurant',
      );

    const [updated] = await this.db
      .update(schema.menuItems)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.menuItems.id, id))
      .returning();

    return updated;
  }

  async deleteMenuItem(id: string, ownerId: string) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const item = await this.getMenuItemById(id);

    if (item.restaurantId !== restaurant.id) {
      throw new ForbiddenException(
        'This item does not belong to your restaurant',
      );
    }

    await this.db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));

    return { message: 'Item deleted' };
  }
}

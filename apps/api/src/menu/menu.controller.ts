import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { type JwtPayload, UserRole } from '@food-delivery-app/types';
import { Request as ExpressRequest } from 'express';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-catergory.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

type RequestWithUser = ExpressRequest & { user: JwtPayload };

@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) {}

  // Menu Category
  @Post('categories')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createCategory(
    @Request() req: RequestWithUser,
    @Body() dto: CreateMenuCategoryDto,
  ) {
    return this.menuService.createMenuCategory(req.user.sub, dto);
  }

  @Get('categories/:restaurantId')
  getCategories(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getMenuCategories(restaurantId);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateCategory(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() dto: UpdateMenuCategoryDto,
  ) {
    return this.menuService.updateMenuCategory(id, req.user.sub, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteCategory(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.menuService.deleteMenuCategory(id, req.user.sub);
  }

  // Menu Item
  @Post('items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  createItem(@Request() req: RequestWithUser, @Body() dto: CreateMenuItemDto) {
    return this.menuService.createMenuItem(req.user.sub, dto);
  }

  @Get('items/:restaurantId')
  getItems(@Param('restaurantId') restaurantId: string) {
    return this.menuService.getItemsByRestaurant(restaurantId);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  updateItem(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menuService.updateMenuItem(id, req.user.sub, dto);
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RESTAURANT_OWNER)
  deleteItem(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.menuService.deleteMenuItem(id, req.user.sub);
  }
}

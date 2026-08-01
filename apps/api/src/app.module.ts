import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { RestaurantsService } from './restaurants/restaurants.service';
import { RestaurantsController } from './restaurants/restaurants.controller';
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    AuthModule,
    RestaurantsModule,
  ],
  controllers: [AppController, RestaurantsController],
  providers: [AppService, RestaurantsService],
})
export class AppModule {}

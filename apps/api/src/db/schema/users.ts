import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'CUSTOMER',
  'RESTAURANT_OWNER',
  'RIDER',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  middleName: varchar('middle_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('CUSTOMER'),
  isOnline: boolean('is_online').notNull().default(false),
  pushToken: text('push_token'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

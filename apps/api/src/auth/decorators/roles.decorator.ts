import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@food-delivery-app/types';
import { ROLES_KEY } from 'src/constants/key';

// usage: @Roles(UserRole.RESTAURANT_OWNER) above any route method
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

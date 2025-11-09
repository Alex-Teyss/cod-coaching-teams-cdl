/**
 * Utility function to get the appropriate dashboard route based on user role
 * @param role - User role (ADMIN, COACH, or PLAYER)
 * @returns Dashboard route path
 */
export function getDashboardRoute(role: string | undefined): string {
  if (!role) {
    return '/dashboard';
  }

  switch (role.toUpperCase()) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'COACH':
      return '/coach/dashboard';
    case 'PLAYER':
      return '/player/dashboard';
    default:
      return '/dashboard';
  }
}

/**
 * Check if user has access to a specific dashboard route
 * @param userRole - Current user role
 * @param requiredRole - Required role for the route
 * @returns boolean
 */
export function hasRoleAccess(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;

  // Admin has access to everything
  if (userRole.toUpperCase() === 'ADMIN') return true;

  // Check if user role matches required role
  return userRole.toUpperCase() === requiredRole.toUpperCase();
}

/**
 * Get user role display name in French
 * @param role - User role
 * @returns Localized role name
 */
export function getRoleDisplayName(role: string | undefined): string {
  if (!role) return 'Utilisateur';

  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'Administrateur';
    case 'COACH':
      return 'Coach';
    case 'PLAYER':
      return 'Joueur';
    default:
      return 'Utilisateur';
  }
}

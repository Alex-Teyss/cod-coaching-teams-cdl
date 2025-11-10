import { PrismaClient } from '@prisma/client';

async function globalSetup() {
  console.log('Setting up E2E test environment...');

  const prisma = new PrismaClient();

  try {
    // Clean up any existing test user and related data
    const existingUser = await prisma.user.findUnique({
      where: { email: 'coach@test.com' },
    });

    if (existingUser) {
      // Delete test user (cascades to accounts, sessions, teams, etc.)
      await prisma.user.delete({
        where: { email: 'coach@test.com' },
      });
      console.log('Cleaned up existing test user');
    }

    console.log('E2E test environment ready');
  } catch (error) {
    console.error('Error setting up test environment:', error);
    // Don't throw - allow tests to proceed even if cleanup fails
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;

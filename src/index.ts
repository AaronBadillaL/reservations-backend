import prisma from './config/database';

async function main() {
  try {
    // Simple query to test the connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    // Optionally, list users (if any)
    const users = await prisma.user.findMany();
    console.log('Users:', users);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

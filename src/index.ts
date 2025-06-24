import prisma from './config/database';

async function main() {
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('📋 Tables in database:', tables);
    
    // Check user count
    const userCount = await prisma.user.count();
    console.log('👥 Users in database:', userCount);
    
    // Check available slots count
    const slotCount = await prisma.availableSlot.count();
    console.log('📅 Available slots:', slotCount);
    
    // Check bookings count
    const bookingCount = await prisma.booking.count();
    console.log('📝 Bookings:', bookingCount);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

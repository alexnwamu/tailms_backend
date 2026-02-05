import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
console.log('Connecting to:', connectionString);
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create test users with different roles
  const adminPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tailms.com' },
    update: {},
    create: {
      email: 'admin@tailms.com',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@tailms.com' },
    update: {},
    create: {
      email: 'student@tailms.com',
      password: studentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
    },
  });

  const pendingStudent = await prisma.user.upsert({
    where: { email: 'pending@tailms.com' },
    update: {},
    create: {
      email: 'pending@tailms.com',
      password: studentPassword,
      role: 'STUDENT',
      status: 'PENDING',
    },
  });

  console.log('Test users created:');
  console.log('Admin: admin@tailms.com / admin123');
  console.log('Student: student@tailms.com / student123');
  console.log('Pending Student: pending@tailms.com / student123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  try {
    const userCols: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position`;
    console.log("=== USER TABLE COLUMNS ===");
    for (const col of userCols) {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    }

    const accountCols: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'account' 
      ORDER BY ordinal_position`;
    console.log("\n=== ACCOUNT TABLE COLUMNS ===");
    for (const col of accountCols) {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    }

    const sessionCols: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'session' 
      ORDER BY ordinal_position`;
    console.log("\n=== SESSION TABLE COLUMNS ===");
    for (const col of sessionCols) {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    }

    const accounts = await prisma.account.findMany({ take: 5 });
    console.log("\n=== EXISTING ACCOUNTS ===");
    console.log(JSON.stringify(accounts, null, 2));

    const sessions = await prisma.session.findMany({ take: 5 });
    console.log("\n=== EXISTING SESSIONS ===");
    console.log(JSON.stringify(sessions, null, 2));

    const users = await prisma.user.findMany({ take: 5 });
    console.log("\n=== EXISTING USERS ===");
    console.log(JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

check();

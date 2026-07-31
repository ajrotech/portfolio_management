import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  const projects = await db.project.findMany({ orderBy: { order: 'desc' }, take: 1 });
  if (projects[0] && projects[0].title === 'Test Project from Browser') {
    await db.project.delete({ where: { id: projects[0].id } });
    console.log('Deleted test project');
  } else {
    console.log('No test project found');
  }
  await db.$disconnect();
}

main();

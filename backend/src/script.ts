import { prisma } from '../lib/prismaUtility'

async function main() {
  const allUsers = await prisma.user.findMany()
  console.log(JSON.stringify(allUsers, null, 2))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
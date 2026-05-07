import { PrismaClient, Category, Status } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with initial reports...')

  // Delete existing reports to avoid duplicates if run multiple times
  await prisma.report.deleteMany({})

  const reports = [
    {
      title: 'Need rice and cooking oil',
      description: 'A family of 5 in Kampong Speu needs basic food supplies for the month.',
      category: Category.FOOD,
      latitude: 11.4531,
      longitude: 104.5209,
      status: Status.PENDING,
    },
    {
      title: 'School supplies for 3 kids',
      description: 'Children need uniforms, notebooks, and pens for the upcoming school year.',
      category: Category.EDUCATION,
      latitude: 11.5564,
      longitude: 104.9282,
      status: Status.VERIFIED,
    },
    {
      title: 'Medical checkup required',
      description: 'An elderly person needs assistance getting to the hospital for a checkup.',
      category: Category.HEALTHCARE,
      latitude: 12.0982,
      longitude: 105.1444,
      status: Status.RESOLVED,
    },
  ]

  for (const report of reports) {
    await prisma.report.create({
      data: report,
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

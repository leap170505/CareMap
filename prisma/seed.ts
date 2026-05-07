import { PrismaClient, Category, Status, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with initial reports...')

  // Delete existing data
  await prisma.report.deleteMany({})
  await prisma.user.deleteMany({})

  // Seed Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@caremap.kh',
      password: hashedPassword,
      name: 'CareMap Admin',
      role: Role.ADMIN,
    },
  })
  console.log('Seeded admin user: admin@caremap.kh (password: admin123)')

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

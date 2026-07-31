import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'portfolio_salt_2024').digest('hex')
}

async function main() {
  await prisma.project.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      username: 'johndoe',
      name: 'John Doe',
      password: hashPassword('password123'),
      profile: {
        create: {
          bio: 'Full Stack Developer passionate about building modern web applications with React, Node.js, and cloud technologies. Open source contributor and tech blogger.',
          title: 'Senior Full Stack Developer',
          location: 'San Francisco, CA',
          website: 'https://johndoe.dev',
          github: 'https://github.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          skills: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind CSS', 'GraphQL']),
        },
      },
    },
    include: { profile: true },
  })

  await prisma.project.createMany({
    data: [
      {
        profileId: user1.profile!.id,
        title: 'CloudSync Dashboard',
        description: 'A real-time cloud infrastructure monitoring dashboard built with React and WebSocket. Features live metrics, alerting, and multi-cloud support for AWS, GCP, and Azure.',
        link: 'https://cloudsync.demo',
        repoUrl: 'https://github.com/johndoe/cloudsync',
        techTags: JSON.stringify(['React', 'WebSocket', 'D3.js', 'Express', 'Redis']),
        order: 0,
        featured: true,
      },
      {
        profileId: user1.profile!.id,
        title: 'AI Content Generator',
        description: 'Full-stack application leveraging OpenAI APIs to generate marketing copy, blog posts, and social media content with customizable tone and style presets.',
        link: 'https://aicopy.demo',
        repoUrl: 'https://github.com/johndoe/ai-content-gen',
        techTags: JSON.stringify(['Next.js', 'OpenAI', 'Prisma', 'Tailwind CSS', 'Vercel']),
        order: 1,
        featured: true,
      },
      {
        profileId: user1.profile!.id,
        title: 'TaskFlow CLI',
        description: 'A command-line project management tool for developers. Create boards, track sprints, and manage tasks entirely from the terminal with Git integration.',
        link: '',
        repoUrl: 'https://github.com/johndoe/taskflow-cli',
        techTags: JSON.stringify(['Node.js', 'TypeScript', 'SQLite', 'Commander.js']),
        order: 2,
        featured: false,
      },
      {
        profileId: user1.profile!.id,
        title: 'E-Commerce Microservices',
        description: 'A microservices architecture for an e-commerce platform with service discovery, API gateway, event-driven communication, and containerized deployment.',
        link: 'https://shop.demo',
        repoUrl: 'https://github.com/johndoe/ecommerce-micro',
        techTags: JSON.stringify(['Docker', 'Kubernetes', 'gRPC', 'RabbitMQ', 'MongoDB', 'Go']),
        order: 3,
        featured: false,
      },
      {
        profileId: user1.profile!.id,
        title: 'Design System Library',
        description: 'A comprehensive React component library with 50+ accessible components, theme customization, and Storybook documentation.',
        link: 'https://designsys.demo',
        repoUrl: 'https://github.com/johndoe/design-system',
        techTags: JSON.stringify(['React', 'Storybook', 'Radix UI', 'CSS Modules', 'Jest']),
        order: 4,
        featured: false,
      },
    ],
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      username: 'janedev',
      name: 'Jane Smith',
      password: hashPassword('password123'),
      profile: {
        create: {
          bio: 'Mobile-first developer crafting beautiful cross-platform experiences. Flutter enthusiast and UI/UX advocate.',
          title: 'Mobile Developer & UI Designer',
          location: 'New York, NY',
          website: 'https://janesmith.design',
          github: 'https://github.com/janesmith',
          linkedin: 'https://linkedin.com/in/janesmith',
          twitter: '',
          skills: JSON.stringify(['Flutter', 'Dart', 'React Native', 'Swift', 'Figma', 'Firebase']),
        },
      },
    },
    include: { profile: true },
  })

  await prisma.project.createMany({
    data: [
      {
        profileId: user2.profile!.id,
        title: 'FitTrack Mobile App',
        description: 'A fitness tracking app built with Flutter. Features workout plans, progress charts, social challenges, and integration with Apple Health and Google Fit.',
        link: 'https://fittrack.demo',
        repoUrl: 'https://github.com/janesmith/fittrack',
        techTags: JSON.stringify(['Flutter', 'Dart', 'Firebase', 'Provider', 'Charts']),
        order: 0,
        featured: true,
      },
      {
        profileId: user2.profile!.id,
        title: 'MealPlan UI Kit',
        description: 'A comprehensive UI kit for food and recipe applications. Includes 80+ screens, dark mode support, and Figma components.',
        link: 'https://figma.com/file/mealplan',
        repoUrl: '',
        techTags: JSON.stringify(['Figma', 'UI Design', 'Prototyping', 'Design System']),
        order: 1,
        featured: false,
      },
    ],
  })

  console.log('Seeded successfully!')
  console.log('Demo accounts:')
  console.log('  johndoe / password123')
  console.log('  janedev / password123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

import { PrismaClient, Prisma } from "../../prisma/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST, // Use individual env vars or parse the URL
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5, // Optional connection pool setting
})

const prismaClient = new PrismaClient({ adapter })

export default prismaClient

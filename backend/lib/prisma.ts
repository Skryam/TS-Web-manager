import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

let prisma: PrismaClient;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient({ adapter });
  }
  return prisma
}
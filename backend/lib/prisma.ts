import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

let prisma: PrismaClient;

export const getPrisma = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma
}
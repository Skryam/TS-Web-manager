import { GraphQLError } from "graphql";

const PRISMA_ERROR_CODES: Record<string, string> = {
  P2002: 'ALREADY_EXISTS',     // уникальность
  P2003: 'FK_CONSTRAINT',      // внешний ключ (например, нельзя удалить из-за связей)
  P2025: 'NOT_FOUND',          // запись не найдена
};

export const handlePrismaError = (err: any): never => {
  const code = PRISMA_ERROR_CODES[err.code];

  if (code) {
    throw new GraphQLError(code);
  }

  console.log(err);
  throw new GraphQLError('INTERNAL_ERROR')
}
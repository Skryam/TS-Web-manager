import { GraphQLError } from "graphql";

const PRISMA_ERROR_CODES: Record<string, string> = {
  P2002: 'ALREADY_EXISTS',     // уникальность
  P2003: 'FK_CONSTRAINT',      // внешний ключ (например, нельзя удалить из-за связей)
  P2025: 'NOT_FOUND',          // запись не найдена
};

export const handlePrismaError = (err: any): never => {
  console.log('code:', err)
  const code = PRISMA_ERROR_CODES[err.code];
  console.log('parsedCode:', code)

  if (code) {
    console.log('GraphQLError:', GraphQLError)
    throw new GraphQLError(code);
  }

  console.log(err);
  throw new GraphQLError('INTERNAL_ERROR')
}
import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import { prisma } from '../lib/prisma';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import encrypt from '../lib/secure';
import { z } from 'zod';
import { createUserSchema, userPublicSchema, updateUserSchema } from './schemas/user';
import { createTaskSchema, updateTaskSchema } from './schemas/task';
import { createStatusSchema, updateStatusSchema } from './schemas/status';
import { createLabelSchema, updateLabelSchema} from './schemas/label';


const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    updatedAt: String
  }

  type Task {
    id: ID!
    name: String!
    description: String
    status: Status!
    executor: User
    creator: User!
    labels: [Label!]!
    createdAt: String!
  }

  type Status {
    id: ID!
    name: String!
    createdAt: String!
    tasksWithStatus: [Task!]!
  }

  type Label {
    id: ID!
    name: String!
    createdAt: String!
    tasksWithLabels: [Task!]!
  }





  
  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    password: String
  }

  input CreateTaskInput {
    name: String!
    description: String
    statusId: ID!
    executorId: ID
    labels: [ID]
  }

  input UpdateTaskInput {
    name: String
    description: String
    statusId: ID
    executorId: ID
    labels: [ID]
  }

  input CreateStatusInput {
    name: String!
  }

  input UpdateStatusInput {
    name: String
  }

  input CreateLabelInput {
    name: String!
  }

  input UpdateLabelInput {
    name: String
  }

  type Mutation {
    createUser(data: CreateUserInput!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    deleteUser(id: ID!): User!

    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, data: UpdateTaskInput!): Task!
    deleteTask(id: ID!): Task!

    createStatus(input: CreateStatusInput!): Status!
    updateStatus(id: ID!, data: UpdateStatusInput!): Status!
    deleteStatus(id: ID!): Status!

    createLabel(input: CreateLabelInput!): Label!
    updateLabel(id: ID!, data: UpdateLabelInput!): Label!
    deleteLabel(id: ID!): Label!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User!

    tasks: [Task!]!
    task(id: ID!): Task!

    statuses: [Status!]!
    status(id: ID!): Status!

    labels: [Label!]!
    label(id: ID!): Label!
  }
`;

const resolvers = {
  Query: {
    users: (_, __, { prisma }) => prisma.user.findMany(),
    user: (_, { id }, { prisma }) => prisma.user.findUnique({ where: { id: Number(id) } }),

    tasks: (_, __, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.task.findMany({
        include: {
          status: true,
          creator: true,
          executor: true
        }
      }); 
    },
    task: (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.task.findUnique({
        where: { id: Number(id) },
        include: {
          status: true,
          creator: true,
          executor: true
        }
      })
    },

    statuses: (_, __, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.status.findMany()
    },
    status: (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.status.findUnique({ where: { id: Number(id) } })
    },
    labels: (_, __, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.label.findMany()
    },
    label: (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');
      return prisma.label.findUnique({ where: { id: Number(id) } })
    }
  },

  Mutation: {
    updateUser: async (_, { id, data }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const validated = updateUserSchema.parse(data);
      const { password, ...rest } = validated;
      const dataForPrisma = { ...rest, ...(password && { passwordDigest: encrypt(password) }) };

      return prisma.user.update({
        where: { id: Number(id) },
        data: dataForPrisma,
      });
    },
    deleteUser: async (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.user.delete({
        where: { id: Number(id) },
      });
    },


    createTask: async (_, { input }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      try {
        const validated = createTaskSchema.parse(input);

        return prisma.task.create({
          data: { ...validated, creatorId: user.id },
          include: { status: true, creator: true, executor: true, labels: true }
        });
     } catch (e) {
        console.log(e)
        return e
      }
    },
    updateTask: async (_, { id, data }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const validated = updateTaskSchema.parse(data);

      return prisma.task.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteTask: async (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.task.delete({
        where: { id: Number(id) },
      });
    },
    createStatus: async (_, { input }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      try {
        const validated = createStatusSchema.parse(input);

        return prisma.status.create({
          data: validated,
          include: { tasksWithStatus: true }
        });
     } catch (e) {
        console.log(e)
        return e
      }
    },
    updateStatus: async (_, { id, data }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const validated = updateStatusSchema.parse(data);

      return prisma.status.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteStatus: async (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.status.delete({
        where: { id: Number(id) },
      });
    },

    createLabel: async (_, { input }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      try {
        const validated = createLabelSchema.parse(input);

        return prisma.label.create({
          data: validated,
          include: { tasksWithLabels: true }
        });
     } catch (e) {
        console.log(e)
        return e
      }
    },
    updateLabel: async (_, { id, data }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      const validated = updateLabelSchema.parse(data);

      return prisma.label.update({
        where: { id: Number(id) },
        data: validated,
      });
    },
    deleteLabel: async (_, { id }, { prisma, user }) => {
      if (!user) throw new Error('Unauthorized');

      return prisma.label.delete({
        where: { id: Number(id) },
      });
    },
  },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({ typeDefs, resolvers });

const main = async () => {
  await server.start();

  app.use(cors<cors.CorsRequest>());
  app.use(express.json())
  app.use(session({
    secret: process.env.SESSION_KEY || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({
        prisma,
        user: req.user || null,
      }),
    }),
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false);

        const isValid = encrypt(password) === user.passwordDigest;
        if (!isValid) return done (null, false);

        return done (null, user);
      } catch (err) {
        return done (err);
      }
    }
  ));

  app.post('/signup', express.json(), async (req: Request, res: Response) => {
     try {
        const validated = createUserSchema.parse(req.body);
        const passwordDigest = encrypt(validated.password);

        const user = await prisma.user.create({
          data: {
            firstName: validated.firstName,
            lastName: validated.lastName,
            email: validated.email,
            passwordDigest,
          },
        });

        req.login(user, (err) => {
          if (err) return res.status(500).json({ error: 'Login failed' });
          return res.status(201).json({ id: user.id, email: user.email });
        });
     } catch (e) {
      console.log(e)
        return res.status(400).json({ error: 'User already exists' });
    }
  });

  app.post('/login', express.json(), passport.authenticate('local', { session: true }), (req: Request, res: Response) => {
    type AuthUser = {
      id: number | string;
      email: string;
    };
    
    const user = req.user as AuthUser | undefined;
    res.json({ id: user!.id, email: user!.email });
  });



  app.post('/logout',(req: Request, res: Response) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`Server ready at:`);
    console.log(`   Main page: http://localhost:${PORT}/`);
    console.log(`   GraphQL:   http://localhost:${PORT}/graphql`);
  })
}

main().catch(console.error)
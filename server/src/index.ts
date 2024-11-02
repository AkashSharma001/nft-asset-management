import fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './context';
import { appRouter } from './routes';

const server = fastify({
  maxParamLength: 5000,
});
const PORT = process.env.PORT || 4000;

server.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
});

server.get('/', async () => {
  return { message: 'Fastify Server is running! 🚀' };
});

server.register(fastifyTRPCPlugin, {
  prefix: '/api/trpc',
  trpcOptions: { router: appRouter, createContext }
});

const start = async () => {
  try {
    await server.listen({ port: Number(PORT) });
    console.log(`Server running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 
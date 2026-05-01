#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { taskHandlers } from './handlers/task.js';
import { goalHandlers } from './handlers/goal.js';

const server = new Server(
  { name: 'todo-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const tools = { ...taskHandlers, ...goalHandlers };

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: Object.entries(tools).map(([name, { description, inputSchema }]) => ({
    name,
    description,
    inputSchema
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const handler = (tools as Record<string, typeof tools[keyof typeof tools]>)[name];
  if (!handler) {
    throw new Error(`Unknown tool: ${name}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await Promise.resolve((handler.handler as (args: any) => any)(args));
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

const transport = new StdioServerTransport();
server.connect(transport);

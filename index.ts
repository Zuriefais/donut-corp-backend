import { Server } from 'socket.io';

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
}
main()
  .catch((e) => {
    throw e
  })

const io = new Server(7777, {
  cors: {
    origin: "http://185.165.162.20:25565",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }})

io.on('connection', async (socket) => {
  const allMessages = await prisma.message.findMany()
  console.log('allMessages', allMessages)
  setTimeout(() => {
    io.to(socket.id).emit('all-messages', allMessages)
  }, 500)
  socket.on('send-message', async (message: { author: string, content: string }) => {
    console.log('socket.on(\'send-message\')', message)
    await prisma.message.create({
      data: message
    })
    io.emit('recieve-message', message)
  })
})

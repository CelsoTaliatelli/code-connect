import argon2 from 'argon2'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const users = [
  { name: 'Ada Lovelace', email: 'ada@example.com', password: 'correct-horse' },
  { name: 'Grace Hopper', email: 'grace@example.com', password: 'compiler-first' },
]

const posts = [
  {
    title: 'Como organizar um projeto React que cresce com você',
    content: 'Uma boa estrutura nasce de responsabilidades claras. Separe componentes de domínio, composição de páginas e integrações para que cada mudança continue pequena e previsível.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    author: 'ada@example.com',
  },
  {
    title: 'O que aprendi construindo minha primeira API',
    content: 'Comece pelo contrato, valide as entradas na borda e mantenha as regras de negócio nos services. Essa disciplina deixa os testes mais diretos e os controllers mais honestos.',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    author: 'grace@example.com',
  },
  {
    title: 'Full-text search sem sair do PostgreSQL',
    content: 'Com tsvector, índices GIN e uma query bem formada, é possível entregar uma busca veloz sem carregar todos os posts para a aplicação.',
    thumbnail: null,
    author: 'ada@example.com',
  },
  {
    title: 'Pequenos testes que evitam grandes regressões',
    content: 'Teste o comportamento visível e os contratos das integrações. Um teste curto de permissão costuma proteger mais do que um snapshot enorme.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'grace@example.com',
  },
  {
    title: 'Acessibilidade começa no HTML',
    content: 'Landmarks, labels, foco visível e estados de erro compreensíveis são decisões de produto. A tecnologia assistiva agradece quando a base é semântica.',
    thumbnail: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
    author: 'ada@example.com',
  },
  {
    title: 'Uma rotina de revisão que cabe no dia',
    content: 'Leia primeiro o risco, depois a estética. Procure falhas de comportamento, contratos quebrados e caminhos sem teste antes de discutir preferências de estilo.',
    thumbnail: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1200&q=80',
    author: 'grace@example.com',
  },
]

async function main() {
  await prisma.comment.deleteMany()
  await prisma.postLike.deleteMany()
  await prisma.post.deleteMany()

  const createdUsers = {}
  for (const user of users) {
    createdUsers[user.email] = await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash: await argon2.hash(user.password) },
      create: { name: user.name, email: user.email, passwordHash: await argon2.hash(user.password) },
    })
  }

  const createdPosts = []
  for (const post of posts) {
    createdPosts.push(await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail,
        authorId: createdUsers[post.author].id,
      },
    }))
  }

  await prisma.postLike.createMany({
    data: [
      { postId: createdPosts[0].id, userId: createdUsers['grace@example.com'].id },
      { postId: createdPosts[1].id, userId: createdUsers['ada@example.com'].id },
      { postId: createdPosts[2].id, userId: createdUsers['grace@example.com'].id },
      { postId: createdPosts[3].id, userId: createdUsers['ada@example.com'].id },
      { postId: createdPosts[3].id, userId: createdUsers['grace@example.com'].id },
    ],
  })

  await prisma.comment.createMany({
    data: [
      { postId: createdPosts[0].id, userId: createdUsers['grace@example.com'].id, content: 'Ótimo ponto sobre separar responsabilidades.' },
      { postId: createdPosts[2].id, userId: createdUsers['ada@example.com'].id, content: 'O índice GIN fez bastante diferença aqui.' },
      { postId: createdPosts[3].id, userId: createdUsers['grace@example.com'].id, content: 'Testes de contrato são uma ótima camada.' },
    ],
  })

  console.log(`Seed concluído: ${createdPosts.length} posts, ${users.length} usuários`)
  console.log('Demo: ada@example.com / correct-horse')
  console.log('Demo: grace@example.com / compiler-first')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

import prismaClient from "./prismaClient"
import seedData from "./seedData.json"

export const dbSeed = async () => {
  const teste = await prismaClient.produto.findFirst()
  const isNotEmpty = !!(await prismaClient.produto.findFirst())
  if (isNotEmpty) return
  await prismaClient.produto.createMany({
    data: seedData,
  })
}

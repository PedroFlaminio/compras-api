import prismaClient from "./prismaClient";
import seedData from "./seedData.json";

export const dbSeed = async () => {
  console.log("Seeding database...");
  const teste = await prismaClient.produto.findFirst();
  console.log(teste);
  const isNotEmpty = !!(await prismaClient.produto.findFirst());
  if (isNotEmpty) return;
  await prismaClient.produto.createMany({
    data: seedData,
  });
};

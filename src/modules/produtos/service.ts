import prismaClient from "../../utils/prismaClient";
import { InsertProduto } from "./model";
export const ProdutoService = {
  list: async () => {
    try {
      const prod = prismaClient.produto.findMany();
      return prod;
    } catch (e) {
      throw e;
    }
  },
  insert: async (novoProduto: InsertProduto) => {
    try {
      const prod = prismaClient.produto.create({
        data: novoProduto,
      });
      return prod;
    } catch (e) {
      throw e;
    }
  },
};

import { da, th } from "zod/v4/locales";
import prismaClient from "../../utils/prismaClient";
import { InsertCompra } from "./model";
import { HttpError } from "../..";
export const CompraService = {
  list: async () => {
    try {
      const prod = await prismaClient.compra.findMany();
      return prod.map((c) => {
        return { ...c, data: c.data.toLocaleDateString("pt-BR") };
      });
    } catch (e) {
      throw e;
    }
  },
  getById: async (id: number) => {
    try {
      const compra = await prismaClient.compra
        .findUniqueOrThrow({
          where: { id },
          include: { produtos: { include: { produto: true } } },
        })
        .catch(() => {
          throw new HttpError("Compra não encontrada", 404);
        });
      return { ...compra, data: compra.data.toLocaleDateString("pt-BR") };
    } catch (e) {
      throw e;
    }
  },
  insert: async (body: InsertCompra) => {
    try {
      const { newProdutos, produtos } = body;
      for (const produto of newProdutos) {
        const newProduto = await prismaClient.produto.create({
          data: { produto: produto.produto, categoria: produto.categoria, unidadeMedida: "UN" },
        });
        produtos.push({ id_produto: newProduto.id, quantidade: produto.quantidade });
      }
      const createProdutos = produtos.map((item) => {
        return { id_produto: item.id_produto, quantidade: item.quantidade };
      });
      const compra = await prismaClient.compra.create({
        data: { produtos: { create: createProdutos } },
        include: { produtos: { include: { produto: true } } },
      });
      return compra;
    } catch (e) {
      throw e;
    }
  },
};

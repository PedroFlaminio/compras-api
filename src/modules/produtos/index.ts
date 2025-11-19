import { Elysia } from "elysia";
import { ListProdutosResponse, Produto, InsertProdutoSchema, InsertProduto } from "./model";
import { ProdutoService } from "./service";

const ProdutosController = {
  listProdutos: async () => {
    const lista = ProdutoService.list();
    return lista;
  },
  insertProduto: async ({ body }: { body: InsertProduto }) => {
    const novoProduto = ProdutoService.insert(body);
    return novoProduto;
  },
};
export const produtosRoutes = new Elysia({ prefix: "/produtos" })
  .get("/", ProdutosController.listProdutos, { response: { 200: ListProdutosResponse } })
  .post("/", ProdutosController.insertProduto, { body: InsertProdutoSchema, response: { 200: Produto } });

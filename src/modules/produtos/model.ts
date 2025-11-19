import zod from "zod";

export const Produto = zod.object({
  id: zod.number(),
  produto: zod.string(),
  categoria: zod.string(),
  unidadeMedida: zod.string(),
});

export const InsertProdutoSchema = Produto.omit({ id: true });
export type InsertProduto = zod.infer<typeof InsertProdutoSchema>;
export const ListProdutosResponse = zod.array(Produto);

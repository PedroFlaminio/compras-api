import zod from "zod";
import { Produto } from "../produtos/model";

export const ProdutoCompra = zod.object({
  id: zod.number(),
  id_produto: zod.number(),
  id_compra: zod.number(),
  quantidade: zod.number(),
  produto: Produto,
});

export const CompraSchema = zod.object({
  id: zod.number(),
  data: zod.string(),
  produtos: zod.array(ProdutoCompra),
});

export const InsertCompraSchema = zod.object({
  produtos: zod.array(zod.object({ quantidade: zod.number(), id_produto: zod.number() })),
  newProdutos: zod.array(zod.object({ quantidade: zod.number(), produto: zod.string(), categoria: zod.string() })),
});
// export const InsertCompraSchema = zod.array(zod.object({ quantidade: zod.number(), produto: Produto }));
export const ListaComprasSchema = zod.array(zod.object({ id: zod.number(), data: zod.string() }));

export type ListaCompras = zod.infer<typeof ListaComprasSchema>;
export type InsertCompra = zod.infer<typeof InsertCompraSchema>;
export type Compra = zod.infer<typeof CompraSchema>;
export const ListProdutosResponse = zod.array(Produto);

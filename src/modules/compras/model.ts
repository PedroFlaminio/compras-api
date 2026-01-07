import zod, { z } from "zod"
import { Produto } from "../produtos/model"

export const ProdutoCompra = zod.object({
  id: zod.number(),
  id_produto: zod.number(),
  id_compra: zod.number(),
  quantidade: zod.number(),
  comprado: zod.boolean().default(false),
  produto: Produto,
})

export const CompraSchema = zod.object({
  id: zod.number(),
  dataCriada: zod.string(),
  dataRealizada: zod.string().nullable(),
  produtos: zod.array(ProdutoCompra),
  titulo: zod.string(),
  status: zod.string(),
})

export const InsertCompraSchema = zod.object({
  produtos: zod.array(zod.object({ quantidade: zod.number(), id_produto: zod.number() })),
  novosProdutos: zod.array(zod.object({ quantidade: zod.number(), produto: zod.string(), categoria: zod.string() })),
  titulo: zod.string(),
})
// export const InsertCompraSchema = zod.array(zod.object({ quantidade: zod.number(), produto: Produto }));
export const ListaComprasSchema = zod.array(
  zod.object({
    id: zod.number(),
    dataCriada: zod.string(),
    count: zod.number(),
    titulo: zod.string(),
    status: zod.string(),
  })
)
export const RealizCompraSchema = zod.object({
  id_compra: zod.number(),
  produtos: zod.array(zod.number()),
})

export type ListaCompras = zod.infer<typeof ListaComprasSchema>
export type InsertCompra = zod.infer<typeof InsertCompraSchema>
export type RealizCompras = zod.infer<typeof RealizCompraSchema>
export type Compra = zod.infer<typeof CompraSchema>
export const ListProdutosResponse = zod.array(Produto)

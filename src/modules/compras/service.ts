import { InsertCompra, RealizCompras, UpdateCompra } from "./model"
import { HttpError } from "../.."
import prismaClient from "../../utils/prismaClient"
export const CompraService = {
  list: async () => {
    try {
      const prod = await prismaClient.compra.findMany({
        include: { _count: { select: { produtos: true } } },
        orderBy: { dataCriada: "desc" },
      })
      const resp = prod.map((c) => {
        return { ...c, dataCriada: c.dataCriada.toLocaleDateString("pt-BR"), count: c._count.produtos }
      })
      return resp
    } catch (e) {
      throw e
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
          throw new HttpError("Compra não encontrada", 404)
        })
      return {
        ...compra,
        dataCriada: compra.dataCriada.toLocaleDateString("pt-BR"),
        dataRealizada: compra.dataRealizada ? compra.dataRealizada.toLocaleDateString("pt-BR") : null,
      }
    } catch (e) {
      throw e
    }
  },
  insert: async (body: InsertCompra) => {
    try {
      const { novosProdutos, produtos, titulo } = body
      for (const produto of novosProdutos) {
        const newProduto = await prismaClient.produto.create({
          data: { produto: produto.produto, categoria: produto.categoria, unidadeMedida: "UN" },
        })
        produtos.push({ id_produto: newProduto.id, quantidade: produto.quantidade })
      }
      const createProdutos = produtos.map((item) => {
        return { id_produto: item.id_produto, quantidade: item.quantidade }
      })
      const compra = await prismaClient.compra.create({
        data: { produtos: { create: createProdutos }, titulo, status: "PENDENTE" },
        include: { produtos: { include: { produto: true } } },
      })
      await prismaClient.compraHistorico.create({
        data: { id_compra: compra.id, status: "Lista de compras criada." },
      })
      return compra
    } catch (e) {
      throw e
    }
  },
  update: async (id: number, body: UpdateCompra) => {
    const compraAtual = await prismaClient.compra.findUnique({ where: { id } })
    if (!compraAtual) throw new HttpError("Compra não encontrada", 404)
    if (compraAtual.status !== "PENDENTE") {
      throw new HttpError("Somente compras pendentes podem ser editadas", 409)
    }

    const produtosSelecionados = body.produtos.filter(({ quantidade }) => quantidade > 0)
    const novosProdutos = body.novosProdutos.filter(({ quantidade }) => quantidade > 0)

    return prismaClient.$transaction(async (transaction) => {
      const produtosCriados = await Promise.all(
        novosProdutos.map(async (produto) => {
          const novoProduto = await transaction.produto.create({
            data: { produto: produto.produto, categoria: produto.categoria, unidadeMedida: "UN" },
          })
          return { id_produto: novoProduto.id, quantidade: produto.quantidade }
        })
      )

      await transaction.compraProduto.deleteMany({ where: { id_compra: id } })
      const produtos = [...produtosSelecionados, ...produtosCriados]
      const compra = await transaction.compra.update({
        where: { id },
        data: {
          titulo: body.titulo,
          produtos: {
            create: produtos.map(({ id_produto, quantidade }) => ({ id_produto, quantidade })),
          },
        },
        include: { produtos: { include: { produto: true } } },
      })
      await transaction.compraHistorico.create({
        data: { id_compra: id, status: "Lista de compras editada." },
      })
      return compra
    })
  },
  realizaCompra: async (body: RealizCompras) => {
    try {
      const { id_compra, produtos } = body
      const compra = await prismaClient.compra.update({
        where: { id: id_compra },
        data: {
          status: "REALIZADA",
          dataRealizada: new Date(),
        },
      })
      await prismaClient.compraHistorico.create({
        data: { id_compra: compra.id, status: "Compra realizada." },
      })
      await prismaClient.compraProduto.updateMany({
        where: { id_compra: id_compra, id_produto: { in: produtos } },
        data: { comprado: true },
      })
      return compra
    } catch (e) {
      throw e
    }
  },
}

import { Elysia } from "elysia"
import { CompraSchema, InsertCompraSchema, ListaComprasSchema, RealizCompraSchema, UpdateCompraSchema } from "./model"
import { CompraService } from "./service"
import { HttpError } from "../.."

export const comprasRoutes = new Elysia({ prefix: "/compras" })

  .get(
    "/",
    async () => {
      try {
        const lista = await CompraService.list()
        return lista
      } catch (e) {
        throw e
      }
    },
    { response: { 200: ListaComprasSchema } }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const idNumber = parseInt(id)
        const compra = await CompraService.getById(idNumber)
        if (!compra) throw new HttpError("Compra não encontrada", 404)
        return compra
      } catch (e) {
        throw e
      }
    },
    { response: { 200: CompraSchema }, detail: { description: "Retorna informação da compra com o ID informado." } }
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        await CompraService.insert(body)
        return { message: "Sucesso ao inserir compra" }
      } catch (e) {
        throw e
      }
    },
    { body: InsertCompraSchema }
  )
  .put(
    "/:id",
    async ({ body, params: { id } }) => {
      const idNumber = parseInt(id)
      if (Number.isNaN(idNumber)) throw new HttpError("ID da compra inválido", 400)
      await CompraService.update(idNumber, body)
      return { message: "Sucesso ao atualizar compra" }
    },
    { body: UpdateCompraSchema }
  )
  .put(
    "/realizar",
    async ({ body }) => {
      try {
        await CompraService.realizaCompra(body)
        return { message: "Sucesso ao realizar compra" }
      } catch (e) {
        throw e
      }
    },
    { body: RealizCompraSchema }
  )

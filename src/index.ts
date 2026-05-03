import { Elysia } from "elysia"
import { produtosRoutes } from "./modules/produtos"
import { comprasRoutes } from "./modules/compras"
import { dbSeed } from "./utils/seed"
import { cors } from "@elysiajs/cors"
import { openapi } from "@elysiajs/openapi"
import * as z from "zod"

export class HttpError extends Error {
  constructor(message: string, public status = 500) {
    super(message)
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export const createApp = () =>
  new Elysia({ prefix: "/compras-api" })
    .onError(({ error, status }) => {
      if (error instanceof HttpError) return status(error.status, error)
      console.error(error)
      return status(400, { message: "Erro interno de servidor" })
    })
    .use(produtosRoutes)
    .use(comprasRoutes)
    .get("/seed", dbSeed)

// App completo com plugins
export const app = createApp()
  .use(cors())
  .use(openapi({ mapJsonSchema: { zod: z.toJSONSchema } }))

if (import.meta.main) {
  app.listen(8080)
  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
}

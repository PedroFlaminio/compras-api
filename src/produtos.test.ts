import { describe, expect, it, test } from "vitest"
import Elysia from "elysia"
import { treaty } from "@elysiajs/eden"
import { produtosRoutes } from "./modules/produtos"
import { app } from "."

// const app = new Elysia().use(produtosRoutes)
// const api = treaty(app)
// describe("Elysia", () => {
//   it("returns a response", async () => {
//     const resp = await api.produtos.get()

//     expect(resp.status).toBe(200)
//   })
// })

// const app = new Elysia().get("/hello", "hi")

// const api = treaty(app)

// describe("Elysia", () => {
//   it("returns a response", async () => {
//     const { data, error } = await api.hello.get()

//     expect(data).toBe("hi")
//   })
// })

describe("Produtos Routes", () => {
  it("GET /produtos should return 200 OK", async () => {
    // O prefix já está incluído no app, então a URL completa fica:
    const response = await app.handle(new Request("http://localhost/compras-api/produtos"))

    expect(response.status).toBe(200)
  })
})

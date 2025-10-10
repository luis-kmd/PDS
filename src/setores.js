const express = require("express")
const router = express.Router()
const db = require("./db")

// GET /api/setores - Buscar todos os setores
router.get("/", async (req, res) => {
  try {
    const [setores] = await db.query("SELECT * FROM Setor")

    console.log("\n>>> Rota /api/setores acessada")
    console.log(">>> Total de setores:", setores.length)
    console.table(setores)

    res.json(setores)
  } catch (error) {
    console.error("Erro ao buscar setores:", error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    const user = req.session?.user
    if (!user) return res.status(401).end()

    if (req.method === 'POST') {
      try {
        const book = JSON.parse(req.body)
        const result = await db.book.add(user.id, book)
        if (result === null) {
          await req.session.destroy()
          return res.status(401).end()
        }
        return res.status(200).end()
      } catch(err) {
        return res.status(400).json({ error: err.message })
      }
    }

    if (req.method === 'DELETE') {
      try {
        const { id } = JSON.parse(req.body)
        const result = await db.book.remove(user.id, id)
        if (result === null) {
          await req.session.destroy()
          return res.status(401).end()
        }
        return res.status(200).end()
      } catch(err) {
        return res.status(400).json({ error: err.message })
      }
    }

    return res.status(404).end()
  },
  sessionOptions
)
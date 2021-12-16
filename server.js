import express from 'express'
import multer from 'multer'
import crypto from 'crypto'
import fs from 'fs-extra'
import path from 'path'
// import CJKFontSplitter from '@xenyo/cjk-font-splitter'

/**
 * Express middleware
 */
const app = express()

const upload = multer({ dest: 'data/uploads' })

app.post(
  '/cjk-font',
  upload.single('fontFile'),
  async (req, res, next) => {
    const { file } = req
    const [, ext] = file.mimetype.split('/')
    const readStream = fs.createReadStream(file.path)
    const hash = crypto.createHash('sha256')
    readStream.on('data', (chunk) => hash.update(chunk))
    readStream.on('close', async () => {
      const fileName = `${hash.digest('hex')}.${ext}`
      const newPath = path.join(path.dirname(file.path), fileName)
      await fs.rename(file.path, newPath)
      file.filename = fileName
      file.path = newPath
      next()
    })
  },
  async (req, res) => {
    res.send({ your: 'font here' })
  },
)

app.listen(3000)

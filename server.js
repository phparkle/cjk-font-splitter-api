import CJKFontSplitter from '@xenyo/cjk-font-splitter'
import Fastify from 'fastify'
import multer from 'fastify-multer'
import tmp from 'tmp'
import fs from 'fs'

/**
 * Multer
 */
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      tmp.dir((err, path, cleanup) => {
        if (err) throw err
        req.cleanup = cleanup
        cb(null, path)
      })
    },
  }),
})

/**
 * Fastify
 */
const fastify = Fastify({ logger: true })
fastify.register(multer.contentParser)

fastify.post(
  '/split-font',
  { preHandler: upload.single('fontFile') },
  async (request, reply) => {
    const {
      fontDisplay,
      fontFamily,
      fontWeight,
      formats,
      locale,
      srcPrefix,
    } = request.body

    const { file } = request

    const zipFilePath = await CJKFontSplitter({
      fontDisplay,
      fontFamily,
      fontWeight,
      formats: formats.split(','),
      inputFontFilePath: file.path,
      locale,
      outputPath: file.destination,
      srcPrefix,
    })

    const stream = fs.createReadStream(zipFilePath)
    reply.type('application/zip').send(stream)
  },
)

fastify.listen(3000, '0.0.0.0')

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

const readStream = fs.createReadStream('data/input/NotoSerifSC-Regular.otf')

const formData = new FormData()
formData.append('fontDisplay', 'swap')
formData.append('fontFamily', 'Noto Serif SC')
formData.append('fontWeight', 400)
formData.append('formats', 'woff2,woff')
formData.append('locale', 'sc')
formData.append('srcPrefix', '../webfonts')
formData.append('fontFile', readStream)

const res = await axios.post('http://localhost:3000/cjk-font', formData, {
  headers: formData.getHeaders(),
  maxBodyLength: 256 * 1024 * 1024,
})

console.log(res.data)

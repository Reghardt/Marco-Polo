import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/trpc" : {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false
      },
    },
    https: {
      key: fs.readFileSync('./ssl/server.key'),
      cert: fs.readFileSync('./ssl/server.crt')
    },
    port: 3000
  },
  
})

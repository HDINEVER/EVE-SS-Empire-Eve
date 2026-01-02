import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// 自定义插件：复制 Cloudflare Pages 配置文件并排除大文件
function cloudflareFilesPlugin(): Plugin {
  return {
    name: 'cloudflare-files',
    closeBundle() {
      // 复制 _redirects 和 _headers 到 dist
      const filesToCopy = ['_redirects', '_headers'];
      filesToCopy.forEach(file => {
        const src = path.resolve(__dirname, file);
        const dest = path.resolve(__dirname, 'dist', file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`Copied ${file} to dist/`);
        }
      });

      // 删除大模型文件（模型已托管在 R2 CDN）
      const largeFiles = [
        'dist/models/ship.glb',
        'dist/models/ship_optimized.glb'
      ];
      largeFiles.forEach(file => {
        const filePath = path.resolve(__dirname, file);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Removed large file: ${file}`);
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), cloudflareFilesPlugin()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

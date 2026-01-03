import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// Draco 解码器路径 (Google CDN)
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

// 默认模型 URL（Imperial Issue），从 R2 CDN 加载
const DEFAULT_MODEL_URL = 'https://pub-ef918f4135654b1caa2833736c639ae1.r2.dev/models/ship_optimized.glb';

interface SpaceshipProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const Spaceship: React.FC<SpaceshipProps> = ({ 
  modelPath, 
  scale = 3.2, 
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) => {
   const group = useRef<Group>(null);
   
   // 如果提供了本地路径，使用本地模型；否则使用默认的 R2 模型
   const modelUrl = modelPath || DEFAULT_MODEL_URL;
   const { scene } = useGLTF(modelUrl, DRACO_PATH);

   // Subtle hover + slow roll to keep the model alive.
   useFrame(({ clock }) => {
      if (!group.current) return;
      const t = clock.elapsedTime;
      group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
      group.current.rotation.y = rotation[1] + t * 0.1;
   });

   return (
      <primitive
         ref={group}
         object={scene}
         scale={scale}
         position={position}
         rotation={rotation}
         castShadow
         receiveShadow
         dispose={null}
      />
   );
};

// 预加载默认模型
useGLTF.preload(DEFAULT_MODEL_URL, DRACO_PATH);

export default Spaceship;
- **深度写入**：关闭以避免遮挡问题

### 3. 性能优化
- 使用本地 WebP 文件代替外部链接
- 减少网络延迟
- 优化加载速度

---

## 🎨 效果说明

新的星空背景将：
- ✨ 显示高清星系图像（螺旋星系）
- 🌌 缓慢旋转营造深空氛围
- 🔗 **无可见 UV 接缝**
- 🚀 快速加载（WebP 优化）
- 🎭 与粒子星场层叠融合

---

## 🛠️ 技术细节

### 转换脚本参数
```javascript
{
  quality: 95,    // 高质量（1-100）
  effort: 6,      // 最高压缩效率（0-6）
  lossless: false // 有损压缩（更小的文件）
}
```

如果需要**完全无损**压缩（文件会更大）：
编辑 `scripts/convert-starfield.mjs`，将 `lossless` 改为 `true`

### 纹理设置参数
```typescript
texture.wrapS = THREE.RepeatWrapping;           // X 轴重复
texture.wrapT = THREE.ClampToEdgeWrapping;      // Y 轴夹边
texture.anisotropy = 16;                        // 各向异性过滤
texture.minFilter = THREE.LinearMipmapLinearFilter;
texture.magFilter = THREE.LinearFilter;
texture.colorSpace = THREE.SRGBColorSpace;
```

---

## 📦 文件位置

```
public/
  images/
    galaxy-source.jpg      ← 你需要保存的原始图片
    galaxy-background.webp ← 转换脚本自动生成
```

---

## ❓ 常见问题

**Q: 我想使用完全无损的 WebP？**
A: 编辑 `scripts/convert-starfield.mjs`，设置 `lossless: true`

**Q: 图片还是有接缝？**
A: 检查图片本身的接缝，可能需要在 Photoshop 中使用 "Offset" 滤镜预处理

**Q: 想调整背景透明度？**
A: 编辑 [components/Scene/Starfield.tsx](components/Scene/Starfield.tsx#L37)，调整 `opacity` 值（0.0-1.0）

**Q: 背景旋转太快/太慢？**
A: 编辑 [components/Scene/Starfield.tsx](components/Scene/Starfield.tsx#L29)，调整 `delta * 0.003` 中的数值

---

## 🚀 快速开始

```bash
# 1. 保存图片到 public/images/galaxy-source.jpg
# 2. 转换图片
npm run convert-starfield

# 3. 启动开发服务器
npm run dev
```

完成！享受你的新星空背景吧！ ✨

# ARENA — Interactive 3D Cyberpunk Facility & Floor Map

**ARENA** is a futuristic, high-performance web application designed for a state-of-the-art cyberpunk competitive gaming facility. Built with React, Vite, Three.js (`@react-three/fiber`, `@react-three/drei`), Tailwind CSS, and Lucide Icons.

---

## ⚡ Visual Identity

ARENA follows a strict Cyberpunk / Technical Grid aesthetic:

- **Deep Void Black** (`#0a0a0f`)
- **Electric Green** (`#00ff88`)
- **Cyan** (`#00d4ff`)
- **Magenta** (`#ff00ff`)
- **Gold & Red Accents** (`#ffd166` / `#ff3366`)
- **Typography**:
  - `Orbitron` — Major Headings
  - `Share Tech Mono` — Technical UI
  - `JetBrains Mono` — Body & Terminal Text
- **Effects**: CRT Scanlines, Chamfered Clip-path Panels, Subtle RGB Split Glitch Text, Web Audio API Sound Synthesizer.

---

## 🎮 Features

1. **Launch Page (`/`)**:
   - Cyberpunk system initialization sequence with animated logs.
   - 3D ARENA Core rotating model with green emissive core and glowing rings.
   - `[ ENTER ARENA ]` entry trigger.

2. **Interactive 3D Floor Map (`/arena`)**:
   - Built using React Three Fiber.
   - 3D interactive rooms representing **ENTRY**, **RECEPTION**, **SPHERE 01**, **SPHERE 02**, **SPHERE ELITE**, **CYBER LOUNGE**, and **SYNTH KITCHEN**.
   - Hover elevation, neon edge brighten, pointer cursor, and Drei HTML label overlay with live capacity stats.
   - Camera perspective controls with subtle mouse move parallax.
   - Live hardware specs drawer and zone selection controls.

3. **2D Blueprint Fallback**:
   - Accessible 2D technical blueprint map toggleable from HUD header or active when WebGL is unavailable.

4. **Room Terminal Views (`/sphere1`, `/sphere2`, `/elite`, `/lounge`, `/kitchen`, `/reception`, `/entry`)**:
   - Real-time cryogenic temperature, FPS, latency, and system load telemetry.
   - Comprehensive hardware breakdown (RTX 5090 / 5080 rigs, 540Hz QD-OLED displays, studio monitors).

5. **Design System Test Area (`/design-system`)**:
   - Visual test environment for buttons, chamfered panels, status badges, typography, and glitch text effects.

---

## 🛠️ How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build Application**:
   ```bash
   npm run build
   ```

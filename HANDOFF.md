# Planet game: shared rules for every worker session

Deadline: hand work back by the time in your brief. The coordinator reviews and merges.

## Project
- SvelteKit + Three.js browser game. Run with `npm run dev -- --port <your port> --strictPort` from this folder.
- Check before you report: `npx svelte-check --tsconfig ./tsconfig.json --threshold error` must print 0 errors, and `npm run build` must finish.
- The planet is radius 42 (`PLANET_RADIUS` in `src/lib/game/planet.ts`). A person or robot is about 1.8 units tall.
- Four zones, ids and centres in `src/lib/game/biomes.ts`: `river` 能量河流, `citadel` 铁堡, `ark` 方舟号, `fortress` 暗影要塞. The energy channels (the old "ocean") wind between them. Do not change zone ids, names or centres.
- Scenery is baked from primitives into merged meshes. Shared helpers live in `src/lib/game/kit.ts` (`part`, `footprint`, `emit`, `G` shapes, `rnd`, `pick`). Glowing parts go in `c.glow`, solid parts in `c.solid`. Register a `footprint` for anything the player should not walk through.
- `src/lib/game/props.legacy.txt` is the old scenery file, kept only as a reference for how props were built. Do not import it.
- Dev helper in the browser console: `window.__game.debugTeleport('citadel')` jumps the player near a zone centre.

## Hard rules
1. Only edit the files listed as yours in your brief. If you need a change elsewhere, stop and say so in your final report; do not make it.
2. No logos, faction symbols or emblems of any real franchise anywhere (no Autobot or Decepticon marks, no Transformers names). Shapes and colours only.
3. Every model is built in code from primitives. No downloaded models, textures or images.
4. Keep it light: scenery for your part should add at most a few thousand triangles' worth of parts per landmark. The game must stay smooth.
5. Do not run git commands. The coordinator commits.
6. Do not add npm packages.

## Shared layout every session must respect
- Each zone centre (east 0, north 0) holds that zone's beacon. Keep a circle of radius 3 around it free of solid props.
- Each zone has one controllable robot standing at (east 4, north -4). Keep a circle of radius 1.5 there free.
- The player starts in the river zone at about (east 1.4, north -3.6). Keep it free.
- A robot must be able to walk from every zone to every other zone. Leave gaps in walls and leave walkable ground or bridges across the energy channels.
- Landmarks sit within about 18 surface units of their zone centre. Zone centres are about 80 units apart.

## Controls, final mapping (for anyone writing help text)
- Arrow keys or W A S D: up and down move forward and back, left and right turn.
- Shift: run, or boost in vehicle form. Space: jump, robot form only.
- F: transform between robot form and vehicle form.
- E: interact with a beacon. Click another robot to take control of it. Tab: back to the protagonist.
- M: globe view. J: journal. H: help.

## When you finish
- Look at your work in the Browser preview yourself before reporting.
- Final message: what you built, which files you changed, what is not done or looks wrong. Type errors in files that are not yours belong to another session; mention them, do not fix them.

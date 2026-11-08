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

## When you finish
- Save 2 to 3 screenshots of your work into `shots/` (use the Browser preview tools if you have them; otherwise describe what to look at).
- Final message: what you built, which files you changed, what is not done or looks wrong.

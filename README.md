# kosu!

A complete recreation  of [osu! lazer](https://github.com/ppy/osu) in TypeScript using a modified version of [Pixi.JS](https://github.com/konekowo/pixijs).

Note: This is **NOT** a port, this is a recreation, so some features may be innacurate to the actual game.
However, this also borrows some code from the actual game, so it may not be that innacurate.

### Why make a recreation of osu! lazer?
- Because this is for devices that can't play on real osu! lazer, such as chromebooks
or managed devices that aren't allowed to download anything. I'm also doing this to 
get better at game development and optimization techniques.

## Commands

- `npm run build` - starts build procedure
- `npm run start` - starts web server on localhost:8080 (doesn't watch for changes, use `npm run dev` for that)
- `npm run dev` - starts development server and watches for file changes on localhost:8080
- `npm run lint` - generate code coverage report


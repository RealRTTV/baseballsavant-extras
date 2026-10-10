# Making Custom Stats

So you want to make your own custom stats? understandable.

Before you make a custom stat file, you can decide to  either write a JS custom stat, or a WASM custom stat. The JS stats take ~3x-5x longer to parse for a full season, but they're JS so they're super easy to modify and create. Note that 90%+ of the time spent on calculating a custom stat is spent loading the CSV, the speedup in WASM comes from loading it to an struct-native format instead of memory-inefficent JS objects.

Here's the format-independent flow of a custom stat:
1. Load the stats "cache" from [IDB](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase) for a specific active season. If the stat cache does not exist for that season, `create_cache` will be invoked.
    ```typescript
    interface StatCache<T extends object | string> {
        /** The actual cache of entry by MLB player id. */
        by_player: Record<string, T>,
        /** List of already calculated dates. */
        cached_dates: string[],
        /** Optional. */
        /** If left unsupplied, calculated as 25% of the max samples (by player) */
        qualification_threshold?: number,
        /** Optional. */
        /** If true, will supply rttv.ca subsidiary CSV data */
        uses_subsidiary_csv?: boolean,
    
        /** and optionally as many more as it would like. */
        [key: string]: unknown,
    };
    ```
2. Selects downloaded dates that do not appear in `cached_dates` (`YYYY-MM-DD` strings)
3. If there are **any** dates that have not been parsed, before actually parsing them. `on_incremental` will be called to indicate an incremental run is being done. For example, if you have a multi-pass stat that needs to sift through all the data multiple times in-order. An `on_incremental` implementation would clear out all the cached data and start the processing from scratch.
4. `apply` is called. In JS this is an already parsed `StatcastRow[]` and `SubsidiaryRow[] | nullish`. In WASM this is a pointer to CSV bytes from the DB for that date.
5. `on_finish_apply` is called, if it returns `rerun` (and removes the cached dates), another pass will run through. If it returns `false`, the data analysis will stop here.
6. Distribution Data is calculated. This means baseballsavant-extras will run through every key in `by_player` and request `samples` and `value` for each value type in the `by_player` map.

# Creating JS Stats

Creating JS stats is relatively easy, we'll break down an example file and how it works.

Here's "First Pitch Strike %":
```javascript
var FIRST_PITCH_STRIKE = {
	create_cache: () => ({
		by_player: {},
		cached_dates: []
	}),
	on_incremental: (_) => {},
	apply: ({ by_player }, rows, _) => {
		for (const row of rows) if (row.strikes === 0 && row.balls === 0) {
			const id = String(row.pitcher);
			const entry = by_player[id] ??= { n: 0, t: 0 };
			entry.t += 1;
			entry.n += row.type === "S" || row.type === "X" ? 1 : 0;
		}
	},
	on_finish_apply: () => false,
	value: ({ n, t }) => 100 * n / t,
	samples: ({ t }) => t,
	property: {
		label: "FPS %",
		value: "first_pitch_strike",
		percent_value: "percent_rank_first_pitch_strike",
		display_type: 3,
		wants_subsidiary_csv: false
	}
};
export { FIRST_PITCH_STRIKE };
```

Here we see all the functions described above in the control-flow for stat parsing. `create_cache`, `on_incremental`, `apply`, `on_finish_apply`, `value`, `samples`. Plus, `property`.

Note that JS can actually export multiple stats per file (unlike WASM).

Important small details:
1. `value` returns a number that is both used for mean & std calculations, and for displaying. Since we want our FPS % stat to show 23.4 for 23.4%, the returned value is multiplied by 100.
2. `samples` is purely used for qualification threshold purposes, if you define your own qualification threshold, players will only show as qualified on baseballsavant if they have `samples` >= `qualification_threshold`.
3. `display_type` is an ordinal in an enum [DisplayType](https://github.com/RealRTTV/baseballsavant-extras/blob/main/src/utils/stats/module.ts#L38).

# Creating WASM Stats

Just check the rust code in `rust-wasm`.

import { BaseSource, DduOptions, Item, SourceOptions } from "https://deno.land/x/ddu_vim@v2.8.4/types.ts";
import { Denops, fn } from "https://deno.land/x/ddu_vim@v2.8.4/deps.ts";
import { join } from "https://deno.land/std@0.186.0/path/mod.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.4.0/file.ts";

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
    override kind = "file";

    override gather(args:{
        denops: Denops;
        options: DduOptions;
        sourceOptions: SourceOptions;
        sourceParams: Params;
        input: string;
    }): ReadableStream<Item<ActionData>[]> {
        return new ReadableStream({
            async start(controller) {
                const arglist = await fn.argv(args.denops) as string[];
                let items: Item<ActionData>[] = [];
                for await (const arg of arglist){
                    items.push({word: arg, action: {path: arg}});
                }

                controller.enqueue(
                    items
                );

                controller.close();
            },
        });
    }

    override params(): Params {
        return {};
    }
}

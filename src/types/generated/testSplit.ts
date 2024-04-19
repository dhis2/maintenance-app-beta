import { Append, Tail, Concat, Length } from 'ts-toolbelt/out/List/Concat'
import { Split } from 'ts-toolbelt/out/String/Split'
import { Cast } from 'ts-toolbelt/out/Any/Cast'
import { IndexOf } from 'ts-toolbelt/out/List/IndexOf'

type SplitFieldFilter<
    S extends string,
    T extends string[] = []
> = S extends `${infer Before},${infer After}`
    ? Before extends `${infer Start}[${infer _}]${infer End}`
        ? SplitFieldFilter<
              `${Start}[${End},${After}`,
              Append<T, `${Start}[${End}`>
          >
        : SplitFieldFilter<After, Append<T, Before>>
    : Append<T, S>

type SplitBrackets<S extends string> =
    S extends `${infer Start}[${infer _}]${infer End}`
        ? Append<SplitBrackets<End>, `${Start}[`>
        : [S]

type Join<S extends string[]> = Cast<JoinRec<S>, string>

type JoinRec<S extends string[], R extends string[] = []> = S extends [
    infer F,
    ...infer L
]
    ? F extends `${infer Start}[${infer _}`
        ? JoinRec<L, Concat<R, SplitBrackets<F>>>
        : JoinRec<L, Append<R, F>>
    : Cast<R, string[]>

type SplitFieldFilterToolbelt<S extends string> = Join<SplitFieldFilter<S>>

// Test
type TestSplit =
    SplitFieldFilterToolbelt<'id,name,attribute[value],categoryCombo[id,name]'>

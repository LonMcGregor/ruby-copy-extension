# Ruby Copy Extension

Lets you copy only the kana or only the kanji from a `<ruby>` HTML markup selection. Most web browsers will just give you a long string with everything jumbled together when you make such a selection.

## Example

Selecting the following and trying to copy, you get:

Selection | In-Browser Copy | Extension Copy (main) | Extension Copy (annotation)
--|--|--|--
<ruby>花<rt>はな</rt>がきれい</ruby> | 花はながきれい | 花がきれい | はながきれい

The extension lets you copy your full selection, but either with ONLY the main part of the `<ruby>` markup, or ONLY the annotation.

## Development Notes

You can't simply grep for complex characters, because someone could coceivably put complex kanji in the annotation, to assist with a reading. `<ruby>` also isn't restricted to just japanese, and could be used in any language, even english, so the extension should support that too.

The `window.getSelection()` is not very assistive for developing this, so there's a lot of workaround code.

The Clipboard API has a lot of workaround code.

## Known Issues
Selection boundaries are still a finnicky issue and there are so many edge cases it's a pain to manage. Particularly if the start or end of the selection is within a `<rt>` tag.

Only translated into english right now, which of course is not usper-useful for people who commonly encounter `<ruby>`.

## License
This software is licensed using GPL. It contains some non-original public domain code from https://github.com/30-seconds/30-seconds-of-code/

The test cases come from HNK web and are excluded from the license

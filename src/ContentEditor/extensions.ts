import { textblockTypeInputRule } from "prosemirror-inputrules";
import { AnyExtension, ExtensionPriority } from "remirror";
import {
  BlockquoteExtension,
  BoldExtension,
  BulletListExtension,
  CodeBlockExtension,
  CodeExtension,
  HardBreakExtension,
  HeadingExtension,
  ItalicExtension,
  LinkExtension,
  ListItemExtension,
  MarkdownExtension,
  OrderedListExtension,
  PlaceholderExtension,
  StrikeExtension,
  TextHighlightExtension,
  TrailingNodeExtension,
} from "remirror/extensions";
// import languages from "./languages";

/**
 * Modifies the Code Block extension creation behavior. Creates a code block after language specification + space/line break.
 */
class ExtendedCodeBlockExtension extends CodeBlockExtension {
  createInputRules() {
    const regexp = /^```([a-zA-Z]+)?(\n|\s)/;
    return [textblockTypeInputRule(regexp, this.type)];
  }
}

/**
 * A list of allowed Remirror Extensions
 */
const extensions =
  (placeholder: string = "") =>
    (): Array<AnyExtension> => [
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new CodeExtension(),
      new BlockquoteExtension(),
      new LinkExtension({ autoLink: true }),
      new StrikeExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
      }),
    //   new ExtendedCodeBlockExtension({
    //     supportedLanguages: languages,
    //   }),
      new TrailingNodeExtension(),
      new MarkdownExtension({
        copyAsMarkdown: false,
      }),
      new HardBreakExtension(),
      new TextHighlightExtension(),
      new PlaceholderExtension({
        placeholder,
      }),
    ];

export default extensions;

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
  MentionAtomExtension,
} from "remirror/extensions";

/**
 * A list of allowed Remirror Extensions
 */
const extensions =
  (placeholder: string = "") =>
  (): Array<AnyExtension> =>
    [
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new CodeExtension(),
      new BlockquoteExtension(),
      new LinkExtension({ autoLink: true }),
      new StrikeExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new MentionAtomExtension({
        matchers: [
          { name: "at", char: "@" },
          { name: "tag", char: "#" },
        ],
      }),
      new ListItemExtension({
        priority: ExtensionPriority.High,
        enableCollapsible: true,
      }),
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

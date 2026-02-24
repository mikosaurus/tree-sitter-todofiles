/**
 * @file tree sitter grammar for dotTodo files
 * @author Anders Johannessen <tstodo@mikosaurus.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const CHECKBOX = "\u2610"; // ☐
const CHECKMARK = "\u2714"; // ✔
const CANCELLED_MARK = "\u2612"; // ☒
const TASK_MARKS = CHECKBOX + CHECKMARK + CANCELLED_MARK;

module.exports = grammar({
  name: "todofiles",

  // Exclude \n from extras so task bodies can't span lines.
  // \n is instead consumed explicitly at the source_file level via seq(_definition, /\n/).
  // This forces each definition to own its full line, preventing the parser from
  // completing a task early (with empty body) when the \n is at the end of the line.
  extras: ($) => [/[^\S\n]/],

  rules: {
    // category includes its own \n (token ends with \n).
    // tasks and comments do not — the outer seq(..., /\n/) provides it.
    source_file: ($) =>
      seq(
        repeat(
          choice(
            $.category,
            seq($.task, /\n/),
            seq($.comment, /\n/),
            /\n/, // blank lines
          ),
        ),
        optional(choice($.task, $.comment)), // last line with no trailing \n
      ),

    category: ($) => $._category_definition,

    task: ($) => choice($.todo, $.done, $.cancelled),

    checkbox: ($) => new RegExp(CHECKBOX),
    checkmark: ($) => new RegExp(CHECKMARK),
    cancelled_mark: ($) => new RegExp(CANCELLED_MARK),

    task_text: ($) => /[^@\n]+/,
    at_word: ($) => /@[^\s\n(]*/,
    tag_done: ($) => /@done\([^)]*\)/,
    tag_started: ($) => /@started\([^)]*\)/,
    tag_cancelled: ($) => /@cancelled\([^)]*\)/,

    _task_body: ($) =>
      repeat1(
        choice(
          $.task_text,
          $.at_word,
          $.tag_done,
          $.tag_started,
          $.tag_cancelled,
        ),
      ),

    _category_definition: ($) => seq($._category_expression),
    todo: ($) => seq($.checkbox, optional($._task_body)),
    done: ($) => seq($.checkmark, optional($._task_body)),
    cancelled: ($) => seq($.cancelled_mark, optional($._task_body)),

    // \n is part of the token — anchors ":" as the last char before the newline,
    // preventing false matches on ":" inside timestamps or mid-line text.
    _category_expression: ($) => token(seq(/.*/, /:/, /\n/)),
    comment: ($) =>
      new RegExp(`[^${TASK_MARKS}\\s].*[^:\\n]|[^${TASK_MARKS}\\s:\\n]`),
  },
});

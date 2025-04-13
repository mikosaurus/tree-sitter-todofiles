/**
 * @file tree sitter grammar for dotTodo files
 * @author Anders Johannessen <tstodo@mikosaurus.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "todofiles",
  conflicts: $ => [
    [$._category]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $._category,
    ),

    _category: $ => seq(
      $.category_definition,
      repeat(choice($._category, $.data)),
    ),

    task: $ => choice(
        $.todo_definition,
        // seq($.todo_definition, $.newline),
        seq($.done_definition, $.done_tag),
        seq($.cancelled_definition, $.cancelled_tag),
    ),

    comment: $ => choice($.comment_expression),
    data: $ => choice($.task, $.comment),
    newline: $ => token(/\n?/),

    category_definition: $ => $.category_expression,
    todo_definition: $ => $.todo_expression,
    done_definition: $ => $.done_expression,
    cancelled_definition: $ => $.cancelled_expression,
    comment_definition: $ => $.comment_expression,

    done_tag: _ =>      token(/@done.*/),
    cancelled_tag: $ => token(/@cancelled.*/),
    // done_tag: _ =>      token(/@done.*\n?/),
    // cancelled_tag: $ => token(/@cancelled.*\n?/),

    category_expression: $ =>  token(seq(/.*/, /:/)), 
    todo_expression: $ =>      token(seq(/\x{2610} /, /.*/)), 
    done_expression: $ =>      token(seq(/\x{2714} /, /.*/)), 
    cancelled_expression: $ => token(seq(/\x{2612} /, /.*/)), 
    // category_expression: $ =>  token(seq(optional(repeat(/\t/)), /.*/, /:/, /\n?/)), 
    // todo_expression: $ => token(seq(repeat(/\t/), /\x{2610} /, /.*/, optional(/\n/))),
    // started_expression: $ => token(seq(repeat(/\t/), /\x{2610} /, /.*/, optional(/@started\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/))),
    // done_expression: $ => token(seq(repeat(/\t/), /\x{2714} /, /.*/, optional(/@done\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/))),
    // cancelled_expression: $ => token(seq(repeat(/\t/), /\x{2612} /, /.*/, optional(/@cancelled\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/))),
    comment_expression: $ => token(seq(repeat(/\t/), /# .*/)),
    // comment_expression: $ => token(seq(repeat(/\t/), /# .*/,/\n/)),

  }
});

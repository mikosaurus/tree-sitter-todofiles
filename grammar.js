/**
 * @file tree sitter grammar for dotTodo files
 * @author Anders Johannessen <tstodo@mikosaurus.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "todofiles",

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.category_definition,
      $.todo_definition,
      $.started_definition,
      $.done_definition,
      $.cancelled_definition,
      $.info_expression,
    ),

    category_definition: $ => $.category_expression,
    todo_definition: $ => $.todo_expression,
    started_definition: $ => $.started_expression,
    done_definition: $ => $.done_expression,
    cancelled_definition: $ => $.cancelled_expression,
    info_definition: $ => $.info_expression,

    category_expression: $ => token(seq(repeat(/\t/), /.*/, /:\n/)), 
    todo_expression: $ => token(seq(repeat(/\t/), /\x{2610} /, /.*/, optional(/\n/))),
    started_expression: $ => token(seq(repeat(/\t/), /\x{2610} /, /.*/, optional(/@started\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/))),
    done_expression: $ => token(seq(repeat(/\t/), /\x{2714} /, /.*/, optional(/@done\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/))),
    cancelled_expression: $ => token(seq(repeat(/\t/), /\x{2612} /, /.*/, optional(/@cancelled\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/))),
    info_expression: $ => token(seq(repeat(/\t/), /.*/, /\n/)),

  }
});

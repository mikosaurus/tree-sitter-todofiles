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
      $._category,
      $.task,
    ),

    _category: $ => seq(
      $.category_definition,
    ),

    task: $ => choice(
      $.todo_definition,
      $.done_definition,
      $.cancelled_definition,
      $.comment,
    ),

    done_tag: $ => /@done\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/,
    cancelled_tag: $ => /@cancelled\(\d{2,4}.\d{2}.\d{2} \d{2}:\d{2}\)\n/,
    checkbox: $ => /\x{2610}/,
    checkmark: $ => /\x{2714}/,
    cancelled_mark: $ => /\x{2612}/,

    category_definition: $ => seq(optional(repeat(/\t/)), $.category_expression,),
    todo_definition: $ => seq(optional(repeat(/\t/)), $.checkbox, /.*/, /\n/),
    done_definition: $ => seq(optional(repeat(/\t/)), $.checkmark, /.*/, $.done_tag),
    cancelled_definition: $ => seq(optional(repeat(/\t/)), $.cancelled_mark, /.*/, $.cancelled_tag),

    category_expression: $ => token(seq(optional(repeat(/\t/)), /.*/, /:/, /\n/)), 
    comment:$ => seq(/#/, /.*/),

  }
});

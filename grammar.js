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
      $.category,
      $.task,
      $.comment,
    ),

    category: $ => seq(
      $._category_definition,
    ),

    task: $ => choice(
      $.todo,
      $.done,
      $.cancelled,
    ),

    checkbox: $ => /\x{2610}/,
    checkmark: $ => /\x{2714}/,
    cancelled_mark: $ => /\x{2612}/,
    statement: $ => /.*/,

    _category_definition: $ =>  seq($._category_expression),
    todo: $ =>      seq($.checkbox, $.statement),
    done: $ =>      seq($.checkmark, $.statement),
    cancelled: $ => seq($.cancelled_mark, $.statement),

    _category_expression: $ => token(seq(/.*/, /:/, /\n/)), 
    _comment_identifier: $ => /#/,
    comment:$ => seq($._comment_identifier, /.*/),

  }
});

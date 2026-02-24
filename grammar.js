/**
 * @file tree sitter grammar for dotTodo files
 * @author Anders Johannessen <tstodo@mikosaurus.net>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const CHECKBOX      = '\u2610'; // ☐
const CHECKMARK     = '\u2714'; // ✔
const CANCELLED_MARK = '\u2612'; // ☒
const TASK_MARKS = CHECKBOX + CHECKMARK + CANCELLED_MARK;

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

    checkbox: $ => new RegExp(CHECKBOX),
    checkmark: $ => new RegExp(CHECKMARK),
    cancelled_mark: $ => new RegExp(CANCELLED_MARK),
    statement: $ => /.*/,

    _category_definition: $ =>  seq($._category_expression),
    todo: $ =>      seq($.checkbox, $.statement),
    done: $ =>      seq($.checkmark, $.statement),
    cancelled: $ => seq($.cancelled_mark, $.statement),

    _category_expression: $ => token(seq(/.*/, /:/, /\n/)),
    comment: $ => new RegExp(`[^${TASK_MARKS}\\s].*[^:\\n]|[^${TASK_MARKS}\\s:\\n]`),

  }
});

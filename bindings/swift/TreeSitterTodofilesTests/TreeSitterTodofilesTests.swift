import XCTest
import SwiftTreeSitter
import TreeSitterTodofiles

final class TreeSitterTodofilesTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_todofiles())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Todofiles grammar")
    }
}

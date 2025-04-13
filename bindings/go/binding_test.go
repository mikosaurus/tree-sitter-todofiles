package tree_sitter_todofiles_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_todofiles "github.com/mikosaurus/tree-sitter-todofiles/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_todofiles.Language())
	if language == nil {
		t.Errorf("Error loading Todofiles grammar")
	}
}

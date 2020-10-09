// +build !integration

package chunk

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

var rangeTestCases = []struct {
	totalSize      int
	chunkSize      int
	expectedRanges []Range
}{
	{3, 1, []Range{
		{0, 1},
		{1, 2},
		{2, 3},
	}},
	{3, 2, []Range{
		{0, 2},
		{2, 3},
	}},
	{3, 3, []Range{
		{0, 3},
	}},
	{3, 4, []Range{
		{0, 3},
	}},
	{0, 4, []Range{}},
	{100, 15, []Range{
		{0, 15},
		{15, 30},
		{30, 45},
		{45, 60},
		{60, 75},
		{75, 90},
		{90, 100},
	}},
	{100, 25, []Range{
		{0, 25},
		{25, 50},
		{50, 75},
		{75, 100},
	}},
}

func TestRanges(t *testing.T) {
	for _, tt := range rangeTestCases {
		t.Run(fmt.Sprintf("totalSize %d chunkSize %d", tt.totalSize, tt.chunkSize), func(t *testing.T) {
			ranges := Ranges(tt.totalSize, tt.chunkSize)
			assert.Equal(t, tt.expectedRanges, ranges)
		})
	}
}

package chunk

import "math"

type Range struct {
	// inclusive
	Start int
	// exclusive
	End int
}

func Ranges(totalSize int, chunkSize int) []Range {
	ranges := []Range{}
	if chunkSize < 1 || totalSize < 0 {
		return ranges
	}

	start := 0
	for start < totalSize {
		end := int(math.Min(float64(totalSize), float64(start+chunkSize)))
		ranges = append(ranges, Range{start, end})

		start = end
	}

	return ranges
}

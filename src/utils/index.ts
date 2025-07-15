// import type { Chapter, ChapterRange } from "../types/chapter"

export function groupChaptersIntoRanges(chapters: any[], rangeSize = 10): any[] {
  // Sort chapters by number
  const sortedChapters = [...chapters].sort((a, b) => {
    const numA = Number.parseFloat(a.number)
    const numB = Number.parseFloat(b.number)
    return numA - numB
  })

  const ranges: any[] = []

  for (let i = 0; i < sortedChapters.length; i += rangeSize) {
    const rangeChapters = sortedChapters.slice(i, i + rangeSize)
    const startNum = Number.parseFloat(rangeChapters[0].number)
    const endNum = Number.parseFloat(rangeChapters[rangeChapters.length - 1].number)

    ranges.push({
      label: `${startNum} - ${endNum}`,
      startChapter: startNum,
      endChapter: endNum,
      chapters: rangeChapters,
    })
  }

  return ranges
}

export function formatUploadDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

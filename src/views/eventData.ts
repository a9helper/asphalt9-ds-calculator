const eventData: DSData = {
  chapters: [
    {
      chapter: 1,
      title: '暗流涌动（第一章）',
      coinPerPack: 48,
      stages: [
        {
          stage: 1,
          sp: 888,
          tasks: [{ danger: 0, sp: 888, packCount: 8 }],
        },
        {
          stage: 2,
          sp: 2388,
          tasks: [{ danger: 0, sp: 2388, packCount: 8 }],
        },
        {
          stage: 3,
          sp: 4724,
          tasks: [
            { danger: 0, sp: 2750, packCount: 8 },
            { danger: 0, sp: 2500, packCount: 8 },
            { danger: 0, sp: 2375, packCount: 8 },
          ],
        },
      ],
    },
    {
      chapter: 2,
      title: '如履薄冰（XJR）',
      coinPerPack: 88,
      stages: [
        {
          stage: 1,
          sp: 7888,
          tasks: [
            { danger: 3, sp: 4063, packCount: 7 },
            { danger: 3, sp: 4277, packCount: 8 },
            { danger: 3, sp: 4705, packCount: 9 },
          ],
        },
        {
          stage: 2,
          sp: 7888,
          tasks: [
            { danger: 2, sp: 1884, packCount: 6 },
            { danger: 2, sp: 1983, packCount: 7 },
            { danger: 2, sp: 2181, packCount: 8 },
            { danger: 3, sp: 4063, packCount: 14 },
            { danger: 3, sp: 4277, packCount: 15 },
            { danger: 3, sp: 4705, packCount: 16 },
          ],
        },
        {
          stage: 3,
          sp: 9888,
          tasks: [
            { danger: 1, sp: 812, packCount: 3 },
            { danger: 1, sp: 855, packCount: 3 },
            { danger: 1, sp: 941, packCount: 3 },
            { danger: 2, sp: 1884, packCount: 7 },
            { danger: 2, sp: 1983, packCount: 8 },
            { danger: 2, sp: 2181, packCount: 9 },
            { danger: 3, sp: 4063, packCount: 15 },
            { danger: 3, sp: 4277, packCount: 16 },
            { danger: 3, sp: 4705, packCount: 17 },
          ],
        },
        {
          stage: 4,
          sp: 12570,
          tasks: [
            { danger: 1, sp: 812, packCount: 4 },
            { danger: 1, sp: 855, packCount: 4 },
            { danger: 1, sp: 941, packCount: 4 },
            { danger: 2, sp: 1884, packCount: 8 },
            { danger: 2, sp: 1983, packCount: 9 },
            { danger: 2, sp: 2181, packCount: 10 },
            { danger: 3, sp: 4063, packCount: 20 },
            { danger: 3, sp: 4277, packCount: 22 },
            { danger: 3, sp: 4705, packCount: 24 },
          ],
        },
      ],
    },
  ],
}

// for (let chapter of eventData.chapters) {
//   for (let stage of chapter.stages) {
//     stage.tasks.sort((a, b) => {
//       // 危险度高，福币少的在后面，尽量选择他们
//       if (a.danger === b.danger) {
//         return b.packCount - a.packCount
//       }
//       return a.danger - b.danger
//     })
//   }
// }

export default eventData
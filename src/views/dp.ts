const dp = ({
  chapter,
  stage,
  tasks,
  stageSpDone,
}: {
  chapter: Chapter
  stage: Stage
  tasks: Task[]
  stageSpDone: number
}) => {
  type DPCell = {
    value: number
    check: boolean
  }

  tasks.sort((a, b) => {
    // 危险度高，福币少的在后面，尽量选择他们
    if (a.danger === b.danger) {
      return b.packCount - a.packCount
    }
    return a.danger - b.danger
  })

  const stageNo = stage.stage

  const V = stage.sp - 1 - stageSpDone

  const coinPerPack = chapter.coinPerPack

  const DP: DPCell[][] = new Array(tasks.length + 1)
    .fill(0)
    .map(() => new Array(V + 1).fill(0))

  // init
  for (let i = 0; i <= tasks.length; i++) {
    for (let j = 0; j <= V; j++) {
      DP[i][j] = {
        value: 0,
        check: false,
      }
    }
  }

  for (let i = 1; i <= tasks.length; i++) {
    for (let j = 1; j <= V; j++) {
      if (j < tasks[i - 1].sp) {
        DP[i][j] = {
          value: DP[i - 1][j].value,
          check: false,
        }
        continue
      }
      const valueNotCheck = DP[i - 1][j].value
      const valueCheck =
        DP[i][j - tasks[i - 1].sp].value + tasks[i - 1].packCount * coinPerPack
      if (valueCheck >= valueNotCheck) {
        //因为危险度越大的越省肝，所以尽量check
        DP[i][j] = {
          value: valueCheck,
          check: true,
        }
      } else {
        DP[i][j] = {
          value: valueNotCheck,
          check: false,
        }
      }
    }
  }

  // console.log(DP[tasks.length][V])
  let lastI = tasks.length
  let lastJ = V

  const res: DPRes[] = []
  while (lastI > 0 && lastJ > 0) {
    if (DP[lastI][lastJ].check) {
      if (
        res.length > 0 &&
        res[res.length - 1].danger === tasks[lastI - 1].danger &&
        res[res.length - 1].sp === tasks[lastI - 1].sp
      ) {
        res[res.length - 1].taskCount++
      } else {
        res.push({ ...tasks[lastI - 1], taskCount: 1 })
      }

      lastJ -= tasks[lastI - 1].sp
    } else {
      lastI--
    }
  }

  // 找到最大的packCount  task
  const taskMax = tasks.reduce((acc, cur) => {
    return acc.packCount > cur.packCount ? acc : cur
  }, tasks[0])
  // res.push({ ...taskMax, taskCount: 1 }) // 最后搞把大的
  // console.log(res)

  const packTotal =
    res.reduce((acc, cur) => acc + cur.packCount * cur.taskCount, 0) +
    taskMax.packCount
  const coinTotal = packTotal * coinPerPack
  const taskCountTotal = res.reduce((acc, cur) => acc + cur.taskCount, 0) + 1
  // const message: string[] = []
  // // console.log(`${chapter.title} 第 ${stageNo} 关攻略：`)
  // for (let i = 0; i < res.length; i++) {
  //   const isLast = i === res.length - 1
  //   message.push(
  //     `${isLast ? '最后，' : ''}${res[i].taskCount} 把 ${res[i].sp} SP，危险 ${
  //       res[i].danger
  //     }，每把 ${res[i].packCount} 包`
  //   )
  // }

  // message.push(
  //   `总共打了 ${taskCountTotal} 把，获得 ${packTotal} 包，如果没有出 🔑 或者 888 福币的话，公主您 / 少爷您 可以获得 ${coinTotal} 福币。`
  // )
  return {
    res,
    packTotal,
    coinTotal,
    taskCountTotal,
    taskMax,
  }
}

export default dp

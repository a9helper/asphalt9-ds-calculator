interface Task {
  danger: 1 | 2 | 3
  sp: number
  coin: number
}

interface Stage {
  title: string
  spFinish: number //完成当前的sp，等于下一关解锁需要的sp
  tasks: Task[]
}

interface Chapter {
  title: string
  stages: Stage[]
}

interface DS {
  chapters: Chapter[]
}

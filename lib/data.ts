// NovaTech Solutions — HRMS mock data
// 판교 소재 86명 규모 AI SaaS 기업

export type DeptName = '개발' | '인사' | '영업' | '마케팅' | '재무' | '디자인'
export type Position = '사원' | '주임' | '대리' | '과장' | '차장' | '부장'
export type Grade = 'S' | 'A' | 'B' | 'C'
export type Status = '재직중' | '휴직' | '퇴사'

export interface Employee {
  id: string
  name: string
  dept: DeptName
  position: Position
  hireDate: string
  salaryAnnual: number // 원
  grade: Grade
  remainingLeave: number
  totalLeave: number
  thisMonthOt: number // 시간
  status: Status
  phone: string
  email: string
  photoUrl: string
  gender: '남' | '여'
  workType: '출근' | '재택' | '휴가' | '출장'
  birth: string
}

export interface LeaveRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: DeptName
  type: '연차' | '반차' | '병가' | '경조사'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: '신청' | '승인' | '반려'
  appliedAt: string
}

export interface Notice {
  id: string
  title: string
  date: string
  content: string
  category: '전사' | '인사' | '복지' | '시스템'
  pinned?: boolean
}

export const COMPANY = {
  name: 'NovaTech Solutions',
  nameKo: '노바테크',
  location: '경기도 성남시 분당구 판교',
  industry: 'AI 기반 SaaS 및 기업용 솔루션',
  founded: 2018,
  headcount: 86,
}

export const DEPARTMENTS: DeptName[] = ['개발', '인사', '영업', '마케팅', '재무', '디자인']
export const POSITIONS: Position[] = ['사원', '주임', '대리', '과장', '차장', '부장']

export const POSITION_SALARY: Record<Position, [number, number]> = {
  사원: [34_000_000, 42_000_000],
  주임: [40_000_000, 48_000_000],
  대리: [46_000_000, 56_000_000],
  과장: [55_000_000, 68_000_000],
  차장: [66_000_000, 80_000_000],
  부장: [78_000_000, 95_000_000],
}

export const ALLOWANCES = {
  meal: 200_000, // 식대
  transport: 100_000, // 교통비
  overtimeHourly: 18_000, // 야근 시급
  position: { 과장: 200_000, 차장: 350_000, 부장: 500_000 } as Partial<Record<Position, number>>,
}

export const BONUS_RATE: Record<Grade, number> = { S: 0.1, A: 0.07, B: 0.05, C: 0 }

// 4대보험 및 세금 (근사치 요율)
export const DEDUCTION_RATES = {
  nationalPension: 0.045, // 국민연금
  healthInsurance: 0.03545, // 건강보험
  longTermCare: 0.1295, // 건강보험료 대비 장기요양
  employmentInsurance: 0.009, // 고용보험
  incomeTaxRate: 0.08, // 소득세 (간이 근사)
}

// ---- Deterministic pseudo-random generator ----
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LAST_NAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍',
]
const FIRST_NAMES_M = [
  '민준', '서준', '도윤', '예준', '시우', '주원', '지호', '준우', '현우', '지훈',
  '건우', '우진', '선우', '서진', '연우', '유준', '정우', '승현', '준혁', '민재',
]
const FIRST_NAMES_F = [
  '서연', '서윤', '지우', '하윤', '하은', '민서', '지유', '윤서', '채원', '수아',
  '지아', '지윤', '은서', '다은', '예은', '수빈', '소율', '예린', '지안', '유나',
]

const DEPT_WEIGHTS: Record<DeptName, number> = {
  개발: 34,
  영업: 16,
  마케팅: 12,
  디자인: 10,
  재무: 8,
  인사: 6,
}

function pad(n: number, len = 2) {
  return String(n).padStart(len, '0')
}

function buildEmployees(): Employee[] {
  const rand = mulberry32(20260713)
  const list: Employee[] = []

  // Build a department pool according to weights (sums to 86)
  const deptPool: DeptName[] = []
  ;(Object.keys(DEPT_WEIGHTS) as DeptName[]).forEach((d) => {
    for (let i = 0; i < DEPT_WEIGHTS[d]; i++) deptPool.push(d)
  })

  const grades: Grade[] = ['S', 'A', 'B', 'C']
  const gradeWeights = [0.12, 0.4, 0.4, 0.08]

  for (let i = 0; i < COMPANY.headcount; i++) {
    const gender = rand() > 0.42 ? '남' : '여'
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
    const firstPool = gender === '남' ? FIRST_NAMES_M : FIRST_NAMES_F
    const first = firstPool[Math.floor(rand() * firstPool.length)]
    const name = last + first

    const dept = deptPool[i]

    // position distribution skewed to lower ranks
    const pr = rand()
    let position: Position
    if (pr < 0.28) position = '사원'
    else if (pr < 0.48) position = '주임'
    else if (pr < 0.68) position = '대리'
    else if (pr < 0.84) position = '과장'
    else if (pr < 0.94) position = '차장'
    else position = '부장'

    // hire date between 2018 and 2025
    const year = 2018 + Math.floor(rand() * 8)
    const month = 1 + Math.floor(rand() * 12)
    const day = 1 + Math.floor(rand() * 27)
    const hireDate = `${year}-${pad(month)}-${pad(day)}`

    const [minS, maxS] = POSITION_SALARY[position]
    const salaryAnnual = Math.round((minS + rand() * (maxS - minS)) / 100_000) * 100_000

    // grade
    let g = rand()
    let grade: Grade = 'B'
    let acc = 0
    for (let k = 0; k < grades.length; k++) {
      acc += gradeWeights[k]
      if (g <= acc) {
        grade = grades[k]
        break
      }
    }

    // leave: 15 + years, max 25
    const years = 2026 - year
    const totalLeave = Math.min(25, 15 + Math.max(0, years - 1))
    const remainingLeave = Math.max(0, Math.round(totalLeave * (0.15 + rand() * 0.75)))

    const thisMonthOt = Math.round(rand() * 24)

    // status: mostly 재직중
    const sr = rand()
    const status: Status = sr > 0.97 ? '휴직' : sr > 0.94 ? '퇴사' : '재직중'

    // worktype for those 재직중
    let workType: Employee['workType'] = '출근'
    if (status === '재직중') {
      const wr = rand()
      if ((dept === '개발' || dept === '디자인') && wr < 0.14) workType = '재택'
      else if (wr < 0.05) workType = '휴가'
      else if (wr < 0.09) workType = '출장'
      else workType = '출근'
    }

    const birthYear = 2026 - (25 + Math.floor(rand() * 20))
    const birth = `${birthYear}-${pad(1 + Math.floor(rand() * 12))}-${pad(1 + Math.floor(rand() * 27))}`

    const idNum = 1001 + i
    list.push({
      id: `NT${idNum}`,
      name,
      dept,
      position,
      hireDate,
      salaryAnnual,
      grade,
      remainingLeave,
      totalLeave,
      thisMonthOt,
      status,
      phone: `010-${pad(1000 + Math.floor(rand() * 9000), 4)}-${pad(1000 + Math.floor(rand() * 9000), 4)}`,
      email: `${last.toLowerCase()}${idNum}@novatech.io`,
      photoUrl: `/avatars/avatar-${(i % 12) + 1}.png`,
      gender,
      workType,
      birth,
    })
  }

  return list
}

export const EMPLOYEES: Employee[] = buildEmployees()

export function getEmployee(id: string) {
  return EMPLOYEES.find((e) => e.id === id)
}

export const ACTIVE_EMPLOYEES = EMPLOYEES.filter((e) => e.status === '재직중')

export const NOTICES: Notice[] = [
  {
    id: 'N001',
    title: '2026년 하계휴가 신청 안내 (7/20까지)',
    date: '2026-07-10',
    category: '인사',
    pinned: true,
    content:
      '2026년 하계휴가 신청을 7월 20일까지 받습니다. 휴가 관리 > 휴가 신청 메뉴에서 신청해 주시기 바랍니다. 부서별 최소 인원 유지를 위해 팀장 승인 후 확정됩니다.',
  },
  {
    id: 'N002',
    title: '판교 본사 3층 라운지 리뉴얼 완료',
    date: '2026-07-08',
    category: '복지',
    content: '3층 휴게 라운지가 새롭게 단장되었습니다. 원두커피 머신과 안마의자가 추가되었습니다.',
  },
  {
    id: 'N003',
    title: '상반기 인사평가 결과 조회 오픈',
    date: '2026-07-05',
    category: '인사',
    content: '2026년 상반기 인사평가 결과를 성과 관리 > 평가 결과 메뉴에서 확인하실 수 있습니다.',
  },
  {
    id: 'N004',
    title: 'HRMS 시스템 정기 점검 (7/15 02:00~04:00)',
    date: '2026-07-04',
    category: '시스템',
    content: '7월 15일 새벽 2시부터 4시까지 시스템 정기 점검이 진행됩니다. 해당 시간 접속이 제한됩니다.',
  },
  {
    id: 'N005',
    title: '재택근무 정책 업데이트 (개발·디자인 주 2회)',
    date: '2026-07-01',
    category: '전사',
    content: '개발팀과 디자인팀의 재택근무가 주 2회로 확대되었습니다. 자세한 내용은 사규를 참고하세요.',
  },
  {
    id: 'N006',
    title: '신규 입사자 온보딩 교육 일정 안내',
    date: '2026-06-28',
    category: '인사',
    content: '7월 신규 입사자 대상 온보딩 교육이 7월 14일에 진행됩니다.',
  },
]

function buildLeaveRecords(): LeaveRecord[] {
  const rand = mulberry32(77123)
  const types: LeaveRecord['type'][] = ['연차', '반차', '병가', '경조사']
  const reasons = ['개인 사유', '가족 행사', '병원 진료', '휴식', '경조사 참석', '자녀 돌봄']
  const statuses: LeaveRecord['status'][] = ['신청', '승인', '승인', '승인', '반려']
  const records: LeaveRecord[] = []
  const pool = ACTIVE_EMPLOYEES
  for (let i = 0; i < 28; i++) {
    const emp = pool[Math.floor(rand() * pool.length)]
    const type = types[Math.floor(rand() * types.length)]
    const month = 7
    const startDay = 1 + Math.floor(rand() * 27)
    const len = type === '반차' ? 0.5 : 1 + Math.floor(rand() * 3)
    const endDay = Math.min(30, startDay + Math.ceil(len) - 1)
    records.push({
      id: `L${2000 + i}`,
      employeeId: emp.id,
      employeeName: emp.name,
      dept: emp.dept,
      type,
      startDate: `2026-${pad(month)}-${pad(startDay)}`,
      endDate: `2026-${pad(month)}-${pad(endDay)}`,
      days: len,
      reason: reasons[Math.floor(rand() * reasons.length)],
      status: statuses[Math.floor(rand() * statuses.length)],
      appliedAt: `2026-07-${pad(Math.max(1, startDay - 3))}`,
    })
  }
  return records.sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
}

export const LEAVE_RECORDS = buildLeaveRecords()

// ---- Aggregations ----
export function deptHeadcount() {
  return DEPARTMENTS.map((d) => ({
    dept: d,
    count: EMPLOYEES.filter((e) => e.dept === d && e.status !== '퇴사').length,
  }))
}

export function deptAvgSalary() {
  return DEPARTMENTS.map((d) => {
    const members = ACTIVE_EMPLOYEES.filter((e) => e.dept === d)
    const avg = members.length
      ? Math.round(members.reduce((s, e) => s + e.salaryAnnual, 0) / members.length)
      : 0
    return { dept: d, avg }
  })
}

export function gradeDistribution() {
  const grades: Grade[] = ['S', 'A', 'B', 'C']
  return grades.map((g) => ({
    grade: g,
    count: ACTIVE_EMPLOYEES.filter((e) => e.grade === g).length,
  }))
}

export const KRW = (n: number) => n.toLocaleString('ko-KR')
export const KRW_MAN = (n: number) => `${Math.round(n / 10_000).toLocaleString('ko-KR')}만원`

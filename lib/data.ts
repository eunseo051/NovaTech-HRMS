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

// ---- Attendance records ----
export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: DeptName
  date: string
  checkIn: string
  checkOut: string
  workHours: number
  overtime: number
  status: '정상' | '지각' | '조퇴' | '결근' | '재택'
}

function buildAttendance(): AttendanceRecord[] {
  const rand = mulberry32(55821)
  const records: AttendanceRecord[] = []
  const pool = ACTIVE_EMPLOYEES
  const today = 13
  for (let day = 1; day <= today; day++) {
    for (const emp of pool) {
      if (rand() < 0.08) continue // skip some days randomly
      const isLate = rand() < 0.08
      const isEarly = rand() < 0.05
      const isRemote = emp.workType === '재택'
      const baseHour = 9
      const baseMin = isLate ? 5 + Math.floor(rand() * 25) : Math.floor(rand() * 10)
      const checkIn = `${pad(baseHour)}:${pad(baseMin)}`
      const outHour = isEarly ? 16 : 18
      const outMin = isEarly ? Math.floor(rand() * 60) : Math.floor(rand() * 30)
      const checkOut = `${pad(outHour)}:${pad(outMin)}`
      const inMins = baseHour * 60 + baseMin
      const outMins = outHour * 60 + outMin
      const workHours = Math.round(((outMins - inMins) - 60) / 60 * 10) / 10 // minus lunch
      const overtime = Math.max(0, Math.round(rand() * 3 * 10) / 10)
      let status: AttendanceRecord['status'] = '정상'
      if (isRemote) status = '재택'
      else if (isLate) status = '지각'
      else if (isEarly) status = '조퇴'
      records.push({
        id: `A${day}${emp.id}`,
        employeeId: emp.id,
        employeeName: emp.name,
        dept: emp.dept,
        date: `2026-07-${pad(day)}`,
        checkIn,
        checkOut,
        workHours: Math.max(0, workHours),
        overtime,
        status,
      })
    }
  }
  return records
}

export const ATTENDANCE_RECORDS = buildAttendance()

export function attendanceSummary() {
  const today = '2026-07-13'
  const todayRecords = ATTENDANCE_RECORDS.filter((r) => r.date === today)
  return {
    present: todayRecords.filter((r) => r.status === '정상' || r.status === '재택').length,
    remote: todayRecords.filter((r) => r.status === '재택').length,
    late: todayRecords.filter((r) => r.status === '지각').length,
    early: todayRecords.filter((r) => r.status === '조퇴').length,
    absent: todayRecords.filter((r) => r.status === '결근').length,
  }
}

export function monthlyOvertimeByDept() {
  return DEPARTMENTS.map((d) => {
    const members = ACTIVE_EMPLOYEES.filter((e) => e.dept === d)
    const total = members.reduce((s, e) => s + e.thisMonthOt, 0)
    return { dept: d, hours: total, avg: members.length ? Math.round((total / members.length) * 10) / 10 : 0 }
  })
}

export function lateEarlyStats() {
  const late = ATTENDANCE_RECORDS.filter((r) => r.status === '지각').length
  const early = ATTENDANCE_RECORDS.filter((r) => r.status === '조퇴').length
  return { late, early }
}

// ---- Performance / KPI ----
export interface KpiRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: DeptName
  objective: string
  progress: number
  weight: number
  status: '진행중' | '완료' | '지연'
  dueDate: string
}

export interface EvaluationRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: DeptName
  position: Position
  period: string
  grade: Grade
  score: number
  evaluator: string
  comments: string
  promotionEligible: boolean
}

const KPI_OBJECTIVES = [
  '신규 클라이언트 10개사 확보',
  'AI 모델 정확도 95% 달성',
  '플랫폼 리팩토링 완료',
  '마케팅 ROI 150% 달성',
  '브랜드 가이드라인 2.0 배포',
  '재무 결산 자동화 구축',
  '채용 프로세스 개선',
  '고객 만족도 NPS 70 달성',
  '신규 기능 5개 출시',
  '보안 감사 통과',
  '데이터 파이프라인 고도화',
  '콘텐츠 마케팅 20% 증가',
]

function buildKpis(): KpiRecord[] {
  const rand = mulberry32(33991)
  const records: KpiRecord[] = []
  const pool = ACTIVE_EMPLOYEES.slice(0, 40)
  pool.forEach((emp, i) => {
    const numKpis = 1 + Math.floor(rand() * 2)
    for (let k = 0; k < numKpis; k++) {
      const obj = KPI_OBJECTIVES[Math.floor(rand() * KPI_OBJECTIVES.length)]
      const progress = Math.round(rand() * 100)
      const status: KpiRecord['status'] = progress >= 100 ? '완료' : progress < 30 && rand() < 0.3 ? '지연' : '진행중'
      records.push({
        id: `K${1000 + records.length}`,
        employeeId: emp.id,
        employeeName: emp.name,
        dept: emp.dept,
        objective: obj,
        progress,
        weight: [20, 30, 40, 50][Math.floor(rand() * 4)],
        status,
        dueDate: `2026-${pad(7 + Math.floor(rand() * 3))}-${pad(1 + Math.floor(rand() * 28))}`,
      })
    }
  })
  return records
}

export const KPI_RECORDS = buildKpis()

function buildEvaluations(): EvaluationRecord[] {
  const rand = mulberry32(88123)
  const records: EvaluationRecord[] = []
  const periods = ['2026 상반기', '2025 하반기', '2025 상반기']
  ACTIVE_EMPLOYEES.forEach((emp) => {
    periods.forEach((period, pi) => {
      const gradeRoll = rand()
      let grade: Grade = 'B'
      if (pi === 0) grade = emp.grade
      else if (gradeRoll < 0.12) grade = 'S'
      else if (gradeRoll < 0.52) grade = 'A'
      else if (gradeRoll < 0.92) grade = 'B'
      else grade = 'C'
      const score = grade === 'S' ? 90 + Math.round(rand() * 8) : grade === 'A' ? 80 + Math.round(rand() * 8) : grade === 'B' ? 70 + Math.round(rand() * 8) : 55 + Math.round(rand() * 12)
      const eligible = (grade === 'S' || grade === 'A') && (emp.position === '대리' || emp.position === '과장' || emp.position === '차장') && pi === 0
      records.push({
        id: `E${emp.id}${pi}`,
        employeeId: emp.id,
        employeeName: emp.name,
        dept: emp.dept,
        position: emp.position,
        period,
        grade,
        score,
        evaluator: `${emp.dept}팀 팀장`,
        comments: grade === 'S' ? '탁월한 성과 달성. 리더십과 주도성이 돋보임.' : grade === 'A' ? '목표 달성 우수. 개선 여지는 소통 역량.' : grade === 'B' ? '기대치 달성. 업무 효율성 개선 권장.' : '목표 미달성. 집중적 코칭 필요.',
        promotionEligible: eligible,
      })
    })
  })
  return records
}

export const EVALUATION_RECORDS = buildEvaluations()

export function promotionCandidates() {
  return EVALUATION_RECORDS.filter((e) => e.promotionEligible)
}

// ---- Education / Training ----
export interface Course {
  id: string
  title: string
  category: '의무' | '직무' | '리더십' | '외부'
  instructor: string
  date: string
  duration: number // 시간
  capacity: number
  enrolled: number
  status: '신청가능' | '마감' | '진행중' | '완료'
  description: string
}

export interface Enrollment {
  id: string
  courseId: string
  courseTitle: string
  employeeId: string
  employeeName: string
  dept: DeptName
  status: '수강신청' | '수강중' | '수료' | '미수료'
  progress: number
  enrolledAt: string
}

export const COURSES: Course[] = [
  { id: 'C001', title: '신규 입사자 온보딩', category: '의무', instructor: '인사팀', date: '2026-07-14', duration: 8, capacity: 20, enrolled: 5, status: '신청가능', description: 'NovaTech 비전·조직문화·사규 교육' },
  { id: 'C002', title: 'AI/ML 최신 트렌드', category: '직무', instructor: '김민준 수석', date: '2026-07-18', duration: 4, capacity: 30, enrolled: 28, status: '신청가능', description: 'LLM 파인튜닝 및 RAG 아키텍처 실습' },
  { id: 'C003', title: '프로젝트 관리 실무', category: '직무', instructor: '외부 강사', date: '2026-07-22', duration: 6, capacity: 25, enrolled: 25, status: '마감', description: '애자일·스크럼 마스터 인증 과정' },
  { id: 'C004', title: '신규 리더십 캠프', category: '리더십', instructor: '외부 컨설턴트', date: '2026-07-25', duration: 16, capacity: 15, enrolled: 8, status: '신청가능', description: '신임 팀장 대상 리더십 개발 프로그램' },
  { id: 'C005', title: '정보보안 의무교육', category: '의무', instructor: '보안팀', date: '2026-07-10', duration: 2, capacity: 86, enrolled: 84, status: '완료', description: '연 1회 정보보안 정기 교육' },
  { id: 'C006', title: '고객 중심 커뮤니케이션', category: '직무', instructor: '영업팀', date: '2026-07-20', duration: 3, capacity: 20, enrolled: 12, status: '신청가능', description: 'B2B 영업 커뮤니케이션 스킬 향상' },
  { id: 'C007', title: '데이터 시각화 워크숍', category: '직무', instructor: '디자인팀', date: '2026-07-15', duration: 4, capacity: 15, enrolled: 15, status: '마감', description: 'Tableau를 활용한 대시보드 제작' },
  { id: 'C008', title: '직장 내 성희롱 예방교육', category: '의무', instructor: '외부 강사', date: '2026-06-30', duration: 2, capacity: 86, enrolled: 86, status: '완료', description: '법정 의무 교육 (연 1회)' },
]

function buildEnrollments(): Enrollment[] {
  const rand = mulberry32(22113)
  const records: Enrollment[] = []
  const pool = ACTIVE_EMPLOYEES
  COURSES.forEach((course) => {
    const num = course.enrolled
    for (let i = 0; i < num; i++) {
      const emp = pool[Math.floor(rand() * pool.length)]
      const status: Enrollment['status'] = course.status === '완료' ? (rand() < 0.9 ? '수료' : '미수료') : course.status === '진행중' ? '수강중' : '수강신청'
      const progress = status === '수료' ? 100 : status === '수강중' ? 20 + Math.floor(rand() * 60) : 0
      records.push({
        id: `EN${course.id}${i}`,
        courseId: course.id,
        courseTitle: course.title,
        employeeId: emp.id,
        employeeName: emp.name,
        dept: emp.dept,
        status,
        progress,
        enrolledAt: `2026-07-${pad(Math.max(1, 10 - i))}`,
      })
    }
  })
  return records
}

export const ENROLLMENTS = buildEnrollments()

export function educationStats() {
  const mandatory = COURSES.filter((c) => c.category === '의무')
  const completed = mandatory.filter((c) => c.status === '완료').length
  return {
    totalCourses: COURSES.length,
    openCourses: COURSES.filter((c) => c.status === '신청가능').length,
    mandatoryCompletion: Math.round((completed / mandatory.length) * 100),
    totalEnrolled: ENROLLMENTS.length,
    completionRate: Math.round((ENROLLMENTS.filter((e) => e.status === '수료').length / ENROLLMENTS.length) * 100),
  }
}

// ---- System management ----
export interface SystemUser {
  id: string
  name: string
  email: string
  role: '시스템 관리자' | '인사 관리자' | '팀장' | '일반 사용자'
  dept: DeptName
  lastLogin: string
  status: '활성' | '비활성' | '잠금'
}

export interface SystemLog {
  id: string
  user: string
  action: string
  target: string
  ip: string
  timestamp: string
  level: '정보' | '경고' | '오류'
}

export interface PolicyDoc {
  id: string
  title: string
  category: '인사규정' | '복리후생' | '근태규정' | '보안규정'
  version: string
  uploadDate: string
  size: string
}

export const SYSTEM_USERS: SystemUser[] = [
  { id: 'U001', name: '박서연', email: 'park1042@novatech.io', role: '시스템 관리자', dept: '인사', lastLogin: '2026-07-13 09:02', status: '활성' },
  { id: 'U002', name: '김민준', email: 'kim1001@novatech.io', role: '팀장', dept: '개발', lastLogin: '2026-07-13 08:45', status: '활성' },
  { id: 'U003', name: '이서윤', email: 'lee1002@novatech.io', role: '인사 관리자', dept: '인사', lastLogin: '2026-07-13 09:10', status: '활성' },
  { id: 'U004', name: '최도윤', email: 'choi1003@novatech.io', role: '팀장', dept: '영업', lastLogin: '2026-07-12 18:30', status: '활성' },
  { id: 'U005', name: '정예준', email: 'jung1004@novatech.io', role: '일반 사용자', dept: '개발', lastLogin: '2026-07-13 09:15', status: '활성' },
  { id: 'U006', name: '강시우', email: 'kang1005@novatech.io', role: '일반 사용자', dept: '마케팅', lastLogin: '2026-07-10 14:20', status: '비활성' },
  { id: 'U007', name: '조주원', email: 'jo1006@novatech.io', role: '일반 사용자', dept: '재무', lastLogin: '2026-07-01 10:00', status: '잠금' },
  { id: 'U008', name: '윤지호', email: 'yoon1007@novatech.io', role: '팀장', dept: '디자인', lastLogin: '2026-07-13 08:50', status: '활성' },
]

export const SYSTEM_LOGS: SystemLog[] = [
  { id: 'LOG001', user: '박서연', action: '로그인', target: '-', ip: '10.0.1.42', timestamp: '2026-07-13 09:02:15', level: '정보' },
  { id: 'LOG002', user: '박서연', action: '직원 정보 수정', target: 'NT1024 김민준', ip: '10.0.1.42', timestamp: '2026-07-13 09:15:30', level: '정보' },
  { id: 'LOG003', user: '이서윤', action: '급여명세서 생성', target: '2026년 7월 급여', ip: '10.0.1.51', timestamp: '2026-07-13 09:20:00', level: '정보' },
  { id: 'LOG004', user: '김민준', action: '휴가 승인', target: 'L2015 정예준', ip: '10.0.1.30', timestamp: '2026-07-13 10:05:12', level: '정보' },
  { id: 'LOG005', user: '알 수 없음', action: '로그인 실패', target: 'park1042@novatech.io', ip: '203.0.113.55', timestamp: '2026-07-13 03:22:00', level: '경고' },
  { id: 'LOG006', user: '시스템', action: '정기 백업 완료', target: 'HRMS DB', ip: '127.0.0.1', timestamp: '2026-07-13 02:00:00', level: '정보' },
  { id: 'LOG007', user: '조주원', action: '비밀번호 변경 실패 (3회)', target: '-', ip: '10.0.1.65', timestamp: '2026-07-01 10:00:00', level: '오류' },
  { id: 'LOG008', user: '박서연', action: '사규 업로드', target: '재택근무 규정 v2.1', ip: '10.0.1.42', timestamp: '2026-07-01 14:30:00', level: '정보' },
  { id: 'LOG009', user: '최도윤', action: '평가 등록', target: '2026 상반기 영업팀', ip: '10.0.1.38', timestamp: '2026-07-05 16:00:00', level: '정보' },
  { id: 'LOG010', user: '시스템', action: '시스템 점검 시작', target: 'HRMS', ip: '127.0.0.1', timestamp: '2026-07-04 02:00:00', level: '정보' },
]

export const POLICY_DOCS: PolicyDoc[] = [
  { id: 'P001', title: '인사규정', category: '인사규정', version: 'v3.2', uploadDate: '2026-07-01', size: '2.4 MB' },
  { id: 'P002', title: '재택근무 규정', category: '근태규정', version: 'v2.1', uploadDate: '2026-07-01', size: '1.1 MB' },
  { id: 'P003', title: '복리후생 규정', category: '복리후생', version: 'v2.0', uploadDate: '2026-05-15', size: '1.8 MB' },
  { id: 'P004', title: '정보보안 규정', category: '보안규정', version: 'v4.0', uploadDate: '2026-04-20', size: '3.2 MB' },
  { id: 'P005', title: '성과평가 운영지침', category: '인사규정', version: 'v1.5', uploadDate: '2026-03-10', size: '0.9 MB' },
  { id: 'P006', title: '출장 규정', category: '근태규정', version: 'v1.3', uploadDate: '2026-02-01', size: '0.7 MB' },
]

export interface DeptManager {
  dept: DeptName
  managerId: string
  managerName: string
  managerPosition: Position
  headcount: number
}

export function deptManagers(): DeptManager[] {
  return DEPARTMENTS.map((d) => {
    const members = EMPLOYEES.filter((e) => e.dept === d && e.status !== '퇴사')
    const manager = members.find((e) => e.position === '부장') ?? members.find((e) => e.position === '차장') ?? members[0]
    return {
      dept: d,
      managerId: manager?.id ?? '',
      managerName: manager?.name ?? '-',
      managerPosition: manager?.position ?? '사원',
      headcount: members.length,
    }
  })
}

export function positionDistribution() {
  return POSITIONS.map((p) => ({
    position: p,
    count: ACTIVE_EMPLOYEES.filter((e) => e.position === p).length,
  }))
}

export function genderRatio() {
  const male = ACTIVE_EMPLOYEES.filter((e) => e.gender === '남').length
  const female = ACTIVE_EMPLOYEES.filter((e) => e.gender === '여').length
  return [
    { gender: '남', count: male },
    { gender: '여', count: female },
  ]
}

export function tenureDistribution() {
  const buckets = ['1년 미만', '1~3년', '3~5년', '5~7년', '7년 이상']
  return buckets.map((label, i) => {
    const count = ACTIVE_EMPLOYEES.filter((e) => {
      const years = 2026 - Number(e.hireDate.slice(0, 4))
      if (i === 0) return years < 1
      if (i === 1) return years >= 1 && years < 3
      if (i === 2) return years >= 3 && years < 5
      if (i === 3) return years >= 5 && years < 7
      return years >= 7
    }).length
    return { range: label, count }
  })
}

export function salaryByDept() {
  return DEPARTMENTS.map((d) => {
    const members = ACTIVE_EMPLOYEES.filter((e) => e.dept === d)
    const avg = members.length ? Math.round(members.reduce((s, e) => s + e.salaryAnnual, 0) / members.length) : 0
    return { dept: d, avg }
  })
}

export function monthlyHireTrend() {
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월']
  const rand = mulberry32(44556)
  return months.map((m, i) => ({
    month: m,
    hired: 1 + Math.floor(rand() * 4),
    left: Math.floor(rand() * 2),
  }))
}

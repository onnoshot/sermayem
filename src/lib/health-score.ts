import type { Budget } from "@/types/database"

export interface HealthScoreInput {
  savingsRate: number        // percentage, can be negative
  expenseToIncomeRatio: number  // 0-infinity (expenses/income)
  budgets: Budget[]
  budgetSpending: Record<string, number>  // source_id → amount spent this month
  hasTransactionsThisMonth: boolean
  totalIncome: number
}

export interface HealthScoreResult {
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  gradeColor: string
  label: string
  comment: string
  breakdown: {
    savings: number
    expenseRatio: number
    budget: number
    activity: number
  }
}

export function calculateHealthScore(input: HealthScoreInput): HealthScoreResult {
  const { savingsRate, expenseToIncomeRatio, budgets, budgetSpending, hasTransactionsThisMonth, totalIncome } = input

  // Savings score (0-35)
  let savingsScore = 0
  if (totalIncome === 0) {
    savingsScore = 10
  } else if (savingsRate >= 20) savingsScore = 35
  else if (savingsRate >= 15) savingsScore = 28
  else if (savingsRate >= 10) savingsScore = 20
  else if (savingsRate >= 5) savingsScore = 12
  else if (savingsRate >= 0) savingsScore = 5
  else savingsScore = 0

  // Expense ratio score (0-35)
  let expenseScore = 0
  if (totalIncome === 0) {
    expenseScore = 10
  } else if (expenseToIncomeRatio <= 0.5) expenseScore = 35
  else if (expenseToIncomeRatio <= 0.65) expenseScore = 28
  else if (expenseToIncomeRatio <= 0.75) expenseScore = 20
  else if (expenseToIncomeRatio <= 0.85) expenseScore = 12
  else if (expenseToIncomeRatio <= 0.95) expenseScore = 5
  else expenseScore = 0

  // Budget adherence score (0-20)
  let budgetScore = 10 // neutral if no budgets
  if (budgets.length > 0) {
    const overCount = budgets.filter((b) => {
      if (!b.source_id) return false
      const spent = budgetSpending[b.source_id] ?? 0
      return spent > b.monthly_limit
    }).length
    const ratio = overCount / budgets.length
    if (ratio === 0) budgetScore = 20
    else if (ratio <= 0.25) budgetScore = 14
    else if (ratio <= 0.5) budgetScore = 8
    else budgetScore = 3
  }

  // Activity score (0-10)
  const activityScore = hasTransactionsThisMonth ? 10 : 0

  const score = Math.round(savingsScore + expenseScore + budgetScore + activityScore)

  let grade: HealthScoreResult["grade"]
  let gradeColor: string
  let label: string
  let comment: string

  if (score >= 85) {
    grade = "A"; gradeColor = "#22C55E"; label = "Mükemmel"
    comment = "Harika gidiyorsun! Tasarruf oranın ve gider disiplinin çok iyi."
  } else if (score >= 70) {
    grade = "B"; gradeColor = "#84CC16"; label = "İyi"
    comment = "Finansal durumun iyi. Tasarruf oranını biraz daha artırabilirsin."
  } else if (score >= 55) {
    grade = "C"; gradeColor = "#EAB308"; label = "Orta"
    comment = "Gelişime açık bir tablo. Bütçe limitlerini gözden geçirmeni öneririm."
  } else if (score >= 40) {
    grade = "D"; gradeColor = "#F97316"; label = "Geliştirilmeli"
    comment = "Giderler gelirin büyük kısmını alıyor. Bütçe oluşturmak yardımcı olacak."
  } else {
    grade = "F"; gradeColor = "#EF4444"; label = "Kritik"
    comment = "Giderler geliri aşıyor ya da çok az işlem var. Hemen bir bütçe planı kur."
  }

  return {
    score,
    grade,
    gradeColor,
    label,
    comment,
    breakdown: { savings: savingsScore, expenseRatio: expenseScore, budget: budgetScore, activity: activityScore },
  }
}

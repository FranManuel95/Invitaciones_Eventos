import { describe, expect, it } from "vitest";
import { agendaEntries, byDay, shiftMonth } from "@/lib/planning/agenda";
import { budgetInputSchema, summarizeBudget, type BudgetItem } from "@/lib/planning/budget";
import { sortTasks, suggestedTasks, taskState, type PlanTask } from "@/lib/planning/tasks";

const task = (title: string, dueDate: string | null, done = false): PlanTask => ({
  id: title,
  title,
  dueDate,
  assignee: "",
  done,
});

const item = (
  concept: string,
  estimated: number,
  paid: number,
  dueDate: string | null = null,
): BudgetItem => ({
  id: concept,
  concept,
  category: concept === "Finca" ? "Lugar y banquete" : "Otros",
  estimated,
  paid,
  dueDate,
  notes: "",
});

describe("tareas", () => {
  it("sugiere la lista clásica con fechas hacia atrás desde la boda", () => {
    const tasks = suggestedTasks("2027-05-22T16:30:00+02:00");
    expect(tasks).toHaveLength(14);
    expect(tasks[0]).toMatchObject({
      title: "Fijar el presupuesto y la lista de invitados",
      done: false,
    });
    expect(tasks[0]?.dueDate).toBe("2026-05-22");
    expect(tasks.every((t) => t.dueDate! < "2027-05-22")).toBe(true);
  });

  it("clasifica por estado respecto a hoy", () => {
    const today = "2026-10-20";
    expect(taskState(task("a", "2026-10-01"), today)).toBe("overdue");
    expect(taskState(task("b", "2026-11-05"), today)).toBe("soon");
    expect(taskState(task("c", "2027-02-01"), today)).toBe("later");
    expect(taskState(task("d", null), today)).toBe("undated");
    expect(taskState(task("e", "2026-10-01", true), today)).toBe("done");
  });

  it("ordena las pendientes por fecha y deja las hechas al final", () => {
    const sorted = sortTasks([
      task("x", "2027-01-01", true),
      task("y", null),
      task("z", "2026-12-01"),
    ]);
    expect(sorted.map((t) => t.title)).toEqual(["z", "y", "x"]);
  });
});

describe("presupuesto", () => {
  it("suma, agrupa por categoría y ordena los próximos pagos", () => {
    const s = summarizeBudget(
      [
        item("Finca", 12000, 4000, "2027-03-01"),
        item("Flores", 900, 0, "2026-12-01"),
        item("Anillos", 600, 600),
      ],
      100,
    );
    expect(s).toMatchObject({ estimated: 13500, paid: 4600, pending: 8900, perGuest: 135 });
    expect(s.byCategory[0]).toEqual({ category: "Lugar y banquete", estimated: 12000, paid: 4000 });
    expect(s.upcoming.map((u) => [u.concept, u.due])).toEqual([
      ["Flores", 900],
      ["Finca", 8000],
    ]);
    expect(summarizeBudget([], 0).perGuest).toBeNull();
  });

  it("redondea a céntimos y no admite negativos", () => {
    const base = { concept: "x", category: "Otros", paid: 0, dueDate: null, notes: "" };
    expect(budgetInputSchema.parse({ ...base, estimated: 10.005 }).estimated).toBe(10.01);
    expect(budgetInputSchema.safeParse({ ...base, estimated: -1 }).success).toBe(false);
  });
});

describe("agenda", () => {
  it("junta boda, plazo, tareas con fecha y pagos pendientes", () => {
    const entries = agendaEntries(
      { date: "2027-05-22T16:30:00+02:00", rsvpDeadline: "2027-04-15T23:59:00+02:00" },
      [task("Flores", "2027-02-01"), task("Sin fecha", null)],
      [item("Finca", 100, 100, "2027-01-01"), item("Música", 500, 0, "2027-04-15")],
    );
    expect(entries.map((e) => [e.date, e.kind])).toEqual([
      ["2027-02-01", "task"],
      ["2027-04-15", "deadline"],
      ["2027-04-15", "payment"],
      ["2027-05-22", "wedding"],
    ]);
    expect(byDay(entries).get("2027-04-15")).toHaveLength(2);
  });

  it("cambia de mes cruzando el año", () => {
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2027-01", -1)).toBe("2026-12");
  });
});

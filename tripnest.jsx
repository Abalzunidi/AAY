import { useState } from "react";

const COLORS = {
  primary: "#2F80ED", primaryLight: "#EBF3FD", green: "#27AE60", greenLight: "#E8F8EF",
  amber: "#F2C94C", amberLight: "#FDF8E3", red: "#EB5757", redLight: "#FDEEEE",
  bg: "#F9FAFB", card: "#FFFFFF", text: "#1F2937", textMuted: "#6B7280", border: "#E5E7EB",
};

const EXPENSE_CATEGORIES = ["إقامة","تذاكر طيران","مواصلات","تأجير سيارة","تأمين سفر","طعام","ترفيه","أخرى"];
const ACTIVITY_TYPES = ["معالم سياحية","مغامرة","ثقافة","طعام وشراب","استرخاء","تسوق","أخرى"];

const defaultState = {
  trip: { name: "", destination: "", dates: "", budget: 0 },
  members: [],
  expenses: [],
  restaurants: [],
  activities: [],
  schedule: [],
};

function useData() {
  const [data, setData] = useState(defaultState);
  const update = (key, val) => setData(d => ({ ...d, [key]: val }));
  const updateTrip = (trip) => update("trip", trip);
  const addMember = (m) => update("members", [...data.members, { ...m, id: Date.now() }]);
  const removeMember = (id) => update("members", data.members.filter(m => m.id !== id));
  const updateMember = (id, changes) => update("members", data.members.map(m => m.id === id ? { ...m, ...changes } : m));
  const addExpense = (e) => update("expenses", [...data.expenses, { ...e, id: Date.now() }]);
  const removeExpense = (id) => update("expenses", data.expenses.filter(e => e.id !== id));
  const toggleExpense = (id) => update("expenses", data.expenses.map(e => e.id === id ? { ...e, paid: !e.paid } : e));
  const addRestaurant = (r) => update("restaurants", [...data.restaurants, { ...r, id: Date.now() }]);
  const removeRestaurant = (id) => update("restaurants", data.restaurants.filter(r => r.id !== id));
  const toggleRestaurant = (id) => update("restaurants", data.restaurants.map(r => r.id === id ? { ...r, reserved: !r.reserved } : r));
  const addActivity = (a) => update("activities", [...data.activities, { ...a, id: Date.now() }]);
  const removeActivity = (id) => update("activities", data.activities.filter(a => a.id !== id));
  const toggleActivity = (id) => update("activities", data.activities.map(a => a.id === id ? { ...a, booked: !a.booked } : a));
  const addScheduleDay = (day) => update("schedule", [...data.schedule, { ...day, id: Date.now() }]);
  const removeScheduleDay = (id) => update("schedule", data.schedule.filter(d => d.id !== id));

  const totalCollected = data.members.reduce((s, m) => s + m.paid, 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + e.amount, 0);
  const totalActivitiesCost = data.activities.reduce((s, a) => s + a.cost, 0);
  const totalBudget = data.trip.budget;
  const remaining = totalBudget - totalExpenses - totalActivitiesCost;
  const memberCount = data.members.length;
  const perPerson = memberCount > 0 ? Math.round((totalExpenses + totalActivitiesCost) / memberCount) : 0;
  const unpaidMembers = data.members.filter(m => m.paid < m.contribution);

  return { data, updateTrip, addMember, removeMember, updateMember, addExpense, removeExpense, toggleExpense, addRestaurant, removeRestaurant, toggleRestaurant, addActivity, removeActivity, toggleActivity, addScheduleDay, removeScheduleDay, stats: { totalCollected, totalExpenses, totalActivitiesCost, totalBudget, remaining, memberCount, perPerson, unpaidMembers } };
}

const fmt = (n) => n.toLocaleString("ar-SA") + " ر.س";
const pct = (a, b) => b > 0 ? Math.min(100, Math.round((a / b) * 100)) : 0;

function Avatar({ name, size = 36 }) {
  const colors = ["#2F80ED","#27AE60","#F2994A","#9B51E0","#EB5757","#2D9CDB","#219653"];
  const bg = colors[(name.charCodeAt(0) || 0) % colors.length];
  const initials = name.trim() ? name.trim()[0] : "؟";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 500, fontSize: size * 0.42, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function Badge({ children, color = "blue" }) {
  const map = { blue: [COLORS.primaryLight, COLORS.primary], green: [COLORS.greenLight, COLORS.green], amber: [COLORS.amberLight, "#B45309"], red: [COLORS.redLight, COLORS.red], gray: ["#F3F4F6", "#6B7280"] };
  const [bg, tc] = map[color] || map.gray;
  return <span style={{ background: bg, color: tc, fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "1.25rem", ...style }}>{children}</div>;
}

function StatCard({ label, value, icon, color = COLORS.primary, sub }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "1rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: COLORS.textMuted }}>{label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className={`ti ${icon}`} style={{ fontSize: 16, color }} aria-hidden="true" />
        </div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, color: COLORS.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ value, max, color = COLORS.primary }) {
  const p = pct(value, max);
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${p}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.3s" }} />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: COLORS.card, borderRadius: 16, width: "100%", maxWidth: 480, padding: "1.5rem", maxHeight: "90vh", overflowY: "auto", direction: "rtl" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textMuted, padding: 4, lineHeight: 1 }}>
            <i className="ti ti-x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ fontSize: 13, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>{label}</label>}
      <input style={{ width: "100%", padding: "8px 12px", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, color: COLORS.text, background: COLORS.bg, boxSizing: "border-box", textAlign: "right" }} {...props} />
    </div>
  );
}

function SelectInput({ label, options, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={{ fontSize: 13, color: COLORS.textMuted, display: "block", marginBottom: 4 }}>{label}</label>}
      <select style={{ width: "100%", padding: "8px 12px", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, color: COLORS.text, background: COLORS.bg, boxSizing: "border-box" }} {...props}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function BtnPrimary({ children, onClick, style = {} }) {
  return <button onClick={onClick} style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 14, fontWeight: 500, cursor: "pointer", ...style }}>{children}</button>;
}

function BtnGhost({ children, onClick, style = {}, danger }) {
  return <button onClick={onClick} style={{ background: "none", border: `1px solid ${danger ? COLORS.red : COLORS.border}`, color: danger ? COLORS.red : COLORS.text, borderRadius: 8, padding: "7px 14px", fontSize: 13, cursor: "pointer", ...style }}>{children}</button>;
}

function Empty({ icon, text }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: COLORS.textMuted }}>
      <i className={`ti ${icon}`} style={{ fontSize: 40, opacity: 0.3, display: "block", marginBottom: 12 }} aria-hidden="true" />
      <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <Empty icon="ti-chart-pie-2" text="لا توجد مصروفات بعد" />;
  const palette = [COLORS.primary, COLORS.green, "#F2994A", "#9B51E0", "#2D9CDB", "#EB5757"];
  let cum = 0;
  const size = 140, cx = 70, cy = 70, r = 52;
  const slices = data.map((d, i) => {
    const s = (cum / total) * 2 * Math.PI - Math.PI / 2;
    cum += d.value;
    const e = (cum / total) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = e - s > Math.PI ? 1 : 0;
    return { path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: palette[i % palette.length], label: d.label, pct: Math.round((d.value / total) * 100) };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth={2} />)}
        <circle cx={cx} cy={cy} r={28} fill={COLORS.card} />
      </svg>
      <div style={{ flex: 1 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: COLORS.text, flex: 1 }}>{s.label}</span>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ d, stats, updateTrip }) {
  const { totalCollected, totalExpenses, totalBudget, remaining, memberCount, perPerson, unpaidMembers, totalActivitiesCost } = stats;
  const [editTrip, setEditTrip] = useState(false);
  const [tripForm, setTripForm] = useState(d.trip);
  const budgetPct = pct(totalExpenses + totalActivitiesCost, totalBudget);
  const collectedTotal = d.members.reduce((s, m) => s + m.contribution, 0);
  const collectedPct = pct(totalCollected, collectedTotal);
  const expenseBreakdown = EXPENSE_CATEGORIES.map(cat => ({ label: cat, value: d.expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0) })).filter(x => x.value > 0);
  const upcoming = d.activities.filter(a => !a.booked).slice(0, 3);

  return (
    <div>
      <Card style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className="ti ti-plane-tilt" style={{ fontSize: 22, color: COLORS.primary }} aria-hidden="true" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500, fontSize: 16 }}>{d.trip.name || "اسم الرحلة"}</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>{d.trip.destination || "الوجهة"} {d.trip.dates ? "· " + d.trip.dates : ""}</div>
        </div>
        <BtnGhost onClick={() => { setTripForm(d.trip); setEditTrip(true); }}>
          <i className="ti ti-edit" style={{ fontSize: 14, marginLeft: 5 }} /> تعديل الرحلة
        </BtnGhost>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        <StatCard label="الميزانية الكلية" value={fmt(totalBudget)} icon="ti-wallet" color={COLORS.primary} />
        <StatCard label="المبلغ المحصّل" value={fmt(totalCollected)} icon="ti-cash" color={COLORS.green} sub={`${collectedPct}% من الهدف`} />
        <StatCard label="إجمالي المصروفات" value={fmt(totalExpenses + totalActivitiesCost)} icon="ti-receipt" color="#F2994A" />
        <StatCard label="المتبقي" value={fmt(Math.max(0, remaining))} icon="ti-chart-pie" color={remaining < 0 ? COLORS.red : COLORS.primary} sub={remaining < 0 ? "تجاوزت الميزانية!" : "متاح"} />
        <StatCard label="نصيب الفرد" value={fmt(perPerson)} icon="ti-users" color="#9B51E0" />
        <StatCard label="عدد الأعضاء" value={memberCount} icon="ti-user-check" color={COLORS.green} sub={`${unpaidMembers.length} لم يدفع بعد`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <i className="ti ti-chart-bar" style={{ color: COLORS.primary, fontSize: 18 }} aria-hidden="true" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>نظرة على الميزانية</h3>
          </div>
          {totalBudget === 0 ? <p style={{ color: COLORS.textMuted, fontSize: 13 }}>أضف ميزانية الرحلة أولاً</p> : (
            <>
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: COLORS.textMuted }}>المصروف {fmt(totalExpenses + totalActivitiesCost)} من {fmt(totalBudget)}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: budgetPct > 80 ? COLORS.red : COLORS.text }}>{budgetPct}%</span>
                </div>
                <ProgressBar value={totalExpenses + totalActivitiesCost} max={totalBudget} color={budgetPct > 80 ? COLORS.red : COLORS.primary} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: COLORS.textMuted }}>المحصّل {fmt(totalCollected)}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.green }}>{collectedPct}%</span>
                </div>
                <ProgressBar value={totalCollected} max={collectedTotal} color={COLORS.green} />
              </div>
            </>
          )}
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <i className="ti ti-chart-pie-2" style={{ color: "#F2994A", fontSize: 18 }} aria-hidden="true" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>توزيع المصروفات</h3>
          </div>
          <PieChart data={expenseBreakdown} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {unpaidMembers.length > 0 && (
          <Card style={{ borderRight: `4px solid ${COLORS.amber}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
              <i className="ti ti-alert-triangle" style={{ color: COLORS.amber, fontSize: 18 }} aria-hidden="true" />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>مدفوعات معلّقة</h3>
            </div>
            {unpaidMembers.map(m => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Avatar name={m.name} size={30} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>المتبقي {fmt(m.contribution - m.paid)}</div>
                </div>
                <Badge color="amber">معلّق</Badge>
              </div>
            ))}
          </Card>
        )}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
            <i className="ti ti-calendar-event" style={{ color: COLORS.green, fontSize: 18 }} aria-hidden="true" />
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500 }}>أنشطة لم تُحجز بعد</h3>
          </div>
          {upcoming.length === 0 ? <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>جميع الأنشطة محجوزة!</p> : upcoming.map(a => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ti ti-map-pin" style={{ fontSize: 14, color: COLORS.primary }} aria-hidden="true" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.day} · {a.time}</div>
              </div>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{fmt(a.cost)}</span>
            </div>
          ))}
        </Card>
      </div>

      {editTrip && (
        <Modal title="تعديل بيانات الرحلة" onClose={() => setEditTrip(false)}>
          <Input label="اسم الرحلة" value={tripForm.name} onChange={e => setTripForm({ ...tripForm, name: e.target.value })} placeholder="مثال: رحلة دبي الصيفية" />
          <Input label="الوجهة" value={tripForm.destination} onChange={e => setTripForm({ ...tripForm, destination: e.target.value })} placeholder="مثال: دبي، الإمارات" />
          <Input label="التواريخ" value={tripForm.dates} onChange={e => setTripForm({ ...tripForm, dates: e.target.value })} placeholder="مثال: 1–10 أغسطس 2025" />
          <Input label="الميزانية الكلية (ر.س)" type="number" value={tripForm.budget || ""} onChange={e => setTripForm({ ...tripForm, budget: Number(e.target.value) })} placeholder="مثال: 20000" />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <BtnGhost onClick={() => setEditTrip(false)}>إلغاء</BtnGhost>
            <BtnPrimary onClick={() => { updateTrip(tripForm); setEditTrip(false); }}>حفظ</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Members({ members, addMember, removeMember, updateMember }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", contribution: "", paid: "" });
  const [editId, setEditId] = useState(null);
  const [editPaid, setEditPaid] = useState("");
  const total = members.reduce((s, m) => s + m.contribution, 0);
  const collected = members.reduce((s, m) => s + m.paid, 0);

  const handleAdd = () => {
    if (!form.name) return;
    addMember({ name: form.name, contribution: Number(form.contribution) || 0, paid: Number(form.paid) || 0 });
    setForm({ name: "", contribution: "", paid: "" });
    setShowAdd(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>أعضاء المجموعة</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: COLORS.textMuted }}>{members.length} مسافر · محصّل {fmt(collected)} من {fmt(total)}</p>
        </div>
        <BtnPrimary onClick={() => setShowAdd(true)}>+ إضافة عضو</BtnPrimary>
      </div>
      {members.length === 0 ? <Empty icon="ti-users" text="لم تُضف أعضاء بعد. ابدأ بإضافة أول مسافر!" /> : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {members.map(m => {
            const balance = m.contribution - m.paid;
            const paid = balance <= 0;
            return (
              <Card key={m.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar name={m.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</span>
                    <Badge color={paid ? "green" : "amber"}>{paid ? "مدفوع ✓" : "معلّق"}</Badge>
                  </div>
                  <ProgressBar value={m.paid} max={m.contribution} color={paid ? COLORS.green : COLORS.amber} />
                  <div style={{ display: "flex", gap: 16, marginTop: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>المطلوب: <strong>{fmt(m.contribution)}</strong></span>
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>المدفوع: <strong style={{ color: COLORS.green }}>{fmt(m.paid)}</strong></span>
                    {!paid && <span style={{ fontSize: 12, color: COLORS.red }}>المتبقي: <strong>{fmt(balance)}</strong></span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {editId === m.id ? (
                    <>
                      <input value={editPaid} onChange={e => setEditPaid(e.target.value)} placeholder="المبلغ المدفوع" style={{ width: 110, padding: "6px 10px", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, textAlign: "right" }} />
                      <BtnGhost onClick={() => { updateMember(m.id, { paid: Number(editPaid) }); setEditId(null); }}>حفظ</BtnGhost>
                    </>
                  ) : (
                    <BtnGhost onClick={() => { setEditId(m.id); setEditPaid(m.paid); }}>
                      <i className="ti ti-edit" style={{ fontSize: 14 }} />
                    </BtnGhost>
                  )}
                  <BtnGhost onClick={() => removeMember(m.id)} danger>
                    <i className="ti ti-trash" style={{ fontSize: 14 }} />
                  </BtnGhost>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {showAdd && (
        <Modal title="إضافة عضو" onClose={() => setShowAdd(false)}>
          <Input label="الاسم" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="الاسم الكامل" />
          <Input label="المبلغ المطلوب (ر.س)" type="number" value={form.contribution} onChange={e => setForm({ ...form, contribution: e.target.value })} placeholder="مثال: 2000" />
          <Input label="المبلغ المدفوع (ر.س)" type="number" value={form.paid} onChange={e => setForm({ ...form, paid: e.target.value })} placeholder="0" />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <BtnGhost onClick={() => setShowAdd(false)}>إلغاء</BtnGhost>
            <BtnPrimary onClick={handleAdd}>إضافة</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Expenses({ expenses, members, addExpense, removeExpense, toggleExpense }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", category: "إقامة", amount: "", paid: false });
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const paidTotal = expenses.filter(e => e.paid).reduce((s, e) => s + e.amount, 0);
  const perPerson = members.length > 0 ? Math.round(total / members.length) : 0;

  const handleAdd = () => {
    if (!form.title || !form.amount) return;
    addExpense({ ...form, amount: Number(form.amount) });
    setForm({ title: "", category: "إقامة", amount: "", paid: false });
    setShowAdd(false);
  };

  const catIcon = { "تذاكر طيران": "ti-plane", "إقامة": "ti-building", "مواصلات": "ti-bus", "تأمين سفر": "ti-shield", "تأجير سيارة": "ti-car" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>المصروفات الأساسية</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: COLORS.textMuted }}>الإجمالي {fmt(total)} · نصيب الفرد {fmt(perPerson)}</p>
        </div>
        <BtnPrimary onClick={() => setShowAdd(true)}>+ إضافة مصروف</BtnPrimary>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10, marginBottom: "1.25rem" }}>
        <StatCard label="الإجمالي" value={fmt(total)} icon="ti-receipt" color={COLORS.primary} />
        <StatCard label="المدفوع" value={fmt(paidTotal)} icon="ti-check" color={COLORS.green} />
        <StatCard label="المتبقي" value={fmt(total - paidTotal)} icon="ti-clock" color="#F2994A" />
        <StatCard label="نصيب الفرد" value={fmt(perPerson)} icon="ti-users" color="#9B51E0" />
      </div>
      {expenses.length === 0 ? <Empty icon="ti-credit-card" text="لا توجد مصروفات بعد. أضف أول مصروف!" /> : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {expenses.map(e => (
            <Card key={e.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: e.paid ? COLORS.greenLight : COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className={`ti ${catIcon[e.category] || "ti-credit-card"}`} style={{ fontSize: 18, color: e.paid ? COLORS.green : COLORS.primary }} aria-hidden="true" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{e.title}</span>
                  <Badge color={e.paid ? "green" : "gray"}>{e.category}</Badge>
                </div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{fmt(Math.round(e.amount / (members.length || 1)))} للفرد</div>
              </div>
              <div style={{ textAlign: "left", marginLeft: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{fmt(e.amount)}</div>
                <Badge color={e.paid ? "green" : "amber"}>{e.paid ? "مدفوع" : "غير مدفوع"}</Badge>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <BtnGhost onClick={() => toggleExpense(e.id)}>
                  <i className={`ti ${e.paid ? "ti-x" : "ti-check"}`} style={{ fontSize: 14 }} />
                </BtnGhost>
                <BtnGhost onClick={() => removeExpense(e.id)} danger>
                  <i className="ti ti-trash" style={{ fontSize: 14 }} />
                </BtnGhost>
              </div>
            </Card>
          ))}
        </div>
      )}
      {showAdd && (
        <Modal title="إضافة مصروف" onClose={() => setShowAdd(false)}>
          <Input label="اسم المصروف" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: حجز الفندق" />
          <SelectInput label="التصنيف" options={EXPENSE_CATEGORIES} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <Input label="المبلغ (ر.س)" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="مثال: 3000" />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 14 }}>
            <input type="checkbox" checked={form.paid} onChange={e => setForm({ ...form, paid: e.target.checked })} />
            تم الدفع بالفعل
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <BtnGhost onClick={() => setShowAdd(false)}>إلغاء</BtnGhost>
            <BtnPrimary onClick={handleAdd}>إضافة</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Restaurants({ restaurants, addRestaurant, removeRestaurant, toggleRestaurant }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", cuisine: "", price: "$$", day: "", reserved: false, note: "" });
  const handleAdd = () => {
    if (!form.name) return;
    addRestaurant({ ...form });
    setForm({ name: "", cuisine: "", price: "$$", day: "", reserved: false, note: "" });
    setShowAdd(false);
  };
  const priceColor = { "$": "green", "$$": "blue", "$$$": "amber", "$$$$": "red" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>المطاعم</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: COLORS.textMuted }}>{restaurants.length} مطعم · {restaurants.filter(r => r.reserved).length} محجوز</p>
        </div>
        <BtnPrimary onClick={() => setShowAdd(true)}>+ إضافة مطعم</BtnPrimary>
      </div>
      {restaurants.length === 0 ? <Empty icon="ti-tools-kitchen-2" text="لا توجد مطاعم بعد. أضف أول مطعم!" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {restaurants.map(r => (
            <Card key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className="ti ti-tools-kitchen-2" style={{ fontSize: 18, color: "#E65100" }} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{r.cuisine}</div>
                  </div>
                </div>
                <Badge color={priceColor[r.price] || "gray"}>{r.price}</Badge>
              </div>
              {r.note && <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "0 0 8px", background: COLORS.bg, borderRadius: 8, padding: "6px 10px" }}>{r.note}</p>}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {r.day && <span style={{ fontSize: 12, color: COLORS.textMuted }}><i className="ti ti-calendar" style={{ fontSize: 12, marginLeft: 3 }} aria-hidden="true" />{r.day}</span>}
                  <Badge color={r.reserved ? "green" : "gray"}>{r.reserved ? "محجوز" : "غير محجوز"}</Badge>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <BtnGhost onClick={() => toggleRestaurant(r.id)} style={{ padding: "5px 10px" }}>
                    <i className={`ti ${r.reserved ? "ti-x" : "ti-check"}`} style={{ fontSize: 13 }} />
                  </BtnGhost>
                  <BtnGhost onClick={() => removeRestaurant(r.id)} danger style={{ padding: "5px 10px" }}>
                    <i className="ti ti-trash" style={{ fontSize: 13 }} />
                  </BtnGhost>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {showAdd && (
        <Modal title="إضافة مطعم" onClose={() => setShowAdd(false)}>
          <Input label="اسم المطعم" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: مطعم البحر" />
          <Input label="نوع المطبخ" value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} placeholder="مثال: مطبخ عربي" />
          <SelectInput label="نطاق السعر" options={["$", "$$", "$$$", "$$$$"]} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          <Input label="اليوم" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} placeholder="مثال: 12 أغسطس" />
          <Input label="ملاحظة" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="أي ملاحظات..." />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 14 }}>
            <input type="checkbox" checked={form.reserved} onChange={e => setForm({ ...form, reserved: e.target.checked })} />
            تم الحجز بالفعل
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <BtnGhost onClick={() => setShowAdd(false)}>إلغاء</BtnGhost>
            <BtnPrimary onClick={handleAdd}>إضافة</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Activities({ activities, members, addActivity, removeActivity, toggleActivity }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", type: "معالم سياحية", cost: "", day: "", time: "", booked: false });
  const total = activities.reduce((s, a) => s + a.cost, 0);
  const perPerson = members.length > 0 ? Math.round(total / members.length) : 0;
  const handleAdd = () => {
    if (!form.name) return;
    addActivity({ ...form, cost: Number(form.cost) || 0 });
    setForm({ name: "", type: "معالم سياحية", cost: "", day: "", time: "", booked: false });
    setShowAdd(false);
  };
  const typeIcon = { "معالم سياحية": "ti-eye", "مغامرة": "ti-mountain", "ثقافة": "ti-building-arch", "طعام وشراب": "ti-tools-kitchen-2", "استرخاء": "ti-pool", "تسوق": "ti-shopping-bag" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>الأنشطة</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: COLORS.textMuted }}>{activities.length} نشاط · الإجمالي {fmt(total)} · نصيب الفرد {fmt(perPerson)}</p>
        </div>
        <BtnPrimary onClick={() => setShowAdd(true)}>+ إضافة نشاط</BtnPrimary>
      </div>
      {activities.length === 0 ? <Empty icon="ti-map-pin" text="لا توجد أنشطة بعد. أضف أول نشاط!" /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0.75rem" }}>
          {activities.map(a => (
            <Card key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <i className={`ti ${typeIcon[a.type] || "ti-map-pin"}`} style={{ fontSize: 18, color: COLORS.primary }} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted }}>{a.type}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 500, fontSize: 15 }}>{a.cost > 0 ? fmt(a.cost) : "مجاني"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {a.day && <span style={{ fontSize: 12, color: COLORS.textMuted }}><i className="ti ti-calendar" style={{ fontSize: 12, marginLeft: 3 }} aria-hidden="true" />{a.day}</span>}
                  {a.time && <span style={{ fontSize: 12, color: COLORS.textMuted }}><i className="ti ti-clock" style={{ fontSize: 12, marginLeft: 3 }} aria-hidden="true" />{a.time}</span>}
                </div>
                <Badge color={a.booked ? "green" : "amber"}>{a.booked ? "محجوز" : "غير محجوز"}</Badge>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
                <BtnGhost onClick={() => toggleActivity(a.id)} style={{ padding: "5px 10px" }}>
                  <i className={`ti ${a.booked ? "ti-x" : "ti-check"}`} style={{ fontSize: 13 }} />
                </BtnGhost>
                <BtnGhost onClick={() => removeActivity(a.id)} danger style={{ padding: "5px 10px" }}>
                  <i className="ti ti-trash" style={{ fontSize: 13 }} />
                </BtnGhost>
              </div>
            </Card>
          ))}
        </div>
      )}
      {showAdd && (
        <Modal title="إضافة نشاط" onClose={() => setShowAdd(false)}>
          <Input label="اسم النشاط" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: جولة المدينة القديمة" />
          <SelectInput label="النوع" options={ACTIVITY_TYPES} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
          <Input label="التكلفة (ر.س، 0 إذا مجاني)" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="0" />
          <Input label="اليوم" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} placeholder="مثال: 12 أغسطس" />
          <Input label="الوقت" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="مثال: 10:00 صباحاً" />
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer", marginBottom: 14 }}>
            <input type="checkbox" checked={form.booked} onChange={e => setForm({ ...form, booked: e.target.checked })} />
            تم الحجز بالفعل
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <BtnGhost onClick={() => setShowAdd(false)}>إلغاء</BtnGhost>
            <BtnPrimary onClick={handleAdd}>إضافة</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Schedule({ schedule, addScheduleDay, removeScheduleDay }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ day: "", items: [{ time: "", title: "", type: "activity" }] });
  const typeColor = { activity: COLORS.primaryLight, restaurant: "#FFF3E0", note: COLORS.bg };
  const typeTextColor = { activity: COLORS.primary, restaurant: "#E65100", note: COLORS.textMuted };
  const typeLabel = { activity: "نشاط", restaurant: "مطعم", note: "ملاحظة" };

  const addItem = () => setForm({ ...form, items: [...form.items, { time: "", title: "", type: "activity" }] });
  const updateItem = (i, key, val) => {
    const items = [...form.items];
    items[i] = { ...items[i], [key]: val };
    setForm({ ...form, items });
  };
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  const handleAdd = () => {
    if (!form.day) return;
    addScheduleDay(form);
    setForm({ day: "", items: [{ time: "", title: "", type: "activity" }] });
    setShowAdd(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>الجدول اليومي</h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: COLORS.textMuted }}>{schedule.length} أيام مخططة</p>
        </div>
        <BtnPrimary onClick={() => setShowAdd(true)}>+ إضافة يوم</BtnPrimary>
      </div>
      {schedule.length === 0 ? <Empty icon="ti-calendar" text="لا يوجد جدول بعد. ابدأ بإضافة أول يوم!" /> : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {schedule.map(day => (
            <Card key={day.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="ti ti-calendar" style={{ fontSize: 18, color: COLORS.primary }} aria-hidden="true" />
                </div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 500, flex: 1 }}>{day.day}</h3>
                <BtnGhost onClick={() => removeScheduleDay(day.id)} danger style={{ padding: "5px 10px" }}>
                  <i className="ti ti-trash" style={{ fontSize: 13 }} />
                </BtnGhost>
              </div>
              <div style={{ borderRight: `2px solid ${COLORS.border}`, paddingRight: "1rem", marginRight: "0.5rem" }}>
                {day.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, position: "relative" }}>
                    <div style={{ position: "absolute", right: -22, top: 6, width: 8, height: 8, borderRadius: "50%", background: typeTextColor[item.type] }} />
                    <div style={{ minWidth: 75, fontSize: 12, color: COLORS.textMuted, paddingTop: 4 }}>{item.time}</div>
                    <div style={{ background: typeColor[item.type], borderRadius: 8, padding: "6px 12px", flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: typeTextColor[item.type] }}>
                        <i className={`ti ${item.type === "activity" ? "ti-map-pin" : item.type === "restaurant" ? "ti-tools-kitchen-2" : "ti-notes"}`} style={{ fontSize: 12, marginLeft: 5 }} aria-hidden="true" />
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
      {showAdd && (
        <Modal title="إضافة يوم للجدول" onClose={() => setShowAdd(false)}>
          <Input label="اليوم / التاريخ" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} placeholder="مثال: 12 أغسطس" />
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13, color: COLORS.textMuted, display: "block", marginBottom: 8 }}>الفعاليات</label>
            {form.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 8, alignItems: "center" }}>
                <input value={item.time} onChange={e => updateItem(i, "time", e.target.value)} placeholder="الوقت" style={{ width: 80, padding: "7px 10px", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, textAlign: "right" }} />
                <input value={item.title} onChange={e => updateItem(i, "title", e.target.value)} placeholder="العنوان" style={{ flex: 1, padding: "7px 10px", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, textAlign: "right" }} />
                <select value={item.type} onChange={e => updateItem(i, "type", e.target.value)} style={{ padding: "7px 8px", border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }}>
                  <option value="activity">نشاط</option>
                  <option value="restaurant">مطعم</option>
                  <option value="note">ملاحظة</option>
                </select>
                {form.items.length > 1 && <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", color: COLORS.red, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>}
              </div>
            ))}
            <button onClick={addItem} style={{ background: "none", border: `1px dashed ${COLORS.border}`, borderRadius: 8, padding: "7px 14px", fontSize: 13, color: COLORS.textMuted, cursor: "pointer", width: "100%", marginTop: 4 }}>+ فعالية جديدة</button>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
            <BtnGhost onClick={() => setShowAdd(false)}>إلغاء</BtnGhost>
            <BtnPrimary onClick={handleAdd}>إضافة اليوم</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

const TABS = [
  { id: "dashboard", label: "الرئيسية", icon: "ti-layout-dashboard" },
  { id: "members", label: "الأعضاء", icon: "ti-users" },
  { id: "expenses", label: "المصروفات", icon: "ti-credit-card" },
  { id: "restaurants", label: "المطاعم", icon: "ti-tools-kitchen-2" },
  { id: "activities", label: "الأنشطة", icon: "ti-map-pin" },
  { id: "schedule", label: "الجدول", icon: "ti-calendar" },
];

export default function TripNest() {
  const [tab, setTab] = useState("dashboard");
  const { data, updateTrip, addMember, removeMember, updateMember, addExpense, removeExpense, toggleExpense, addRestaurant, removeRestaurant, toggleRestaurant, addActivity, removeActivity, toggleActivity, addScheduleDay, removeScheduleDay, stats } = useData();

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: COLORS.text, background: COLORS.bg, minHeight: "100vh", direction: "rtl" }}>
      <h2 className="sr-only">TripNest — تخطيط الرحلات الجماعية</h2>
      <div style={{ background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, padding: "0 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.75rem 0 0" }}>
            <svg width="110" height="38" viewBox="0 0 110 38" xmlns="http://www.w3.org/2000/svg" aria-label="AAY GROUP">
              <circle cx="19" cy="19" r="17" fill="none" stroke="#2F80ED" strokeWidth="1.5" opacity="0.3"/>
              <circle cx="19" cy="19" r="13" fill="none" stroke="#2F80ED" strokeWidth="1" opacity="0.5"/>
              <circle cx="19" cy="19" r="9" fill="none" stroke="#1a5fb4" strokeWidth="0.8" opacity="0.7"/>
              <path d="M 7 8 A 17 17 0 0 1 31 8" fill="none" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round"/>
              <path d="M 7 30 A 17 17 0 0 0 31 30" fill="none" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round"/>
              <text x="10" y="24" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#1F2937">A</text>
              <text x="19" y="24" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#1F2937">A</text>
              <text x="28" y="24" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#2F80ED">Y</text>
              <rect x="10" y="27" width="19" height="1.5" rx="0.75" fill="#F2C94C"/>
              <text x="42" y="16" fontFamily="Georgia,serif" fontSize="13" fontWeight="700" fill="#1F2937">AAY</text>
              <text x="42" y="30" fontFamily="system-ui,sans-serif" fontSize="8" fontWeight="500" fill="#6B7280" letterSpacing="2">GROUP</text>
            </svg>
            {data.trip.name && <span style={{ fontSize: 13, color: COLORS.textMuted, borderRight: `1px solid ${COLORS.border}`, paddingRight: 12 }}>· {data.trip.name}</span>}
            {data.trip.destination && (
              <div style={{ marginRight: "auto", display: "flex", gap: 4, alignItems: "center" }}>
                <i className="ti ti-map-pin" style={{ fontSize: 14, color: COLORS.textMuted }} aria-hidden="true" />
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{data.trip.destination}</span>
                {data.trip.dates && <><span style={{ color: COLORS.border }}>·</span><span style={{ fontSize: 13, color: COLORS.textMuted }}>{data.trip.dates}</span></>}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 0, overflowX: "auto", marginTop: 8 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ background: "none", border: "none", borderBottom: tab === t.id ? `2px solid ${COLORS.primary}` : "2px solid transparent", padding: "10px 14px", fontSize: 13, fontWeight: tab === t.id ? 500 : 400, color: tab === t.id ? COLORS.primary : COLORS.textMuted, cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
                <i className={`ti ${t.icon}`} style={{ fontSize: 15 }} aria-hidden="true" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem" }}>
        {tab === "dashboard" && <Dashboard d={data} stats={stats} updateTrip={updateTrip} />}
        {tab === "members" && <Members members={data.members} addMember={addMember} removeMember={removeMember} updateMember={updateMember} />}
        {tab === "expenses" && <Expenses expenses={data.expenses} members={data.members} addExpense={addExpense} removeExpense={removeExpense} toggleExpense={toggleExpense} />}
        {tab === "restaurants" && <Restaurants restaurants={data.restaurants} addRestaurant={addRestaurant} removeRestaurant={removeRestaurant} toggleRestaurant={toggleRestaurant} />}
        {tab === "activities" && <Activities activities={data.activities} members={data.members} addActivity={addActivity} removeActivity={removeActivity} toggleActivity={toggleActivity} />}
        {tab === "schedule" && <Schedule schedule={data.schedule} addScheduleDay={addScheduleDay} removeScheduleDay={removeScheduleDay} />}
      </div>
    </div>
  );
}

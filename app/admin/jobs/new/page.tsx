"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/app/providers";

type Lang = "ua" | "jp" | "en";

type EmploymentTypeCode = "PART_TIME" | "FULL_TIME" | "CONTRACT" | "INTERNSHIP";
type JapaneseLevelCode = "NOT_REQUIRED" | "BASIC" | "N4" | "N3" | "N2" | "N1";
type JobTermCode = "ONE_DAY" | "SHORT_TERM" | "ONE_MONTH" | "LONG_TERM";

const EMPLOYMENT_TYPES: { value: EmploymentTypeCode; labels: { ua: string; jp: string; en: string } }[] = [
  { value: "PART_TIME", labels: { ua: "Підробіток", jp: "アルバイト", en: "Part-time" } },
  { value: "FULL_TIME", labels: { ua: "Повна зайнятість", jp: "正社員", en: "Full-time" } },
  { value: "CONTRACT", labels: { ua: "Контракт", jp: "契約社員", en: "Contract" } },
  { value: "INTERNSHIP", labels: { ua: "Інтернатура", jp: "インターン", en: "Internship" } },
];

const FACILITY_TYPES = [
  { value: "CAFE_RESTAURANT", labels: { ua: "Заклад харчування", jp: "飲食店", en: "Food service" } },
  { value: "IT_COMPANY", labels: { ua: "IT компанія", jp: "IT企業", en: "IT company" } },
  { value: "OFFICE", labels: { ua: "Офісна компанія", jp: "オフィス / 事務所", en: "Office" } },
  { value: "CARE_FACILITY", labels: { ua: "Догляд / медичний заклад", jp: "介護・福祉施設", en: "Care / nursing facility" } },
  { value: "RETAIL_SHOP", labels: { ua: "Магазин / торгівля", jp: "小売店", en: "Retail / shop" } },
  { value: "HOTEL", labels: { ua: "Готель", jp: "ホテル", en: "Hotel" } },
  { value: "OTHER", labels: { ua: "Інше", jp: "その他", en: "Other" } },
] as const;

const JAPANESE_LEVELS: { value: JapaneseLevelCode; labels: { ua: string; jp: string; en: string } }[] = [
  { value: "NOT_REQUIRED", labels: { ua: "Не вимагається", jp: "不問", en: "Not required" } },
  { value: "BASIC", labels: { ua: "Базовий", jp: "初級", en: "Basic" } },
  { value: "N4", labels: { ua: "JLPT N4", jp: "N4レベル", en: "JLPT N4" } },
  { value: "N3", labels: { ua: "JLPT N3", jp: "N3レベル", en: "JLPT N3" } },
  { value: "N2", labels: { ua: "JLPT N2", jp: "N2レベル", en: "JLPT N2" } },
  { value: "N1", labels: { ua: "JLPT N1", jp: "N1レベル", en: "JLPT N1" } },
];

const JOB_TERMS: { value: JobTermCode; labels: { ua: string; jp: string; en: string } }[] = [
  { value: "ONE_DAY", labels: { ua: "1 день", jp: "1日だけ", en: "One day" } },
  { value: "SHORT_TERM", labels: { ua: "Короткий термін", jp: "短期", en: "Short-term" } },
  { value: "ONE_MONTH", labels: { ua: "Близько 1 місяця", jp: "1ヶ月ほど", en: "Around 1 month" } },
  { value: "LONG_TERM", labels: { ua: "Довгостроково", jp: "長期", en: "Long-term" } },
];

export default function AdminNewJobPage() {
  const { lang } = useLang() as { lang: Lang };
  const t = (ua: string, jp: string, en: string) => (lang === "ua" ? ua : lang === "jp" ? jp : en);

  const router = useRouter();

  const [companyNameJp, setCompanyNameJp] = useState("");
  const [companyNameUa, setCompanyNameUa] = useState("");
  const [companyNameEn, setCompanyNameEn] = useState("");

  const [facilityType, setFacilityType] = useState("");
  const [facilityTypeNoteJp, setFacilityTypeNoteJp] = useState("");
  const [facilityTypeNoteUa, setFacilityTypeNoteUa] = useState("");
  const [facilityTypeNoteEn, setFacilityTypeNoteEn] = useState("");

  const [employmentType, setEmploymentType] = useState<EmploymentTypeCode | "">("");
  const [japaneseLevel, setJapaneseLevel] = useState<JapaneseLevelCode | "">("");
  const [jobTerm, setJobTerm] = useState<JobTermCode | "">("");

  const [titleJp, setTitleJp] = useState("");
  const [titleUa, setTitleUa] = useState("");
  const [titleEn, setTitleEn] = useState("");

  const [locationJp, setLocationJp] = useState("");
  const [locationUa, setLocationUa] = useState("");
  const [locationEn, setLocationEn] = useState("");

  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [salaryCurrency, setSalaryCurrency] = useState("JPY");

  const [shortJp, setShortJp] = useState("");
  const [shortUa, setShortUa] = useState("");
  const [shortEn, setShortEn] = useState("");

  const [descriptionJp, setDescriptionJp] = useState("");
  const [descriptionUa, setDescriptionUa] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(true);

  const [saving, setSaving] = useState(false);
  const [msgErr, setMsgErr] = useState<string | null>(null);
  const [msgOk, setMsgOk] = useState<string | null>(null);

  const canSave = useMemo(() => {
    return (
      companyNameJp.trim() &&
      facilityType.trim() &&
      employmentType &&
      japaneseLevel &&
      jobTerm &&
      titleJp.trim() &&
      locationJp.trim() &&
      shortJp.trim() &&
      descriptionJp.trim()
    );
  }, [companyNameJp, facilityType, employmentType, japaneseLevel, jobTerm, titleJp, locationJp, shortJp, descriptionJp]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setMsgErr(null);
    setMsgOk(null);

    if (!canSave) {
      setMsgErr(t("Заповни обовʼязкові поля (JP).", "必須項目（日本語）を入力してください。", "Fill required JP fields."));
      return;
    }

    const salaryFromNum = salaryFrom.trim() === "" ? null : Number(salaryFrom.trim());
    const salaryToNum = salaryTo.trim() === "" ? null : Number(salaryTo.trim());

    setSaving(true);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyNameJp,
          companyNameUa: companyNameUa || null,
          companyNameEn: companyNameEn || null,

          facilityType,
          facilityTypeNoteJp: facilityTypeNoteJp || null,
          facilityTypeNoteUa: facilityTypeNoteUa || null,
          facilityTypeNoteEn: facilityTypeNoteEn || null,

          employmentType,
          japaneseLevel,
          jobTerm,

          titleJp,
          titleUa: titleUa || null,
          titleEn: titleEn || null,

          locationJp,
          locationUa: locationUa || null,
          locationEn: locationEn || null,

          salaryFrom: salaryFromNum === null || Number.isNaN(salaryFromNum) ? null : salaryFromNum,
          salaryTo: salaryToNum === null || Number.isNaN(salaryToNum) ? null : salaryToNum,
          salaryCurrency: salaryCurrency || "JPY",

          shortJp,
          shortUa: shortUa || null,
          shortEn: shortEn || null,

          descriptionJp,
          descriptionUa: descriptionUa || null,
          descriptionEn: descriptionEn || null,

          slug: slug || null,
          published,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsgErr(data?.error || "Failed to save");
        return;
      }

      setMsgOk(t("Створено ✅", "作成しました ✅", "Created ✅"));
      router.refresh();
      router.replace("/admin/jobs");
    } catch (err) {
      console.error(err);
      setMsgErr(t("Помилка збереження", "保存エラー", "Save error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("Нова вакансія", "求人を作成", "New job")}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {t("Зміни збережуться після кнопки Save.", "保存ボタンで更新されます。", "Changes apply after Save.")}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/jobs"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← {t("Назад", "戻る", "Back")}
          </Link>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Company */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Компанія / заклад", "会社・店舗情報", "Company / place")}</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                {t("Назва (JP)", "名称（日本語）", "Name (JP)")} *
              </label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={companyNameJp} onChange={(e) => setCompanyNameJp(e.target.value)} required />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Назва (UA)", "名称（ウクライナ語）", "Name (UA)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={companyNameUa} onChange={(e) => setCompanyNameUa(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Назва (EN)", "名称（英語）", "Name (EN)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={companyNameEn} onChange={(e) => setCompanyNameEn(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Умови", "条件", "Conditions")}</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Тип закладу", "施設の種類", "Facility type")} *</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={facilityType} onChange={(e) => setFacilityType(e.target.value)} required>
                <option value="">{t("Оберіть", "選択", "Select")}</option>
                {FACILITY_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labels[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Тип роботи", "雇用形態", "Employment type")} *</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={employmentType} onChange={(e) => setEmploymentType(e.target.value as EmploymentTypeCode)} required>
                <option value="">{t("Оберіть", "選択", "Select")}</option>
                {EMPLOYMENT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labels[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Рівень японської", "日本語レベル", "Japanese level")} *</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={japaneseLevel} onChange={(e) => setJapaneseLevel(e.target.value as JapaneseLevelCode)} required>
                <option value="">{t("Оберіть", "選択", "Select")}</option>
                {JAPANESE_LEVELS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labels[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Тривалість", "勤務期間", "Job term")} *</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={jobTerm} onChange={(e) => setJobTerm(e.target.value as JobTermCode)} required>
                <option value="">{t("Оберіть", "選択", "Select")}</option>
                {JOB_TERMS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labels[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Дод. інфо (JP)", "補足（日本語）", "Extra (JP)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={facilityTypeNoteJp} onChange={(e) => setFacilityTypeNoteJp(e.target.value)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 md:col-span-1">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">UA</label>
                <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={facilityTypeNoteUa} onChange={(e) => setFacilityTypeNoteUa(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-800">EN</label>
                <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={facilityTypeNoteEn} onChange={(e) => setFacilityTypeNoteEn(e.target.value)} />
              </div>
            </div>
          </div>
        </section>

        {/* Title + location */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Заголовок і локація", "タイトル・勤務地", "Title & location")}</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Заголовок (JP)", "タイトル（日本語）", "Title (JP)")} *</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={titleJp} onChange={(e) => setTitleJp(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Заголовок (UA)", "タイトル（ウクライナ語）", "Title (UA)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={titleUa} onChange={(e) => setTitleUa(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Заголовок (EN)", "タイトル（英語）", "Title (EN)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Локація (JP)", "勤務地（日本語）", "Location (JP)")} *</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={locationJp} onChange={(e) => setLocationJp(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Локація (UA)", "勤務地（ウクライナ語）", "Location (UA)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={locationUa} onChange={(e) => setLocationUa(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Локація (EN)", "勤務地（英語）", "Location (EN)")}</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={locationEn} onChange={(e) => setLocationEn(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Salary */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Оплата", "給与", "Salary")}</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Від", "下限", "From")}</label>
              <input type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("До", "上限", "To")}</label>
              <input type="number" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">{t("Валюта", "通貨", "Currency")}</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={salaryCurrency} onChange={(e) => setSalaryCurrency(e.target.value)}>
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </section>

        {/* Short */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Короткий опис", "短い紹介文", "Short description")}</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">JP *</label>
              <textarea className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={shortJp} onChange={(e) => setShortJp(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">UA</label>
              <textarea className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={shortUa} onChange={(e) => setShortUa(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">EN</label>
              <textarea className="h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={shortEn} onChange={(e) => setShortEn(e.target.value)} />
            </div>
          </div>
        </section>

        {/* Full */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Повний опис", "詳細説明", "Full description")}</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">JP *</label>
              <textarea className="h-40 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={descriptionJp} onChange={(e) => setDescriptionJp(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">UA</label>
              <textarea className="h-40 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={descriptionUa} onChange={(e) => setDescriptionUa(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">EN</label>
              <textarea className="h-40 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} />
            </div>
          </div>
        </section>

        {/* slug + published */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t("Технічне", "技術情報", "Technical")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">slug</label>
              <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input id="published" type="checkbox" className="h-4 w-4 rounded border-slate-300" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              <label htmlFor="published" className="text-sm font-medium text-slate-800">
                {t("Показувати на сайті", "サイトに表示する", "Visible on site")}
              </label>
            </div>
          </div>
        </section>

        {/* messages + button */}
        <div className="space-y-3">
          {msgErr && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{msgErr}</div>}
          {msgOk && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{msgOk}</div>}

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? t("Зберігаю...", "保存中...", "Saving...") : t("Зберегти", "保存", "Save")}
          </button>
        </div>
      </form>
    </main>
  );
}
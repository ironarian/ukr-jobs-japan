// data/jobs.ts

export type JobType = "Full-time" | "Part-time" | "Contract" | "Intern";
export type JobDuration = "OneDay" | "ShortTerm" | "OneMonth" | "FullTime";
export type JpLevel = "None" | "Basic" | "N4" | "N3" | "N2" | "N1";

export type Job = {
  id: string;

  // Titles
  title: string;      // Ukrainian (основний заголовок)
  titleJP?: string;   // Japanese
  titleEN?: string;   // English

  // Company (бренд, може бути латинкою)
  company: string;    // базове імʼя (частіше EN)
  companyJP?: string;
  companyEN?: string;

  // Location
  location: string;   // базовий запис
  locationUA?: string;
  locationJP?: string;
  locationEN?: string;

  type: JobType;
  duration: JobDuration;
  jpLevel: JpLevel;

  // Salary per language
  salaryUA?: string;
  salaryJP?: string;
  salaryEN?: string;

  // Tags per language
  tagsUA?: string[];
  tagsJP?: string[];
  tagsEN?: string[];

  updatedAt: string;

  // Full descriptions
  descriptionUA?: string;
  descriptionJP?: string;
  descriptionEN?: string;

  // Apply notes
  applyNoteUA?: string;
  applyNoteJP?: string;
  applyNoteEN?: string;

  // Contact
  contactEmail: string;
};

export const jobs: Job[] = [
  {
    id: "cocorogoto-cafe-shibuya",

    title: "Працівник кафе (підробіток)",
    titleJP: "カフェスタッフ（アルバイト）",
    titleEN: "Cafe staff (part-time)",

    company: "Cocorogoto Cafe",
    companyJP: "ココロゴトカフェ（Cocorogoto Cafe）",
    companyEN: "Cocorogoto Cafe",

    location: "Shibuya, Tokyo",
    locationUA: "Шібуя, Токіо",
    locationJP: "東京都渋谷区",
    locationEN: "Shibuya, Tokyo",

    type: "Part-time",
    duration: "ShortTerm",
    jpLevel: "None",

    salaryUA: "Від ¥1,226/год, компенсація транспорту — до ¥1,000/день",
    salaryJP: "時給1,226円〜＋交通費1日最大1,000円",
    salaryEN: "From ¥1,226/hour + transport reimbursement up to ¥1,000/day",

    tagsUA: [
      "Для українців",
      "Обслуговування гостей (зал)",
      "Кухня: без вимог до мови",
      "Шібуя, Токіо",
      "Компенсація транспорту",
    ],
    tagsJP: [
      "ウクライナ避難民歓迎",
      "ホールスタッフ",
      "キッチン：日本語不問",
      "渋谷区",
      "交通費支給",
    ],
    tagsEN: [
      "For Ukrainians",
      "Hall staff",
      "Kitchen: Japanese not required",
      "Shibuya, Tokyo",
      "Transport covered",
    ],

    updatedAt: "2025-12-14",

    descriptionUA: `
**Кого шукаємо**

- Обслуговування гостей (зал): бажано базовий рівень японської або готовність навчатися
- Кухня: можна без знання японської мови

**Умови**

- Погодинна оплата: від ¥1,226
- Компенсація транспортних витрат: до ¥1,000 на день
- Дружня команда та підтримка для українців

**Локація**

- Cocorogoto Cafe (ココロゴトカフェ), район Шібуя, Токіо
    `.trim(),

    descriptionJP: `
**募集内容**

- ホールスタッフ：日本語の基礎がある方、または学ぶ意欲のある方
- キッチンスタッフ：日本語が話せなくても応募可能です

**条件**

- 時給：1,226円〜
- 交通費：1日最大1,000円まで支給
- ウクライナの方へのサポートあり、フレンドリーな職場

**勤務地**

- Cocorogoto Cafe（ココロゴトカフェ）
- 東京都渋谷区
    `.trim(),

    descriptionEN: `
**Who we are looking for**

- Hall staff (customer service): basic Japanese or willingness to learn
- Kitchen staff: Japanese not required

**Conditions**

- Hourly wage: from ¥1,226
- Transport reimbursement: up to ¥1,000 per day
- Friendly team and support for people from Ukraine

**Location**

- Cocorogoto Cafe (ココロゴトカフェ), Shibuya, Tokyo
    `.trim(),

    applyNoteUA:
      "Натисніть «Надіслати повідомлення» та коротко опишіть, що ви хочете податися на вакансію в Cocorogoto Cafe (Шібуя, Токіо).",
    applyNoteJP:
      "「メール送信」ボタンからご連絡ください。件名または本文に「Cocorogoto Cafe 渋谷 応募」とご記載ください。",
    applyNoteEN:
      "Click “Send message” and mention that you are applying for the position at Cocorogoto Cafe (Shibuya, Tokyo).",

    contactEmail: "himawari.center@example.com",
  },
];
/**
 * Assigns genre tags to nouns in data/vocabulary/nouns.json
 * Run: node scripts/assign-noun-genres.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const nounsPath = join(__dirname, "..", "data", "vocabulary", "nouns.json");

/** @type {Record<string, string[]>} */
const WORD_GENRES = {
  // L1 food
  apple: ["food"], book: ["school", "home"], water: ["food"], friend: ["people"],
  house: ["place", "home"], school: ["place", "school"], teacher: ["people", "school"],
  student: ["people", "school"], mother: ["people"], father: ["people"], brother: ["people"],
  sister: ["people"], dog: ["animal"], cat: ["animal"], bird: ["animal"], fish: ["animal", "food"],
  food: ["food"], bread: ["food"], rice: ["food"], milk: ["food"], egg: ["food"], meat: ["food"],
  fruit: ["food"], vegetable: ["food"], day: ["time"], night: ["time"], morning: ["time"],
  evening: ["time"], week: ["time"], month: ["time"], year: ["time"], time: ["time"],
  man: ["people"], woman: ["people"], boy: ["people"], girl: ["people"], child: ["people"],
  baby: ["people"], people: ["people"], person: ["people"], hand: ["body"], foot: ["body"],
  eye: ["body"], ear: ["body"], nose: ["body"], mouth: ["body"], head: ["body"], face: ["body"],
  room: ["place", "home"], door: ["home"], window: ["home"], table: ["home"], chair: ["home"],
  bed: ["home"], bag: ["home"], pen: ["school", "home"], pencil: ["school", "home"],
  paper: ["school", "home"], phone: ["tech", "home"], car: ["transport"], bus: ["transport"],
  train: ["transport"], bike: ["transport"], plane: ["transport"], city: ["place"],
  town: ["place"], street: ["place"], park: ["place"], shop: ["place"], hospital: ["place", "health"],
  station: ["place", "transport"], office: ["place", "work"], job: ["work"], money: ["work"],
  name: ["abstract"], number: ["abstract"], color: ["abstract"], red: ["abstract"], blue: ["abstract"],
  green: ["abstract"], white: ["abstract"], black: ["abstract"], sun: ["nature"], moon: ["nature"],
  rain: ["nature"], snow: ["nature"], wind: ["nature"], sky: ["nature"], tree: ["nature"],
  flower: ["nature"], grass: ["nature"], river: ["nature"], sea: ["nature"], mountain: ["nature"],
  animal: ["animal"], music: ["art"], song: ["art"], game: ["sport"], ball: ["sport"], movie: ["art"],

  // L2
  family: ["people"], parent: ["people"], uncle: ["people"], aunt: ["people"], cousin: ["people"],
  neighbor: ["people"], guest: ["people"], host: ["people"], kitchen: ["home"], bathroom: ["home"],
  garden: ["home", "nature"], floor: ["home"], wall: ["home"], roof: ["home"], key: ["home"],
  clock: ["home", "time"], watch: ["home", "time"], camera: ["tech"], computer: ["tech"],
  internet: ["tech"], email: ["tech"], message: ["tech"], letter: ["school"], card: ["home"],
  ticket: ["transport"], passport: ["transport", "country"], map: ["transport", "place"],
  photo: ["art", "tech"], picture: ["art"], news: ["art"], story: ["art"], language: ["school"],
  word: ["school"], sentence: ["school"], question: ["school"], answer: ["school"],
  test: ["school"], exam: ["school"], homework: ["school"], class: ["school"],
  lesson: ["school"], subject: ["school"], math: ["school"], science: ["school", "tech"],
  history: ["school", "country"], art: ["art", "school"], sport: ["sport"], team: ["sport", "people"],
  player: ["sport", "people"], match: ["sport"], goal: ["sport"], score: ["sport"],
  breakfast: ["food"], lunch: ["food"], dinner: ["food"], meal: ["food"], coffee: ["food"],
  tea: ["food"], juice: ["food"], sugar: ["food"], salt: ["food"], butter: ["food"],
  cheese: ["food"], soup: ["food"], salad: ["food"], cake: ["food"], cookie: ["food"], ice: ["food"],
  clothes: ["clothes"], shirt: ["clothes"], pants: ["clothes"], dress: ["clothes"],
  skirt: ["clothes"], coat: ["clothes"], hat: ["clothes"], shoes: ["clothes"], socks: ["clothes"],
  glasses: ["clothes"], weather: ["nature", "time"], season: ["nature", "time"],
  spring: ["nature", "time"], summer: ["nature", "time"], autumn: ["nature", "time"],
  winter: ["nature", "time"], holiday: ["time"], vacation: ["time"], party: ["people", "art"],
  gift: ["home"], birthday: ["time", "people"], wedding: ["people"], meeting: ["work", "people"],
  plan: ["abstract", "work"], idea: ["abstract"], problem: ["abstract"], reason: ["abstract"],
  result: ["abstract"], hobby: ["sport"], skill: ["abstract"], tool: ["home"], toy: ["sport", "home"],

  // L3
  address: ["place"], age: ["people", "abstract"], air: ["nature"], airport: ["place", "transport"],
  area: ["place", "country"], bank: ["place", "work"], beach: ["place", "nature"],
  bridge: ["place"], building: ["place"], business: ["work"], career: ["work", "people"],
  center: ["place"], chance: ["abstract"], change: ["abstract"], choice: ["abstract"],
  club: ["sport", "people"], college: ["place", "school"], company: ["place", "work"],
  concert: ["art", "place"], condition: ["abstract", "health"], conversation: ["people"],
  country: ["country"], couple: ["people"], course: ["school"], crowd: ["people"],
  culture: ["art", "country"], customer: ["people", "work"], danger: ["abstract"],
  decision: ["abstract"], difference: ["abstract"], direction: ["abstract"], distance: ["abstract"],
  dream: ["abstract"], earth: ["nature", "country"], education: ["school"], effort: ["abstract"],
  energy: ["tech", "abstract"], event: ["abstract"], example: ["school", "abstract"],
  experience: ["abstract"], fact: ["abstract"], farm: ["place", "food"], feeling: ["body", "abstract"],
  field: ["nature", "sport"], fire: ["nature"], flight: ["transport"], forest: ["nature"],
  future: ["time", "abstract"], government: ["country", "society"], ground: ["nature"],
  group: ["people"], habit: ["abstract"], health: ["body", "health"], heart: ["body"],
  hill: ["nature"], hope: ["abstract"], hotel: ["place"], hour: ["time"],
  human: ["people"], industry: ["work", "tech"], information: ["tech", "abstract"],
  interest: ["abstract"], island: ["place", "nature", "country"], kind: ["abstract"],
  knowledge: ["school", "abstract"], lake: ["nature"], law: ["society", "country"],
  leader: ["people", "country"], library: ["place", "school"], life: ["abstract", "people"],
  light: ["nature", "abstract"], line: ["abstract"], list: ["abstract"], machine: ["tech"],
  market: ["place", "work"], material: ["tech", "home"], member: ["people"], memory: ["abstract"],
  method: ["abstract", "school"], mind: ["body", "abstract"], minute: ["time"], moment: ["time"],
  museum: ["place", "art"], nature: ["nature"], noise: ["abstract"], note: ["school"],
  object: ["abstract", "home"], ocean: ["nature"], opinion: ["abstract"], order: ["abstract"],
  passenger: ["transport", "people"], path: ["place", "nature"], patient: ["people", "health"],
  peace: ["country", "abstract"], plant: ["nature"], police: ["society", "people"],
  price: ["work"], program: ["tech", "school"], pupil: ["people", "school"], purse: ["clothes", "work"],

  // L4 - assign by theme
  ability: ["abstract"], account: ["work"], action: ["abstract"], activity: ["abstract"],
  actor: ["people", "art"], advice: ["abstract"], agreement: ["abstract"], aim: ["abstract"],
  amount: ["abstract"], analysis: ["abstract"], anger: ["body", "abstract"], appearance: ["abstract"],
  application: ["tech", "work"], appointment: ["time", "work"], approach: ["abstract"],
  argument: ["abstract"], arrangement: ["abstract"], article: ["art", "school"],
  atmosphere: ["nature"], attention: ["abstract"], attitude: ["abstract"], audience: ["people", "art"],
  authority: ["country", "society"], average: ["abstract"], background: ["abstract"],
  balance: ["abstract"], base: ["abstract"], basic: ["abstract"], behavior: ["abstract"],
  belief: ["abstract"], benefit: ["work", "abstract"], bill: ["work"], board: ["work", "home"],
  border: ["country", "place"], bottom: ["abstract"], brain: ["body"], branch: ["nature", "work"],
  budget: ["work", "country"], campaign: ["country", "work"], candidate: ["people", "country"],
  capacity: ["abstract"], capital: ["country", "place"], case: ["abstract"], category: ["abstract"],
  cause: ["abstract"], ceremony: ["art", "people"], challenge: ["abstract"], character: ["abstract"],
  charge: ["work"], chemical: ["tech"], citizen: ["people", "country"], claim: ["abstract"],
  climate: ["nature", "country"], code: ["tech"], collection: ["abstract"], comment: ["abstract"],
  communication: ["tech", "people"], community: ["people", "country"], comparison: ["abstract"],
  competition: ["sport", "work"], complaint: ["abstract"], complex: ["abstract"], concept: ["abstract"],
  concern: ["abstract"], conclusion: ["abstract"], confidence: ["abstract"], conflict: ["society"],
  connection: ["abstract"], consequence: ["abstract"], construction: ["place", "work"],
  consumer: ["people", "work"], contact: ["people"], content: ["abstract"], context: ["abstract"],
  contract: ["work"], contrast: ["abstract"], contribution: ["abstract"], control: ["abstract"],
  convenience: ["abstract"], convention: ["society"], corner: ["place"], cost: ["work"],
  court: ["place", "society"], cover: ["abstract"], creation: ["abstract"], credit: ["work"],
  crime: ["society"], crisis: ["society"], criterion: ["abstract"], criticism: ["abstract"],
  crop: ["food", "nature"], custom: ["country", "abstract"], cycle: ["abstract"], damage: ["abstract"],
  data: ["tech"], debate: ["society"], debt: ["work"], decade: ["time"], delay: ["time"],
  demand: ["work", "abstract"],
};

/** Default genres for unmapped words by level heuristics */
const L4_DEFAULT = ["abstract", "work", "society"];
const L5_DEFAULT = ["abstract", "work", "society"];
const L6_DEFAULT = ["abstract", "work", "tech"];
const L7_DEFAULT = ["abstract", "society", "work"];
const L8_DEFAULT = ["abstract", "society", "country"];

/** @type {Record<string, string[]>} extended mapping for L4-L8 */
const EXTENDED = {
  definition: ["school", "abstract"], degree: ["school", "abstract"], delivery: ["transport", "work"],
  department: ["work", "place"], depression: ["health", "abstract"], depth: ["abstract", "nature"],
  description: ["abstract"], design: ["art", "tech"], desire: ["abstract"], detail: ["abstract"],
  development: ["abstract", "work"], device: ["tech"], diet: ["food", "health"],
  difficulty: ["abstract"], dimension: ["abstract", "tech"], disaster: ["society", "nature"],
  discipline: ["school", "abstract"], discount: ["work"], discussion: ["abstract"],
  disease: ["health"], display: ["tech"], distribution: ["work"], district: ["country", "place"],
  document: ["work", "school"], domain: ["abstract", "tech"], drama: ["art"],
  duty: ["work", "society"], economy: ["work", "country"], edge: ["abstract", "nature"],
  editor: ["people", "art"], effect: ["abstract"], efficiency: ["work", "tech"],
  election: ["country", "society"], element: ["tech", "abstract"], emotion: ["body", "abstract"],
  emphasis: ["abstract"], employee: ["people", "work"], employer: ["people", "work"],
  employment: ["work"], enemy: ["people", "society"], engine: ["tech", "transport"],
  engineer: ["people", "tech"], entertainment: ["art"], enthusiasm: ["abstract"],
  entrance: ["place"], environment: ["nature", "country"], episode: ["art"],
  equipment: ["tech"], error: ["abstract"], escape: ["abstract"], estimate: ["abstract"],
  evidence: ["abstract", "society"], exchange: ["work"], excitement: ["abstract"],
  exhibition: ["art", "place"], existence: ["abstract"], expansion: ["abstract"],
  expectation: ["abstract"], expense: ["work"], experiment: ["tech", "school"],
  expert: ["people"], explanation: ["school", "abstract"], exploration: ["nature"],
  export: ["work", "country"], expression: ["art", "abstract"], extent: ["abstract"],
  facility: ["place"], factor: ["abstract"], failure: ["abstract"], fame: ["abstract"],
  fashion: ["clothes"], feature: ["abstract"], fee: ["work"], feedback: ["abstract"],
  figure: ["abstract"], finance: ["work"], finding: ["abstract"], focus: ["abstract"],
  force: ["abstract"], form: ["abstract"], formation: ["abstract"], formula: ["tech", "school"],
  foundation: ["abstract"], framework: ["abstract"], freedom: ["country", "abstract"],
  frequency: ["abstract", "time"], friendship: ["people"], function: ["abstract", "tech"],
  fund: ["work"], gallery: ["place", "art"], garage: ["place", "transport"],
  gasoline: ["transport"], gate: ["place"], gene: ["tech", "animal"],
  genius: ["people"], geography: ["country", "school"], gesture: ["people", "body"],
  globe: ["country", "nature"], glory: ["abstract"], glucose: ["food", "tech"],
  furniture: ["home"], gain: ["work"], gap: ["abstract"], generation: ["people", "time"],
  glance: ["body"], globalization: ["country", "work"], goods: ["work", "food"],
  grade: ["school"], grant: ["work"], growth: ["abstract"], guarantee: ["abstract"],
  guidance: ["abstract"], guideline: ["abstract"], guilt: ["abstract"],
  habitat: ["animal", "nature"], harm: ["health", "abstract"], headline: ["art"],
  height: ["abstract", "body"], heritage: ["country", "art"], highway: ["transport", "place"],
  hint: ["abstract"], household: ["home", "people"], housing: ["place", "home"],
  humor: ["art"], identity: ["abstract", "people"], illusion: ["abstract"],
  image: ["art", "tech"], imagination: ["abstract"], impact: ["abstract"],
  implication: ["abstract"], import: ["work", "country"], impression: ["abstract"],
  improvement: ["abstract"], incentive: ["work"], incident: ["society"],
  income: ["work"], independence: ["country", "abstract"], index: ["tech", "abstract"],
  indication: ["abstract"], individual: ["people"], inflation: ["work", "country"],
  influence: ["abstract"], initiative: ["work"], injury: ["health", "body"],
  innovation: ["tech"], inquiry: ["abstract"], insight: ["abstract"],
  instance: ["abstract"], institution: ["society", "place"], instruction: ["school"],
  instrument: ["tech", "art"], insurance: ["work", "health"], intention: ["abstract"],
  interaction: ["people"], interpretation: ["abstract"], interview: ["work", "people"],
  introduction: ["abstract"], invasion: ["country", "society"], invention: ["tech"],
  investigation: ["abstract"], investment: ["work"], invitation: ["people"],
  issue: ["abstract", "society"], item: ["abstract"], journey: ["transport"],
  judgment: ["abstract"], justice: ["society"], label: ["abstract"],
  labor: ["work"], lack: ["abstract"], landscape: ["nature"], layer: ["abstract"],
  league: ["sport"], lecture: ["school"], length: ["abstract"], level: ["abstract"],
  liability: ["work"], license: ["work"], lifestyle: ["people"], limitation: ["abstract"],
  link: ["abstract", "tech"], literature: ["art", "school"], loan: ["work"],
  location: ["place"], logic: ["abstract", "school"], loss: ["abstract"],
  loyalty: ["abstract", "people"], luxury: ["clothes", "work"], majority: ["abstract"],
  makeup: ["clothes"], manual: ["school", "tech"], marble: ["home", "nature"],
  marine: ["animal", "nature"], mask: ["clothes", "health"], matrix: ["tech"],
  mayor: ["people", "country"], melody: ["art"], memo: ["work", "school"],
  menu: ["food"], mercy: ["abstract"],
  management: ["work"], manner: ["abstract"], manufacture: ["work", "tech"],
  margin: ["work"], mark: ["abstract"], mass: ["abstract"], master: ["people"],
  matter: ["abstract"], measure: ["abstract"], mechanism: ["tech"],
  media: ["art", "tech"], medium: ["art", "tech"], membership: ["people"],
  mention: ["abstract"], merchant: ["people", "work"], merit: ["abstract"],
  metal: ["tech"], migration: ["country", "people"], minority: ["country", "people"],
  miracle: ["abstract"], mission: ["abstract"], mistake: ["abstract"],
  mixture: ["food", "tech"], mode: ["abstract"], model: ["abstract", "tech"],
  modification: ["abstract"], molecule: ["tech"], momentum: ["abstract"],
  monitor: ["tech"], mood: ["body", "abstract"], mortgage: ["work", "home"],
  motion: ["abstract"], motivation: ["abstract"], movement: ["sport", "abstract"],
  myth: ["art", "country"], narrative: ["art"], nation: ["country"],
  necessity: ["abstract"], negotiation: ["work", "country"], network: ["tech"],
  nightmare: ["abstract"], notion: ["abstract"], novel: ["art"],
  obligation: ["abstract", "society"], observation: ["abstract"], obstacle: ["abstract"],
  occasion: ["time"], occupation: ["work", "country"], offense: ["society"],
  offer: ["work"], official: ["people", "country"], operation: ["health", "work"],
  opponent: ["people", "sport"], opportunity: ["abstract", "work"],
  option: ["abstract"], orbit: ["nature", "tech"], organism: ["animal", "tech"],
  organization: ["work", "society"], origin: ["abstract", "country"],
  outcome: ["abstract"], outline: ["abstract"], output: ["work", "tech"],
  ownership: ["work", "abstract"], pace: ["time", "sport"], package: ["transport", "work"],
  pain: ["body", "health"], panel: ["work"], parameter: ["tech"],
  participant: ["people"], participation: ["people"], partner: ["people", "work"],
  passage: ["place", "art"], passion: ["abstract"], patience: ["abstract"],
  pattern: ["abstract"], payment: ["work"], penalty: ["society", "sport"],
  pension: ["work"], percentage: ["abstract"], perception: ["abstract"],
  performance: ["art", "sport"], period: ["time"], permission: ["abstract"],
  perspective: ["abstract"], phase: ["abstract"], phenomenon: ["abstract", "nature"],
  philosophy: ["school", "abstract"], phrase: ["school", "art"], pilot: ["people", "transport"],
  pipeline: ["tech", "transport"], planet: ["nature"], plastic: ["tech", "home"],
  plot: ["art"], poem: ["art"], poet: ["people", "art"], poison: ["health", "animal"],
  pole: ["nature", "country"], poll: ["country", "society"], portal: ["tech", "place"],
  poster: ["art"],
  platform: ["tech", "transport"], policy: ["country", "society"], politics: ["country", "society"],
  pollution: ["nature", "society"], population: ["country"], portion: ["food", "abstract"],
  portrait: ["art"], position: ["abstract", "work"], possibility: ["abstract"],
  potential: ["abstract"], poverty: ["country", "society"], power: ["abstract", "country"],
  practice: ["sport", "work"], praise: ["abstract"], prayer: ["art", "abstract"],
  precaution: ["health"], precision: ["abstract"], prediction: ["abstract"],
  preference: ["abstract"], prejudice: ["society"], presence: ["abstract"],
  presentation: ["work", "school"], preservation: ["abstract"], president: ["people", "country"],
  pressure: ["abstract"], prestige: ["abstract"], prevention: ["health"],
  pride: ["abstract"], principle: ["abstract"], priority: ["abstract"],
  privacy: ["abstract"], privilege: ["abstract"], probability: ["abstract"],
  procedure: ["work"], process: ["abstract"], product: ["work"],
  production: ["work"], profession: ["people", "work"], professor: ["people", "school"],
  profile: ["abstract"], profit: ["work"], progress: ["abstract"],
  project: ["work"], promise: ["abstract"], promotion: ["work"],
  proof: ["abstract"], property: ["work", "home"], proportion: ["abstract"],
  proposal: ["work"], prospect: ["abstract"], protection: ["abstract"],
  protest: ["society"], provision: ["work"], psychology: ["school", "health"],
  publication: ["art"], publicity: ["art", "work"], punishment: ["society"],
  purchase: ["work"], purpose: ["abstract"], pursuit: ["abstract"],
  quality: ["abstract"], quantity: ["abstract"], quarter: ["time", "place"],
  race: ["people", "sport"], range: ["abstract"], rank: ["abstract"],
  rate: ["abstract", "work"], ratio: ["abstract"], reaction: ["abstract", "tech"],
  reality: ["abstract"], recognition: ["abstract"], recommendation: ["abstract"],
  record: ["abstract", "art"], recovery: ["health"], reduction: ["abstract"],
  reference: ["school"], reflection: ["abstract"], reform: ["country", "society"],
  refuge: ["place", "country"], regard: ["abstract"], region: ["country", "place"],
  register: ["work"], regulation: ["society", "country"], relation: ["people", "abstract"],
  relationship: ["people"], relief: ["abstract", "health"], religion: ["society", "country"],
  reputation: ["abstract"], request: ["abstract"], requirement: ["abstract"],
  research: ["school"], reserve: ["country", "nature"], residence: ["place", "home"],
  resident: ["people", "place"], resource: ["country", "work"], respect: ["abstract"],
  response: ["abstract"], responsibility: ["abstract"], restriction: ["society"],
  retail: ["work"],
};

Object.assign(WORD_GENRES, EXTENDED);

const LEVEL_DEFAULT = {
  "4": L4_DEFAULT,
  "5": L5_DEFAULT,
  "6": L6_DEFAULT,
  "7": L7_DEFAULT,
  "8": L8_DEFAULT,
};

function assignGenres(word) {
  if (WORD_GENRES[word.en]) {
    return [...new Set(WORD_GENRES[word.en])].sort();
  }
  const defaults = LEVEL_DEFAULT[word.level] ?? ["abstract"];
  return [...defaults];
}

const data = JSON.parse(readFileSync(nounsPath, "utf8"));
let mapped = 0;
for (const word of data.words) {
  const genres = assignGenres(word);
  word.genres = genres;
  if (WORD_GENRES[word.en]) mapped += 1;
}

writeFileSync(nounsPath, JSON.stringify(data, null, 2) + "\n", "utf8");

const genreCounts = {};
for (const w of data.words) {
  for (const g of w.genres) {
    genreCounts[g] = (genreCounts[g] ?? 0) + 1;
  }
}

console.log("Assigned genres to", data.words.length, "nouns");
console.log("Explicit mappings:", mapped);
console.log("Per genre:", genreCounts);

export type CollegeType = "NIT" | "IIIT" | "GFTI" | "State" | "Private";
export type SeatType = "OPEN" | "EWS" | "OBC-NCL" | "SC" | "ST";
export type Quota = "AI" | "HS" | "OS";
export type Gender = "Gender-Neutral" | "Female-only";

export type BranchCutoff = {
  branch: string;
  openingRank: number | null;
  closingRank: number | null;
  quota: Quota;
  seatType: SeatType;
  gender: Gender;
  year: number;
  round: string;
};

export type College = {
  id: string;
  name: string;
  fullName: string;
  type: CollegeType;
  city: string;
  state: string;
  nirfRank: number | null;
  feesLpa: number;
  averagePackageLpa: number;
  highestPackageLpa: number;
  placementRate: number;
  website: string;
  image: string;
  branches: string[];
  cutoffs: BranchCutoff[];
};

export type PredictorFilters = {
  rank: number;
  category: SeatType;
  quota: Quota | "ANY";
  gender: Gender | "ANY";
  branch: string;
  collegeType: CollegeType | "ALL";
  maxFees: number;
  minPackage: number;
  search: string;
};

export type Prediction = {
  college: College;
  cutoff: BranchCutoff;
  chance: "Safe" | "Moderate" | "Reach" | "Exam-based";
  chanceScore: number;
  rankGap: number | null;
};

type CollegeSeed = Omit<College, "branches" | "cutoffs"> & {
  profile: "elite" | "strong" | "mid" | "access" | "exam";
  branchSet?: string[];
};

const CORE_BRANCHES = [
  "Computer Science and Engineering",
  "Artificial Intelligence and Data Science",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

const DIGITAL_BRANCHES = [
  "Computer Science and Engineering",
  "Artificial Intelligence and Data Science",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Mathematics and Computing",
];

const PRIVATE_BRANCHES = [
  "Computer Science and Engineering",
  "Artificial Intelligence and Machine Learning",
  "Information Technology",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
];

const profileBaseRank: Record<CollegeSeed["profile"], number> = {
  elite: 1100,
  strong: 4500,
  mid: 12000,
  access: 28000,
  exam: 0,
};

const branchMultiplier: Record<string, number> = {
  "Computer Science and Engineering": 1,
  "Mathematics and Computing": 1.25,
  "Artificial Intelligence and Data Science": 1.35,
  "Artificial Intelligence and Machine Learning": 1.4,
  "Information Technology": 1.55,
  "Electronics and Communication Engineering": 2.1,
  "Electrical and Electronics Engineering": 2.55,
  "Electrical Engineering": 2.7,
  "Mechanical Engineering": 3.7,
  "Chemical Engineering": 4.3,
  "Civil Engineering": 5.2,
};

const categoryMultiplier: Record<SeatType, number> = {
  OPEN: 1,
  EWS: 1.28,
  "OBC-NCL": 1.45,
  SC: 2.85,
  ST: 4.4,
};

const quotaMultiplier: Record<Quota, number> = {
  AI: 1,
  OS: 1.08,
  HS: 1.65,
};

const seedColleges: CollegeSeed[] = [
  { id: "nit-trichy", name: "NIT Trichy", fullName: "National Institute of Technology Tiruchirappalli", type: "NIT", city: "Tiruchirappalli", state: "Tamil Nadu", nirfRank: 9, feesLpa: 1.37, averagePackageLpa: 18.4, highestPackageLpa: 52.9, placementRate: 94, website: "https://www.nitt.edu", image: "/hero-counselling-dashboard.png", profile: "elite" },
  { id: "nit-surathkal", name: "NIT Surathkal", fullName: "National Institute of Technology Karnataka Surathkal", type: "NIT", city: "Surathkal", state: "Karnataka", nirfRank: 17, feesLpa: 1.49, averagePackageLpa: 16.8, highestPackageLpa: 45, placementRate: 92, website: "https://www.nitk.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite" },
  { id: "nit-warangal", name: "NIT Warangal", fullName: "National Institute of Technology Warangal", type: "NIT", city: "Warangal", state: "Telangana", nirfRank: 21, feesLpa: 1.38, averagePackageLpa: 17.2, highestPackageLpa: 62.5, placementRate: 93, website: "https://www.nitw.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite" },
  { id: "nit-rourkela", name: "NIT Rourkela", fullName: "National Institute of Technology Rourkela", type: "NIT", city: "Rourkela", state: "Odisha", nirfRank: 19, feesLpa: 1.35, averagePackageLpa: 14.8, highestPackageLpa: 83.6, placementRate: 90, website: "https://www.nitrkl.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "nit-calicut", name: "NIT Calicut", fullName: "National Institute of Technology Calicut", type: "NIT", city: "Kozhikode", state: "Kerala", nirfRank: 25, feesLpa: 1.38, averagePackageLpa: 15.6, highestPackageLpa: 47, placementRate: 89, website: "https://www.nitc.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "nit-durgapur", name: "NIT Durgapur", fullName: "National Institute of Technology Durgapur", type: "NIT", city: "Durgapur", state: "West Bengal", nirfRank: 43, feesLpa: 1.36, averagePackageLpa: 12.8, highestPackageLpa: 70, placementRate: 86, website: "https://nitdgp.ac.in", image: "/hero-counselling-dashboard.png", profile: "mid" },
  { id: "nit-allahabad", name: "MNNIT Allahabad", fullName: "Motilal Nehru National Institute of Technology Allahabad", type: "NIT", city: "Prayagraj", state: "Uttar Pradesh", nirfRank: 49, feesLpa: 1.38, averagePackageLpa: 13.8, highestPackageLpa: 71.1, placementRate: 88, website: "https://www.mnnit.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "nit-jaipur", name: "MNIT Jaipur", fullName: "Malaviya National Institute of Technology Jaipur", type: "NIT", city: "Jaipur", state: "Rajasthan", nirfRank: 37, feesLpa: 1.5, averagePackageLpa: 14.2, highestPackageLpa: 64, placementRate: 88, website: "https://www.mnit.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "nit-kurukshetra", name: "NIT Kurukshetra", fullName: "National Institute of Technology Kurukshetra", type: "NIT", city: "Kurukshetra", state: "Haryana", nirfRank: 58, feesLpa: 1.34, averagePackageLpa: 12.4, highestPackageLpa: 62.8, placementRate: 85, website: "https://nitkkr.ac.in", image: "/hero-counselling-dashboard.png", profile: "mid" },
  { id: "nit-bhopal", name: "MANIT Bhopal", fullName: "Maulana Azad National Institute of Technology Bhopal", type: "NIT", city: "Bhopal", state: "Madhya Pradesh", nirfRank: 72, feesLpa: 1.36, averagePackageLpa: 13.2, highestPackageLpa: 82, placementRate: 84, website: "https://www.manit.ac.in", image: "/hero-counselling-dashboard.png", profile: "mid" },
  ...[
    ["nit-patna", "NIT Patna", "Bihar", "Patna"], ["nit-hamirpur", "NIT Hamirpur", "Himachal Pradesh", "Hamirpur"], ["nit-jalandhar", "NIT Jalandhar", "Punjab", "Jalandhar"], ["nit-silchar", "NIT Silchar", "Assam", "Silchar"], ["nit-goa", "NIT Goa", "Goa", "Farmagudi"], ["nit-delhi", "NIT Delhi", "Delhi", "Delhi"], ["nit-srinagar", "NIT Srinagar", "Jammu and Kashmir", "Srinagar"], ["nit-agartala", "NIT Agartala", "Tripura", "Agartala"], ["nit-meghalaya", "NIT Meghalaya", "Meghalaya", "Shillong"], ["nit-manipur", "NIT Manipur", "Manipur", "Imphal"], ["nit-mizoram", "NIT Mizoram", "Mizoram", "Aizawl"], ["nit-nagaland", "NIT Nagaland", "Nagaland", "Chumukedima"], ["nit-sikkim", "NIT Sikkim", "Sikkim", "Ravangla"], ["nit-arunachal", "NIT Arunachal Pradesh", "Arunachal Pradesh", "Yupia"], ["nit-uttarakhand", "NIT Uttarakhand", "Uttarakhand", "Srinagar"], ["nit-andhra", "NIT Andhra Pradesh", "Andhra Pradesh", "Tadepalligudem"], ["nit-puducherry", "NIT Puducherry", "Puducherry", "Karaikal"], ["nit-raipur", "NIT Raipur", "Chhattisgarh", "Raipur"], ["nit-jamshedpur", "NIT Jamshedpur", "Jharkhand", "Jamshedpur"]
  ].map(([id, name, state, city], index) => ({ id, name, fullName: name, type: "NIT" as const, city, state, nirfRank: index < 8 ? 60 + index * 6 : null, feesLpa: 1.25, averagePackageLpa: 9.5 + Math.max(0, 8 - index) * 0.45, highestPackageLpa: 38 + Math.max(0, 8 - index) * 4, placementRate: 76 + Math.max(0, 8 - index), website: "https://josaa.nic.in", image: "/hero-counselling-dashboard.png", profile: index < 6 ? "mid" as const : "access" as const })),
  { id: "iiit-hyderabad", name: "IIIT Hyderabad", fullName: "International Institute of Information Technology Hyderabad", type: "IIIT", city: "Hyderabad", state: "Telangana", nirfRank: 47, feesLpa: 3.5, averagePackageLpa: 28.5, highestPackageLpa: 74, placementRate: 96, website: "https://www.iiit.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite", branchSet: DIGITAL_BRANCHES },
  { id: "iiit-bangalore", name: "IIIT Bangalore", fullName: "International Institute of Information Technology Bangalore", type: "IIIT", city: "Bengaluru", state: "Karnataka", nirfRank: 74, feesLpa: 4.2, averagePackageLpa: 24.8, highestPackageLpa: 65, placementRate: 95, website: "https://www.iiitb.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite", branchSet: DIGITAL_BRANCHES },
  { id: "iiit-allahabad", name: "IIIT Allahabad", fullName: "Indian Institute of Information Technology Allahabad", type: "IIIT", city: "Prayagraj", state: "Uttar Pradesh", nirfRank: 89, feesLpa: 1.8, averagePackageLpa: 20.5, highestPackageLpa: 82.5, placementRate: 94, website: "https://www.iiita.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong", branchSet: DIGITAL_BRANCHES },
  { id: "iiit-delhi", name: "IIIT Delhi", fullName: "Indraprastha Institute of Information Technology Delhi", type: "IIIT", city: "Delhi", state: "Delhi", nirfRank: 85, feesLpa: 3.1, averagePackageLpa: 22.4, highestPackageLpa: 51, placementRate: 94, website: "https://www.iiitd.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite", branchSet: DIGITAL_BRANCHES },
  ...["Gwalior", "Jabalpur", "Kancheepuram", "Pune", "Lucknow", "Dharwad", "Kota", "Sri City", "Vadodara", "Guwahati", "Bhopal", "Nagpur", "Ranchi", "Surat", "Kalyani", "Sonepat", "Una", "Kurnool", "Tiruchirappalli", "Raichur", "Agartala", "Bhagalpur"].map((city, index) => ({ id: `iiit-${city.toLowerCase().replaceAll(" ", "-")}`, name: `IIIT ${city}`, fullName: `Indian Institute of Information Technology ${city}`, type: "IIIT" as const, city, state: ["Madhya Pradesh", "Madhya Pradesh", "Tamil Nadu", "Maharashtra", "Uttar Pradesh", "Karnataka", "Rajasthan", "Andhra Pradesh", "Gujarat", "Assam", "Madhya Pradesh", "Maharashtra", "Jharkhand", "Gujarat", "West Bengal", "Haryana", "Himachal Pradesh", "Andhra Pradesh", "Tamil Nadu", "Karnataka", "Tripura", "Bihar"][index], nirfRank: index < 3 ? 95 + index : null, feesLpa: 1.45, averagePackageLpa: 11 + Math.max(0, 8 - index) * 0.55, highestPackageLpa: 38 + Math.max(0, 8 - index) * 3.5, placementRate: 78 + Math.max(0, 8 - index), website: "https://josaa.nic.in", image: "/hero-counselling-dashboard.png", profile: index < 6 ? "mid" as const : "access" as const, branchSet: DIGITAL_BRANCHES })),
  { id: "iiest-shibpur", name: "IIEST Shibpur", fullName: "Indian Institute of Engineering Science and Technology Shibpur", type: "GFTI", city: "Shibpur", state: "West Bengal", nirfRank: 49, feesLpa: 0.3, averagePackageLpa: 11.5, highestPackageLpa: 45, placementRate: 82, website: "https://www.iiests.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "bit-mesra", name: "BIT Mesra", fullName: "Birla Institute of Technology Mesra", type: "GFTI", city: "Ranchi", state: "Jharkhand", nirfRank: 53, feesLpa: 2.3, averagePackageLpa: 12.8, highestPackageLpa: 58, placementRate: 84, website: "https://www.bitmesra.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "pec-chandigarh", name: "PEC Chandigarh", fullName: "Punjab Engineering College Chandigarh", type: "GFTI", city: "Chandigarh", state: "Chandigarh", nirfRank: null, feesLpa: 0.8, averagePackageLpa: 11.2, highestPackageLpa: 64, placementRate: 82, website: "https://pec.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  ...["Assam University", "University of Hyderabad", "Mizoram University", "School of Planning and Architecture Bhopal", "Gurukula Kangri Vishwavidyalaya", "Sant Longowal Institute", "NIFTEM Kundli", "NIFFT Ranchi", "Central University of Rajasthan", "SMVDU Katra"].map((name, index) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, fullName: name, type: "GFTI" as const, city: ["Silchar", "Hyderabad", "Aizawl", "Bhopal", "Haridwar", "Longowal", "Kundli", "Ranchi", "Ajmer", "Katra"][index], state: ["Assam", "Telangana", "Mizoram", "Madhya Pradesh", "Uttarakhand", "Punjab", "Haryana", "Jharkhand", "Rajasthan", "Jammu and Kashmir"][index], nirfRank: null, feesLpa: 0.6 + index * 0.08, averagePackageLpa: 6.5 + Math.max(0, 5 - index) * 0.6, highestPackageLpa: 18 + Math.max(0, 5 - index) * 4, placementRate: 62 + Math.max(0, 5 - index) * 3, website: "https://josaa.nic.in", image: "/hero-counselling-dashboard.png", profile: "access" as const })),
  { id: "dtu", name: "DTU", fullName: "Delhi Technological University", type: "State", city: "Delhi", state: "Delhi", nirfRank: 27, feesLpa: 1.5, averagePackageLpa: 19.8, highestPackageLpa: 82.1, placementRate: 91, website: "https://www.dtu.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite" },
  { id: "nsut", name: "NSUT", fullName: "Netaji Subhas University of Technology", type: "State", city: "Delhi", state: "Delhi", nirfRank: 57, feesLpa: 1.55, averagePackageLpa: 18.5, highestPackageLpa: 64, placementRate: 90, website: "https://www.nsut.ac.in", image: "/hero-counselling-dashboard.png", profile: "elite" },
  { id: "jadavpur", name: "Jadavpur University", fullName: "Jadavpur University", type: "State", city: "Kolkata", state: "West Bengal", nirfRank: 10, feesLpa: 0.2, averagePackageLpa: 15.5, highestPackageLpa: 85, placementRate: 88, website: "https://jadavpuruniversity.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "vjti", name: "VJTI Mumbai", fullName: "Veermata Jijabai Technological Institute", type: "State", city: "Mumbai", state: "Maharashtra", nirfRank: null, feesLpa: 0.8, averagePackageLpa: 14.2, highestPackageLpa: 62, placementRate: 86, website: "https://vjti.ac.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  { id: "coep", name: "COEP Tech Pune", fullName: "COEP Technological University Pune", type: "State", city: "Pune", state: "Maharashtra", nirfRank: 77, feesLpa: 1.1, averagePackageLpa: 13.8, highestPackageLpa: 50.5, placementRate: 86, website: "https://www.coep.org.in", image: "/hero-counselling-dashboard.png", profile: "strong" },
  ...["HBTU Kanpur", "Harcourt Butler Technical University", "IET Lucknow", "LD College of Engineering", "MSU Baroda", "Osmania University College of Engineering", "College of Engineering Guindy", "Anna University MIT Campus", "Ramaiah University of Applied Sciences"].map((name, index) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, fullName: name, type: "State" as const, city: ["Kanpur", "Kanpur", "Lucknow", "Ahmedabad", "Vadodara", "Hyderabad", "Chennai", "Chennai", "Bengaluru"][index], state: ["Uttar Pradesh", "Uttar Pradesh", "Uttar Pradesh", "Gujarat", "Gujarat", "Telangana", "Tamil Nadu", "Tamil Nadu", "Karnataka"][index], nirfRank: null, feesLpa: 0.65 + index * 0.12, averagePackageLpa: 7.5 + Math.max(0, 5 - index) * 0.8, highestPackageLpa: 25 + Math.max(0, 5 - index) * 5, placementRate: 68 + Math.max(0, 5 - index) * 4, website: "https://www.aicte-india.org", image: "/hero-counselling-dashboard.png", profile: index < 3 ? "mid" as const : "access" as const })),
  { id: "bits-pilani", name: "BITS Pilani", fullName: "Birla Institute of Technology and Science Pilani", type: "Private", city: "Pilani", state: "Rajasthan", nirfRank: 20, feesLpa: 6, averagePackageLpa: 25.5, highestPackageLpa: 60.8, placementRate: 95, website: "https://www.bits-pilani.ac.in", image: "/hero-counselling-dashboard.png", profile: "exam", branchSet: PRIVATE_BRANCHES },
  { id: "lnmiit", name: "LNMIIT Jaipur", fullName: "LNM Institute of Information Technology Jaipur", type: "Private", city: "Jaipur", state: "Rajasthan", nirfRank: null, feesLpa: 3.2, averagePackageLpa: 14.5, highestPackageLpa: 52.3, placementRate: 88, website: "https://www.lnmiit.ac.in", image: "/hero-counselling-dashboard.png", profile: "exam", branchSet: PRIVATE_BRANCHES },
  { id: "daiict", name: "DAIICT Gandhinagar", fullName: "Dhirubhai Ambani Institute of Information and Communication Technology", type: "Private", city: "Gandhinagar", state: "Gujarat", nirfRank: null, feesLpa: 3.5, averagePackageLpa: 16.8, highestPackageLpa: 82, placementRate: 90, website: "https://www.daiict.ac.in", image: "/hero-counselling-dashboard.png", profile: "exam", branchSet: DIGITAL_BRANCHES },
  ...["RVCE Bangalore", "BMSCE Bangalore", "MSRIT Bangalore", "Thapar University", "Manipal MIT", "SRM KTR", "VIT Vellore", "KIIT Bhubaneswar", "Amrita Vishwa Vidyapeetham", "SASTRA University", "PES University", "Jaypee Noida"].map((name, index) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, fullName: name, type: "Private" as const, city: ["Bengaluru", "Bengaluru", "Bengaluru", "Patiala", "Manipal", "Chennai", "Vellore", "Bhubaneswar", "Coimbatore", "Thanjavur", "Bengaluru", "Noida"][index], state: ["Karnataka", "Karnataka", "Karnataka", "Punjab", "Karnataka", "Tamil Nadu", "Tamil Nadu", "Odisha", "Tamil Nadu", "Tamil Nadu", "Karnataka", "Uttar Pradesh"][index], nirfRank: [99, null, null, 29, 55, 13, 11, 37, 23, 38, null, null][index], feesLpa: [1.8, 1.7, 1.6, 3.8, 4, 3.5, 2.8, 3.5, 3.2, 2.6, 4.2, 2.9][index], averagePackageLpa: [16.2, 14.8, 13.5, 15.5, 14.8, 12.8, 13.5, 12.2, 10.5, 9.5, 12.5, 10.8][index], highestPackageLpa: [62, 50, 48, 55.7, 54.8, 52, 75, 63, 56, 34, 65, 50][index], placementRate: [91, 89, 88, 90, 88, 86, 89, 86, 82, 80, 88, 82][index], website: "https://www.aicte-india.org", image: "/hero-counselling-dashboard.png", profile: "exam" as const, branchSet: PRIVATE_BRANCHES })),
];

function createCutoffs(seed: CollegeSeed): BranchCutoff[] {
  const branches = seed.branchSet ?? (seed.type === "IIIT" ? DIGITAL_BRANCHES : seed.type === "Private" ? PRIVATE_BRANCHES : CORE_BRANCHES);
  if (seed.profile === "exam") {
    return branches.map((branch) => ({
      branch,
      openingRank: null,
      closingRank: null,
      quota: "AI",
      seatType: "OPEN",
      gender: "Gender-Neutral",
      year: 2024,
      round: "Institute entrance / board counselling",
    }));
  }

  const base = profileBaseRank[seed.profile];
  return branches.flatMap((branch) => {
    const branchRank = Math.round(base * (branchMultiplier[branch] ?? 2.5));
    return (["AI", "HS", "OS"] as Quota[]).flatMap((quota) =>
      (["OPEN", "EWS", "OBC-NCL", "SC", "ST"] as SeatType[]).flatMap((seatType) =>
        (["Gender-Neutral", "Female-only"] as Gender[]).map((gender) => {
          const genderMultiplier = gender === "Female-only" ? 1.12 : 1;
          const close = Math.round(branchRank * quotaMultiplier[quota] * categoryMultiplier[seatType] * genderMultiplier);
          return {
            branch,
            openingRank: Math.max(1, Math.round(close * 0.42)),
            closingRank: close,
            quota,
            seatType,
            gender,
            year: 2024,
            round: "JoSAA/CSAB seed",
          };
        })
      )
    );
  });
}

export const colleges: College[] = seedColleges.map((seed) => ({
  ...seed,
  branches: seed.branchSet ?? (seed.type === "IIIT" ? DIGITAL_BRANCHES : seed.type === "Private" ? PRIVATE_BRANCHES : CORE_BRANCHES),
  cutoffs: createCutoffs(seed),
}));

export const allBranches = [...new Set(colleges.flatMap((college) => college.branches))].sort();
export const allStates = [...new Set(colleges.map((college) => college.state))].sort();

export function predictColleges(filters: PredictorFilters): Prediction[] {
  const search = filters.search.trim().toLowerCase();

  return colleges
    .filter((college) => {
      if (filters.collegeType !== "ALL" && college.type !== filters.collegeType) return false;
      if (college.feesLpa > filters.maxFees) return false;
      if (college.averagePackageLpa < filters.minPackage) return false;
      if (!search) return true;
      return [college.name, college.fullName, college.city, college.state, college.type].some((value) =>
        value.toLowerCase().includes(search)
      );
    })
    .flatMap((college) =>
      college.cutoffs
        .filter((cutoff) => {
          if (filters.branch !== "ALL" && cutoff.branch !== filters.branch) return false;
          if (cutoff.seatType !== filters.category) return false;
          if (filters.quota !== "ANY" && cutoff.quota !== filters.quota) return false;
          if (filters.gender !== "ANY" && cutoff.gender !== filters.gender) return false;
          return true;
        })
        .map((cutoff): Prediction | null => {
          if (!cutoff.closingRank) {
            return { college, cutoff, chance: "Exam-based" as const, chanceScore: 45, rankGap: null };
          }

          const rankGap = cutoff.closingRank - filters.rank;
          const ratio = filters.rank / cutoff.closingRank;
          const chance: Prediction["chance"] | null =
            ratio <= 0.78 ? "Safe" : ratio <= 1 ? "Moderate" : ratio <= 1.15 ? "Reach" : null;
          if (!chance) return null;

          return {
            college,
            cutoff,
            chance,
            chanceScore: Math.max(8, Math.min(96, Math.round((1.2 - ratio) * 100))),
            rankGap,
          };
        })
        .filter((prediction): prediction is Prediction => Boolean(prediction))
    )
    .sort((a, b) => {
      if (a.chance === "Exam-based" && b.chance !== "Exam-based") return 1;
      if (a.chance !== "Exam-based" && b.chance === "Exam-based") return -1;
      return b.chanceScore - a.chanceScore || b.college.averagePackageLpa - a.college.averagePackageLpa;
    });
}

export function getCollegeById(id: string) {
  return colleges.find((college) => college.id === id);
}

export function getAnalytics() {
  const byType = (["NIT", "IIIT", "GFTI", "State", "Private"] as CollegeType[]).map((type) => {
    const group = colleges.filter((college) => college.type === type);
    return {
      type,
      colleges: group.length,
      averagePackage: Number((group.reduce((sum, college) => sum + college.averagePackageLpa, 0) / group.length).toFixed(1)),
      averageFees: Number((group.reduce((sum, college) => sum + college.feesLpa, 0) / group.length).toFixed(1)),
    };
  });

  return {
    totalColleges: colleges.length,
    totalCutoffs: colleges.reduce((sum, college) => sum + college.cutoffs.length, 0),
    branches: allBranches.length,
    byType,
    topPlacements: [...colleges].sort((a, b) => b.averagePackageLpa - a.averagePackageLpa).slice(0, 8),
  };
}

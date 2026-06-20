import { db } from "@workspace/db";
import {
  usersTable, candidatesTable, employersTable, vacanciesTable,
  applicationsTable, documentsTable, coursesTable, batchesTable,
  enrollmentsTable, recognitionCasesTable, visaCasesTable,
  visaChecklistItemsTable, interviewsTable, offersTable,
  welfareTicketsTable, notificationsTable,
} from "@workspace/db";

function hash(p: string): string {
  let h = 0;
  for (let i = 0; i < p.length; i++) { const c = p.charCodeAt(i); h = (h << 5) - h + c; h = h & h; }
  return h.toString(16);
}

const VISA_CHECKLIST = [
  { item: "Valid passport (minimum 6 months validity)", required: true },
  { item: "Signed job offer letter from employer", required: true },
  { item: "Qualification recognition result or evidence", required: true },
  { item: "German language certificate (A2/B1 minimum)", required: true },
  { item: "Health insurance coverage confirmation", required: true },
  { item: "Financial documents / bank statements", required: false },
  { item: "Visa appointment booked", required: true },
  { item: "Visa application form completed", required: true },
  { item: "Visa application submitted to German consulate", required: true },
  { item: "Visa decision received", required: true },
  { item: "Travel booking confirmed", required: false },
];

async function main() {
  console.log("Seeding database...");

  // ---- USERS ----
  const userData = [
    // Candidates
    { email: "arjun.sharma@gmail.com", name: "Arjun Sharma", role: "candidate" as const, phone: "+91 9876543210", organization: null },
    { email: "priya.nair@gmail.com", name: "Priya Nair", role: "candidate" as const, phone: "+91 9876543211", organization: null },
    { email: "ravi.kumar@gmail.com", name: "Ravi Kumar", role: "candidate" as const, phone: "+91 9865432109", organization: null },
    { email: "sunita.patel@gmail.com", name: "Sunita Patel", role: "candidate" as const, phone: "+91 9654321098", organization: null },
    { email: "Mohammed.iqbal@gmail.com", name: "Mohammed Iqbal", role: "candidate" as const, phone: "+91 9543210987", organization: null },
    { email: "kavya.reddy@gmail.com", name: "Kavya Reddy", role: "candidate" as const, phone: "+91 9432109876", organization: null },
    { email: "deepak.singh@gmail.com", name: "Deepak Singh", role: "candidate" as const, phone: "+91 9321098765", organization: null },
    { email: "ananya.das@gmail.com", name: "Ananya Das", role: "candidate" as const, phone: "+91 9210987654", organization: null },
    // Employers
    { email: "hr@bosch-germany.de", name: "Hans Mueller", role: "employer" as const, phone: "+49 711 400401", organization: "Robert Bosch GmbH" },
    { email: "talent@db-schenker.de", name: "Ingrid Fischer", role: "employer" as const, phone: "+49 69 9105 0", organization: "DB Schenker GmbH" },
    { email: "jobs@carehome-berlin.de", name: "Klaus Weber", role: "employer" as const, phone: "+49 30 2345678", organization: "BerlinCare Altenpflege" },
    // Trainers
    { email: "admin@goethe-pune.in", name: "Sunita Krishnan", role: "trainer" as const, phone: "+91 20 26650700", organization: "Goethe-Institut Pune" },
    { email: "director@maxmueller.in", name: "Ramesh Iyer", role: "trainer" as const, phone: "+91 44 28113421", organization: "Max Mueller Bhavan Chennai" },
    // Facilitators
    { email: "ops@indiagermanyjobs.in", name: "Vikram Malhotra", role: "facilitator" as const, phone: "+91 11 23456789", organization: "Indo-German Careers" },
    // Government
    { email: "official@msde.gov.in", name: "Rajesh Gupta", role: "government" as const, phone: "+91 11 23456789", organization: "Ministry of Skill Development" },
    // Admin
    { email: "admin@mobicorridor.in", name: "System Admin", role: "admin" as const, phone: null, organization: "MobiCorridor Platform" },
  ];

  const users: typeof usersTable.$inferSelect[] = [];
  for (const u of userData) {
    const existing = await db.select().from(usersTable).limit(1);
    if (existing.length > 0) {
      // check by email
    }
    try {
      const [user] = await db.insert(usersTable).values({ ...u, passwordHash: hash("Demo@1234") }).returning();
      users.push(user);
      console.log(`Created user: ${user.email}`);
    } catch (e: any) {
      if (e.message?.includes("duplicate key")) {
        console.log(`User ${u.email} already exists, skipping`);
      } else throw e;
    }
  }

  if (users.length === 0) { console.log("All users already exist, exiting."); return; }

  // Map users by email
  const userMap: Record<string, typeof usersTable.$inferSelect> = {};
  for (const u of users) userMap[u.email] = u;

  // ---- CANDIDATES ----
  const candidateData = [
    { email: "arjun.sharma@gmail.com", district: "Pune", state: "Maharashtra", occupation: "Automotive Mechanic", educationLevel: "ITI Diploma", experienceYears: 4, germanLanguageLevel: "B1", passportAvailable: true, stage: "employer_matching" as const, readinessScore: 78 },
    { email: "priya.nair@gmail.com", district: "Kochi", state: "Kerala", occupation: "Nursing", educationLevel: "B.Sc Nursing", experienceYears: 3, germanLanguageLevel: "B2", passportAvailable: true, stage: "visa_readiness" as const, readinessScore: 91 },
    { email: "ravi.kumar@gmail.com", district: "Hyderabad", state: "Telangana", occupation: "Electrician", educationLevel: "ITI Certificate", experienceYears: 5, germanLanguageLevel: "A2", passportAvailable: true, stage: "language_training" as const, readinessScore: 52 },
    { email: "sunita.patel@gmail.com", district: "Ahmedabad", state: "Gujarat", occupation: "Aged Care Worker", educationLevel: "Diploma in Care", experienceYears: 2, germanLanguageLevel: "B1", passportAvailable: false, stage: "document_vault" as const, readinessScore: 64 },
    { email: "Mohammed.iqbal@gmail.com", district: "Lucknow", state: "Uttar Pradesh", occupation: "Welder", educationLevel: "ITI Diploma", experienceYears: 6, germanLanguageLevel: "A1", passportAvailable: false, stage: "eligibility" as const, readinessScore: 38 },
    { email: "kavya.reddy@gmail.com", district: "Bengaluru", state: "Karnataka", occupation: "IT Specialist", educationLevel: "B.Tech", experienceYears: 3, germanLanguageLevel: "B2", passportAvailable: true, stage: "interview_offer" as const, readinessScore: 88 },
    { email: "deepak.singh@gmail.com", district: "Jaipur", state: "Rajasthan", occupation: "Plumber", educationLevel: "ITI Certificate", experienceYears: 7, germanLanguageLevel: "A2", passportAvailable: true, stage: "qualification_recognition" as const, readinessScore: 61 },
    { email: "ananya.das@gmail.com", district: "Kolkata", state: "West Bengal", occupation: "Hotel & Hospitality", educationLevel: "Diploma in Hotel Mgmt", experienceYears: 2, germanLanguageLevel: "B1", passportAvailable: true, stage: "employer_matching" as const, readinessScore: 72 },
  ];

  const candidates: typeof candidatesTable.$inferSelect[] = [];
  for (const c of candidateData) {
    const user = userMap[c.email];
    if (!user) continue;
    const { email, ...rest } = c;
    const [cand] = await db.insert(candidatesTable).values({ userId: user.id, ...rest, profileComplete: true }).returning();
    candidates.push(cand);
    console.log(`Created candidate: ${user.name}`);
  }

  // ---- EMPLOYERS ----
  const employerData = [
    { email: "hr@bosch-germany.de", companyName: "Robert Bosch GmbH", city: "Stuttgart", industry: "Automotive & Manufacturing" },
    { email: "talent@db-schenker.de", companyName: "DB Schenker GmbH", city: "Frankfurt", industry: "Logistics & Supply Chain" },
    { email: "jobs@carehome-berlin.de", companyName: "BerlinCare Altenpflege", city: "Berlin", industry: "Healthcare & Aged Care" },
  ];

  const employers: typeof employersTable.$inferSelect[] = [];
  for (const e of employerData) {
    const user = userMap[e.email];
    if (!user) continue;
    const [emp] = await db.insert(employersTable).values({
      userId: user.id, companyName: e.companyName, country: "Germany",
      city: e.city, industry: e.industry, contactName: user.name,
      contactEmail: e.email, verificationStatus: "verified",
    }).returning();
    employers.push(emp);
    console.log(`Created employer: ${emp.companyName}`);
  }

  // ---- VACANCIES ----
  const vacancyData = [
    { employerIdx: 0, title: "Automotive Technician – Stuttgart Plant", occupation: "Automotive Mechanic", location: "Stuttgart, Baden-Württemberg", salaryMin: 38000, salaryMax: 48000, languageLevel: "B1", experienceYears: 2, recognitionRequired: true, visaSupport: true, accommodationSupport: true, joiningDate: "2026-09-01", status: "active" as const },
    { employerIdx: 0, title: "CNC Machinist – Precision Parts Division", occupation: "CNC Machinist", location: "Gerlingen, Baden-Württemberg", salaryMin: 36000, salaryMax: 44000, languageLevel: "A2", experienceYears: 3, recognitionRequired: false, visaSupport: true, accommodationSupport: false, joiningDate: "2026-10-01", status: "active" as const },
    { employerIdx: 1, title: "Logistics Coordinator – Frankfurt Hub", occupation: "Logistics Specialist", location: "Frankfurt, Hessen", salaryMin: 34000, salaryMax: 42000, languageLevel: "B1", experienceYears: 2, recognitionRequired: false, visaSupport: true, accommodationSupport: true, joiningDate: "2026-08-15", status: "active" as const },
    { employerIdx: 1, title: "Warehouse Operations Lead", occupation: "Warehouse Manager", location: "Mannheim, Baden-Württemberg", salaryMin: 40000, salaryMax: 50000, languageLevel: "B2", experienceYears: 5, recognitionRequired: false, visaSupport: false, accommodationSupport: false, joiningDate: "2026-11-01", status: "active" as const },
    { employerIdx: 2, title: "Qualified Nurse – Elderly Care Unit", occupation: "Nursing", location: "Berlin, Brandenburg", salaryMin: 42000, salaryMax: 52000, languageLevel: "B2", experienceYears: 2, recognitionRequired: true, visaSupport: true, accommodationSupport: true, joiningDate: "2026-09-15", status: "active" as const },
    { employerIdx: 2, title: "Aged Care Specialist – Residential Home", occupation: "Aged Care Worker", location: "Munich, Bavaria", salaryMin: 38000, salaryMax: 46000, languageLevel: "B1", experienceYears: 1, recognitionRequired: true, visaSupport: true, accommodationSupport: true, joiningDate: "2026-10-15", status: "active" as const },
  ];

  const vacancies: typeof vacanciesTable.$inferSelect[] = [];
  for (const v of vacancyData) {
    if (!employers[v.employerIdx]) continue;
    const { employerIdx, ...rest } = v;
    const [vac] = await db.insert(vacanciesTable).values({ ...rest, employerId: employers[employerIdx].id, shiftType: "Day" }).returning();
    vacancies.push(vac);
    console.log(`Created vacancy: ${vac.title}`);
  }

  // ---- APPLICATIONS ----
  const appData = [
    { candIdx: 0, vacIdx: 0, status: "interview_scheduled" as const },
    { candIdx: 1, vacIdx: 4, status: "offer_issued" as const },
    { candIdx: 2, vacIdx: 2, status: "applied" as const },
    { candIdx: 3, vacIdx: 5, status: "shortlisted" as const },
    { candIdx: 5, vacIdx: 0, status: "interview_done" as const },
    { candIdx: 7, vacIdx: 2, status: "shortlisted" as const },
  ];

  const applications: typeof applicationsTable.$inferSelect[] = [];
  for (const a of appData) {
    if (!candidates[a.candIdx] || !vacancies[a.vacIdx]) continue;
    const [app] = await db.insert(applicationsTable).values({
      candidateId: candidates[a.candIdx].id, vacancyId: vacancies[a.vacIdx].id,
      status: a.status, coverNote: "I am eager to contribute my skills and grow in Germany.",
    }).returning();
    applications.push(app);
    console.log(`Created application: cand ${a.candIdx} → vac ${a.vacIdx}`);
  }

  // ---- DOCUMENTS ----
  const docData = [
    { candIdx: 0, type: "passport" as const, name: "Passport – Arjun Sharma", status: "verified" as const },
    { candIdx: 0, type: "education_certificate" as const, name: "ITI Diploma Certificate", status: "verified" as const },
    { candIdx: 0, type: "language_certificate" as const, name: "Goethe-Institut B1 Certificate", status: "verified" as const },
    { candIdx: 0, type: "experience_letter" as const, name: "Bajaj Auto – Experience Letter", status: "pending" as const },
    { candIdx: 1, type: "passport" as const, name: "Passport – Priya Nair", status: "verified" as const },
    { candIdx: 1, type: "education_certificate" as const, name: "B.Sc Nursing Degree", status: "verified" as const },
    { candIdx: 1, type: "language_certificate" as const, name: "Goethe-Institut B2 Certificate", status: "verified" as const },
    { candIdx: 1, type: "police_clearance" as const, name: "Police Clearance Certificate", status: "verified" as const },
    { candIdx: 1, type: "medical_certificate" as const, name: "Medical Fitness Certificate", status: "under_review" as const },
    { candIdx: 2, type: "passport" as const, name: "Passport – Ravi Kumar", status: "verified" as const },
    { candIdx: 2, type: "iti_diploma" as const, name: "ITI Electrician Certificate", status: "pending" as const },
    { candIdx: 3, type: "aadhaar" as const, name: "Aadhaar Card", status: "verified" as const },
    { candIdx: 3, type: "education_certificate" as const, name: "Diploma in Care Certificate", status: "pending" as const },
  ];

  for (const d of docData) {
    if (!candidates[d.candIdx]) continue;
    await db.insert(documentsTable).values({
      candidateId: candidates[d.candIdx].id, type: d.type, name: d.name,
      verificationStatus: d.status, uploadedAt: new Date(),
    });
    console.log(`Created document: ${d.name}`);
  }

  // ---- COURSES ----
  const trainer1User = userMap["admin@goethe-pune.in"];
  const trainer2User = userMap["director@maxmueller.in"];

  const courseData = [
    { providerId: trainer1User?.id, name: "A1 German Starter – Online", languageLevel: "A1" as const, durationWeeks: 8, feeAmount: 8000, mode: "online" as const, city: null },
    { providerId: trainer1User?.id, name: "A2 German Beginner – Pune", languageLevel: "A2" as const, durationWeeks: 12, feeAmount: 15000, mode: "hybrid" as const, city: "Pune" },
    { providerId: trainer1User?.id, name: "B1 German Intermediate – Classroom", languageLevel: "B1" as const, durationWeeks: 16, feeAmount: 22000, mode: "offline" as const, city: "Pune" },
    { providerId: trainer2User?.id, name: "B2 German Advanced – Chennai", languageLevel: "B2" as const, durationWeeks: 20, feeAmount: 28000, mode: "offline" as const, city: "Chennai" },
    { providerId: trainer2User?.id, name: "B1 Conversational German – Online", languageLevel: "B1" as const, durationWeeks: 14, feeAmount: 18000, mode: "online" as const, city: null },
  ];

  const courses: typeof coursesTable.$inferSelect[] = [];
  for (const c of courseData) {
    if (!c.providerId) continue;
    const [course] = await db.insert(coursesTable).values(c as any).returning();
    courses.push(course);
    console.log(`Created course: ${course.name}`);
  }

  // ---- BATCHES ----
  const batchData = [
    { courseIdx: 0, trainerName: "Sunita Krishnan", startDate: "2026-07-01", endDate: "2026-08-25", status: "upcoming" as const, capacity: 25 },
    { courseIdx: 1, trainerName: "Sunita Krishnan", startDate: "2026-05-01", endDate: "2026-07-24", status: "active" as const, capacity: 20 },
    { courseIdx: 2, trainerName: "Amit Joshi", startDate: "2026-04-01", endDate: "2026-07-24", status: "active" as const, capacity: 18 },
    { courseIdx: 3, trainerName: "Ramesh Iyer", startDate: "2026-01-15", endDate: "2026-06-05", status: "completed" as const, capacity: 15 },
    { courseIdx: 4, trainerName: "Ramesh Iyer", startDate: "2026-06-10", endDate: "2026-09-18", status: "upcoming" as const, capacity: 30 },
  ];

  const batches: typeof batchesTable.$inferSelect[] = [];
  for (const b of batchData) {
    if (!courses[b.courseIdx]) continue;
    const [batch] = await db.insert(batchesTable).values({ ...b, courseId: courses[b.courseIdx].id }).returning();
    batches.push(batch);
    console.log(`Created batch: ${batch.id}`);
  }

  // ---- ENROLLMENTS ----
  const enrollData = [
    { candIdx: 0, batchIdx: 2, status: "passed" as const, attendance: 92, score: 78, cert: true },
    { candIdx: 2, batchIdx: 1, status: "attending" as const, attendance: 85, score: null, cert: false },
    { candIdx: 3, batchIdx: 2, status: "attending" as const, attendance: 73, score: null, cert: false },
    { candIdx: 4, batchIdx: 0, status: "enrolled" as const, attendance: null, score: null, cert: false },
    { candIdx: 6, batchIdx: 1, status: "attending" as const, attendance: 88, score: null, cert: false },
    { candIdx: 7, batchIdx: 2, status: "attending" as const, attendance: 95, score: null, cert: false },
  ];

  for (const e of enrollData) {
    if (!candidates[e.candIdx] || !batches[e.batchIdx]) continue;
    await db.insert(enrollmentsTable).values({
      candidateId: candidates[e.candIdx].id, batchId: batches[e.batchIdx].id,
      status: e.status, attendancePercent: e.attendance ?? null,
      assessmentScore: e.score ?? null, certificateIssued: e.cert,
    });
    console.log(`Created enrollment: cand ${e.candIdx} → batch ${e.batchIdx}`);
  }

  // ---- RECOGNITION CASES ----
  const recognitionData = [
    { candIdx: 0, indianQual: "ITI Diploma in Automobile Service Technician", germanProf: "Kfz-Mechatroniker (Automotive Mechatronics Technician)", regulated: "regulated" as const, authority: "ZAB – Central Office for Foreign Education", status: "authority_review" as const },
    { candIdx: 1, indianQual: "B.Sc Nursing from Rajiv Gandhi University of Health Sciences", germanProf: "Gesundheits- und Krankenpfleger (Registered Nurse)", regulated: "regulated" as const, authority: "Landesamt für Gesundheit und Soziales Berlin", status: "full_recognition" as const },
    { candIdx: 2, indianQual: "ITI Certificate in Electrical Wireman", germanProf: "Elektroinstallateur (Electrician)", regulated: "non_regulated" as const, authority: "IHK Frankfurt", status: "documents_pending" as const },
    { candIdx: 3, indianQual: "Diploma in Care Assistant", germanProf: "Altenpflegehelferin (Aged Care Helper)", regulated: "regulated" as const, authority: "Sozialministerium Bayern", status: "partial_recognition" as const },
    { candIdx: 6, indianQual: "ITI Certificate in Plumber", germanProf: "Anlagenmechaniker SHK", regulated: "non_regulated" as const, authority: "HWK München", status: "submitted" as const },
  ];

  for (const r of recognitionData) {
    if (!candidates[r.candIdx]) continue;
    await db.insert(recognitionCasesTable).values({
      candidateId: candidates[r.candIdx].id, indianQualification: r.indianQual,
      germanProfession: r.germanProf, regulatedStatus: r.regulated,
      recognitionAuthority: r.authority, status: r.status,
      documentsRequired: ["Certified copies of diploma", "Apostille", "Translated documents (DE)", "Experience letters"],
    });
    console.log(`Created recognition case for cand ${r.candIdx}`);
  }

  // ---- VISA CASES ----
  const visaData = [
    { candIdx: 1, pathway: "Skilled Worker Visa (§18a AufenthG)", status: "appointment_pending" as const, travelDate: "2026-09-15", arrived: false, completedItems: [0, 1, 2, 3, 4, 5, 6, 7] },
    { candIdx: 5, pathway: "EU Blue Card (§18c AufenthG)", status: "checklist_in_progress" as const, travelDate: null, arrived: false, completedItems: [0, 1, 2, 3] },
  ];

  for (const v of visaData) {
    if (!candidates[v.candIdx]) continue;
    const [vc] = await db.insert(visaCasesTable).values({
      candidateId: candidates[v.candIdx].id, pathwayType: v.pathway,
      status: v.status, travelDate: v.travelDate, arrivalConfirmed: v.arrived,
    }).returning();
    const items = await db.insert(visaChecklistItemsTable).values(
      VISA_CHECKLIST.map((ci, i) => ({ visaCaseId: vc.id, item: ci.item, required: ci.required, completed: v.completedItems.includes(i), completedAt: v.completedItems.includes(i) ? new Date() : null }))
    ).returning();
    console.log(`Created visa case for cand ${v.candIdx} with ${items.length} checklist items`);
  }

  // ---- INTERVIEWS ----
  if (applications[0] && candidates[0] && employers[0]) {
    await db.insert(interviewsTable).values({
      applicationId: applications[0].id, candidateId: candidates[0].id, employerId: employers[0].id,
      scheduledAt: "2026-07-05T10:00:00Z", meetingLink: "https://teams.microsoft.com/l/meetup-join/mock-link",
      status: "scheduled", feedback: null, outcome: null,
    });
    console.log("Created interview for Arjun × Bosch");
  }
  if (applications[4] && candidates[5] && employers[0]) {
    await db.insert(interviewsTable).values({
      applicationId: applications[4].id, candidateId: candidates[5].id, employerId: employers[0].id,
      scheduledAt: "2026-06-28T14:00:00Z", meetingLink: "https://teams.microsoft.com/l/meetup-join/mock-link-2",
      status: "completed", feedback: "Excellent technical knowledge. Strong candidate.", outcome: "proceed",
    });
    console.log("Created completed interview for Kavya × Bosch");
  }

  // ---- OFFERS ----
  if (applications[1] && candidates[1] && employers[2]) {
    await db.insert(offersTable).values({
      applicationId: applications[1].id, candidateId: candidates[1].id, employerId: employers[2].id,
      salaryOffered: 46000, joiningDate: "2026-09-15", status: "issued",
      expiresAt: "2026-07-31",
    });
    console.log("Created offer for Priya × BerlinCare");
  }

  // ---- WELFARE TICKETS ----
  if (candidates[0]) {
    await db.insert(welfareTicketsTable).values({
      candidateId: candidates[0].id, category: "general", title: "Query about recognition documents",
      description: "I need guidance on which documents need apostille for the ZAB recognition process.",
      priority: "medium", status: "in_progress", assignedTo: "Vikram Malhotra",
    });
  }
  if (candidates[1]) {
    await db.insert(welfareTicketsTable).values({
      candidateId: candidates[1].id, category: "accommodation", title: "Employer-provided housing query",
      description: "Confirming details about the accommodation support offered by BerlinCare.",
      priority: "low", status: "resolved", assignedTo: "Vikram Malhotra",
      resolution: "Accommodation for 3 months provided by employer as per offer letter.",
    });
  }
  console.log("Created welfare tickets");

  // ---- NOTIFICATIONS ----
  if (users[0]) {
    await db.insert(notificationsTable).values([
      { userId: users[0].id, type: "application_update", title: "Interview Scheduled", body: "Your interview with Robert Bosch GmbH is scheduled for July 5, 2026 at 10:00 AM.", read: false, link: "/candidate/applications" },
      { userId: users[0].id, type: "document_verified", title: "Passport Verified", body: "Your passport has been verified successfully.", read: true, link: "/candidate/documents" },
    ]);
  }
  if (users[1]) {
    await db.insert(notificationsTable).values([
      { userId: users[1].id, type: "offer_received", title: "Job Offer Received", body: "BerlinCare Altenpflege has issued you a job offer. Salary: EUR 46,000/year.", read: false, link: "/candidate/applications" },
    ]);
  }
  console.log("Created notifications");

  console.log("\nSeeding complete!");
}

main().catch(e => { console.error(e); process.exit(1); });

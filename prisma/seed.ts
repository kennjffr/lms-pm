import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL env variable not set for seeding");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean the database
  await prisma.submission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.program.deleteMany();

  // Hash passwords
  const adminPasswordHash = bcrypt.hashSync("admin123", 10);
  const teacherPasswordHash = bcrypt.hashSync("teacher123", 10);
  const studentPasswordHash = bcrypt.hashSync("student123", 10);

  // 1. Create Programs
  console.log("Creating programs...");
  const rpl = await prisma.program.create({
    data: {
      name: "Rekayasa Perangkat Lunak (Software Engineering)",
      code: "RPL",
      description: "Focuses on software development, web applications, coding, databases, and algorithms.",
    },
  });

  const dkv = await prisma.program.create({
    data: {
      name: "Desain Komunikasi Visual (Digital Media & Design)",
      code: "DKV",
      description: "Focuses on graphic design, UI/UX, photography, branding, and multimedia elements.",
    },
  });

  const tkj = await prisma.program.create({
    data: {
      name: "Teknik Komputer dan Jaringan (Computer & Network Engineering)",
      code: "TKJ",
      description: "Focuses on computer hardware, operating systems, routing, switching, and server management.",
    },
  });

  const anim = await prisma.program.create({
    data: {
      name: "Animasi (Animation)",
      code: "ANIM",
      description: "Focuses on 2D/3D character design, storytelling, motion graphics, and rendering.",
    },
  });

  // 2. Create Users
  console.log("Creating users...");
  
  // Admin
  await prisma.user.create({
    data: {
      email: "admin@smk.sch.id",
      name: "Admin Utama",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  // Teachers
  const teacherRpl = await prisma.user.create({
    data: {
      email: "budi@smk.sch.id",
      name: "Pak Budi Hartono",
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
    },
  });

  const teacherDkv = await prisma.user.create({
    data: {
      email: "ani@smk.sch.id",
      name: "Ibu Ani Wijaya",
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
    },
  });

  const teacherTkj = await prisma.user.create({
    data: {
      email: "eka@smk.sch.id",
      name: "Pak Eka Saputra",
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
    },
  });

  const teacherAnim = await prisma.user.create({
    data: {
      email: "doni@smk.sch.id",
      name: "Pak Doni Pratama",
      passwordHash: teacherPasswordHash,
      role: Role.TEACHER,
    },
  });

  // Students
  const joko = await prisma.user.create({
    data: {
      email: "joko@smk.sch.id",
      name: "Joko Susilo",
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      programId: rpl.id,
      currentSemester: 1,
    },
  });

  const siti = await prisma.user.create({
    data: {
      email: "siti@smk.sch.id",
      name: "Siti Rahmawati",
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      programId: dkv.id,
      currentSemester: 3,
    },
  });

  const rudi = await prisma.user.create({
    data: {
      email: "rudi@smk.sch.id",
      name: "Rudi Setiawan",
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      programId: tkj.id,
      currentSemester: 5,
    },
  });

  const lani = await prisma.user.create({
    data: {
      email: "lani@smk.sch.id",
      name: "Lani Apriani",
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      programId: anim.id,
      currentSemester: 2,
    },
  });

  // 3. Create Courses
  console.log("Creating courses...");
  
  // RPL Courses
  const rpl101 = await prisma.course.create({
    data: {
      name: "Web Development Basics",
      code: "RPL-101",
      description: "Learn HTML5, CSS3, semantic layouts, responsive design, and CSS frameworks.",
      semester: 1,
      programId: rpl.id,
      teacherId: teacherRpl.id,
    },
  });

  const rpl301 = await prisma.course.create({
    data: {
      name: "Advanced React & Next.js",
      code: "RPL-301",
      description: "Deep dive into React core concepts, hooks, Next.js routing, server actions, and fetching.",
      semester: 3,
      programId: rpl.id,
      teacherId: teacherRpl.id,
    },
  });

  // DKV Courses
  const dkv101 = await prisma.course.create({
    data: {
      name: "Vector Illustration",
      code: "DKV-101",
      description: "Mastering pen tool, pathing, colors, and layout configurations in Adobe Illustrator.",
      semester: 1,
      programId: dkv.id,
      teacherId: teacherDkv.id,
    },
  });

  const dkv301 = await prisma.course.create({
    data: {
      name: "UI/UX Web & Mobile Design",
      code: "DKV-301",
      description: "Understand Figma, user research, wireframing, component libraries, auto layout, and prototyping.",
      semester: 3,
      programId: dkv.id,
      teacherId: teacherDkv.id,
    },
  });

  // TKJ Courses
  const tkj101 = await prisma.course.create({
    data: {
      name: "Computer Network Basics",
      code: "TKJ-101",
      description: "Understanding IP Addresses, OSI Layers, cabling, sub-netting, and packet routing.",
      semester: 1,
      programId: tkj.id,
      teacherId: teacherTkj.id,
    },
  });

  const tkj501 = await prisma.course.create({
    data: {
      name: "Linux Server Administration",
      code: "TKJ-501",
      description: "Configure Debian server, SSH keys, DHCP server, DNS server, Web Server Apache/Nginx.",
      semester: 5,
      programId: tkj.id,
      teacherId: teacherTkj.id,
    },
  });

  // ANIM Courses
  const anim201 = await prisma.course.create({
    data: {
      name: "Principles of 2D Animation",
      code: "ANIM-201",
      description: "Learning squash & stretch, anticipation, timing, spacing, and keyframing.",
      semester: 2,
      programId: anim.id,
      teacherId: teacherAnim.id,
    },
  });

  // 4. Add Materials
  console.log("Creating materials...");
  
  await prisma.material.create({
    data: {
      title: "Introduction to HTML5 & CSS3 Syntax",
      content: `# HTML5 & CSS3 Reference Guide

Welcome to the foundation of web engineering! HTML structure and CSS styling are the key building blocks of any digital interface.

## HTML5 Core Elements
- \`<header>\`: Container for introductory content or navigational links.
- \`<nav>\`: Defines a set of navigation links.
- \`<main>\`: Specifies the main content of a document.
- \`<section>\`: Defines a section in a document.
- \`<article>\`: Specifies independent, self-contained content.
- \`<aside>\`: Defines content aside from the main page content (like a sidebar).
- \`<footer>\`: Container for footer notes or copyright details.

## CSS Layouts
### Flexbox
\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

### Grid
\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
\`\`\`
`,
      courseId: rpl101.id,
    },
  });

  await prisma.material.create({
    data: {
      title: "Figma Typography and Grids",
      content: `# Figma Design System Foundations

A successful digital media UI starts with robust foundations in layout grids and typography hierarchies.

## 1. The 8pt Grid System
In UI design, we use spacing increments of 8px (8, 16, 24, 32, 48, etc.) to maintain consistency across screens.

- **Margins**: Typically 16px (mobile) or 24px/32px (desktop)
- **Gutter**: Space between columns, typically 16px or 24px
- **Columns**: 4 for mobile, 8 for tablet, and 12 for desktop layouts

## 2. Typography Scale
Choose a clean sans-serif typeface (like Inter, Outfit, or Roboto).
- **H1 (Hero Heading)**: 40px - Bold - Line Height 1.2
- **H2 (Section Heading)**: 28px - Semibold - Line Height 1.3
- **H3 (Subsection Title)**: 20px - Medium - Line Height 1.4
- **Body Text**: 16px - Regular - Line Height 1.5
- **Caption / Small Text**: 12px - Regular - Line Height 1.4
`,
      courseId: dkv301.id,
    },
  });

  // 5. Add Assignments
  console.log("Creating assignments...");
  
  const now = new Date();
  const dueIn7Days = new Date();
  dueIn7Days.setDate(now.getDate() + 7);

  const dueIn5Days = new Date();
  dueIn5Days.setDate(now.getDate() + 5);

  const ass1 = await prisma.assignment.create({
    data: {
      title: "Build your first Personal Portfolio Page",
      description: `### Goal
Create a single-page responsive portfolio showcasing your skills, projects, and contact details.

### Requirements:
1. Use semantic HTML5 elements.
2. Structure layouts using CSS Flexbox or CSS Grid.
3. Design a responsive layout that looks great on mobile, tablet, and desktop screens.
4. Set up custom colors and fonts (use a cohesive palette).
5. Submit your HTML/CSS code or a hosted URL (e.g. GitHub Pages or Vercel link).
`,
      dueDate: dueIn7Days,
      maxPoints: 100,
      courseId: rpl101.id,
    },
  });

  const ass2 = await prisma.assignment.create({
    data: {
      title: "Create a High-Fidelity Landing Page Mockup in Figma",
      description: `### Goal
Design a visually stunning landing page for a tech vocational high school (SMK) in Figma.

### Requirements:
1. Adhere to the 8pt Grid System (12 columns for desktop, 24px margins, 16px gutters).
2. Utilize component structures and auto layout for buttons, cards, and navigation headers.
3. Create both Light and Dark mode options.
4. Establish a clean color palette focusing on digital tech aesthetics (neon accents, glassmorphic elements, rich contrast).
5. Submit the Figma file link with editing/viewing privileges enabled.
`,
      dueDate: dueIn5Days,
      maxPoints: 100,
      courseId: dkv301.id,
    },
  });

  console.log("Database seeded successfully!");
  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // ── Industries ───────────────────────────────────────────────────────
  const industries = [
    {
      name: "Healthcare",
      description:
        "A mid-sized hospital network running patient management systems, electronic health records (EHR), and HIPAA-compliant data pipelines across 12 regional facilities.",
    },
    {
      name: "FinTech",
      description:
        "A digital payments startup processing 2 million daily transactions through a real-time fraud detection engine and PCI-DSS compliant card processing platform.",
    },
    {
      name: "E-Commerce",
      description:
        "An online retail marketplace handling 500K daily active users, a product catalogue of 3 million SKUs, and a warehouse management system spanning 4 distribution centres.",
    },
    {
      name: "EdTech",
      description:
        "A learning management platform serving 200 universities with live video lectures, auto-graded assignments, and a plagiarism detection microservice.",
    },
    {
      name: "Logistics & Supply Chain",
      description:
        "A freight management company operating a GPS fleet-tracking system, route-optimization engine, and customs-clearance automation portal across 18 countries.",
    },
  ];

  for (const industry of industries) {
    await prisma.industry.upsert({
      where: { name: industry.name },
      update: {},
      create: industry,
    });
  }

  // ── Architectures ───────────────────────────────────────────────────
  const architectures = [
    {
      name: "Monolithic Java EE Application",
      description:
        "A single 800K-line Java EE application deployed as a WAR file on Apache Tomcat. All modules — authentication, billing, reporting, and notifications — share one codebase, one database, and one deployment pipeline. Releases happen once per quarter after a 3-week regression testing cycle.",
    },
    {
      name: "Legacy COBOL Mainframe",
      description:
        "Core business rules run on an IBM z/OS mainframe written in COBOL in the 1990s. Batch processing jobs execute overnight via JCL scripts. The system interfaces with modern front-ends through a fragile SOAP-based middleware layer that frequently drops connections.",
    },
    {
      name: "Tightly-Coupled .NET Monolith on Windows Server",
      description:
        "A .NET Framework 4.5 application hosted on IIS across 6 Windows Server 2012 R2 VMs. The app relies on Windows-specific APIs, MSMQ for messaging, and SQL Server stored procedures containing 40% of the business logic. No Linux compatibility exists.",
    },
    {
      name: "PHP/MySQL LAMP Stack",
      description:
        "A legacy PHP 5.6 application running on bare-metal Apache servers with a single MySQL 5.5 master database. Deployments are performed by FTP-ing files directly to production. No staging environment exists and database migrations are applied manually via phpMyAdmin.",
    },
    {
      name: "Early-Stage Microservices (Partial Migration)",
      description:
        "A hybrid architecture where 3 new microservices (written in Node.js and Go) communicate via REST with a legacy monolithic Rails application that still handles 70% of traffic. Service discovery is hardcoded via environment variables and there is no centralised logging or tracing.",
    },
  ];

  for (const arch of architectures) {
    await prisma.architecture.upsert({
      where: { name: arch.name },
      update: {},
      create: arch,
    });
  }

  // ── Pain Points ─────────────────────────────────────────────────────
  const painPoints = [
    // --- Easy (3) ---
    {
      description:
        "Deployments are performed manually by SSH-ing into each server and running shell scripts. There is no CI/CD pipeline, and the deployment checklist is a 35-step Word document maintained by a single senior engineer who is about to retire.",
      difficultyLevel: "Easy",
    },
    {
      description:
        "The team has no version control discipline — developers commit directly to the main branch, there are no code reviews, and the last three production outages were caused by untested commits pushed on Friday afternoons.",
      difficultyLevel: "Easy",
    },
    {
      description:
        "Application monitoring consists of a single Nagios check that pings the homepage every 5 minutes. The team only discovers outages when customers call the support hotline, resulting in an average detection time of 47 minutes.",
      difficultyLevel: "Easy",
    },

    // --- Medium (3) ---
    {
      description:
        "The release process requires sign-off from 7 different stakeholders across 4 departments, taking an average of 12 business days per release. Emergency hotfixes follow the same approval chain, meaning critical security patches take 2+ weeks to reach production.",
      difficultyLevel: "Medium",
    },
    {
      description:
        "No automated testing exists at any level. The QA team manually executes 1,200 test cases over a 2-week cycle before each release, yet production defect rates remain at 38% because the test cases do not cover the API layer or edge cases.",
      difficultyLevel: "Medium",
    },
    {
      description:
        "Development, staging, and production environments are configured entirely differently. Developers work on Windows laptops, staging runs on a single Linux VM with half the RAM, and production is a cluster of 8 bare-metal servers. 'Works on my machine' is the team's unofficial motto.",
      difficultyLevel: "Medium",
    },

    // --- Hard (3) ---
    {
      description:
        "The production database is a single Oracle 11g instance with 4 TB of data, no read replicas, and 340 stored procedures that contain critical business logic. Any schema change requires a 6-hour maintenance window, and the last two migrations corrupted data that took 3 days to recover.",
      difficultyLevel: "Hard",
    },
    {
      description:
        "The application handles PII/PHI data under HIPAA and PCI-DSS but has no secrets management — API keys and database passwords are hardcoded across 14 repositories. An audit revealed that 6 former employees still have active production credentials, and there is no automated credential rotation.",
      difficultyLevel: "Hard",
    },
    {
      description:
        "The organization has zero Infrastructure as Code. All 42 production servers were manually provisioned over 5 years by different sysadmins with no documentation. No two servers have identical configurations, package versions differ across the fleet, and disaster recovery consists of untested 6-month-old VM snapshots.",
      difficultyLevel: "Hard",
    },
  ];

  for (const pp of painPoints) {
    await prisma.painPoint.create({ data: pp });
  }

  console.log("✅ Database seeded successfully!");
  console.log("   → 5 Industries");
  console.log("   → 5 Architectures");
  console.log("   → 9 Pain Points (3 Easy, 3 Medium, 3 Hard)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

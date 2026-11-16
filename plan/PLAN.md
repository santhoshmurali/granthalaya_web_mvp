# Granthlaya online

## Project Specification

## 1. Vision
**Sri Raghavendra Granthalaya* will have its own website or online platform. This project is for developing a visually stunning web pages that deliveres the interactive open content about Sri Raghavendra Granthalaya and its Founder Amman Sathiyanathan. 

## 2. Sections and visual design of the webpage
1. There needs to be a landsing page with very short summay of Granthalaya. Use the the @`static\Granthalaya_English_Translation_Pages_25-37.docx` to summarize and this should be a highlight text on the webpage.Provide the link there that should take the user about Granthalaya page.
2. When scrolls down, there should by cascading cards that appear from bottom while user continues the scroll till all trge cards disappear. use the content from @`static\Granthalaya_English_Translation_Pages_25-37.docx` between pages 8 to 13, its all about shrines, where each card will hold image of the shrine @`content/static/images` and a very short summary. provide a link there that will take the user the respective shrines page.
3. We should have a small section that talks shortly about the founder with his image. Provide a link tha takes the user to about the founder page. Find the content in @`content\static\amman_h_sathiyanathan.md`
4. There need to be a seperate detailed page for below and group it under one menu call "About"
    - About Granthalaya, craft it from @`static\Granthalaya_English_Translation_Pages_25-37.docx` till page 7. add reference images from @`content/static/images` folder.
    - Shrines, One single detailed page with content crafted from @`static\Granthalaya_English_Translation_Pages_25-37.docx` between pages 8 to 13.  add reference images from @`content/static/images` folder for each shrine referred to.
    - About Founder : One single detailed page with content crafted from @`content\static\amman_h_sathiyanathan.md` and with his images.
5. Need to have a section for news and alerts.
6. Have a seperate page for content management where content manager can post news/alerts. add more shrines, edit the exitisitng contents etc.
7. Content Management should be password protected. For now as it is a local develoment, lets use default username/passoword as admin/admin123.
8. Content manager should have ability to update or modify the image.

## 3. Special Instruction and Skills 
**IMPORTANT** Once this is tested finalized and updated as complete in Implementation section. Do not re-visit this again
Use following skills. if not installed, then install at the project level and use it.
| Skill name | Purpose | Installation | Documentation | 
| ----------- | ------- | ------------ |--------------|
| image-enhancer | When developing the web page, some images may not fit the overall design texture, use this skill to enhnace the image to suite the theme of the template | npx skills add https://github.com/ComposioHQ/awesome-claude-skills --skill image-enhancer | https://github.com/ComposioHQ/awesome-claude-skills/blob/master/image-enhancer/SKILL.md |
| frontend-design | use this skill to create visually stunning UX without compromising front-end desing engineering | bash npx skills add anthropics/skills@frontend-design | https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md |

### 3.1 ui-ux-pro-max-skill
- Git page of https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Install using `npm install -g ui-ux-pro-max-cli`
- Read through the documentation of 'Design System Generator' and based on your undestanding about Sri Raghavendra Granthalaya make appropriate design decisions.  
- KEY EFFECTS: Soft shadows + Context-appropriate transitions + Gentle hover states  
- AVOID (Anti-patterns):  Bright neon colors + Harsh animations + Dark mode + AI purple/pink gradients
- PRE-DELIVERY CHECKLIST: 
    - No emojis as icons (use SVG: Heroicons/Lucide)
    - cursor-pointer on all clickable elements 
    - Interaction timing follows the platform, component, and user preference 
    - Light mode: text contrast 4.5:1 minimum 
    - Focus states visible for keyboard nav
    - Prefers-reduced-motion respected  
    - Text, chips, and badges reflow without clipping or broken labels  
    - Responsive: 375px, 768px, 1024px, 1440px  


## 4. Architecture Overview
- Frontend: Next.js with TypeScript, built as a static export (output: 'export'), served by FastAPI as static files  
- Backend: FastAPI (Python), managed as a uv project  
- Database: Use postgresSQL use docker containter  
- Python Package manage : uv  
- Container : Single Docker container.  

## 5. Directory Structure
granthalaya_about/  
├── frontend/                 # Next.js TypeScript project (static export)  
├── backend/                  # FastAPI uv project (Python)   
│   └── db/                   # Schema definitions, seed data, migration logic  
├── plan/                 # Project-wide documentation for agents  
│   ├── PLAN.md               # This document  
│   └── ...                   # Additional agent reference docs  
├── content/  
│   └── static/               # Static content data  
│       └── images/           # all the referance images  
├── scripts/  
│   ├── start_mac.sh          # Launch Docker container (macOS/Linux)  
│   ├── stop_mac.sh           # Stop Docker container (macOS/Linux)  
├── test/                     # Playwright E2E tests + docker-compose.test.yml  
├── Dockerfile                # Multi-stage build (Node → Python)  
├── docker-compose.yml        # Optional convenience wrapper  
├── .env                      # Environment variables (gitignored, .env.example committed)  
└── .gitignore  




# 6. Implentation Status
## -- Update the implementation status below. This is important to manage the context---

### Status as of 2026-11-16 (rebuilt; the earlier status claimed work that was not on disk)
- [x] Backend: FastAPI + uv, SQLAlchemy models, seed from content/static, cookie login (admin/admin123), CRUD for news, shrines, pages, image upload. 11 pytest tests pass on SQLite and on Postgres 17.
- [x] Frontend: Next.js static export. Landing (highlight + link, cascading shrine cards, founder teaser, news), About menu (About Granthalaya, Shrines, About Founder), News and Alerts, alert banner.
- [x] Content manager at /admin/: news/alerts, shrines (add/edit/delete, image replace/add/remove), pages (home highlight, about, founder).
- [x] 21 Playwright tests pass against a local server and against the Docker + Postgres stack, including 375/768/1024/1440 overflow checks, reduced motion and keyboard focus.
- [x] Dockerfile, docker-compose.yml (app + Postgres), scripts/start_mac.sh, stop_mac.sh, .env.example, test/docker-compose.test.yml. Build, run, restart persistence verified.
- [x] Skills installed at project level (.claude/skills, .agents/skills): frontend-design, image-enhancer, ui-ux-pro-max. The UI was built from the plan's own design guidance before they were installed; source images are used unmodified.

"""Builds the learn/ pages: wraps each body_*.html in the site shell (top.html + bottom.html). Run: python learn/_src/compose.py"""
import pathlib, sys, html

S = pathlib.Path(__file__).parent
REPO = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else S.parent.parent  # default: the repo root
top = (S / "top.html").read_text(encoding="utf-8")
bottom = (S / "bottom.html").read_text(encoding="utf-8")

OLD_T = "Free Azure Data Engineering Course (Basic to Advanced) | Kramavriddhi"
OLD_D = "Free Azure Data Engineering course plan on YouTube: Data Factory, Databricks, Microsoft Fabric, Delta Lake, streaming, governance and CI/CD, from basic to advanced with projects."
OLD_U = "https://kramavriddhi.com/courses/azure-data-engineering/"

PAGES = [
    ("learn/index.html", "body_hub.html", "Learn by Playing: Free Puzzle Games for Tech Skills | Kramavriddhi",
     "Learn tech skills by playing short puzzle games. Start with Cloud & DevOps: build Azure data pipelines and fix Ansible playbooks, free and in your browser."),
    ("learn/devops/index.html", "body_devops.html", "Cloud & DevOps Games: Learn Azure and Ansible by Playing | Kramavriddhi",
     "Free browser puzzle games that teach Azure data engineering and Ansible: build a data pipeline, fix a playbook, and earn stars. Works on phones."),
    ("learn/devops/azure-data-pipeline/index.html", "body_pipeline.html", "Build the Data Pipeline: Azure Puzzle Game | Kramavriddhi",
     "Put Azure services in the right order: Data Factory, Data Lake, Databricks, Synapse, Event Hubs, Stream Analytics and Power BI. 5 levels, free, works on phones."),
    ("learn/devops/ansible-fix-the-playbook/index.html", "body_playbook.html", "Fix the Playbook: Ansible YAML Puzzle Game | Kramavriddhi",
     "Fix broken Ansible playbooks: reorder YAML lines, fix the indentation and press Run. Learn apt, copy, service, variables and handlers in 5 levels."),
    ("learn/python/index.html", "body_python.html", "Python Games: Learn Python Coding by Playing | Kramavriddhi",
     "Free browser puzzle games that teach Python from the first line: variables, if/else, loops, lists and functions. Fix code and guess the output. Works on phones."),
    ("learn/python/fix-the-code/index.html", "body_pyfix.html", "Fix the Code: Python Indentation Puzzle Game | Kramavriddhi",
     "Fix scrambled Python programs: put the lines in order, fix the indentation and run them. Learn variables, if/else, for loops and functions in 5 levels."),
    ("learn/python/guess-the-output/index.html", "body_pyout.html", "Guess the Output: Python Quiz Game | Kramavriddhi",
     "Read short Python programs and pick what they print. Strings, maths, lists, loops, functions and dictionaries in 5 levels, with simple explanations."),
    ("learn/daily/index.html", "body_daily.html", "Kramavriddhi Learn: Pick Your Skills, Learn Step by Step | Kramavriddhi",
     "Pick Python, Azure, Power BI, Git, Linux, SQL, Docker, Kubernetes, Ansible or DevOps and learn it step by step, from basics to advanced, in a free Instagram-style feed. Works on phones."),
]

for out, body, title, desc in [p for p in PAGES if (S / p[1]).exists()]:
    url = "https://kramavriddhi.com/" + out.replace("index.html", "")
    t = top.replace(OLD_T, html.escape(title, quote=True)).replace(OLD_D, html.escape(desc, quote=True)).replace(OLD_U, url)
    extra = ('  <link rel="stylesheet" href="/learn/common/learn.css?v=23">\n'
             '  <link rel="manifest" href="/learn/manifest.webmanifest">\n'
             '  <meta name="theme-color" content="#a46400">\n'
             '  <link rel="apple-touch-icon" href="/learn/icons/apple-touch-icon.png">\n'
             '  <meta name="apple-mobile-web-app-capable" content="yes">\n'
             '  <meta name="mobile-web-app-capable" content="yes">\n'
             '  <meta name="apple-mobile-web-app-title" content="KV Learn">\n</head>')
    t = t.replace("&display=swap", "&family=Noto+Sans+Telugu:wght@400;700&display=swap", 1)  # Telugu feed text (Phase 8)
    t = t.replace("</head>", extra, 1)
    page = t + (S / body).read_text(encoding="utf-8") + bottom
    p = REPO / out
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(page, encoding="utf-8", newline="\n")
    print("wrote", out)

/* Kramavriddhi Learn: meme breaks (original captions, no meme templates or film stills).
   Each meme: id (permanent), track id, face (emoji), top, bottom, lesson (a real fact), te = Telugu. */
window.KV_MEMES = [
  { id: 'm1', tr: 'py', face: '😵', top: 'Me: writes 200 lines of Python', bottom: 'Python: IndentationError on line 3', lesson: 'Python groups code by spaces. Keep every indent the same, usually 4 spaces.',
    te: { top: 'నేను: 200 lines Python రాశాను', bottom: 'Python: line 3 లో IndentationError', lesson: 'Python spaces తో code ని group చేస్తుంది. ప్రతి indent ఒకేలా ఉంచండి, సాధారణంగా 4 spaces.' } },
  { id: 'm2', tr: 'py', face: '😱', top: "print('Hi') works fine", bottom: "Print('Hi') → NameError", lesson: 'Python is case-sensitive: `print` and `Print` are different names.',
    te: { top: "print('Hi') బాగా పనిచేస్తుంది", bottom: "Print('Hi') → NameError", lesson: 'Python case-sensitive: `print` మరియు `Print` వేరు వేరు names.' } },
  { id: 'm3', tr: 'py', face: '🤔', top: 'Normal people: counting starts at 1', bottom: 'Python lists: the first item is [0]', lesson: 'List indexes start at 0, so `items[0]` is the first item.',
    te: { top: 'అందరూ: లెక్క 1 నుంచి మొదలు', bottom: 'Python list: మొదటి item [0]', lesson: 'List indexes 0 నుంచి మొదలవుతాయి, కాబట్టి `items[0]` మొదటి item.' } },

  { id: 'm4', tr: 'git', face: '😭', top: 'Coded for 3 hours', bottom: 'Never committed. Laptop restarted.', lesson: 'Run `git commit` often, so every step is saved.',
    te: { top: '3 గంటలు code రాశాను', bottom: 'ఒక్కసారి కూడా commit చేయలేదు. Laptop restart అయింది.', lesson: 'తరచుగా `git commit` చేయండి, అప్పుడు ప్రతి step save అవుతుంది.' } },
  { id: 'm5', tr: 'git', face: '😬', top: 'Me: git push ‑‑force on main', bottom: 'The whole team: 👀', lesson: 'Never force-push a shared branch. It can wipe out other people’s commits.',
    te: { top: 'నేను: main మీద git push ‑‑force', bottom: 'Team మొత్తం: 👀', lesson: 'అందరూ వాడే branch మీద force-push చేయకండి. ఇతరుల commits పోవచ్చు.' } },
  { id: 'm6', tr: 'git', face: '🥊', top: 'Two people edit the same line', bottom: 'Git: CONFLICT. You two sort it out.', lesson: 'A merge conflict means Git needs you to choose which change to keep.',
    te: { top: 'ఇద్దరు ఒకే line మార్చారు', bottom: 'Git: CONFLICT. మీరిద్దరే తేల్చుకోండి.', lesson: 'Merge conflict అంటే ఏ change ఉంచాలో మీరే ఎంచుకోవాలని Git అడుగుతోంది.' } },

  { id: 'm7', tr: 'lx', face: '😎', top: 'Terminal: Permission denied', bottom: 'sudo: Let me handle this', lesson: '`sudo` runs one command as the admin (root). Use it carefully.',
    te: { top: 'Terminal: Permission denied', bottom: 'sudo: నేను చూసుకుంటా', lesson: '`sudo` ఒక command ని admin (root) గా run చేస్తుంది. జాగ్రత్తగా వాడండి.' } },
  { id: 'm8', tr: 'lx', face: '🫠', top: 'Opened vim to fix one typo', bottom: 'Me, 20 minutes later: still inside vim', lesson: 'To leave vim without saving: press `Esc`, type `:q!` and press Enter.',
    te: { top: 'ఒక typo సరిచేయడానికి vim తెరిచాను', bottom: '20 నిమిషాల తర్వాత కూడా vim లోనే ఉన్నాను', lesson: 'Save చేయకుండా vim నుంచి బయటకు: `Esc` నొక్కి, `:q!` type చేసి Enter.' } },
  { id: 'm9', tr: 'lx', face: '🧘', top: 'Typed ls 47 times today', bottom: 'Just to feel in control', lesson: '`ls` lists the files in a folder; `ls -l` shows details like size and permissions.',
    te: { top: 'ఈరోజు 47 సార్లు ls type చేశాను', bottom: 'Control లో ఉన్నట్టు అనిపించడానికి', lesson: '`ls` folder లోని files చూపిస్తుంది; `ls -l` size, permissions లాంటి details కూడా చూపిస్తుంది.' } },

  { id: 'm10', tr: 'sql', face: '😨', top: 'UPDATE staff SET salary = 1000000;', bottom: 'Forgot the WHERE. Everyone is rich now.', lesson: 'Without `WHERE`, `UPDATE` changes every row in the table.',
    te: { top: 'UPDATE staff SET salary = 1000000;', bottom: 'WHERE మర్చిపోయా. ఇప్పుడు అందరూ ధనవంతులే.', lesson: '`WHERE` లేకపోతే `UPDATE` table లోని ప్రతి row ని మారుస్తుంది.' } },
  { id: 'm11', tr: 'sql', face: '🥲', top: 'SELECT * FROM friends WHERE free_tonight = 1;', bottom: '0 rows returned', lesson: '`WHERE` keeps only the rows that match the condition.',
    te: { top: 'SELECT * FROM friends WHERE free_tonight = 1;', bottom: '0 rows వచ్చాయి', lesson: '`WHERE` condition కి సరిపోయే rows ని మాత్రమే ఉంచుతుంది.' } },
  { id: 'm12', tr: 'sql', face: '🌊', top: 'Wanted to peek at 10 rows', bottom: 'Got 1 million rows', lesson: 'In SQLite, MySQL and PostgreSQL, `LIMIT 10` returns only 10 rows.',
    te: { top: '10 rows చూద్దామనుకున్నా', bottom: '10 లక్షల rows వచ్చాయి', lesson: 'SQLite, MySQL, PostgreSQL లో `LIMIT 10` 10 rows మాత్రమే ఇస్తుంది.' } },

  { id: 'm13', tr: 'dk', face: '📦', top: 'Dev: It works on my machine', bottom: 'Docker: Then we ship your machine', lesson: 'A container packs the app with everything it needs, so it runs the same everywhere.',
    te: { top: 'Developer: నా machine లో పనిచేస్తుంది', bottom: 'Docker: అయితే నీ machine నే పంపిద్దాం', lesson: 'Container app కి కావాల్సినవన్నీ కలిపి pack చేస్తుంది, కాబట్టి ఎక్కడైనా ఒకేలా run అవుతుంది.' } },
  { id: 'm14', tr: 'dk', face: '👻', top: 'docker ps shows nothing', bottom: 'Container: I was here a second ago', lesson: '`docker ps` shows only running containers. `docker ps -a` shows stopped ones too.',
    te: { top: 'docker ps ఏమీ చూపించట్లేదు', bottom: 'Container: ఒక్క second ముందు ఇక్కడే ఉన్నా', lesson: '`docker ps` running containers మాత్రమే చూపిస్తుంది. `docker ps -a` ఆగిపోయినవి కూడా చూపిస్తుంది.' } },
  { id: 'm15', tr: 'dk', face: '🐘', top: 'My app: 5 MB', bottom: 'My Docker image: 2 GB', lesson: 'Start from a small base image (for example a `-slim` one) to keep images small.',
    te: { top: 'నా app: 5 MB', bottom: 'నా Docker image: 2 GB', lesson: 'Image చిన్నగా ఉండాలంటే చిన్న base image (ఉదా: `-slim`) తో మొదలుపెట్టండి.' } },

  { id: 'm16', tr: 'k8s', face: '🧟', top: 'Deleted the pod to stop it', bottom: 'Deployment: brings it back in seconds', lesson: 'A Deployment keeps the number of pods you asked for. Scale it to 0 to stop them.',
    te: { top: 'ఆపడానికి pod ని delete చేశా', bottom: 'Deployment: seconds లో మళ్ళీ తెచ్చింది', lesson: 'Deployment మీరు అడిగినన్ని pods ఎప్పుడూ ఉంచుతుంది. ఆపాలంటే 0 కి scale చేయండి.' } },
  { id: 'm17', tr: 'k8s', face: '🔍', top: 'Pod status: CrashLoopBackOff', bottom: 'Me: kubectl logs, my best friend', lesson: '`kubectl logs <pod>` shows what the app printed, often the reason it crashed.',
    te: { top: 'Pod status: CrashLoopBackOff', bottom: 'నేను: kubectl logs, నా best friend', lesson: '`kubectl logs <pod>` app print చేసింది చూపిస్తుంది, తరచుగా crash కి కారణం అక్కడే ఉంటుంది.' } },
  { id: 'm18', tr: 'k8s', face: '📜', top: 'Wrote 1 line of app code', bottom: '…and 200 lines of YAML', lesson: 'In Kubernetes you describe what you want (pods, deployments) in YAML files.',
    te: { top: 'App code 1 line రాశా', bottom: '…YAML 200 lines రాశా', lesson: 'Kubernetes లో మీకు ఏమి కావాలో (pods, deployments) YAML files లో రాస్తారు.' } },

  { id: 'm19', tr: 'ans', face: '😌', top: 'Ran the playbook a second time', bottom: 'changed=0. Already perfect.', lesson: 'Idempotent: running again changes nothing when everything is already right.',
    te: { top: 'Playbook రెండోసారి run చేశా', bottom: 'changed=0. ఇప్పటికే perfect.', lesson: 'Idempotent: అన్నీ సరిగ్గా ఉంటే మళ్ళీ run చేసినా ఏమీ మారదు.' } },
  { id: 'm20', tr: 'ans', face: '🙅', top: 'One space wrong in the YAML', bottom: 'Playbook: I refuse to run', lesson: 'YAML uses indentation for structure, so every space matters.',
    te: { top: 'YAML లో ఒక space తప్పు', bottom: 'Playbook: నేను run అవ్వను', lesson: 'YAML indentation తో structure చూపిస్తుంది, కాబట్టి ప్రతి space ముఖ్యం.' } },
  { id: 'm21', tr: 'ans', face: '🤖', top: 'Update 50 servers by hand', bottom: 'Ansible: one command, all 50', lesson: 'Ansible runs the same task on every host in your inventory.',
    te: { top: '50 servers ని చేత్తో update చేయాలి', bottom: 'Ansible: ఒక్క command, 50 అన్నీ', lesson: 'Ansible మీ inventory లోని ప్రతి host మీద అదే task run చేస్తుంది.' } },

  { id: 'm22', tr: 'az', face: '💸', top: 'Left a big VM running all weekend', bottom: 'The bill on Monday:', lesson: 'Cloud bills by use. Stop or delete resources you are not using.',
    te: { top: 'పెద్ద VM ని weekend మొత్తం on లో వదిలేశా', bottom: 'సోమవారం వచ్చిన bill:', lesson: 'Cloud వాడినంత bill వేస్తుంది. వాడని resources ని ఆపండి లేదా delete చేయండి.' } },
  { id: 'm23', tr: 'az', face: '📦', top: 'Azure Storage: put files in a container', bottom: 'Me: Docker? Here too?', lesson: 'In Azure Blob Storage, a container is a folder-like group of files, not a Docker container.',
    te: { top: 'Azure Storage: files ని container లో పెట్టండి', bottom: 'నేను: Docker ఇక్కడ కూడానా?', lesson: 'Azure Blob Storage లో container అంటే files ఉండే folder లాంటిది, Docker container కాదు.' } },
  { id: 'm24', tr: 'az', face: '🌙', top: 'The data pipeline ran at 2 AM', bottom: 'Data Factory does not sleep', lesson: 'A schedule trigger runs a pipeline automatically at the times you set.',
    te: { top: 'Data pipeline రాత్రి 2 గంటలకు run అయింది', bottom: 'Data Factory కి నిద్ర లేదు', lesson: 'Schedule trigger మీరు చెప్పిన సమయాలకు pipeline ని ఆటోమేటిక్ గా run చేస్తుంది.' } },

  { id: 'm25', tr: 'pbi', face: '🔗', top: 'Dashboard says Total Sales: same number for every region', bottom: 'Forgot the relationship between the tables', lesson: 'Relationships connect tables, so a filter on one table reaches the other.',
    te: { top: 'Dashboard లో ప్రతి region కి ఒకే Total Sales', bottom: 'Tables మధ్య relationship మర్చిపోయా', lesson: 'Relationships tables ని కలుపుతాయి, అప్పుడు ఒక table మీద filter ఇంకో table కి చేరుతుంది.' } },
  { id: 'm26', tr: 'pbi', face: '🐢', top: 'Boss: show me today’s numbers', bottom: 'My report: last month’s data', lesson: 'Set up scheduled refresh so the report shows the latest data.',
    te: { top: 'Boss: ఈరోజు numbers చూపించు', bottom: 'నా report: గత నెల data', lesson: 'Report లో తాజా data రావాలంటే scheduled refresh set చేయండి.' } },
  { id: 'm27', tr: 'pbi', face: '🍕', top: 'Made a pie chart with 25 slices', bottom: 'Everyone: is this a pizza?', lesson: 'Pie charts suit a few categories. For many, a bar chart is easier to read.',
    te: { top: '25 ముక్కలతో pie chart చేశా', bottom: 'అందరూ: ఇది pizza నా?', lesson: 'Pie chart కొన్ని categories కే బాగుంటుంది. ఎక్కువ ఉంటే bar chart చదవడం సులభం.' } },

  { id: 'm28', tr: 'ops', face: '🔥', top: 'Big deploy on Friday evening', bottom: 'Weekend plans: cancelled', lesson: 'Small, tested releases through CI make any deploy day calmer.',
    te: { top: 'శుక్రవారం సాయంత్రం పెద్ద deploy', bottom: 'Weekend plans: cancel', lesson: 'CI తో test చేసిన చిన్న releases ఏ రోజు deploy అయినా ప్రశాంతంగా ఉంచుతాయి.' } },
  { id: 'm29', tr: 'ops', face: '🚨', top: 'CI build: red ❌', bottom: 'Team rule: fix it before anything else', lesson: 'A broken build blocks everyone, so fixing it comes first.',
    te: { top: 'CI build: ఎరుపు ❌', bottom: 'Team rule: ముందు దాన్నే సరిచేయాలి', lesson: 'Build పాడైతే అందరూ ఆగిపోతారు, అందుకే ముందు దాన్ని సరిచేయాలి.' } },
  { id: 'm30', tr: 'ops', face: '😬', top: 'Tested it directly in production', bottom: 'Users: we noticed', lesson: 'Test in staging first. It is a safe copy of production.',
    te: { top: 'నేరుగా production లోనే test చేశా', bottom: 'Users: మేము గమనించాం', lesson: 'ముందు staging లో test చేయండి. అది production కి సురక్షితమైన copy.' } }
];
